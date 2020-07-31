import ICreateCommandClosureDTO from '../Dtos/ICreateCommandClosureDTO';
import CommandClosure from '../infra/typeorm/entities/CommandClosure';

export default interface ICommandClosureRepository {
  create({
    operator_id,
    business_id,
    value_total,
    discount,
    payment_commands_closure,
    command_ids,
  }: ICreateCommandClosureDTO): Promise<CommandClosure>;
}
