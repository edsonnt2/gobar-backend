import IBUsinessRepository from '@modules/business/repositories/IBusinessRepository';
import { getRepository, Repository } from 'typeorm';
import ICreateBusinessDTO from '@modules/business/Dtos/ICreateBusinessDTO';
import IFindInBusinessDTO from '@modules/business/Dtos/IFindInBusinessDTO';
import Category from '@modules/categories/infra/typeorm/entities/Category';
import removeAccents from '@shared/utils/removeAccents';
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
    taxId,
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
    const formattedCategory = categories.map(category => ({
      label_name: removeAccents(category.name).toLowerCase().trim(),
    }));

    const findCategories = await this.ormCategory.find({
      where: formattedCategory,
    });

    const business_category = categories.map(category => {
      const formattedName = removeAccents(category.name).toLowerCase().trim();
      const findCategory = findCategories.find(
        cat => cat.label_name === formattedName,
      );

      return {
        category: {
          ...(findCategory || {
            name: category.name,
            label_name: formattedName,
          }),
        },
      };
    });

    const business = this.ormRepository.create({
      user_id,
      avatar,
      name,
      label_name: removeAccents(name).toLowerCase().trim(),
      taxId,
      cell_phone,
      phone,
      zip_code,
      street,
      label_street: removeAccents(street).toLowerCase().trim(),
      number,
      district,
      label_district: removeAccents(district).toLowerCase().trim(),
      city,
      label_city: removeAccents(city).toLowerCase().trim(),
      state,
      business_category,
      complement,
      ...(complement && {
        label_complement: removeAccents(complement).toLowerCase().trim(),
      }),
    });

    await this.ormRepository.save(business);

    return business;
  }

  public async findInBusiness({
    find,
    where,
  }: IFindInBusinessDTO): Promise<Business | undefined> {
    let newWhere: string = where;
    let newFind = find;
    if (where === 'name') {
      newWhere = 'label_name';
      const findString = find as string;
      newFind = removeAccents(findString).toLowerCase().trim();
    }

    const business = await this.ormRepository.findOne({
      where: {
        [newWhere]: newFind,
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
