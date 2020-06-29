import { getRepository, Repository, Like, IsNull } from 'typeorm';
import ICreateCustomerDTO from '@modules/customers/Dtos/ICreateCustomerDTO';
import ICustomerRepository from '@modules/customers/repositories/ICustomerRepository';
import IFindInCustomerDTO from '@modules/customers/Dtos/IFindInCustomerDTO';
import { IReturnSearchCustomerDTO } from '@modules/customers/Dtos/IReturnSearchCustomerDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import Customer from '../entities/Customer';

class CustomerRepository implements ICustomerRepository {
  private ormRepository: Repository<Customer>;

  private userRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(Customer);
    this.userRepository = getRepository(User);
  }

  public async create({
    name,
    email,
    cell_phone,
    birthDate,
    gender,
    cpf_or_cnpj,
    business_id,
  }: ICreateCustomerDTO): Promise<Customer> {
    const customer = this.ormRepository.create({
      name,
      email,
      cell_phone,
      birthDate,
      gender,
      cpf_or_cnpj,
      business_customer: [{ business_id }],
    });

    await this.ormRepository.save(customer);

    return customer;
  }

  public async findInCustomer({
    find,
    where,
  }: IFindInCustomerDTO): Promise<Customer | undefined> {
    const customer = await this.ormRepository.findOne({
      where: {
        [where]: find,
      },
    });

    return customer;
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const customer = await this.ormRepository.findOne({ id });

    return customer;
  }

  public async search(
    business_id: string,
    search: string,
  ): Promise<IReturnSearchCustomerDTO> {
    const users = await this.userRepository.find({
      where: [
        {
          name: Like(`%${search}%`),
          customer_id: IsNull(),
        },
        {
          email: Like(`%${search}%`),
          customer_id: IsNull(),
        },
        {
          email: Like(`%${search}%`),
          customer_id: IsNull(),
        },
      ],
    });

    const customers = await this.ormRepository.find({
      where: [
        {
          name: Like(`%${search}%`),
        },
        {
          email: Like(`%${search}%`),
        },
        {
          email: Like(`%${search}%`),
        },
      ],
      take: 20,
    });

    const customersInBusiness = customers.filter(
      ({ business_customer }) =>
        business_customer.filter(
          getBusiness => getBusiness.business_id === business_id,
        ).length > 0,
    );

    const customersOutherBusiness = customers.filter(
      ({ id }) =>
        customersInBusiness.filter(getBusiness => getBusiness.id === id)
          .length === 0,
    );

    customersOutherBusiness.forEach((_, index) => {
      delete customersOutherBusiness[index].cpf_or_cnpj;
    });

    return {
      customersInBusiness,
      customersOutherBusiness,
      users,
    };
  }

  public async save(customer: Customer): Promise<void> {
    await this.ormRepository.save(customer);
  }
}

export default CustomerRepository;
