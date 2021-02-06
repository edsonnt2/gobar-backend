import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import CommandClosure from '@modules/commands/infra/typeorm/entities/CommandClosure';
import TableClosure from '@modules/tables/infra/typeorm/entities/TableClosure';
import AnyDiscount from './AnyDiscount';

@Entity('payments_closure_or_discount')
export default class PaymentClosureOrDiscount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  command_closure_id: string;

  @ManyToOne(
    () => CommandClosure,
    commandClosure => commandClosure.payment_closure_or_discount,
  )
  @JoinColumn({ name: 'command_closure_id' })
  command_closure: CommandClosure;

  @Column('uuid')
  table_closure_id: string;

  @ManyToOne(
    () => TableClosure,
    tableClosure => tableClosure.payment_closure_or_discount,
  )
  @JoinColumn({ name: 'table_closure_id' })
  table_closure: CommandClosure;

  // Add id table closure and id account closure here

  @Column('uuid')
  any_discount_id: string;

  @ManyToOne(() => AnyDiscount, anyDiscount => anyDiscount.payment_discount)
  @JoinColumn({ name: 'any_discount_id' })
  any_discount: AnyDiscount;

  @Column()
  type: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  subtotal: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  received: number;

  @Column()
  type_card: string;
}
