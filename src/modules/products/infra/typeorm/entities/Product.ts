import { Expose } from 'class-transformer';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import Business from '@modules/business/infra/typeorm/entities/Business';
import ItemForSale from '@modules/itemsForSale/infra/typeorm/entities/ItemForSale';
import CategoryProduct from './CategoryProduct';
import CategoryProvider from './CategoryProvider';

@Entity('products')
export default class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  business_id: string;

  @ManyToOne(() => Business, business => business.product)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column()
  image?: string;

  @Column()
  description: string;

  @Column()
  label_description: string;

  @Column('uuid')
  category_id: string;

  @ManyToOne(
    () => CategoryProduct,
    categoryProduct => categoryProduct.product,
    {
      cascade: ['insert'],
      eager: true,
    },
  )
  @JoinColumn({ name: 'category_id' })
  category: CategoryProduct;

  @Column('decimal')
  quantity: number;

  @Column('uuid')
  provider_id: string;

  @ManyToOne(
    () => CategoryProvider,
    categoryProvider => categoryProvider.product,
    {
      cascade: ['insert'],
      eager: true,
    },
  )
  @JoinColumn({ name: 'provider_id' })
  provider: CategoryProvider;

  @OneToMany(() => ItemForSale, itemForSale => itemForSale.product)
  item_for_sale: ItemForSale[];

  @Column()
  internal_code: string;

  @Column()
  barcode?: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  pushase_value: number;

  @Column('decimal')
  porcent?: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  sale_value: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'image_url' })
  getImageUrl(): string | null {
    return this.image ? `${process.env.URL_HOST}/file/${this.image}` : null;
  }
}
