import { Exclude, Expose } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import Business from '@modules/business/infra/typeorm/entities/Business';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import ItemForSale from '@modules/itemsForSale/infra/typeorm/entities/ItemForSale';
import Command from '@modules/commands/infra/typeorm/entities/Command';
import CommandClosure from '@modules/commands/infra/typeorm/entities/CommandClosure';
import Table from '@modules/tables/infra/typeorm/entities/Table';
import TableClosure from '@modules/tables/infra/typeorm/entities/TableClosure';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  label_name: string;

  @Column()
  cell_phone: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @Column()
  birthDate: string;

  @Column({ type: 'varchar', length: 1 })
  gender: string;

  @Column()
  cpf_or_cnpj: number;

  @OneToMany(() => Business, business => business.user, { eager: true })
  business: Business[];

  @Column('uuid')
  customer_id: string;

  @OneToOne(() => Customer, customer => customer.user)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(() => ItemForSale, itemForSale => itemForSale.operator)
  item_for_sale: ItemForSale[];

  @OneToMany(() => Command, command => command.operator)
  command: Command[];

  @OneToMany(() => CommandClosure, commandClosure => commandClosure.operator)
  command_closure: CommandClosure[];

  @OneToMany(() => Table, table => table.operator)
  table: Table[];

  @OneToMany(() => TableClosure, tableClosure => tableClosure.operator)
  table_closure: TableClosure[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    return this.avatar ? `${process.env.URL_HOST}/file/${this.avatar}` : null;
  }
}
