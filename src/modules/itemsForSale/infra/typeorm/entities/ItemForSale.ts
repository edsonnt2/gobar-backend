import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Product from '@modules/products/infra/typeorm/entities/Product';
import Command from '@modules/commands/infra/typeorm/entities/Command';
import User from '@modules/users/infra/typeorm/entities/User';
import Table from '@modules/tables/infra/typeorm/entities/Table';

@Entity('items_for_sale')
export default class ItemForSale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  operator_id: string;

  @ManyToOne(() => User, user => user.item_for_sale)
  @JoinColumn({ name: 'operator_id' })
  operator: User;

  @Column('uuid')
  command_id: string;

  @ManyToOne(() => Command, command => command.command_product)
  @JoinColumn({ name: 'command_id' })
  command: Command;

  @Column('uuid')
  table_id: string;

  @ManyToOne(() => Table, table => table.table_product)
  @JoinColumn({ name: 'table_id' })
  table: Command;

  // Add id table and id account here

  @Column('uuid')
  product_id: string;

  @ManyToOne(() => Product, product => product.item_for_sale, {
    eager: true,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  description: string;

  @Column()
  label_description: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  value: number;

  @Column()
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
