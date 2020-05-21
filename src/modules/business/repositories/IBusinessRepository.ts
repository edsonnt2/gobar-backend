import ICreateBusinessDTO from '../Dtos/ICreateBusinessDTO';
import Business from '../infra/typeorm/entities/Business';
import IFindInBusinessDTO from '../Dtos/IFindInBusinessDTO';

export default interface ICreateBusiness {
  create({
    user_id,
    avatar,
    name,
    category,
    cell_phone,
    phone,
    cpf_or_cnpj,
    zip_code,
    street,
    number,
    complement,
    district,
    city,
    state,
  }: ICreateBusinessDTO): Promise<Business>;
  findInBusiness({
    find,
    where,
  }: IFindInBusinessDTO): Promise<Business | undefined>;
  findById(id: string): Promise<Business | undefined>;
  save(business: Business): Promise<void>;
}
