import ICreateCommandDTO from '../Dtos/ICreateCommandDTO';
import Command from '../infra/typeorm/entities/Command';
import ISearchCommandDTO from '../Dtos/ISearchCommandDTO';
import IFindByCustomerCommandDTO from '../Dtos/IFIndByCustomerCommandDTO';
import IDeleteByIdCommandDTO from '../Dtos/IDeleteByIdCommandDTO';
import IFindByNumberCommandDTO from '../Dtos/IFIndByNumberCommandDTO';

export default interface ICommandRepository {
  create({
    business_id,
    customer_id,
    number,
    value_ingress,
    prepaid_ingress,
    value_consume,
  }: ICreateCommandDTO): Promise<Command>;
  findByNumber({
    number,
    business_id,
  }: IFindByNumberCommandDTO): Promise<Command | undefined>;
  getAll(business_id: string): Promise<Command[]>;
  search({ business_id, search }: ISearchCommandDTO): Promise<Command[]>;
  findById(id: string): Promise<Command | undefined>;
  findByCustomer({
    customer_id,
    business_id,
  }: IFindByCustomerCommandDTO): Promise<Command | undefined>;
  deleteById({ id, business_id }: IDeleteByIdCommandDTO): Promise<void>;
}
