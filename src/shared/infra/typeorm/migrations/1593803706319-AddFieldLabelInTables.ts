import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddFieldLabelInTables1593803706319
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'users',
      'taxId',
      new TableColumn({
        name: 'taxId',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'customers',
      'taxId',
      new TableColumn({
        name: 'taxId',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'commands',
      'number',
      new TableColumn({
        name: 'number',
        type: 'varchar',
      }),
    );

    await queryRunner.changeColumn(
      'business',
      'state',
      new TableColumn({
        name: 'state',
        type: 'varchar',
        length: '2',
      }),
    );

    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'label_description',
        type: 'varchar',
      }),
    );

    await queryRunner.addColumn(
      'customers',
      new TableColumn({
        name: 'label_name',
        type: 'varchar',
      }),
    );

    await queryRunner.addColumn(
      'entrance',
      new TableColumn({
        name: 'label_description',
        type: 'varchar',
      }),
    );

    await queryRunner.addColumns('business', [
      new TableColumn({
        name: 'label_name',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'label_street',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'label_complement',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'label_district',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'label_city',
        type: 'varchar',
      }),
    ]);

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'label_name',
        type: 'varchar',
      }),
    );

    await queryRunner.addColumn(
      'categories_provider',
      new TableColumn({
        name: 'label_name',
        type: 'varchar',
      }),
    );

    await queryRunner.addColumn(
      'categories_product',
      new TableColumn({
        name: 'label_name',
        type: 'varchar',
      }),
    );

    await queryRunner.addColumn(
      'categories',
      new TableColumn({
        name: 'label_name',
        type: 'varchar',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('categories', 'label_name');

    await queryRunner.dropColumn('categories_product', 'label_name');

    await queryRunner.dropColumn('categories_provider', 'label_name');

    await queryRunner.dropColumn('users', 'label_name');

    await queryRunner.dropColumns('business', [
      new TableColumn({
        name: 'label_name',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'label_street',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'label_complement',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'label_district',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'label_city',
        type: 'varchar',
      }),
    ]);

    await queryRunner.dropColumn('entrance', 'label_description');

    await queryRunner.dropColumn('customers', 'label_name');

    await queryRunner.dropColumn('products', 'label_description');

    await queryRunner.changeColumn(
      'business',
      'state',
      new TableColumn({
        name: 'state',
        type: 'varchar',
      }),
    );

    await queryRunner.changeColumn(
      'commands',
      'number',
      new TableColumn({
        name: 'number',
        type: 'decimal',
      }),
    );

    await queryRunner.changeColumn(
      'customers',
      'taxId',
      new TableColumn({
        name: 'taxId',
        type: 'decimal',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'users',
      'taxId',
      new TableColumn({
        name: 'taxId',
        type: 'decimal',
        isNullable: true,
      }),
    );
  }
}
