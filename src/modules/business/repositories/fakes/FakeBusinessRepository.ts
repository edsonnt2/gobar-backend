import crypto from 'crypto';
import Business from '@modules/business/infra/typeorm/entities/Business';
import ICreateBusinessDTO from '@modules/business/Dtos/ICreateBusinessDTO';
import IFindInBusinessDTO from '@modules/business/Dtos/IFindInBusinessDTO';
import IBusinessRepository from '../IBusinessRepository';

class FakeBusinessRepository implements IBusinessRepository {
  private business: Business[] = [];

  public async create(data: ICreateBusinessDTO): Promise<Business> {
    const getBusiness = new Business();

    const id = crypto.randomBytes(10).toString('hex');

    Object.assign(getBusiness, { id }, data);

    this.business.push(getBusiness);

    return getBusiness;
  }

  public async findInBusiness({
    find,
    where,
  }: IFindInBusinessDTO): Promise<Business | undefined> {
    const newFind =
      where === 'cell_phone' || where === 'phone' ? Number(find) : find;

    const getBusiness = this.business.find(
      findBusiness => findBusiness[where] === newFind,
    );

    return getBusiness;
  }

  public async findById(id: string): Promise<Business | undefined> {
    const business = this.business.find(findBusiness => findBusiness.id === id);

    return business;
  }

  public async save(business: Business): Promise<void> {
    const findIndex = this.business.findIndex(({ id }) => id === business.id);

    this.business[findIndex] = business;
  }
}

export default FakeBusinessRepository;
