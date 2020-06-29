import 'reflect-metadata';
import AppError from '@shared/error/AppError';
import FakeAuthProvider from '@shared/provider/AuthProvider/fakes/FakeAuthProvider';
import BackAuthenticationUserService from './BackAuthenticationUserService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

let fakeUserRepository: FakeUserRepository;
let fakeAuthProvider: FakeAuthProvider;
let backAuthenticationUserService: BackAuthenticationUserService;

describe('BackAuthenticationUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeAuthProvider = new FakeAuthProvider();
    backAuthenticationUserService = new BackAuthenticationUserService(
      fakeUserRepository,
      fakeAuthProvider,
    );
  });

  it('should be able to back for user login without business.', async () => {
    const user = await fakeUserRepository.create({
      name: 'Name Test',
      email: 'test@test.com',
      cell_phone: 12999999999,
      password: 'new-password',
      birthDate: '1991-09-08',
    });

    const login = await backAuthenticationUserService.execute({
      user_id: user.id,
    });

    expect(login).toHaveProperty('token');
    expect(login.user).toBe(user);
  });

  it('should be able to back for user login with user id incorrect.', async () => {
    await expect(
      backAuthenticationUserService.execute({
        user_id: 'user-no-exists',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
