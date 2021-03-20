import ICreateEntranceDTO from '../Dtos/ICreateEntranceDTO';
import Entrance from '../infra/typeorm/entities/Entrance';

export default interface IEntranceRepository {
  create({
    business_id,
    description,
    value,
    consume,
  }: ICreateEntranceDTO): Promise<Entrance>;
  findByDescription(
    description: string,
    business_id: string,
  ): Promise<Entrance | undefined>;
  getAll(business_id: string): Promise<Entrance[]>;
  entranceInBusiness(business_id: string): Promise<Entrance | undefined>;
  findById(id: string): Promise<Entrance | undefined>;
  deleteById(id: string, business_id: string): Promise<void>;
}
