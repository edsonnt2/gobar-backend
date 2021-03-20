import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Business from '@modules/business/infra/typeorm/entities/Business';

@Entity('entrance')
export default class Entrance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  business_id: string;

  @ManyToOne(() => Business, business => business.entrance)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column()
  description: string;

  @Column()
  label_description: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  value: number;

  @Column('boolean')
  consume: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
