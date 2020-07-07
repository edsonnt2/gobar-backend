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
import Command from '@modules/commands/infra/typeorm/entities/Command';
import BusinessCategory from './BusinessCategory';

@Entity('business')
export default class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  label_name: string;

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

  @OneToMany(() => Command, command => command.business)
  command: Command[];

  @Column()
  avatar: string;

  @Column()
  cell_phone?: number;

  @Column()
  phone?: number;

  @Column()
  cpf_or_cnpj: number;

  @Column()
  zip_code: string;

  @Column('decimal')
  number: number;

  @Column()
  complement?: string;

  @Column()
  label_complement?: string;

  @Column()
  street: string;

  @Column()
  label_street: string;

  @Column()
  district: string;

  @Column()
  label_district: string;

  @Column()
  city: string;

  @Column()
  label_city: string;

  @Column('varchar', {
    length: '2',
  })
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
