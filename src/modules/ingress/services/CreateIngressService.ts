import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import IIngressRepository from '../repositories/IIngressRepository';
import Ingress from '../infra/typeorm/entities/Ingress';
import ICreateIngressDTO from '../Dtos/ICreateIngressDTO';

@injectable()
class CreateIngressService {
  constructor(
    @inject('IngressRepository')
    private ingressRepository: IIngressRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,
  ) {}

  public async execute({
    business_id,
    description,
    value,
    consume,
  }: ICreateIngressDTO): Promise<Ingress> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const hasDescription = await this.ingressRepository.findByDescription(
      description,
      business_id,
    );

    if (hasDescription)
      throw new AppError('Ingress description already registered');

    const ingress = await this.ingressRepository.create({
      business_id,
      description,
      value,
      consume,
    });

    return ingress;
  }
}

export default CreateIngressService;
