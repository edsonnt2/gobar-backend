import IBUsinessRepository from '@modules/business/repositories/IBusinessRepository';
import { getRepository, Repository } from 'typeorm';
import ICreateBusinessDTO from '@modules/business/Dtos/ICreateBusinessDTO';
import IFindInBusinessDTO from '@modules/business/Dtos/IFindInBusinessDTO';
import Category from '@modules/categories/infra/typeorm/entities/Category';
import Business from '../entities/Business';

class BusinessRepository implements IBUsinessRepository {
  private ormRepository: Repository<Business>;

  private ormCategory: Repository<Category>;

  constructor() {
    this.ormRepository = getRepository(Business);
    this.ormCategory = getRepository(Category);
  }

  public async create({
    user_id,
    avatar,
    name,
    categories,
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
    const findCategories = await this.ormCategory.find({ where: categories });

    const business_category = categories.map(category => {
      const findCategory = findCategories.find(
        cat => cat.name === category.name,
      );

      return {
        category: {
          ...(findCategory || category),
        },
      };
    });

    const business = this.ormRepository.create({
      user_id,
      avatar,
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
      business_category,
    });

    await this.ormRepository.save(business);

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

  public async findById(id: string): Promise<Business | undefined> {
    const business = await this.ormRepository.findOne({ id });

    return business;
  }

  public async findByUserId(user_id: string): Promise<Business[]> {
    const business = await this.ormRepository.find({ user_id });

    return business;
  }

  public async save(business: Business): Promise<void> {
    await this.ormRepository.save(business);
  }
}

export default BusinessRepository;
