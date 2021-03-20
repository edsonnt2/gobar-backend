import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import ICustomerRepository from '@modules/customers/repositories/ICustomerRepository';
import IEntranceRepository from '@modules/entrance/repositories/IEntranceRepository';
import ICommandRepository from '../repositories/ICommandRepository';
import Command from '../infra/typeorm/entities/Command';

interface IRequest {
  user_id: string;
  business_id: string;
  customer_id: string;
  entrance_id?: string;
  number: number;
  prepaid_entrance?: boolean;
  value_consume?: number;
}

@injectable()
class CreateCommandService {
  constructor(
    @inject('CommandRepository')
    private commandRepository: ICommandRepository,

    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,

    @inject('EntranceRepository')
    private entranceRepository: IEntranceRepository,
  ) {}

  public async execute({
    user_id,
    business_id,
    customer_id,
    number,
    entrance_id,
    prepaid_entrance,
    value_consume,
  }: IRequest): Promise<Command> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const customer = await this.customerRepository.findById(customer_id);

    if (!customer) throw new AppError('Customer not found');

    const customerInBusiness = customer.business_customer.filter(
      filBusiness => filBusiness.business_id === business_id,
    );

    if (customerInBusiness.length === 0)
      throw new AppError('Customer not found at this business');

    const customerHasCommand = await this.commandRepository.findByCustomer({
      customer_id,
      business_id,
    });

    if (customerHasCommand)
      throw new AppError('Customer already opened command at this business');

    const hasNumber = await this.commandRepository.findByNumber({
      number,
      business_id,
    });

    if (hasNumber) throw new AppError('Command number already registered');

    let value_entrance: number | undefined;
    let entrance_consume: boolean | undefined;
    if (entrance_id) {
      const entrance = await this.entranceRepository.findById(entrance_id);

      if (!entrance) throw new AppError('Entrance not found');

      if (entrance.business_id !== business_id)
        throw new AppError('Entrance not found at this business');

      value_entrance = Number(entrance.value);
      entrance_consume = entrance.consume;
    } else {
      const entranceInBusiness = await this.entranceRepository.entranceInBusiness(
        business_id,
      );

      if (entranceInBusiness)
        throw new AppError('There are Entrance registered at the Business');
    }

    const command = await this.commandRepository.create({
      business_id,
      operator_id: user_id,
      customer_id,
      number,
      value_entrance,
      entrance_consume,
      prepaid_entrance,
      value_consume,
    });

    return command;
  }
}

export default CreateCommandService;
