import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddFieldOperatorInTables1594391046374
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'commands_products',
      new TableColumn({
        name: 'operator_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'commands_products',
      new TableForeignKey({
        name: 'key_operator',
        columnNames: ['operator_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.addColumn(
      'commands',
      new TableColumn({
        name: 'operator_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'commands',
      new TableForeignKey({
        name: 'key_operator',
        columnNames: ['operator_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('commands', 'key_operator');
    await queryRunner.dropColumn('commands', 'operator_id');

    await queryRunner.dropForeignKey('commands_products', 'key_operator');
    await queryRunner.dropColumn('commands_products', 'operator_id');
  }
}
