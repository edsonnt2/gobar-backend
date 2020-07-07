import ICreateIngressDTO from '../Dtos/ICreateIngressDTO';
import Ingress from '../infra/typeorm/entities/Ingress';

export default interface IIngressRepository {
  create({
    business_id,
    description,
    value,
    consume,
  }: ICreateIngressDTO): Promise<Ingress>;
  findByDescription(
    description: string,
    business_id: string,
  ): Promise<Ingress | undefined>;
  getAll(business_id: string): Promise<Ingress[]>;
  ingressInBusiness(business_id: string): Promise<Ingress | undefined>;
  findById(id: string): Promise<Ingress | undefined>;
  deleteById(id: string, business_id: string): Promise<void>;
}
