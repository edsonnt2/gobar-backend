import AppError from '@shared/error/AppError';
import FakeProductRepository from '@modules/products/repositories/fakes/FakeProductRepository';
import FakeCommandRepository from '@modules/commands/repositories/fakes/FakeCommandRepository';
import FakeTableRepository from '@modules/tables/repositories/fakes/FakeTableRepository';
import DeleteItemForSaleService from './DeleteItemForSaleService';
import FakeItemForSaleRepository from '../repositories/fakes/FakeItemForSaleRepository';

let fakeItemForSaleRepository: FakeItemForSaleRepository;
let fakeCommandRepository: FakeCommandRepository;
let fakeTableRepository: FakeTableRepository;
let fakeProductRepository: FakeProductRepository;
let deleteCommandProductService: DeleteItemForSaleService;
let command: { id: string };
let table: { id: string };

describe('DeleteItemForSale', () => {
  beforeEach(async () => {
    fakeItemForSaleRepository = new FakeItemForSaleRepository();
    fakeProductRepository = new FakeProductRepository();
    fakeCommandRepository = new FakeCommandRepository();
    fakeTableRepository = new FakeTableRepository();
    deleteCommandProductService = new DeleteItemForSaleService(
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

  it('should be able to delete product in command', async () => {
    const save = jest.spyOn(fakeProductRepository, 'save');
    const deleteProduct = jest.spyOn(fakeItemForSaleRepository, 'delete');

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

    const commandProduct = await fakeItemForSaleRepository.create([
      {
        command_id: command.id,
        description: productOne.description,
        label_description: productOne.label_description,
        operator_id: 'operator-id',
        value: 120.0,
        quantity: 2,
        product_id: productOne.id,
      },
    ]);
    const commadProductId = commandProduct[0].id;

    await deleteCommandProductService.execute({
      business_id: 'business-id',
      command_id: command.id,
      item_product_id: commadProductId,
    });

    expect(deleteProduct).toHaveBeenCalledWith(commadProductId);
    expect(save).toHaveBeenCalled();
  });

  it('should be able to delete product in table', async () => {
    const save = jest.spyOn(fakeProductRepository, 'save');
    const deleteProduct = jest.spyOn(fakeItemForSaleRepository, 'delete');

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

    const tableProduct = await fakeItemForSaleRepository.create([
      {
        table_id: table.id,
        description: productOne.description,
        label_description: productOne.label_description,
        operator_id: 'operator-id',
        value: 120.0,
        quantity: 2,
        product_id: productOne.id,
      },
    ]);
    const tableProductId = tableProduct[0].id;

    await deleteCommandProductService.execute({
      business_id: 'business-id',
      table_id: table.id,
      item_product_id: tableProductId,
    });

    expect(deleteProduct).toHaveBeenCalledWith(tableProductId);
    expect(save).toHaveBeenCalled();
  });

  it('should be able to delete product in command or table without product-id', async () => {
    const deleteProduct = jest.spyOn(fakeItemForSaleRepository, 'delete');

    const commandProduct = await fakeItemForSaleRepository.create([
      {
        command_id: command.id,
        description: 'Product Fictitious',
        label_description: 'product fictitious',
        operator_id: 'operator-id',
        value: 120.0,
        quantity: 2,
      },
    ]);

    const commadProductId = commandProduct[0].id;

    await deleteCommandProductService.execute({
      business_id: 'business-id',
      command_id: command.id,
      item_product_id: commadProductId,
    });

    expect(deleteProduct).toHaveBeenCalledWith(commadProductId);
  });

  it('should be able to delete product in command with product-id not found', async () => {
    const deleteProduct = jest.spyOn(fakeItemForSaleRepository, 'delete');

    const commandProduct = await fakeItemForSaleRepository.create([
      {
        command_id: command.id,
        description: 'Product Fictitious',
        label_description: 'product fictitious',
        operator_id: 'operator-id',
        value: 120.0,
        quantity: 2,
        product_id: 'product-id',
      },
    ]);

    const commadProductId = commandProduct[0].id;

    await deleteCommandProductService.execute({
      business_id: 'business-id',
      command_id: command.id,
      item_product_id: commadProductId,
    });

    expect(deleteProduct).toHaveBeenCalledWith(commadProductId);
  });

  it('should not be able to delete product with command or table non-exists', async () => {
    await expect(
      deleteCommandProductService.execute({
        business_id: 'business-id',
        item_product_id: 'item-product-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete product in command with command non-exists', async () => {
    await expect(
      deleteCommandProductService.execute({
        business_id: 'business-id',
        command_id: 'command-non-exists',
        item_product_id: 'item-product-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete product in table with table non-exists', async () => {
    await expect(
      deleteCommandProductService.execute({
        business_id: 'business-id',
        table_id: 'table-non-exists',
        item_product_id: 'item-product-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to detele product in command with command than outher business', async () => {
    await expect(
      deleteCommandProductService.execute({
        business_id: 'outher-business-id',
        command_id: command.id,
        item_product_id: 'item-product-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to detele product in table with table than outher business', async () => {
    await expect(
      deleteCommandProductService.execute({
        business_id: 'outher-business-id',
        table_id: table.id,
        item_product_id: 'item-product-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to detele product in command with command-product-id non-exists', async () => {
    await expect(
      deleteCommandProductService.execute({
        business_id: 'business-id',
        command_id: command.id,
        item_product_id: 'command-product-id-non-exists',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to detele product with product register in outher command', async () => {
    const commandProduct = await fakeItemForSaleRepository.create([
      {
        command_id: 'outher-command',
        description: 'Product Fictitious',
        label_description: 'product fictitious',
        operator_id: 'operator-id',
        value: 120.0,
        quantity: 2,
      },
    ]);

    await expect(
      deleteCommandProductService.execute({
        business_id: 'business-id',
        command_id: command.id,
        item_product_id: commandProduct[0].id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to detele product with product register in outher table', async () => {
    const tableProduct = await fakeItemForSaleRepository.create([
      {
        table_id: 'outher-table',
        description: 'Product Fictitious',
        label_description: 'product fictitious',
        operator_id: 'operator-id',
        value: 120.0,
        quantity: 2,
      },
    ]);

    await expect(
      deleteCommandProductService.execute({
        business_id: 'business-id',
        table_id: table.id,
        item_product_id: tableProduct[0].id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
