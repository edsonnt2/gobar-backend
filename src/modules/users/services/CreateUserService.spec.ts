import 'reflect-metadata';
import AppError from '@shared/error/AppError';
import FakeAuthProvider from '@shared/provider/AuthProvider/fakes/FakeAuthProvider';
import CreateUserService from './CreateUserService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../provider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeAuthProvider: FakeAuthProvider;
let createUserService: CreateUserService;

describe('CreateUserServie', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeAuthProvider = new FakeAuthProvider();
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeAuthProvider,
    );

    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 4, 10).getTime());
  });

  it('should be able to create a new user', async () => {
    const data = await createUserService.execute({
      full_name: 'Full Name Test',
      cell_phone: '12999999099',
      email: 'test@test.com',
      password: 'test-password',
      birthDate: '1991/09/08',
    });

    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('user');
    expect(data.user.id).toBe('123456');
  });

  it('should not be able to create a new account with email already registered', async () => {
    await createUserService.execute({
      full_name: 'Full Name Test',
      cell_phone: '12999999999',
      email: 'test@test.com',
      password: 'test-password',
      birthDate: '1991/09/08',
    });

    await expect(
      createUserService.execute({
        full_name: 'Full Name Test Two',
        cell_phone: '55000000000',
        email: 'test@test.com',
        password: 'test-password',
        birthDate: '1991/09/08',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new account with cell_phone already registered', async () => {
    await createUserService.execute({
      full_name: 'Full Name Test',
      cell_phone: '12999999999',
      email: 'test@test.com',
      password: 'test-password',
      birthDate: '1991/09/08',
    });

    await expect(
      createUserService.execute({
        full_name: 'Full Name Test Two',
        cell_phone: '12999999999',
        email: 'testwo@test.com',
        password: 'test-password',
        birthDate: '1991/09/08',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to generate hash with password informed.', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await createUserService.execute({
      full_name: 'Full Name Test',
      cell_phone: '(12) 99999-9999',
      email: 'test@test.com',
      password: 'test-password',
      birthDate: '1991/09/08',
    });

    expect(generateHash).toHaveBeenCalledWith('test-password');
  });

  it('should not be able to create an account with birth date in format invalid.', async () => {
    await expect(
      createUserService.execute({
        full_name: 'Full Name Test',
        cell_phone: '12999999999',
        email: 'test@test.com',
        password: 'test-password',
        birthDate: 'invalid-date',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an account for under the age of 16.', async () => {
    await expect(
      createUserService.execute({
        full_name: 'Full Name Test',
        cell_phone: '12999999999',
        email: 'test@test.com',
        password: 'test-password',
        birthDate: '2004/5/20',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
