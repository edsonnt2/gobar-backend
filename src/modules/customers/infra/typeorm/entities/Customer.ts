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
import User from '@modules/users/infra/typeorm/entities/User';
import Command from '@modules/commands/infra/typeorm/entities/Command';
import TableCustomer from '@modules/tables/infra/typeorm/entities/TableCustomer';
import BusinessCustomer from './BusinessCustomer';

@Entity('customers')
export default class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @OneToOne(() => User, user => user.customer)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  name: string;

  @Column()
  label_name: string;

  @Column()
  cell_phone: number;

  @Column()
  email: string;

  @Column()
  birthDate: string;

  @Column({ type: 'varchar', length: 1 })
  gender: string;

  @Column()
  taxId: number;

  @OneToMany(
    () => BusinessCustomer,
    businessCustomer => businessCustomer.customer,
    {
      cascade: ['insert'],
    },
  )
  business_customer: BusinessCustomer[];

  @OneToMany(() => Command, command => command.customer)
  command: Command[];

  @OneToMany(() => TableCustomer, tableCustomer => tableCustomer.customer)
  table_customer: TableCustomer[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
