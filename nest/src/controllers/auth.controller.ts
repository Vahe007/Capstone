import {
  RecoverPasswordDto,
  UpdatePasswordDto,
} from 'src/dto/changePassword.dto';
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
  HttpException,
  Get,
  Req,
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
  @HttpCode(200)
  async login(@Body() signInUserDto: SignInUserDto) {
    return this.authSerivce.signIn(signInUserDto);
  }

  @Public()
  @Post('register')
  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authSerivce.register(createUserDto);
  }

  @Public()
  @Post('recoverPassword')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @UseGuards(JwtEmailGuard)
  async recoverPassword(@Req() req, @Body() body: RecoverPasswordDto) {
    const { token, password } = body;
    return this.authSerivce.recoverPassword({
      email: req.payload.email,
      password,
      token,
    });
  }

  @Post('updatePassword')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async updatePassword(@Req() req, @Body() body: UpdatePasswordDto) {
    const payload = req['user'];

    const { oldPassword, newPassword } = body;
    return this.authSerivce.updatePassword({
      email: payload.email,
      newPassword,
      oldPassword,
    });
  }

  @Public()
  @Post('sendResetPasswordEmail')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async sendResetPasswordEmail(@Body() data: { email: string }) {
    if (data.email) {
      return await this.authSerivce.changePasswordEmailTrigger(data.email);
    }
    throw new HttpException('Missing email address', 400);
  }

  @Post('sendVerificationEmail')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async sendVerificationEmail(@Body() data: { email: string }) {
    if (data.email) {
      return await this.authSerivce.verifyAccountEmailTrigger(data.email);
    }
    throw new HttpException('Missing email address', 400);
  }

  @Get('verifyEmail')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @UseGuards(JwtEmailGuard)
  async verifyEmail(@Query('token') token) {
    return await this.authSerivce.verifyEmail(token);
  }
}
