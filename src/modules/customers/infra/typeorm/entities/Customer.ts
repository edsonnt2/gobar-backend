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
import { Expose } from 'class-transformer';
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
  cell_phone: number;

  @Column()
  email: string;

  @Column()
  birthDate: string;

  @Column({ type: 'varchar', length: 1 })
  gender: string;

  @Column()
  cpf_or_cnpj: number;

  @OneToMany(
    () => BusinessCustomer,
    businessCustomer => businessCustomer.customer,
    {
      cascade: ['insert'],
      eager: true,
    },
  )
  business_customer: BusinessCustomer[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    return this.user && this.user.avatar
      ? `${process.env.URL_HOST}/file/${this.user.avatar}`
      : null;
  }
}
