import IBUsinessRepository from '@modules/business/repositories/IBusinessRepository';
import { getRepository, Repository } from 'typeorm';
import ICreateBusinessDTO from '@modules/business/Dtos/ICreateBusinessDTO';
import IFindInBusinessDTO from '@modules/business/Dtos/IFindInBusinessDTO';
import Business from '../entities/Business';
import Category from '../entities/Category';

class BusinessRepository implements IBUsinessRepository {
  private ormRepository: Repository<Business>;

  private ormCategory: Repository<Category>;

  constructor() {
    this.ormRepository = getRepository(Business);
    this.ormCategory = getRepository(Category);
  }

  public async create({
    user_id,
    name,
    category,
    cpf_or_cnpj,
    cell_phone,
    phone,
    zip_code,
    street,
    number,
    complement,
    district,
    city,
    state,
  }: ICreateBusinessDTO): Promise<Business> {
    const findCategory = await this.ormCategory.findOne({
      where: {
        name: category,
      },
    });

    const isCategory = findCategory
      ? { category_id: findCategory.id }
      : {
          category: {
            name: category,
          },
        };

    const business = this.ormRepository.create({
      user_id,
      name,
      cpf_or_cnpj,
      cell_phone,
      phone,
      zip_code,
      street,
      number,
      complement,
      district,
      city,
      state,
      ...isCategory,
    });

    this.ormRepository.save(business);

    return business;
  }

  public async findInBusiness({
    find,
    where,
  }: IFindInBusinessDTO): Promise<Business | undefined> {
    const business = await this.ormRepository.findOne({
      where: {
        [where]: find,
      },
    });

    return business;
  }
}

export default BusinessRepository;
