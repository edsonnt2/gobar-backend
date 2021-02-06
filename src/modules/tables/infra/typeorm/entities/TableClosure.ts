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
import PaymentClosureOrDiscount from '@modules/anyDiscounts/infra/typeorm/entities/PaymentClosureOrDiscount';
import Table from './Table';

@Entity('tables_closure')
export default class TableClosure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  business_id: string;

  @ManyToOne(() => Business, business => business.table_closure)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column('uuid')
  operator_id: string;

  @ManyToOne(() => User, user => user.table_closure)
  @JoinColumn({ name: 'operator_id' })
  operator: User;

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
    paymentClosureOrDiscount => paymentClosureOrDiscount.table_closure,
    {
      cascade: true,
    },
  )
  payment_closure_or_discount: PaymentClosureOrDiscount[];

  @OneToMany(() => Table, table => table.table_closure, {
    cascade: ['update'],
  })
  table: Table[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
