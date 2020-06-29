import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class CreateBusinessCustomersAndAddGenderAndPreRegisterInUsers1593376703527
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'users',
      'full_name',
      new TableColumn({ name: 'name', type: 'varchar' }),
    );

    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'gender',
        type: 'varchar',
        length: '1',
        isNullable: true,
      }),
      new TableColumn({
        name: 'cpf_or_cnpj',
        type: 'decimal',
        isNullable: true,
      }),
      new TableColumn({
        name: 'customer_id',
        type: 'uuid',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        name: 'key_customer',
        columnNames: ['customer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'customers',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'business_customers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'business_id',
            type: 'uuid',
          },
          {
            name: 'customer_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'key_business',
            columnNames: ['business_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'business',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'key_customer',
            columnNames: ['customer_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'customers',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('business_customers');

    await queryRunner.dropForeignKey('users', 'key_customer');

    await queryRunner.dropColumns('users', [
      new TableColumn({
        name: 'gender',
        type: 'varchar',
        length: '1',
        isNullable: true,
      }),
      new TableColumn({
        name: 'cpf_or_cnpj',
        type: 'decimal',
        isNullable: true,
      }),
      new TableColumn({
        name: 'customer_id',
        type: 'uuid',
        isNullable: true,
      }),
    ]);

    await queryRunner.changeColumn(
      'users',
      'name',
      new TableColumn({ name: 'full_name', type: 'varchar' }),
    );
  }
}
