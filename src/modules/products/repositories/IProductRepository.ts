import ICreateProductDTO from '../Dtos/ICreateProductDTO';
import Product from '../infra/typeorm/entities/Product';
import IFindInProductDTO from '../Dtos/IFindInProductDTO';

export default interface ICreateBusiness {
  create({
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
  }: ICreateProductDTO): Promise<Product>;
  findInProduct({
    find,
    where,
    business_id,
  }: IFindInProductDTO): Promise<Product | undefined>;
  findById(id: string): Promise<Product | undefined>;
  save(product: Product): Promise<void>;
}
