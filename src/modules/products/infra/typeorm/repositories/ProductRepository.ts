import { getRepository, Repository } from 'typeorm';
import IProductRepository from '@modules/products/repositories/IProductRepository';
import ICreateProductDTO from '@modules/products/Dtos/ICreateProductDTO';
import IFindInProductDTO from '@modules/products/Dtos/IFindInProductDTO';
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
        name: category,
      },
    });

    const saveCategoryProduct: Partial<CategoryProduct> = findCategoryProduct || {
      name: category,
    };

    const findCategoryProvider = await this.ormCategoryProvider.findOne({
      where: {
        name: provider,
      },
    });

    const saveCategoryProvider: Partial<CategoryProvider> = findCategoryProvider || {
      name: provider,
    };

    const product = this.ormRepository.create({
      business_id,
      image,
      description,
      category: saveCategoryProduct,
      quantity,
      provider: saveCategoryProvider,
      internal_code,
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
    const product = await this.ormRepository.findOne({
      where: {
        [where]: find,
        business_id,
      },
    });

    return product;
  }

  public async findById(id: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ id });

    return product;
  }

  public async save(product: Product): Promise<void> {
    await this.ormRepository.save(product);
  }
}

export default ProductRepository;
