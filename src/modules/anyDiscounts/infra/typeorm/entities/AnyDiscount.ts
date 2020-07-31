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
import User from '@modules/users/infra/typeorm/entities/User';
import Command from '@modules/commands/infra/typeorm/entities/Command';
import Table from '@modules/tables/infra/typeorm/entities/Table';
import PaymentClosureOrDiscount from './PaymentClosureOrDiscount';

@Entity('any_discounts')
export default class AnyDiscount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  business_id: string;

  @ManyToOne(() => Business, business => business.command_closure)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column('uuid')
  operator_id: string;

  @ManyToOne(() => User, user => user.command_closure)
  @JoinColumn({ name: 'operator_id' })
  operator: User;

  @Column('uuid')
  command_id: string;

  @ManyToOne(() => Command, command => command.command_discount)
  @JoinColumn({ name: 'command_id' })
  command: Command;

  @Column('uuid')
  table_id: string;

  @ManyToOne(() => Table, table => table.table_discount)
  @JoinColumn({ name: 'table_id' })
  table: Table;

  // Add id table and id account here

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  value_total: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  discount: number;

  @OneToMany(
    () => PaymentClosureOrDiscount,
    paymentClosureOrDiscount => paymentClosureOrDiscount.any_discount,
    {
      cascade: true,
    },
  )
  payment_discount: PaymentClosureOrDiscount[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
