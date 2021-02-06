import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import Category from '@modules/categories/infra/typeorm/entities/Category';
import Business from './Business';

@Entity('business_categories')
export default class BusinessCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  business_id: string;

  @ManyToOne(() => Business, business => business.business_category)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column('uuid')
  category_id: string;

  @ManyToOne(() => Category, category => category.business_category, {
    cascade: ['insert'],
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
