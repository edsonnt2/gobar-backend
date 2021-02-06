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
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import ItemForSale from '@modules/itemsForSale/infra/typeorm/entities/ItemForSale';
import User from '@modules/users/infra/typeorm/entities/User';
import CommandClosure from '@modules/commands/infra/typeorm/entities/CommandClosure';
import AnyDiscount from '@modules/anyDiscounts/infra/typeorm/entities/AnyDiscount';

@Entity('commands')
export default class Command {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  business_id: string;

  @ManyToOne(() => Business, business => business.command)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column('uuid')
  operator_id: string;

  @ManyToOne(() => User, user => user.command)
  @JoinColumn({ name: 'operator_id' })
  operator: User;

  @Column('uuid')
  customer_id: string;

  @ManyToOne(() => Customer, customer => customer.command)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column('uuid')
  command_closure_id: string;

  @ManyToOne(() => CommandClosure, commandClosure => commandClosure.command)
  @JoinColumn({ name: 'command_closure_id' })
  command_closure: CommandClosure;

  @OneToMany(() => ItemForSale, itemForSale => itemForSale.command)
  command_product: ItemForSale[];

  @OneToMany(() => AnyDiscount, anyDiscount => anyDiscount.command)
  command_discount: AnyDiscount[];

  @Column()
  number: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  value_ingress: number;

  @Column('boolean')
  ingress_consume: boolean;

  @Column('boolean')
  prepaid_ingress: boolean;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  value_consume: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
