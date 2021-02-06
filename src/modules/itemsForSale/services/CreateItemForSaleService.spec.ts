import AppError from '@shared/error/AppError';
import FakeProductRepository from '@modules/products/repositories/fakes/FakeProductRepository';
import FakeCommandRepository from '@modules/commands/repositories/fakes/FakeCommandRepository';
import FakeTableRepository from '@modules/tables/repositories/fakes/FakeTableRepository';
import CreateItemForSaleService from './CreateItemForSaleService';
import FakeItemForSaleRepository from '../repositories/fakes/FakeItemForSaleRepository';

let fakeItemForSaleRepository: FakeItemForSaleRepository;
let fakeCommandRepository: FakeCommandRepository;
let fakeTableRepository: FakeTableRepository;
let fakeProductRepository: FakeProductRepository;
let createItemForSaleService: CreateItemForSaleService;
let command: { number: number };
let table: { number: number };

describe('CreateItemForSale', () => {
  beforeEach(async () => {
    fakeItemForSaleRepository = new FakeItemForSaleRepository();
    fakeProductRepository = new FakeProductRepository();
    fakeCommandRepository = new FakeCommandRepository();
    fakeTableRepository = new FakeTableRepository();
    createItemForSaleService = new CreateItemForSaleService(
      fakeItemForSaleRepository,
      fakeCommandRepository,
      fakeTableRepository,
      fakeProductRepository,
    );

    command = await fakeCommandRepository.create({
      business_id: 'business-id',
      operator_id: 'operator-id',
      customer_id: 'customer-id',
      number: 100,
    });

    table = await fakeTableRepository.create({
      business_id: 'business-id',
      operator_id: 'operator-id',
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

    const inCommand = await createItemForSaleService.execute({
      business_id: 'business-id',
      user_id: 'operator-id',
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

  it('should be able to register produts in table', async () => {
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

    const inTable = await createItemForSaleService.execute({
      business_id: 'business-id',
      user_id: 'operator-id',
      table: table.number,
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

    expect(inTable).toEqual([
      expect.objectContaining({ product_id: productOne.id }),
      expect.objectContaining({ label_description: 'product diverse' }),
      expect.objectContaining({ product_id: productTwo.id }),
    ]);
    expect(saveArray).toHaveBeenCalled();
  });

  it('should not be able to register products in command or table with command or table non-exists', async () => {
    await expect(
      createItemForSaleService.execute({
        business_id: 'outher-id-business',
        user_id: 'operator-id',
        products: [],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to register products in command with command other than business', async () => {
    await expect(
      createItemForSaleService.execute({
        business_id: 'outher-id-business',
        user_id: 'operator-id',
        command: command.number,
        products: [],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to register products in table with table other than business', async () => {
    await expect(
      createItemForSaleService.execute({
        business_id: 'outher-id-business',
        user_id: 'operator-id',
        table: table.number,
        products: [],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to register products in command with description undefined in product diverse', async () => {
    await expect(
      createItemForSaleService.execute({
        business_id: 'business-id',
        user_id: 'operator-id',
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
      createItemForSaleService.execute({
        business_id: 'business-id',
        user_id: 'operator-id',
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
      createItemForSaleService.execute({
        business_id: 'business-id',
        user_id: 'operator-id',
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
      createItemForSaleService.execute({
        business_id: 'business-id',
        user_id: 'operator-id',
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
