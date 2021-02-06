import 'reflect-metadata';
import AppError from '@shared/error/AppError';
import FakeAuthProvider from '@shared/provider/AuthProvider/fakes/FakeAuthProvider';
import AuthenticationUserService from './AuthenticationUserService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../provider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeAuthProvider: FakeAuthProvider;
let authenticationUserService: AuthenticationUserService;

describe('AuthenticationUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeAuthProvider = new FakeAuthProvider();
    authenticationUserService = new AuthenticationUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeAuthProvider,
    );
  });

  it('should be able to make the login in app.', async () => {
    await fakeUserRepository.create({
      name: 'Name Test',
      email: 'test@test.com',
      cell_phone: 12999999999,
      password: 'new-password',
      birthDate: '1991-09-08',
    });

    const logincell_phone = await authenticationUserService.execute({
      cellPhoneOrEmail: '12999999999',
      password: 'new-password',
    });

    const loginEmail = await authenticationUserService.execute({
      cellPhoneOrEmail: 'test@test.com',
      password: 'new-password',
    });

    expect(logincell_phone).toHaveProperty('token');
    expect(loginEmail).toHaveProperty('token');
  });

  it('should not be able to make the login with cell phone or email incorrect.', async () => {
    await fakeUserRepository.create({
      name: 'Name Test',
      email: 'test@test.com',
      cell_phone: 12999999999,
      password: 'new-password',
      birthDate: '1991-09-08',
    });

    await expect(
      authenticationUserService.execute({
        cellPhoneOrEmail: '(99) 99999-9999',
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      authenticationUserService.execute({
        cellPhoneOrEmail: 'no-email',
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to make the login with password incorrect.', async () => {
    await fakeUserRepository.create({
      name: 'Name Test',
      email: 'test@test.com',
      cell_phone: 12999999999,
      password: 'new-password',
      birthDate: '1991-09-08',
    });

    await expect(
      authenticationUserService.execute({
        cellPhoneOrEmail: 'test@test.com',
        password: 'password-incorrect',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
