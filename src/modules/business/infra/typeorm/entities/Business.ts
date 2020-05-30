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
import User from '@modules/users/infra/typeorm/entities/User';
import BusinessCategory from './BusinessCategory';

@Entity('business')
export default class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User, user => user.business)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    () => BusinessCategory,
    businessCategory => businessCategory.business,
    {
      cascade: ['insert'],
      eager: true,
    },
  )
  business_category: BusinessCategory[];

  @Column()
  avatar: string;

  @Column()
  cell_phone?: number;

  @Column()
  phone?: number;

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
