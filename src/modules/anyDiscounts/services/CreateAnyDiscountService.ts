import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import ICommandRepository from '@modules/commands/repositories/ICommandRepository';
import ITableRepository from '@modules/tables/repositories/ITableRepository';
import IAnyDiscountRepository from '../repositories/IAnyDiscountRepository';
import AnyDiscount from '../infra/typeorm/entities/AnyDiscount';

interface IRequest {
  user_id: string;
  business_id: string;
  value_total: number;
  discount?: number;
  command_id?: string;
  table_id?: string;
  payment_discount: {
    type: 'card' | 'money';
    subtotal: number;
    received?: number;
    type_card?: string;
  }[];
}

@injectable()
class CreateAnyDiscountService {
  constructor(
    @inject('AnyDiscountRepository')
    private anyDiscountRepository: IAnyDiscountRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,

    @inject('CommandRepository')
    private commandRepository: ICommandRepository,

    @inject('TableRepository')
    private tableRepository: ITableRepository,
  ) {}

  public async execute({
    user_id,
    business_id,
    value_total,
    discount,
    command_id,
    table_id,
    payment_discount,
  }: IRequest): Promise<AnyDiscount> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    if (command_id) {
      const command = await this.commandRepository.findById({ id: command_id });

      if (!command) {
        throw new AppError('Command not found');
      }

      if (command.business_id !== business_id) {
        throw new AppError('Command was not found in the business');
      }
    } else if (table_id) {
      const table = await this.tableRepository.findById({ id: table_id });

      if (!table) {
        throw new AppError('Table not found');
      }

      if (table.business_id !== business_id) {
        throw new AppError('Table was not found in the business');
      }
    } else {
      throw new AppError('Command or Table is required');
    }

    payment_discount.forEach(payClosure => {
      if (payClosure.type === 'money' && !payClosure.received) {
        throw new AppError('Type Money requires value received');
      }

      if (payClosure.type === 'card' && !payClosure.type_card) {
        throw new AppError('Type Card requires selected of card');
      }
    });

    const commandDiscount = await this.anyDiscountRepository.create({
      operator_id: user_id,
      business_id,
      command_id,
      table_id,
      discount,
      value_total,
      payment_discount,
    });

    return commandDiscount;
  }
}

export default CreateAnyDiscountService;
