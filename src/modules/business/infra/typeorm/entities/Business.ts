import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import Category from './Category';

@Entity('business')
export default class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User, user => user.business, {
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('uuid')
  category_id: string;

  @ManyToOne(() => Category, category => category.business, {
    cascade: ['insert'],
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  cell_phone?: string;

  @Column()
  phone?: string;

  @Column()
  cpf_or_cnpj: string;

  @Column()
  zip_code: string;

  @Column()
  number: number;

  @Column()
  complement?: string;

  @Column()
  street: string;

  @Column()
  district: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
