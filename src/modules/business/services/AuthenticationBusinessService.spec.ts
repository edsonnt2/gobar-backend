import 'reflect-metadata';
import AppError from '@shared/error/AppError';
import FakeAuthProvider from '@shared/provider/AuthProvider/fakes/FakeAuthProvider';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeBusinessRepository from '../repositories/fakes/FakeBusinessRepository';
import AuthenticationBusinessService from './AuthenticationBusinessService';

let fakeBusinessRepository: FakeBusinessRepository;
let fakeUserRepository: FakeUserRepository;
let fakeAuthProvider: FakeAuthProvider;
let authenticationBusinessService: AuthenticationBusinessService;

describe('AuthenticationBusiness', () => {
  beforeEach(() => {
    fakeBusinessRepository = new FakeBusinessRepository();
    fakeUserRepository = new FakeUserRepository();
    fakeAuthProvider = new FakeAuthProvider();
    authenticationBusinessService = new AuthenticationBusinessService(
      fakeBusinessRepository,
      fakeUserRepository,
      fakeAuthProvider,
    );
  });

  it('should be able to make the login in app.', async () => {
    const user = await fakeUserRepository.create({
      full_name: 'Name Test',
      email: 'test@test.com',
      cell_phone: '(12) 99999-9999',
      password: 'new-password',
      birthDate: '1991-09-08',
    });

    const business = await fakeBusinessRepository.create({
      user_id: user.id,
      name: 'New Business',
      category: 'bares',
      cpf_or_cnpj: '889.786.230-69',
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });

    const loginBusiness = await authenticationBusinessService.execute({
      user_id: user.id,
      business_id: business.id,
    });

    expect(loginBusiness).toHaveProperty('token');
  });

  it('should not be able to make the login with non-existing user.', async () => {
    await expect(
      authenticationBusinessService.execute({
        user_id: 'non-existing-user',
        business_id: 'business-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to make the login with non-existing business.', async () => {
    const user = await fakeUserRepository.create({
      full_name: 'Name Test',
      email: 'test@test.com',
      cell_phone: '(12) 99999-9999',
      password: 'new-password',
      birthDate: '1991-09-08',
    });

    await expect(
      authenticationBusinessService.execute({
        user_id: user.id,
        business_id: 'non-existing-business',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to login into another user's business.", async () => {
    const user = await fakeUserRepository.create({
      full_name: 'Name Test',
      email: 'test@test.com',
      cell_phone: '(12) 99999-9999',
      password: 'new-password',
      birthDate: '1991-09-08',
    });

    const business = await fakeBusinessRepository.create({
      user_id: 'other-user',
      name: 'New Business',
      category: 'bares',
      cpf_or_cnpj: '889.786.230-69',
      zip_code: '99999-999',
      number: 9,
      street: 'Rua test',
      district: 'District Test',
      city: 'City Test',
      state: 'State Test',
    });

    await expect(
      authenticationBusinessService.execute({
        user_id: user.id,
        business_id: business.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
