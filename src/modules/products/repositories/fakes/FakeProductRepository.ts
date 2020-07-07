import crypto from 'crypto';
import Product from '@modules/products/infra/typeorm/entities/Product';
import ICreateProductDTO from '@modules/products/Dtos/ICreateProductDTO';
import IFindInProductDTO from '@modules/products/Dtos/IFindInProductDTO';
import IProductRepository from '../IProductRepository';

class FakeProductRepository implements IProductRepository {
  private products: Product[] = [];

  public async create(data: ICreateProductDTO): Promise<Product> {
    const product = new Product();
    const id = crypto.randomBytes(6).toString('hex');
    Object.assign(product, { id }, data);

    this.products.push(product);

    return product;
  }

  public async findInProduct({
    find,
    where,
    business_id,
  }: IFindInProductDTO): Promise<Product | undefined> {
    const product = this.products.find(
      findProduct =>
        findProduct[where] === find && findProduct.business_id === business_id,
    );

    return product;
  }

  public async findById(id: string): Promise<Product | undefined> {
    const product = this.products.find(findProduct => findProduct.id === id);

    return product;
  }

  public async findByIds(ids: string[]): Promise<Product[]> {
    const products = this.products.filter(
      findProduct => ids.filter(id => id === findProduct.id).length > 0,
    );

    return products;
  }

  public async search(search: string, business_id: string): Promise<Product[]> {
    const findProducts = this.products.filter(
      getProduct =>
        (getProduct.label_description.includes(search) ||
          String(getProduct.sale_value).includes(search)) &&
        getProduct.business_id === business_id,
    );

    return findProducts;
  }

  public async save(product: Product): Promise<void> {
    const findIndex = this.products.findIndex(({ id }) => id === product.id);

    this.products[findIndex] = product;
  }

  public async saveArray(products: Product[]): Promise<void> {
    products.forEach(product => {
      const findIndex = this.products.findIndex(({ id }) => id === product.id);

      this.products[findIndex] = product;
    });
  }
}

export default FakeProductRepository;
