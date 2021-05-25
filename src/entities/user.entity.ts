import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';

@Entity({ name: 'store' })
@Unique(['store_name'])
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'store_id' })
  store_id: number;

  @Column('varchar', { name: 'store_name' })
  store_name: string;

  @Column('varchar', { name: 'store_password' })
  @Exclude()
  store_password: string;

  @Column()
  @Exclude()
  salt: string;

  @Column('varchar', { name: 'store_address' })
  store_address: string;

  @Column('varchar', { name: 'store_phone_number' })
  store_phone_number: string;

  @Column('decimal', { name: 'store_longitude' })
  store_longitude: string;

  @Column('decimal', { name: 'store_latitude' })
  store_latitude: string;

  @Column('varchar', { name: 'store_business_hour' })
  store_business_hour: string;

  @Column('int', { name: 'store_grade' })
  store_grade: number;

  @Column('varchar', { name: 'store_image' })
  store_image: string;

  @Column('varchar', { name: 'store_profile_image' })
  store_profile_image: string;

  @Column('varchar', { name: 'store_closed_day' })
  store_closed_day: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  created_at: Date;

  @CreateDateColumn({
    name: 'modified_at',
  })
  modified_at: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.store_password;
  }
}
