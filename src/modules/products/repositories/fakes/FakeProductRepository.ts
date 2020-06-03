import Product from '@modules/products/infra/typeorm/entities/Product';
import ICreateProductDTO from '@modules/products/Dtos/ICreateProductDTO';
import IFindInProductDTO from '@modules/products/Dtos/IFindInProductDTO';
import IProductRepository from '../IProductRepository';

class FakeProductRepository implements IProductRepository {
  private products: Product[] = [];

  public async create(data: ICreateProductDTO): Promise<Product> {
    const product = new Product();

    Object.assign(product, { id: '274234498fsdf34548' }, data);

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

  public async save(product: Product): Promise<void> {
    const findIndex = this.products.findIndex(({ id }) => id === product.id);

    this.products[findIndex] = product;
  }
}

export default FakeProductRepository;
