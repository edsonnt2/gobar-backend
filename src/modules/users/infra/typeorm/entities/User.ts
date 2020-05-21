import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import Business from '@modules/business/infra/typeorm/entities/Business';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  full_name: string;

  @Column()
  cell_phone: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  avatar: string;

  @Column()
  birthDate: string;

  @OneToMany(() => Business, business => business.user)
  business: Business[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
