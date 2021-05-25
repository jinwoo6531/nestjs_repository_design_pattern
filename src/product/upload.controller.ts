import { Controller, Post, Req, Res } from '@nestjs/common';

import * as AWS from 'aws-sdk';
import 'dotenv/config';
import { ProductService } from './product.service';

@Controller()
export class UploadController {
  constructor(private readonly productService: ProductService) {}

  //   @Post('upload')
  //   @UseInterceptors(
  //     FilesInterceptor('images', 3, {
  //       storage: multerS3({
  //         s3: s3,
  //         bucket: process.env.AWS_S3_BUCKET_NAME,
  //         acl: 'public-read',
  //         key: function (req, file, cb) {
  //           cb(null, file.originalname);
  //         },
  //       }),
  //     }),
  //   )
  //   async uploadImage(@UploadedFiles() files: Express.Multer.File) {
  //     return this.productService.uploadImage(files);
  //   }

  @Post('upload')
  async uploadImage(@Req() request, @Res() response) {
    try {
      await this.productService.fileupload(request, response);
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
  }
}
