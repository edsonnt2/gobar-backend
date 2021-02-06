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
import PaymentClosureOrDiscount from '@modules/anyDiscounts/infra/typeorm/entities/PaymentClosureOrDiscount';

@Entity('commands_closure')
export default class CommandClosure {
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
    paymentClosureOrDiscount => paymentClosureOrDiscount.command_closure,
    {
      cascade: true,
    },
  )
  payment_closure_or_discount: PaymentClosureOrDiscount[];

  @OneToMany(() => Command, command => command.command_closure, {
    cascade: ['update'],
  })
  command: Command[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
