import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import ICustomerRepository from '@modules/customers/repositories/ICustomerRepository';
import IIngressRepository from '@modules/ingress/repositories/IIngressRepository';
import ICommandRepository from '../repositories/ICommandRepository';
import Command from '../infra/typeorm/entities/Command';

interface IRequest {
  business_id: string;
  customer_id: string;
  ingress_id?: string;
  number: number;
  prepaid_ingress?: boolean;
  value_consume?: number;
}

@injectable()
class CreateCommandService {
  constructor(
    @inject('CommandRepository')
    private commandRepository: ICommandRepository,

    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,

    @inject('IngressRepository')
    private ingressRepository: IIngressRepository,
  ) {}

  public async execute({
    business_id,
    customer_id,
    number,
    ingress_id,
    prepaid_ingress,
    value_consume,
  }: IRequest): Promise<Command> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const customer = await this.customerRepository.findById(customer_id);

    if (!customer) throw new AppError('Customer not found');

    const customerInBusiness = customer.business_customer.filter(
      filBusiness => filBusiness.business_id === business_id,
    );

    if (customerInBusiness.length === 0)
      throw new AppError('Customer not found at this business');

    const customerHasCommand = await this.commandRepository.findByCustomer({
      customer_id,
      business_id,
    });

    if (customerHasCommand)
      throw new AppError('Customer already opened command at this business');

    const hasNumber = await this.commandRepository.findByNumber({
      number,
      business_id,
    });

    if (hasNumber) throw new AppError('Command number already registered');

    let value_ingress: number | undefined;
    let ingress_consume: boolean | undefined;
    if (ingress_id) {
      const ingress = await this.ingressRepository.findById(ingress_id);

      if (!ingress) throw new AppError('Ingress not found');

      if (ingress.business_id !== business_id)
        throw new AppError('Ingress not found at this business');

      value_ingress = Number(ingress.value);
      ingress_consume = ingress.consume;
    } else {
      const ingressInBusiness = await this.ingressRepository.ingressInBusiness(
        business_id,
      );

      if (ingressInBusiness)
        throw new AppError('There are Ingress registered at the Business');
    }

    const command = await this.commandRepository.create({
      business_id,
      customer_id,
      number,
      value_ingress,
      ingress_consume,
      prepaid_ingress,
      value_consume,
    });

    return command;
  }
}

export default CreateCommandService;
