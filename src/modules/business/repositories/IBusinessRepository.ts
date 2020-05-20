import ICreateBusinessDTO from '../Dtos/ICreateBusinessDTO';
import Business from '../infra/typeorm/entities/Business';
import IFindInBusinessDTO from '../Dtos/IFindInBusinessDTO';

export default interface ICreateBusiness {
  create(data: ICreateBusinessDTO): Promise<Business>;
  findInBusiness(data: IFindInBusinessDTO): Promise<Business | undefined>;
}
