import { Expose } from 'class-transformer';

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
import Product from '@modules/products/infra/typeorm/entities/Product';
import Ingress from '@modules/ingress/infra/typeorm/entities/Ingress';
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

  @OneToMany(() => Product, product => product.business)
  product: Product[];

  @OneToMany(() => Ingress, ingress => ingress.business)
  ingress: Ingress[];

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

  @Column('decimal')
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

  @Column()
  table?: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    return this.avatar ? `${process.env.URL_HOST}/file/${this.avatar}` : null;
  }
}
