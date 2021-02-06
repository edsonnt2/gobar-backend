import Ingress from '@modules/ingress/infra/typeorm/entities/Ingress';
import ICreateIngressDTO from '@modules/ingress/Dtos/ICreateIngressDTO';
import IIngressRepository from '../IIngressRepository';

class FakeIngressRepository implements IIngressRepository {
  private ingress: Ingress[] = [];

  public async create(data: ICreateIngressDTO): Promise<Ingress> {
    const getIngress = new Ingress();

    Object.assign(getIngress, { id: '274234498fsdf34548' }, data);

    this.ingress.push(getIngress);

    return getIngress;
  }

  public async findByDescription(
    description: string,
    business_id: string,
  ): Promise<Ingress | undefined> {
    const getIngress = this.ingress.find(
      findIngress =>
        findIngress.description === description &&
        findIngress.business_id === business_id,
    );

    return getIngress;
  }

  public async getAll(business_id: string): Promise<Ingress[]> {
    const getIngress = this.ingress.filter(
      filIngress => filIngress.business_id === business_id,
    );
    return getIngress;
  }

  public async ingressInBusiness(
    business_id: string,
  ): Promise<Ingress | undefined> {
    const command = this.ingress.find(
      filIngress => filIngress.business_id === business_id,
    );

    return command;
  }

  public async findById(id: string): Promise<Ingress | undefined> {
    const getIngress = this.ingress.find(findIngress => findIngress.id === id);

    return getIngress;
  }

  public async deleteById(id: string, business_id: string): Promise<void> {
    const findIndex = this.ingress.findIndex(
      findIngress =>
        findIngress.id === id && findIngress.business_id === business_id,
    );

    delete this.ingress[findIndex];
  }
}

export default FakeIngressRepository;
