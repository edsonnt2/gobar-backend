import AppError from '@shared/error/AppError';
import FakeProductRepository from '@modules/products/repositories/fakes/FakeProductRepository';
import FakeCommandRepository from '@modules/commands/repositories/fakes/FakeCommandRepository';
import CreateCommandProductService from './CreateCommandProductService';
import FakeCommandProductRepository from '../repositories/fakes/FakeCommandRepository';

let fakeCommandProductRepository: FakeCommandProductRepository;
let fakeCommandRepository: FakeCommandRepository;
let fakeProductRepository: FakeProductRepository;
let createCommandProductService: CreateCommandProductService;
let command: { number: number };

describe('CreateCommandProduct', () => {
  beforeEach(async () => {
    fakeCommandProductRepository = new FakeCommandProductRepository();
    fakeProductRepository = new FakeProductRepository();
    fakeCommandRepository = new FakeCommandRepository();
    createCommandProductService = new CreateCommandProductService(
      fakeCommandProductRepository,
      fakeCommandRepository,
      fakeProductRepository,
    );

    command = await fakeCommandRepository.create({
      business_id: 'business-id',
      customer_id: 'customer-id',
      number: 100,
    });
  });

  it('should be able to register produts in command', async () => {
    const saveArray = jest.spyOn(fakeProductRepository, 'saveArray');

    const productOne = await fakeProductRepository.create({
      business_id: 'business-id',
      description: 'Product Fictitious',
      label_description: 'product fictitious',
      category: 'Drinks',
      provider: 'Coca-cola',
      internal_code: '10',
      quantity: 10,
      barcode: '9405804287539004444',
      pushase_value: 100.0,
      sale_value: 120.0,
      porcent: 20,
    });

    const productTwo = await fakeProductRepository.create({
      business_id: 'business-id',
      description: 'Product Fictitious Two',
      label_description: 'product fictitious two',
      category: 'Drinks',
      provider: 'Coca-cola',
      internal_code: '10',
      quantity: 10,
      barcode: '9405804287539004444',
      pushase_value: 100.0,
      sale_value: 120.0,
      porcent: 20,
    });

    const inCommand = await createCommandProductService.execute({
      business_id: 'business-id',
      command: command.number,
      products: [
        {
          product_id: productOne.id,
          quantity: 2,
        },
        {
          description: 'Product Diverse',
          value: 19.99,
          quantity: 3,
        },
        {
          product_id: productTwo.id,
          quantity: 1,
        },
      ],
    });

    expect(inCommand).toEqual([
      expect.objectContaining({ product_id: productOne.id }),
      expect.objectContaining({ label_description: 'product diverse' }),
      expect.objectContaining({ product_id: productTwo.id }),
    ]);
    expect(saveArray).toHaveBeenCalled();
  });

  it('should not be able to register products in command with command other than business', async () => {
    await expect(
      createCommandProductService.execute({
        business_id: 'outher-id-business',
        command: command.number,
        products: [],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to register products in command with description undefined in product diverse', async () => {
    await expect(
      createCommandProductService.execute({
        business_id: 'business-id',
        command: command.number,
        products: [
          {
            quantity: 2,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to register products in command with value undefined in product diverse', async () => {
    await expect(
      createCommandProductService.execute({
        business_id: 'business-id',
        command: command.number,
        products: [
          {
            quantity: 2,
            description: 'Description Test',
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to register products in command with product id non-exists', async () => {
    await expect(
      createCommandProductService.execute({
        business_id: 'business-id',
        command: command.number,
        products: [
          {
            product_id: 'non-exists',
            quantity: 1,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to register products in command with product id non-exists', async () => {
    const product = await fakeProductRepository.create({
      business_id: 'business-id',
      description: 'Product Fictitious',
      label_description: 'product fictitious',
      category: 'Drinks',
      provider: 'Coca-cola',
      internal_code: '10',
      quantity: 10,
      barcode: '9405804287539004444',
      pushase_value: 100.0,
      sale_value: 120.0,
      porcent: 20,
    });

    await expect(
      createCommandProductService.execute({
        business_id: 'business-id',
        command: command.number,
        products: [
          {
            product_id: product.id,
            quantity: 11,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
