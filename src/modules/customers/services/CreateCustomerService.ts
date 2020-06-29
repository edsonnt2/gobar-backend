import { injectable, inject } from 'tsyringe';
import { differenceInYears, format } from 'date-fns';
import AppError from '@shared/error/AppError';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import ICpfAndCnpjProvider from '@shared/provider/CpfOrCnpjProvider/models/ICpfAndCnpjProvider';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICustomerRepository from '../repositories/ICustomerRepository';

interface IRequest {
  customer_id?: string;
  cell_phone?: string;
  email?: string;
  cpf_or_cnpj?: string;
  business_id: string;
  name?: string;
  birthDate?: string;
  gender?: 'W' | 'M';
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,

    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('CpfAndCnpjProvider')
    private cpfAndCnpjProvider: ICpfAndCnpjProvider,
  ) {}

  public async execute({
    business_id,
    customer_id,
    cell_phone,
    email,
    cpf_or_cnpj,
    name,
    birthDate,
    gender,
  }: IRequest): Promise<Customer> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    let formattedToNumber: number | undefined;
    if (cell_phone) {
      formattedToNumber = Number(
        cell_phone
          .split('')
          .filter(char => Number(char) || char === '0')
          .join(''),
      );

      const isCell_phoneRegistered = await this.customerRepository.findInCustomer(
        {
          find: formattedToNumber,
          where: 'cell_phone',
        },
      );

      if (isCell_phoneRegistered) {
        if (!customer_id || isCell_phoneRegistered.id !== customer_id) {
          throw new AppError(
            'Cell phone already registered at another customer',
          );
        }
      } else {
        const isCell_phoneToUser = await this.userRepository.findBycellPhone(
          formattedToNumber,
        );

        if (isCell_phoneToUser)
          throw new AppError('Cell phone already registered at one user');
      }
    }

    if (email) {
      const isEmailRegistered = await this.customerRepository.findInCustomer({
        find: email,
        where: 'email',
      });

      if (isEmailRegistered) {
        if (!customer_id || isEmailRegistered.id !== customer_id) {
          throw new AppError('E-mail already registered at another customer');
        }
      } else {
        const isEmailToUser = await this.userRepository.findByEmail(email);

        if (isEmailToUser)
          throw new AppError('E-mail already registered at one user');
      }
    }

    let newCpfOrCnpj: string | undefined;
    if (cpf_or_cnpj) {
      const isCpfOrCnpj = this.cpfAndCnpjProvider.validateCpfOrCnpj({
        cpf_or_cnpj,
      });

      if (!isCpfOrCnpj) {
        throw new AppError('Cpf or Cnpf informed is invalid');
      }
      const { type } = isCpfOrCnpj;

      newCpfOrCnpj = this.cpfAndCnpjProvider.stripCpfOrCnpj({
        cpf_or_cnpj,
        type,
      });

      const cpfOrCnpjCustomer = await this.customerRepository.findInCustomer({
        find: newCpfOrCnpj,
        where: 'cpf_or_cnpj',
      });

      if (cpfOrCnpjCustomer) {
        if (!customer_id || cpfOrCnpjCustomer.id !== customer_id) {
          if (newCpfOrCnpj.length === 11) {
            throw new AppError('CPF already registered at another customer');
          } else {
            throw new AppError('CNPJ already registered at another customer');
          }
        }
      }
    }

    if (customer_id) {
      const customer = await this.customerRepository.findById(customer_id);

      if (!customer) throw new AppError('Customer not found');

      Object.assign(customer, {
        ...(customer.business_customer.filter(
          getBusiness => getBusiness.business_id === business_id,
        ).length === 0 && {
          business_customer: [
            {
              business_id,
            },
            ...customer.business_customer,
          ],
        }),
        ...(formattedToNumber &&
          !customer.cell_phone && {
            cell_phone: formattedToNumber,
          }),
        ...(email &&
          !customer.email && {
            email,
          }),
        ...(newCpfOrCnpj &&
          !customer.cpf_or_cnpj && {
            cpf_or_cnpj: Number(newCpfOrCnpj),
          }),
      });

      await this.customerRepository.save(customer);

      return customer;
    }

    if (!name || !birthDate || !gender)
      throw new AppError(
        'Name, Birthdate and Gender is requered for create new customer.',
      );

    const parsedDate = new Date(birthDate);

    const differenceYears = differenceInYears(Date.now(), parsedDate);

    if (!differenceYears) throw new AppError('Format Date invalid');

    if (differenceYears < 16)
      throw new AppError('Age minimum for register is 16 Years');

    const createCustomer = await this.customerRepository.create({
      name,
      cell_phone: formattedToNumber,
      email,
      cpf_or_cnpj: newCpfOrCnpj ? Number(newCpfOrCnpj) : undefined,
      birthDate: format(parsedDate, 'yyyy/MM/dd'),
      gender,
      business_id,
    });

    return createCustomer;
  }
}

export default CreateCustomerService;
