import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class RemoveCategoryIdFromBusiness1592957700300
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('business', 'category_id');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'business',
      new TableColumn({
        name: 'category_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }
}
