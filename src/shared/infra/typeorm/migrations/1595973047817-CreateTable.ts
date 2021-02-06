import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class CreateTable1595973047817 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tables',
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
            isNullable: true,
          },
          {
            name: 'operator_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'table_closure_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'number',
            type: 'varchar',
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
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'key_operator',
            columnNames: ['operator_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'key_table_closure',
            columnNames: ['table_closure_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'tables_closure',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.addColumn(
      'items_for_sale',
      new TableColumn({
        name: 'table_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'items_for_sale',
      new TableForeignKey({
        name: 'key_table',
        columnNames: ['table_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tables',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.addColumn(
      'any_discounts',
      new TableColumn({
        name: 'table_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'any_discounts',
      new TableForeignKey({
        name: 'key_table',
        columnNames: ['table_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tables',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('any_discounts', 'key_table');

    await queryRunner.dropColumn('any_discounts', 'table_id');

    await queryRunner.dropForeignKey('items_for_sale', 'key_table');

    await queryRunner.dropColumn('items_for_sale', 'table_id');

    await queryRunner.dropTable('tables');
  }
}
