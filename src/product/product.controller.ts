import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { GetUser } from 'src/user/get-user.decorator';
import { UserGuard } from 'src/user/user.guard';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';
import { ProductStatus } from './product.enum';
import { ProductService } from './product.service';

@UseGuards(UserGuard)
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async all(@Query('page') page = 1) {
    return this.productService.paginate(page);
  }

  @Post()
  async create(@Body() body: ProductCreateDto, @GetUser() user: User) {
    return this.productService.createProduct(body, user);
  }

  @Get(':product_id')
  async get(@Param('product_id') product_id: number) {
    return this.productService.findOne({ product_id });
  }

  @Put(':product_id')
  async update(
    @Param('product_id') product_id: number,
    @Body() body: ProductUpdateDto,
  ) {
    await this.productService.update(product_id, body);
    return this.productService.findOne({ product_id });
  }

  @Delete(':product_id')
  async delete(@Param('product_id') product_id: number) {
    return this.productService.delete(product_id);
  }
}
