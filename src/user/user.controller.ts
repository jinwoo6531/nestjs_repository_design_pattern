import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { UserGuard } from './user.guard';
import { StoreUpdateDto } from './dto/update.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Get()
  async all(): Promise<User[]> {
    return this.userService.all();
  }

  //회원가입
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const hashed = await bcrypt.hash(body.store_password, 12);

    return this.userService.create({
      store_name: body.store_name,
      store_password: hashed,
      store_address: body.store_address,
      store_phone_number: body.store_phone_number,
      store_longitude: body.store_longitude,
      store_latitude: body.store_latitude,
      store_business_hour: body.store_business_hour,
      store_grade: body.store_grade,
      store_image: body.store_image,
      store_profile_image: body.store_profile_image,
      store_closed_day: body.store_closed_day,
    });
  }

  //로그인
  @Post('login')
  async login(
    @Body('store_name') store_name: string,
    @Body('store_password') store_password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const store = await this.userService.findOne({ store_name: store_name });
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    if (!(await bcrypt.compare(store_password, (await store).store_password))) {
      throw new BadRequestException('Invalid credentials');
    }
    const jwt = await this.jwtService.signAsync({ id: store.store_id });
    response.cookie('jwt', jwt, { httpOnly: true });
    // return store;
    return '로그인 성공';
  }

  @UseGuards(UserGuard)
  @Get('store')
  async store(@Req() request: Request) {
    //현재 cookie 가져오기
    const cookie = request.cookies['jwt'];

    const data = await this.jwtService.verifyAsync(cookie);

    return this.userService.findOne({ store_id: data['id'] });
  }

  //로그아웃
  @UseGuards(UserGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: '로그아웃 성공',
    };
  }

  //회원정보 수정
  @Put(':store_id')
  async update(
    @Param('store_id') store_id: number,
    @Body() body: StoreUpdateDto,
  ) {
    await this.userService.update(store_id, body);

    return this.userService.findOne({ store_id });
  }
}
