import ICreateProductDTO from '../Dtos/ICreateProductDTO';
import Product from '../infra/typeorm/entities/Product';
import IFindInProductDTO from '../Dtos/IFindInProductDTO';

export default interface IProductRepository {
  create({
    business_id,
    image,
    description,
    label_description,
    category,
    quantity,
    provider,
    internal_code,
    barcode,
    pushase_value,
    porcent,
    sale_value,
  }: ICreateProductDTO): Promise<Product>;
  findInProduct({
    find,
    where,
    business_id,
  }: IFindInProductDTO): Promise<Product | undefined>;
  findById(id: string): Promise<Product | undefined>;
  findByIds(ids: string[]): Promise<Product[]>;
  search(search: string, business_id: string): Promise<Product[]>;
  save(product: Product): Promise<void>;
  saveArray(products: Product[]): Promise<void>;
}
