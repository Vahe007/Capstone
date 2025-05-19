import { CreateUserDto } from './../dto/createUser.dto';
import {
  Body,
  Controller,
  HttpException,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { Types } from 'mongoose';
import mongoose from 'mongoose';

import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @Get()
  // getUsers() {
  //   return this.userService.getUsers();
  // }

  @Get()
  getUser(@Req() req: Request) {
    return req['user'];
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  getUserById(@Param('id') id: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);

    if (!isValidId) {
      throw new HttpException('User not found', 404);
    }

    return this.userService.findById(id);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  deleteUser(@Param('id') id: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);

    if (!isValidId) {
      throw new HttpException('User not found', 404);
    }

    return this.userService.deleteUser(id);
  }
}
