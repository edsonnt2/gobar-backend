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
import CommandProduct from '@modules/commandsProducts/infra/typeorm/entities/CommandProduct';

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
  customer_id: string;

  @ManyToOne(() => Customer, customer => customer.command)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(() => CommandProduct, commandProduct => commandProduct.command, {
    eager: true,
  })
  command_product: CommandProduct[];

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
