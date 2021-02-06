import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import Business from '@modules/business/infra/typeorm/entities/Business';
import ItemForSale from '@modules/itemsForSale/infra/typeorm/entities/ItemForSale';
import User from '@modules/users/infra/typeorm/entities/User';
import AnyDiscount from '@modules/anyDiscounts/infra/typeorm/entities/AnyDiscount';
import TableClosure from './TableClosure';
import TableCustomer from './TableCustomer';

@Entity('tables')
export default class Table {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  business_id: string;

  @ManyToOne(() => Business, business => business.table_entitie)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column('uuid')
  operator_id: string;

  @ManyToOne(() => User, user => user.table)
  @JoinColumn({ name: 'operator_id' })
  operator: User;

  @Column('uuid')
  table_closure_id: string;

  @ManyToOne(() => TableClosure, tableClosure => tableClosure.table)
  @JoinColumn({ name: 'table_closure_id' })
  table_closure: TableClosure;

  @OneToMany(() => ItemForSale, itemForSale => itemForSale.table)
  table_product: ItemForSale[];

  @OneToMany(() => AnyDiscount, anyDiscount => anyDiscount.table)
  table_discount: AnyDiscount[];

  @OneToMany(() => TableCustomer, tableCustomer => tableCustomer.table, {
    cascade: true,
  })
  table_customer: TableCustomer[];

  @Column()
  number: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
