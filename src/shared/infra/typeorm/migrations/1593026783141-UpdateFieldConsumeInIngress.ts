import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class UpdateFieldConsumeInIngress1593026783141
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'ingress',
      'type',
      new TableColumn({
        name: 'consume',
        type: 'boolean',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'ingress',
      'cunsume',
      new TableColumn({
        name: 'type',
        type: 'varchar',
      }),
    );
  }
}
