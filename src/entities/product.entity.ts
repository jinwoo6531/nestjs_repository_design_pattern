//import { Review } from 'src/review/models/review.entity';
import { ProductStatus } from 'src/product/product.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn({ type: 'int', name: 'product_id' })
  product_id: number;

  @Column('varchar', { name: 'product_title' })
  product_title: string;

  @Column('int', { name: 'product_price' })
  product_price: number;

  @Column('int', { name: 'product_discount_price' })
  product_discount_price: number;

  @Column('varchar', { name: 'product_account' })
  product_account: string;

  // @Column('date', { name: 'product_start_at' })
  // product_start_at: Date;

  // @Column('date', { name: 'product_end_at' })
  // product_end_at: Date;

  // @Column('int', { name: 'product_stock' })
  // product_stock: number;

  // @Column('int', { name: 'product_extra_price' })
  // product_extra_price: number;

  @Column('char', { name: 'product_category' })
  product_category: string;

  @Column('char', { name: 'product_use_yn' })
  product_use_yn: ProductStatus;

  @Column('char', { name: 'product_keyword' })
  product_keyword: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  created_at: Date;

  @CreateDateColumn({
    name: 'modified_at',
  })
  modified_at: Date;

  @ManyToOne((type) => User, (user) => user.products, { eager: false })
  user: User;
}
