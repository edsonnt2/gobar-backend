import {
  getRepository,
  Repository,
  Like,
  IsNull,
  FindOperator,
  Raw,
} from 'typeorm';
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
    const isNumber = search
      .split('')
      .filter(char => Number(char) || '0')
      .join('');

    const whereUser: {
      [key: string]: FindOperator<string>;
      customer_id: FindOperator<string>;
    }[] = [];

    const customersOne = await this.ormRepository.find({
      where: [
        {
          name: Like(`%${search.trim()}%`),
        },
        {
          email: Like(`%${search.trim()}%`),
        },
        {
          cell_phone: Like(`%${isNumber}%`),
        },
      ],
      take: 20,
    });

    const notIdCustomers = customersOne.map(({ id }) => id);

    const usersOne = await this.userRepository.find({
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
          cell_phone: Like(`%${isNumber}%`),
          customer_id: IsNull(),
        },
      ],
      take: 20,
    });

    const notIdUsers = usersOne.map(({ id }) => id);

    const whereCustomer: { [key: string]: FindOperator<string> }[] = [];
    search
      .trim()
      .split(' ')
      .forEach(searchSeparator => {
        const isNumberSeparator = searchSeparator
          .split('')
          .filter(char => Number(char) || '0')
          .join('');

        whereCustomer.push(
          {
            name: Like(`%${searchSeparator}%`),
            id: Raw(alias =>
              notIdCustomers
                .map((id, index) => {
                  const and = index > 0 ? ' AND ' : '';
                  return `${and + alias} != '${id}'`;
                })
                .join(''),
            ),
          },
          {
            email: Like(`%${searchSeparator}%`),
            id: Raw(alias =>
              notIdCustomers
                .map((id, index) => {
                  const and = index > 0 ? ' AND ' : '';
                  return `${and + alias} != '${id}'`;
                })
                .join(''),
            ),
          },
          {
            cell_phone: Like(`%${isNumberSeparator}%`),
            id: Raw(alias =>
              notIdCustomers
                .map((id, index) => {
                  const and = index > 0 ? ' AND ' : '';
                  return `${and + alias} != '${id}'`;
                })
                .join(''),
            ),
          },
        );
        whereUser.push(
          {
            name: Like(`%${searchSeparator}%`),
            customer_id: IsNull(),
            id: Raw(alias =>
              notIdUsers
                .map((id, index) => {
                  const and = index > 0 ? ' AND ' : '';
                  return `${and + alias} != '${id}'`;
                })
                .join(''),
            ),
          },
          {
            email: Like(`%${searchSeparator}%`),
            customer_id: IsNull(),
            id: Raw(alias =>
              notIdUsers
                .map((id, index) => {
                  const and = index > 0 ? ' AND ' : '';
                  return `${and + alias} != '${id}'`;
                })
                .join(''),
            ),
          },
          {
            cell_phone: Like(`%${isNumberSeparator}%`),
            customer_id: IsNull(),
            id: Raw(alias =>
              notIdUsers
                .map((id, index) => {
                  const and = index > 0 ? ' AND ' : '';
                  return `${and + alias} != '${id}'`;
                })
                .join(''),
            ),
          },
        );
      });

    const customersTwo =
      customersOne.length < 20
        ? await this.ormRepository.find({
            where: whereCustomer,
            take: 20 - customersOne.length,
          })
        : [];

    const customers = customersOne.concat(customersTwo);

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

    const usersTwo = await this.userRepository.find({
      where: whereUser,
      take: 20 - usersOne.length,
    });

    const users = usersOne.concat(usersTwo);

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
