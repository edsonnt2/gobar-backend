import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumn,
} from 'typeorm';

export default class CreateCommandClosureAndAnyDiscount1595557069695
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'commands_closure',
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

    await queryRunner.createTable(
      new Table({
        name: 'any_discounts',
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
            name: 'command_id',
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
          {
            name: 'key_command',
            columnNames: ['command_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'commands',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'payments_closure_or_discount',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'command_closure_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'any_discount_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'subtotal',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'received',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'type_card',
            type: 'varchar',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'key_command_closure',
            columnNames: ['command_closure_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'commands_closure',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'key_any_discount',
            columnNames: ['any_discount_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'any_discounts',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.addColumn(
      'commands',
      new TableColumn({
        name: 'command_closure_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'commands',
      new TableForeignKey({
        name: 'key_command_closure',
        columnNames: ['command_closure_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'commands_closure',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('commands', 'key_command_closure');

    await queryRunner.dropColumn('commands', 'command_closure_id');

    await queryRunner.dropTable('payments_closure_or_discount');

    await queryRunner.dropTable('any_discounts');

    await queryRunner.dropTable('commands_closure');
  }
}
