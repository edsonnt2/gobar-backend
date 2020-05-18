import CreateUserService from './CreateUserService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../provider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUserServie', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 4, 10).getTime());
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      full_name: 'Full Name Test',
      cellPhone: 1234567890,
      email: 'test@test.com',
      password: 'test-password',
      birthDate: '1991/09/08',
    });

    expect(user).toHaveProperty('id');
    expect(user.full_name).toBe('Full Name Test');
  });

  it('should not be able to create a new account with email already registered', async () => {
    await createUserService.execute({
      full_name: 'Full Name Test',
      cellPhone: 1234567890,
      email: 'test@test.com',
      password: 'test-password',
      birthDate: '1991/09/08',
    });

    await expect(
      createUserService.execute({
        full_name: 'Full Name Test Two',
        cellPhone: 5500000000000,
        email: 'test@test.com',
        password: 'test-password',
        birthDate: '1991/09/08',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to create a new account with cellPhone already registered', async () => {
    await createUserService.execute({
      full_name: 'Full Name Test',
      cellPhone: 1234567890,
      email: 'test@test.com',
      password: 'test-password',
      birthDate: '1991/09/08',
    });

    await expect(
      createUserService.execute({
        full_name: 'Full Name Test Two',
        cellPhone: 1234567890,
        email: 'testwo@test.com',
        password: 'test-password',
        birthDate: '1991/09/08',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to generate hash with password informed.', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await createUserService.execute({
      full_name: 'Full Name Test',
      cellPhone: 1234567890,
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
        cellPhone: 1234567890,
        email: 'test@test.com',
        password: 'test-password',
        birthDate: 'invalid-date',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to create an account for under the age of 16.', async () => {
    await expect(
      createUserService.execute({
        full_name: 'Full Name Test',
        cellPhone: 1234567890,
        email: 'test@test.com',
        password: 'test-password',
        birthDate: '2004/5/20',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
