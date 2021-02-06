import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class UpdateTypeNumberInColluns1592958298631
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'business',
      'number',
      new TableColumn({
        name: 'number',
        type: 'decimal',
      }),
    );

    await queryRunner.changeColumns('products', [
      {
        oldColumn: new TableColumn({ name: 'quantity', type: 'integer' }),
        newColumn: new TableColumn({
          name: 'quantity',
          type: 'decimal',
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'porcent',
          type: 'integer',
          isNullable: true,
        }),
        newColumn: new TableColumn({
          name: 'porcent',
          type: 'decimal',
          isNullable: true,
        }),
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('products', [
      {
        oldColumn: new TableColumn({
          name: 'quantity',
          type: 'decimal',
        }),
        newColumn: new TableColumn({ name: 'quantity', type: 'integer' }),
      },
      {
        oldColumn: new TableColumn({
          name: 'porcent',
          type: 'decimal',
          isNullable: true,
        }),
        newColumn: new TableColumn({
          name: 'porcent',
          type: 'integer',
          isNullable: true,
        }),
      },
    ]);

    await queryRunner.changeColumn(
      'business',
      'number',
      new TableColumn({
        name: 'number',
        type: 'integer',
      }),
    );
  }
}
