import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import ICommandRepository from '@modules/commands/repositories/ICommandRepository';
import ICommandClosureRepository from '../repositories/ICommandClosureRepository';
import CommandClosure from '../infra/typeorm/entities/CommandClosure';

interface IRequest {
  user_id: string;
  business_id: string;
  value_total: number;
  discount?: number;
  payment_commands_closure: {
    type: 'card' | 'money';
    subtotal: number;
    received?: number;
    type_card?: string;
  }[];
  command_ids: string[];
}

@injectable()
class CreateCommandService {
  constructor(
    @inject('CommandClosureRepository')
    private commandClosureRepository: ICommandClosureRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,

    @inject('CommandRepository')
    private commandRepository: ICommandRepository,
  ) {}

  public async execute({
    user_id,
    business_id,
    value_total,
    discount,
    payment_commands_closure,
    command_ids,
  }: IRequest): Promise<CommandClosure> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const commands = await this.commandRepository.findByIds({
      ids: command_ids,
      business_id,
    });

    if (commands.length !== command_ids.length)
      throw new AppError('One of the command was not found in the business');

    payment_commands_closure.forEach(payClosure => {
      if (payClosure.type === 'money' && !payClosure.received) {
        throw new AppError('Type Money requires value received');
      }

      if (payClosure.type === 'card' && !payClosure.type_card) {
        throw new AppError('Type Card requires selected of card');
      }
    });

    const commandClosure = await this.commandClosureRepository.create({
      operator_id: user_id,
      business_id,
      command_ids,
      discount,
      value_total,
      payment_commands_closure,
    });

    return commandClosure;
  }
}

export default CreateCommandService;
