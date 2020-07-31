import ICreateCommandClosureDTO from '@modules/commands/Dtos/ICreateCommandClosureDTO';
import CommandClosure from '@modules/commands/infra/typeorm/entities/CommandClosure';
import crypto from 'crypto';
import ICommandClosureRepository from '../ICommandClosureRepository';

class FakeCommandClosureRepository implements ICommandClosureRepository {
  private commandsClosure: CommandClosure[] = [];

  public async create(data: ICreateCommandClosureDTO): Promise<CommandClosure> {
    const commandClosure = new CommandClosure();

    const idCommandClosure = crypto.randomBytes(6).toString('hex');

    Object.assign(commandClosure, { id: idCommandClosure }, data);

    this.commandsClosure.push(commandClosure);

    return commandClosure;
  }
}

export default FakeCommandClosureRepository;
