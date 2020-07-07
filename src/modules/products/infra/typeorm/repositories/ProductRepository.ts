import { getRepository, Repository, Like, FindOperator, Raw } from 'typeorm';
import IProductRepository from '@modules/products/repositories/IProductRepository';
import ICreateProductDTO from '@modules/products/Dtos/ICreateProductDTO';
import IFindInProductDTO from '@modules/products/Dtos/IFindInProductDTO';
import removeAccents from '@shared/utils/removeAccents';
import Product from '../entities/Product';
import CategoryProduct from '../entities/CategoryProduct';
import CategoryProvider from '../entities/CategoryProvider';

class ProductRepository implements IProductRepository {
  private ormRepository: Repository<Product>;

  private ormCategoryProduct: Repository<CategoryProduct>;

  private ormCategoryProvider: Repository<CategoryProvider>;

  constructor() {
    this.ormRepository = getRepository(Product);
    this.ormCategoryProduct = getRepository(CategoryProduct);
    this.ormCategoryProvider = getRepository(CategoryProvider);
  }

  public async create({
    business_id,
    image,
    description,
    category,
    quantity,
    provider,
    internal_code,
    barcode,
    pushase_value,
    porcent,
    sale_value,
  }: ICreateProductDTO): Promise<Product> {
    const findCategoryProduct = await this.ormCategoryProduct.findOne({
      where: {
        label_name: removeAccents(category).toLowerCase().trim(),
      },
    });

    const saveCategoryProduct: Partial<CategoryProduct> = findCategoryProduct || {
      name: category,
      label_name: removeAccents(category).toLowerCase().trim(),
    };

    const findCategoryProvider = await this.ormCategoryProvider.findOne({
      where: {
        label_name: removeAccents(provider).toLowerCase().trim(),
      },
    });

    const saveCategoryProvider: Partial<CategoryProvider> = findCategoryProvider || {
      name: provider,
      label_name: removeAccents(provider).toLowerCase().trim(),
    };

    const product = this.ormRepository.create({
      business_id,
      image,
      description,
      label_description: removeAccents(description).toLowerCase().trim(),
      category: saveCategoryProduct,
      quantity,
      provider: saveCategoryProvider,
      internal_code: removeAccents(internal_code).toUpperCase().trim(),
      barcode,
      pushase_value,
      porcent,
      sale_value,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findInProduct({
    find,
    where,
    business_id,
  }: IFindInProductDTO): Promise<Product | undefined> {
    let newWhere: string = where;
    let newFind = find;
    if (where === 'description') {
      newWhere = 'label_description';
      newFind = removeAccents(find).toLowerCase().trim();
    } else if (where === 'internal_code') {
      newFind = removeAccents(find).toUpperCase().trim();
    }

    const product = await this.ormRepository.findOne({
      where: {
        [newWhere]: newFind,
        business_id,
      },
    });

    return product;
  }

  public async findById(id: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ id });

    return product;
  }

  public async findByIds(ids: string[]): Promise<Product[]> {
    const product = await this.ormRepository.findByIds(ids);

    return product;
  }

  public async search(
    findSearch: string,
    business_id: string,
  ): Promise<Product[]> {
    const search = removeAccents(findSearch).toLowerCase().trim();

    const productOne = await this.ormRepository.find({
      where: [
        {
          label_description: Like(`%${search}%`),
          business_id,
        },
        {
          internal_code: Like(`%${search}%`),
          business_id,
        },
      ],
      take: 20,
    });

    const notIdProduct = productOne.map(({ id }) => id);

    const whereProduct: { [key: string]: FindOperator<string> | string }[] = [];

    search.split(' ').forEach(searchSeparator => {
      whereProduct.push(
        {
          label_description: Like(`%${searchSeparator}%`),
          business_id,
          id: Raw(alias =>
            notIdProduct
              .map((id, index) => {
                const and = index > 0 ? ' AND ' : '';
                return `${and + alias} != '${id}'`;
              })
              .join(''),
          ),
        },
        {
          internal_code: Like(`%${searchSeparator}%`),
          business_id,
          id: Raw(alias =>
            notIdProduct
              .map((id, index) => {
                const and = index > 0 ? ' AND ' : '';
                return `${and + alias} != '${id}'`;
              })
              .join(''),
          ),
        },
      );
    });

    const productTwo =
      productOne.length < 20
        ? await this.ormRepository.find({
            where: whereProduct,
            take: 20 - productOne.length,
          })
        : [];

    const products = productOne.concat(productTwo);

    return products;
  }

  public async save(product: Product): Promise<void> {
    await this.ormRepository.save(product);
  }

  public async saveArray(products: Product[]): Promise<void> {
    await this.ormRepository.save(products);
  }
}

export default ProductRepository;
