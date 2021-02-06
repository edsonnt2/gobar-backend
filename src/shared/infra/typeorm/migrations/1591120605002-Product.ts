import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class Product1591120605002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
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
            name: 'image',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'category_id',
            type: 'uuid',
          },
          {
            name: 'quantity',
            type: 'integer',
          },
          {
            name: 'provider_id',
            type: 'uuid',
          },
          {
            name: 'internal_code',
            type: 'varchar',
          },
          {
            name: 'barcode',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'pushase_value',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'porcent',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'sale_value',
            type: 'decimal',
            precision: 10,
            scale: 2,
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
            name: 'key_category_product',
            columnNames: ['category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'categories_product',
          },
          {
            name: 'key_category_provider',
            columnNames: ['provider_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'categories_provider',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
