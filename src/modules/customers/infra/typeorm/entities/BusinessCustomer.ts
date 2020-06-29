import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import Business from '@modules/business/infra/typeorm/entities/Business';
import Customer from './Customer';

@Entity('business_customers')
export default class BusinessCustomer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  business_id: string;

  @ManyToOne(() => Business, business => business.business_category)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column('uuid')
  customer_id: string;

  @ManyToOne(() => Customer, customer => customer.business_customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
