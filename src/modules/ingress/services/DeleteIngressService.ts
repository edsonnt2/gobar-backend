import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import IIngressRepository from '../repositories/IIngressRepository';

interface IRequest {
  id: string;
  business_id: string;
}

@injectable()
class DeleteIngressService {
  constructor(
    @inject('IngressRepository')
    private ingressRepository: IIngressRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,
  ) {}

  public async execute({ id, business_id }: IRequest): Promise<void> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const ingress = await this.ingressRepository.findById(id);

    if (!ingress) throw new AppError('Ingress not found');

    if (ingress.business_id !== business_id)
      throw new AppError('Ingress not found at this business');

    await this.ingressRepository.deleteById(id, business_id);
  }
}

export default DeleteIngressService;
