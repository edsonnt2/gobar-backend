import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateCommand1593626733772 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'commands',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'customer_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'business_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'number',
            type: 'decimal',
          },
          {
            name: 'value_entrance',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'entrance_consume',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'prepaid_entrance',
            type: 'boolean',
            default: false,
          },
          {
            name: 'value_consume',
            type: 'decimal',
            precision: 10,
            scale: 2,
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
            name: 'key_customer',
            columnNames: ['customer_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'customers',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'key_business',
            columnNames: ['business_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'business',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('commands');
  }
}
