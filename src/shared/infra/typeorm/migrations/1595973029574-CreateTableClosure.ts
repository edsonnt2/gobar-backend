import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class CreateTableClosure1595973029574
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tables_closure',
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
            name: 'value_total',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'discount',
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
        ],
      }),
    );

    await queryRunner.addColumn(
      'payments_closure_or_discount',
      new TableColumn({
        name: 'table_closure_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'payments_closure_or_discount',
      new TableForeignKey({
        name: 'key_table_closure',
        columnNames: ['table_closure_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tables_closure',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'payments_closure_or_discount',
      'key_table_closure',
    );

    await queryRunner.dropColumn(
      'payments_closure_or_discount',
      'table_closure_id',
    );

    await queryRunner.dropTable('tables_closure');
  }
}
