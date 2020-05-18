import AuthenticationUserService from './AuthenticationUserService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../provider/fakes/FakeHashProvider';
import FakeAuthProvider from '../provider/fakes/FakeAuthProvider';

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
      full_name: 'Name Test',
      email: 'test@test.com',
      cellPhone: 1234567890,
      password: 'new-password',
      birthDate: '1991-09-08',
    });

    const logincellPhone = await authenticationUserService.execute({
      cellPhoneOrEmail: 1234567890,
      password: 'new-password',
    });

    const loginEmail = await authenticationUserService.execute({
      cellPhoneOrEmail: 'test@test.com',
      password: 'new-password',
    });

    expect(logincellPhone).toHaveProperty('token');
    expect(loginEmail).toHaveProperty('token');
  });

  it('should not be able to make the login with cell phone or email incorrect.', async () => {
    await fakeUserRepository.create({
      full_name: 'Name Test',
      email: 'test@test.com',
      cellPhone: 1234567890,
      password: 'new-password',
      birthDate: '1991-09-08',
    });

    await expect(
      authenticationUserService.execute({
        cellPhoneOrEmail: 9999999999,
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(Error);

    await expect(
      authenticationUserService.execute({
        cellPhoneOrEmail: 'no-email',
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to make the login with password incorrect.', async () => {
    await fakeUserRepository.create({
      full_name: 'Name Test',
      email: 'test@test.com',
      cellPhone: 1234567890,
      password: 'new-password',
      birthDate: '1991-09-08',
    });

    await expect(
      authenticationUserService.execute({
        cellPhoneOrEmail: 'test@test.com',
        password: 'password-incorrect',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
