import { Repository, getRepository } from 'typeorm';
import ICreateAnyDiscountDTO from '@modules/anyDiscounts/Dtos/ICreateAnyDiscountDTO';
import IAnyDiscountRepository from '@modules/anyDiscounts/repositories/IAnyDiscountRepository';
import AnyDiscount from '../entities/AnyDiscount';

class AnyDiscountRepository implements IAnyDiscountRepository {
  private ormRepository: Repository<AnyDiscount>;

  constructor() {
    this.ormRepository = getRepository(AnyDiscount);
  }

  public async create({
    operator_id,
    business_id,
    value_total,
    discount,
    command_id,
    table_id,
    payment_discount,
  }: ICreateAnyDiscountDTO): Promise<AnyDiscount> {
    const anyDiscount = this.ormRepository.create({
      business_id,
      operator_id,
      discount,
      value_total,
      payment_discount,
      command_id,
      table_id,
    });

    await this.ormRepository.save(anyDiscount);

    return anyDiscount;
  }
}

export default AnyDiscountRepository;
