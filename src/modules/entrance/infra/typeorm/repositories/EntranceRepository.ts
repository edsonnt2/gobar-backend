import Entrance from '@modules/entrance/infra/typeorm/entities/Entrance';
import ICreateEntranceDTO from '@modules/entrance/Dtos/ICreateEntranceDTO';
import IEntranceRepository from '@modules/entrance/repositories/IEntranceRepository';
import { Repository, getRepository } from 'typeorm';
import removeAccents from '@shared/utils/removeAccents';

class EntranceRepository implements IEntranceRepository {
  private ormReposity: Repository<Entrance>;

  constructor() {
    this.ormReposity = getRepository(Entrance);
  }

  public async create({
    business_id,
    description,
    consume,
    value,
  }: ICreateEntranceDTO): Promise<Entrance> {
    const entrance = this.ormReposity.create({
      business_id,
      description,
      label_description: removeAccents(description).toLowerCase().trim(),
      consume,
      value,
    });

    await this.ormReposity.save(entrance);

    return entrance;
  }

  public async findByDescription(
    description: string,
    business_id: string,
  ): Promise<Entrance | undefined> {
    const entrance = await this.ormReposity.findOne({
      label_description: removeAccents(description).toLowerCase().trim(),
      business_id,
    });

    return entrance;
  }

  public async getAll(business_id: string): Promise<Entrance[]> {
    const entrance = await this.ormReposity.find({ business_id });

    return entrance;
  }

  public async entranceInBusiness(
    business_id: string,
  ): Promise<Entrance | undefined> {
    const entrance = await this.ormReposity.findOne({ business_id });

    return entrance;
  }

  public async findById(id: string): Promise<Entrance | undefined> {
    const entrance = this.ormReposity.findOne({ id });

    return entrance;
  }

  public async deleteById(id: string, business_id: string): Promise<void> {
    await this.ormReposity.delete({
      id,
      business_id,
    });
  }
}

export default EntranceRepository;
