import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddTableFieldToBusiness1592956114103
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'business',
      new TableColumn({
        name: 'table',
        type: 'decimal',
        isNullable: true,
        default: 0,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('business', 'table');
  }
}
