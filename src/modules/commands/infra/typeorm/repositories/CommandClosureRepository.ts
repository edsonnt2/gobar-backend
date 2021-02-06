import { Repository, getRepository } from 'typeorm';
import ICommandClosureRepository from '@modules/commands/repositories/ICommandClosureRepository';
import ICreateCommandClosureDTO from '@modules/commands/Dtos/ICreateCommandClosureDTO';
import CommandClosure from '../entities/CommandClosure';

class CommandClosureRepository implements ICommandClosureRepository {
  private ormRepository: Repository<CommandClosure>;

  constructor() {
    this.ormRepository = getRepository(CommandClosure);
  }

  public async create({
    operator_id,
    business_id,
    value_total,
    discount,
    payment_commands_closure,
    command_ids,
  }: ICreateCommandClosureDTO): Promise<CommandClosure> {
    const idsCommands = command_ids.map(ids => ({
      id: ids,
    }));

    const commandClosure = this.ormRepository.create({
      business_id,
      operator_id,
      discount,
      value_total,
      payment_closure_or_discount: payment_commands_closure,
      command: idsCommands,
    });

    await this.ormRepository.save(commandClosure);

    return commandClosure;
  }
}

export default CommandClosureRepository;
