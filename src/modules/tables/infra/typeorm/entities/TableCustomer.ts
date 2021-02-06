import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import Table from './Table';

@Entity('table_customers')
export default class TableCustomer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  table_id: string;

  @ManyToOne(() => Table, table => table.table_customer, {
    eager: true,
  })
  @JoinColumn({ name: 'table_id' })
  table: Table;

  @Column('uuid')
  customer_id: string;

  @ManyToOne(() => Customer, customer => customer.table_customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
