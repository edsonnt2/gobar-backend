import Entrance from '@modules/entrance/infra/typeorm/entities/Entrance';
import ICreateEntranceDTO from '@modules/entrance/Dtos/ICreateEntranceDTO';
import IEntranceRepository from '../IEntranceRepository';

class FakeEntranceRepository implements IEntranceRepository {
  private entrance: Entrance[] = [];

  public async create(data: ICreateEntranceDTO): Promise<Entrance> {
    const getEntrance = new Entrance();

    Object.assign(getEntrance, { id: '274234498fsdf34548' }, data);

    this.entrance.push(getEntrance);

    return getEntrance;
  }

  public async findByDescription(
    description: string,
    business_id: string,
  ): Promise<Entrance | undefined> {
    const getEntrance = this.entrance.find(
      findEntrance =>
        findEntrance.description === description &&
        findEntrance.business_id === business_id,
    );

    return getEntrance;
  }

  public async getAll(business_id: string): Promise<Entrance[]> {
    const getEntrance = this.entrance.filter(
      filEntrance => filEntrance.business_id === business_id,
    );
    return getEntrance;
  }

  public async entranceInBusiness(
    business_id: string,
  ): Promise<Entrance | undefined> {
    const command = this.entrance.find(
      filEntrance => filEntrance.business_id === business_id,
    );

    return command;
  }

  public async findById(id: string): Promise<Entrance | undefined> {
    const getEntrance = this.entrance.find(
      findEntrance => findEntrance.id === id,
    );

    return getEntrance;
  }

  public async deleteById(id: string, business_id: string): Promise<void> {
    const findIndex = this.entrance.findIndex(
      findEntrance =>
        findEntrance.id === id && findEntrance.business_id === business_id,
    );

    delete this.entrance[findIndex];
  }
}

export default FakeEntranceRepository;
