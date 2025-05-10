import { ChangePasswordDto } from 'src/dto/changePassword.dto';
import { AuthService } from './../services/auth.service';
import {
  Body,
  Controller,
  UsePipes,
  ValidationPipe,
  Post,
  HttpCode,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { SignInUserDto } from 'src/dto/loginUse.dto';
import { JwtEmailGuard } from 'src/guards/jwt-email.guard';
import { Public } from 'src/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authSerivce: AuthService) {}

  @Public()
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() signInUserDto: SignInUserDto) {
    return this.authSerivce.signIn(signInUserDto);
  }

  @Public()
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authSerivce.register(createUserDto);
  }

  @Public()
  @Post('changePassword')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @UseGuards(JwtEmailGuard)
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authSerivce.changePassword(changePasswordDto);
  }

  @Post('verifyAccount')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @UseGuards(JwtEmailGuard)
  async verifyAccount(@Query() token: string) {
    return await this.authSerivce.verifyAccount(token);
  }
}
