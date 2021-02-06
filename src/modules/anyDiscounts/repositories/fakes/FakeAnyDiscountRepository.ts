import crypto from 'crypto';
import AnyDiscount from '@modules/anyDiscounts/infra/typeorm/entities/AnyDiscount';
import ICreateAnyDiscountDTO from '@modules/anyDiscounts/Dtos/ICreateAnyDiscountDTO';
import IAnyDiscountRepository from '../IAnyDiscountRepository';

class FakeAnyDiscountRepository implements IAnyDiscountRepository {
  private anyDiscounts: AnyDiscount[] = [];

  public async create(data: ICreateAnyDiscountDTO): Promise<AnyDiscount> {
    const anyDiscount = new AnyDiscount();

    const idAnyDiscount = crypto.randomBytes(6).toString('hex');

    Object.assign(anyDiscount, { id: idAnyDiscount }, data);

    this.anyDiscounts.push(anyDiscount);

    return anyDiscount;
  }
}

export default FakeAnyDiscountRepository;
