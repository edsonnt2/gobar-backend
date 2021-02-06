import AnyDiscount from '../infra/typeorm/entities/AnyDiscount';
import ICreateAnyDiscountDTO from '../Dtos/ICreateAnyDiscountDTO';

export default interface IAnyDiscountRepository {
  create({
    operator_id,
    business_id,
    value_total,
    discount,
    command_id,
    table_id,
    payment_discount,
  }: ICreateAnyDiscountDTO): Promise<AnyDiscount>;
}
