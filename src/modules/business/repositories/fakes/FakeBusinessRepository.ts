import Business from '@modules/business/infra/typeorm/entities/Business';
import ICreateBusinessDTO from '@modules/business/Dtos/ICreateBusinessDTO';
import IFindInBusinessDTO from '@modules/business/Dtos/IFindInBusinessDTO';
import IBusinessRepository from '../IBusinessRepository';

class FakeBusinessRepository implements IBusinessRepository {
  private business: Business[] = [];

  public async create(data: ICreateBusinessDTO): Promise<Business> {
    const getBusiness = new Business();

    Object.assign(getBusiness, { id: '274234498fsdf34548' }, data);

    this.business.push(getBusiness);

    return getBusiness;
  }

  public async findInBusiness({
    find,
    where,
  }: IFindInBusinessDTO): Promise<Business | undefined> {
    const getBusiness = this.business.find(
      findBusiness => findBusiness[where] === find,
    );

    return getBusiness;
  }
}

export default FakeBusinessRepository;
