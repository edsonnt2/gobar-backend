import Ingress from '@modules/ingress/infra/typeorm/entities/Ingress';
import ICreateIngressDTO from '@modules/ingress/Dtos/ICreateIngressDTO';
import IIngressRepository from '@modules/ingress/repositories/IIngressRepository';
import { Repository, getRepository } from 'typeorm';

class IngressRepository implements IIngressRepository {
  private ormReposity: Repository<Ingress>;

  constructor() {
    this.ormReposity = getRepository(Ingress);
  }

  public async create({
    business_id,
    description,
    consume,
    value,
  }: ICreateIngressDTO): Promise<Ingress> {
    const ingress = this.ormReposity.create({
      business_id,
      description,
      consume,
      value,
    });

    await this.ormReposity.save(ingress);

    return ingress;
  }

  public async findByDescription(
    description: string,
    business_id: string,
  ): Promise<Ingress | undefined> {
    const ingress = await this.ormReposity.findOne({
      description,
      business_id,
    });

    return ingress;
  }

  public async getAll(business_id: string): Promise<Ingress[]> {
    const ingress = await this.ormReposity.find({ business_id });

    return ingress;
  }

  public async findById(id: string): Promise<Ingress | undefined> {
    const ingress = this.ormReposity.findOne({ id });

    return ingress;
  }

  public async deleteById(id: string, business_id: string): Promise<void> {
    await this.ormReposity.delete({
      id,
      business_id,
    });
  }
}

export default IngressRepository;
