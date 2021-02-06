import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import IIngressRepository from '../repositories/IIngressRepository';
import Ingress from '../infra/typeorm/entities/Ingress';

interface IRequest {
  business_id: string;
}

@injectable()
class ListIngressService {
  constructor(
    @inject('IngressRepository')
    private ingressRepository: IIngressRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,
  ) {}

  public async execute({ business_id }: IRequest): Promise<Ingress[]> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const ingress = await this.ingressRepository.getAll(business_id);

    return ingress;
  }
}

export default ListIngressService;
