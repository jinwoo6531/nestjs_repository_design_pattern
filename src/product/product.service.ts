import { Injectable, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { ProductCreateDto } from './dto/product-create.dto';
import { User } from 'src/entities/user.entity';
import { ProductStatus } from './product.enum';

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

@Injectable()
export class ProductService extends AbstractService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    super(productRepository);
  }

  async createProduct(
    productCreateDto: ProductCreateDto,
    user: User,
  ): Promise<Product> {
    console.log(445, user);

    const {
      product_title,
      product_price,
      product_discount_price,
      product_start_at,
      product_end_at,
      product_stock,
      product_extra_price,
    } = productCreateDto;

    const product = new Product();
    product.product_title = product_title;
    product.product_price = product_price;
    product.product_discount_price = product_discount_price;
    product.product_start_at = product_start_at;
    product.product_end_at = product_end_at;
    product.product_stock = product_stock;
    product.product_use_yn = ProductStatus.Y;
    product.product_extra_pridce = product_extra_price;
    product.user = user;

    // const product = this.productRepository.create({
    //   product_title,
    //   product_price,
    //   product_discount_price,
    //   product_start_at,
    //   product_end_at,
    //   product_stock,
    //   product: ProductStatus.Y,
    //   product_extra_price,
    //   user,
    // });

    try {
      await this.productRepository.save(product);
      delete product.user;
    } catch (error) {
      console.log(error);
    }
    return product;
  }

  async fileupload(@Req() req, @Res() res) {
    try {
      this.upload(req, res, function (error) {
        if (error) {
          console.log(error);
          return res.status(404).json(`Failed to upload image file: ${error}`);
        }
        return res.status(201).json(req.files[0].location);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(`Failed to upload image file: ${error}`);
    }
  }

  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      key: function (request, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    }),
  }).array('upload', 1);
}
