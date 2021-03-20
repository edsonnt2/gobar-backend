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
import removeAccents from '@shared/utils/removeAccents';
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
    taxId,
    business_id,
  }: ICreateCustomerDTO): Promise<Customer> {
    const customer = this.ormRepository.create({
      name,
      label_name: removeAccents(name).toLowerCase().trim(),
      email: email?.toLowerCase(),
      cell_phone,
      birthDate,
      gender,
      taxId,
      business_customer: [{ business_id }],
    });

    await this.ormRepository.save(customer);

    return customer;
  }

  public async findInCustomer({
    find,
    where,
  }: IFindInCustomerDTO): Promise<Customer | undefined> {
    let newWhere: string = where;
    let newFind = find;
    if (where === 'name') {
      newWhere = 'label_name';
      const findString = find as string;
      newFind = removeAccents(findString).toLowerCase().trim();
    }

    const customer = await this.ormRepository.findOne({
      where: {
        [newWhere]: newFind,
      },
    });

    return customer;
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const customer = await this.ormRepository.findOne(
      { id },
      {
        relations: ['business_customer'],
      },
    );

    return customer;
  }

  public async search(
    business_id: string,
    findSearch: string,
  ): Promise<IReturnSearchCustomerDTO> {
    const isNumber = findSearch
      .split('')
      .filter(char => Number(char) || char === '0')
      .join('');

    const search = removeAccents(findSearch).toLowerCase().trim();

    const whereCustomer: { [key: string]: FindOperator<string> }[] = [];
    const whereCustomerOne: { [key: string]: FindOperator<string> }[] = [
      {
        label_name: Like(`%${search}%`),
      },
      {
        email: Like(`%${findSearch.toLowerCase().trim()}%`),
      },
    ];
    if (isNumber)
      whereCustomerOne.push({
        cell_phone: Like(`%${isNumber}%`),
      });

    const customersOne = await this.ormRepository.find({
      relations: ['business_customer', 'command', 'table_customer'],
      where: whereCustomerOne,
      take: 20,
    });

    const notIdCustomers = customersOne.map(({ id }) => id);

    const whereUser: { [key: string]: FindOperator<string> }[] = [];
    const whereUserOne: { [key: string]: FindOperator<string> }[] = [
      {
        label_name: Like(`%${search}%`),
        customer_id: IsNull(),
      },
      {
        email: Like(`%${findSearch.toLowerCase().trim()}%`),
        customer_id: IsNull(),
      },
    ];

    if (isNumber)
      whereUserOne.push({
        cell_phone: Like(`%${isNumber}%`),
        customer_id: IsNull(),
      });

    const usersOne = await this.userRepository.find({
      where: whereUserOne,
      take: 20,
    });

    const notIdUsers = usersOne.map(({ id }) => id);

    search
      .trim()
      .split(' ')
      .forEach(searchSeparator => {
        const isNumberSeparator = searchSeparator
          .split('')
          .filter(char => Number(char) || char === '0')
          .join('');

        whereCustomer.push(
          {
            label_name: Like(`%${searchSeparator}%`),
            ...(notIdCustomers.length > 0 && {
              id: Raw(alias =>
                notIdCustomers
                  .map((id, index) => {
                    const and = index > 0 ? ' AND ' : '';
                    return `${and + alias} != '${id}'`;
                  })
                  .join(''),
              ),
            }),
          },
          {
            email: Like(`%${searchSeparator}%`),
            ...(notIdCustomers.length > 0 && {
              id: Raw(alias =>
                notIdCustomers
                  .map((id, index) => {
                    const and = index > 0 ? ' AND ' : '';
                    return `${and + alias} != '${id}'`;
                  })
                  .join(''),
              ),
            }),
          },
        );

        if (isNumberSeparator)
          whereCustomer.push({
            cell_phone: Like(`%${isNumberSeparator}%`),
            ...(notIdCustomers.length > 0 && {
              id: Raw(alias =>
                notIdCustomers
                  .map((id, index) => {
                    const and = index > 0 ? ' AND ' : '';
                    return `${and + alias} != '${id}'`;
                  })
                  .join(''),
              ),
            }),
          });

        whereUser.push(
          {
            label_name: Like(`%${searchSeparator}%`),
            customer_id: IsNull(),
            ...(notIdUsers.length > 0 && {
              id: Raw(alias =>
                notIdUsers
                  .map((id, index) => {
                    const and = index > 0 ? ' AND ' : '';
                    return `${and + alias} != '${id}'`;
                  })
                  .join(''),
              ),
            }),
          },
          {
            email: Like(`%${searchSeparator}%`),
            customer_id: IsNull(),
            ...(notIdUsers.length > 0 && {
              id: Raw(alias =>
                notIdUsers
                  .map((id, index) => {
                    const and = index > 0 ? ' AND ' : '';
                    return `${and + alias} != '${id}'`;
                  })
                  .join(''),
              ),
            }),
          },
        );

        if (isNumberSeparator)
          whereUser.push({
            cell_phone: Like(`%${isNumberSeparator}%`),
            customer_id: IsNull(),
            ...(notIdUsers.length > 0 && {
              id: Raw(alias =>
                notIdUsers
                  .map((id, index) => {
                    const and = index > 0 ? ' AND ' : '';
                    return `${and + alias} != '${id}'`;
                  })
                  .join(''),
              ),
            }),
          });
      });

    const customersTwo =
      customersOne.length < 20
        ? await this.ormRepository.find({
            relations: ['business_customer', 'command', 'table_customer'],
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
      delete customersOutherBusiness[index].taxId;
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
