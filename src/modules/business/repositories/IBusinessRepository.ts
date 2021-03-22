import ICreateBusinessDTO from '../Dtos/ICreateBusinessDTO';
import Business from '../infra/typeorm/entities/Business';
import IFindInBusinessDTO from '../Dtos/IFindInBusinessDTO';

export default interface IBusinessRepository {
  create({
    user_id,
    avatar,
    name,
    categories,
    cell_phone,
    phone,
    taxId,
    zip_code,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
  }: ICreateBusinessDTO): Promise<Business>;
  findInBusiness({
    find,
    where,
  }: IFindInBusinessDTO): Promise<Business | undefined>;
  findById(id: string): Promise<Business | undefined>;
  findByUserId(user_id: string): Promise<Business[]>;
  save(business: Business): Promise<void>;
}
