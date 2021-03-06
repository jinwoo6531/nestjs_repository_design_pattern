import { IsNotEmpty } from 'class-validator';

export class ProductCreateDto {
  @IsNotEmpty()
  product_title: string;

  @IsNotEmpty()
  product_image: string;

  @IsNotEmpty()
  product_price: number;

  @IsNotEmpty()
  product_discount_price: number;

  @IsNotEmpty()
  product_account: string;

  // @IsNotEmpty()
  // product_start_at: Date;

  // @IsNotEmpty()
  // product_end_at: Date;

  // @IsNotEmpty()
  // product_stock: number;

  @IsNotEmpty()
  product_category: string;

  @IsNotEmpty()
  product_keyword: string;

  // @IsNotEmpty()
  // product_extra_price: number;
}
