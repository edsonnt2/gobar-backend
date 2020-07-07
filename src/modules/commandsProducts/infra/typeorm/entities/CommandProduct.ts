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

@Entity('commands_products')
export default class CommandProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  command_id: string;

  @ManyToOne(() => Command, command => command.command_product)
  @JoinColumn({ name: 'command_id' })
  command: Command;

  @Column('uuid')
  product_id: string;

  @ManyToOne(() => Product, product => product.command_product)
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
