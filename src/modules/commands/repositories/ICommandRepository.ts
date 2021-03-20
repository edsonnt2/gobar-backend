import ICreateCommandDTO from '../Dtos/ICreateCommandDTO';
import Command from '../infra/typeorm/entities/Command';
import ISearchCommandDTO from '../Dtos/ISearchCommandDTO';
import IAllCommandDTO from '../Dtos/IAllCommandDTO';
import IFindByCustomerCommandDTO from '../Dtos/IFIndByCustomerCommandDTO';
import IDeleteByIdCommandDTO from '../Dtos/IDeleteByIdCommandDTO';
import IFindByNumberCommandDTO from '../Dtos/IFIndByNumberCommandDTO';
import IFindByIdsCommandDTO from '../Dtos/IFindByIdsCommandDTO';
import IFindByIdCommandDTO from '../Dtos/IFindByIdCommandDTO';

export default interface ICommandRepository {
  create({
    operator_id,
    business_id,
    customer_id,
    number,
    value_entrance,
    prepaid_entrance,
    value_consume,
  }: ICreateCommandDTO): Promise<Command>;
  findByNumber({
    number,
    business_id,
    closed,
  }: IFindByNumberCommandDTO): Promise<Command | undefined>;
  getAll({ business_id, closed }: IAllCommandDTO): Promise<Command[]>;
  search({ business_id, search }: ISearchCommandDTO): Promise<Command[]>;
  findById({ id, closed }: IFindByIdCommandDTO): Promise<Command | undefined>;
  findByIds({
    ids,
    business_id,
    closed,
  }: IFindByIdsCommandDTO): Promise<Command[]>;
  findByCustomer({
    customer_id,
    business_id,
    closed,
  }: IFindByCustomerCommandDTO): Promise<Command | undefined>;
  deleteById({ id, business_id }: IDeleteByIdCommandDTO): Promise<void>;
}
