import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import ICreateCustomerDTO from '@modules/customers/Dtos/ICreateCustomerDTO';
import IFindInCustomerDTO from '@modules/customers/Dtos/IFindInCustomerDTO';
import { IReturnSearchCustomerDTO } from '@modules/customers/Dtos/IReturnSearchCustomerDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import crypto from 'crypto';
import ICustomerRepository from '../ICustomerRepository';

class FakeCustomerRepository implements ICustomerRepository {
  private customers: Customer[] = [];

  private users: User[] = [];

  public async create({
    business_id,
    ...rest
  }: ICreateCustomerDTO): Promise<Customer> {
    const customer = new Customer();

    const idCustomer = crypto.randomBytes(6).toString('hex');

    Object.assign(
      customer,
      {
        id: idCustomer,
        business_customer: [
          {
            id: 'fjasdl405353fdsa',
            customer_id: idCustomer,
            business_id,
          },
        ],
      },
      rest,
    );

    this.customers.push(customer);

    return customer;
  }

  public async findInCustomer({
    find,
    where,
  }: IFindInCustomerDTO): Promise<Customer | undefined> {
    const newFind =
      where === 'cell_phone' || where === 'taxId' ? Number(find) : find;

    const getCustomer = this.customers.find(
      findCustomer => findCustomer[where] === newFind,
    );

    return getCustomer;
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const customer = this.customers.find(
      findCustomer => findCustomer.id === id,
    );

    return customer;
  }

  public async search(
    business_id: string,
    search: string,
  ): Promise<IReturnSearchCustomerDTO> {
    const user = new User();

    const customerTwo = new Customer();

    const dataUser = {
      id: '35aaeec1c2f7180fd464',
      name: 'Name Test',
      cell_phone: 19999999999,
      email: 'test@mail.com',
    };

    Object.assign(user, dataUser);

    this.users.push(user);

    const dataCustomer = {
      id: '35re64eec1c2f7180fd434',
      name: dataUser.name,
      cell_phone: dataUser.cell_phone,
      email: dataUser.email,
      business_customer: [
        {
          id: 'fjasdl405654rged53fdsa',
          customer_id: '35re64eec1c2f7180fd434',
          business_id,
        },
      ],
    };

    Object.assign(customerTwo, dataCustomer);

    this.customers.push(customerTwo);

    const customersInBusiness = this.customers.filter(
      ({ name, cell_phone, email, business_customer }) =>
        (name.includes(search) ||
          String(cell_phone).includes(search) ||
          email.includes(search)) &&
        business_customer.filter(
          getBusiness => getBusiness.business_id === business_id,
        ).length > 0,
    );

    const customersOutherBusiness = this.customers.filter(
      ({ name, cell_phone, email, business_customer }) =>
        (name.includes(search) ||
          String(cell_phone).includes(search) ||
          email.includes(search)) &&
        business_customer.filter(
          getBusiness => getBusiness.business_id === business_id,
        ).length === 0,
    );

    const findUsers = this.users.filter(
      ({ name, cell_phone, email, customer_id }) =>
        (name.includes(search) ||
          String(cell_phone).includes(search) ||
          email.includes(search)) &&
        !customer_id,
    );

    return {
      users: findUsers,
      customersInBusiness,
      customersOutherBusiness,
    };
  }

  public async save(customer: Customer): Promise<void> {
    const findIndex = this.customers.findIndex(({ id }) => id === customer.id);

    this.customers[findIndex] = customer;
  }
}

export default FakeCustomerRepository;
