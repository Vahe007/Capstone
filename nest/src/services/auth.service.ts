import { EMAIL_SUBJECT } from 'src/utils';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInUserDto } from 'src/dto/loginUse.dto';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from 'src/dto/changePassword.dto';
import bcrypt from 'bcrypt';
import { UserDocument } from 'src/schemas/user.schemas';
import { ObjectId } from 'mongoose';

@Injectable()
export class AuthService {
  private jwtSecret: string;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get('jwt_secret')!;
  }

  async signIn(
    data: SignInUserDto,
  ): Promise<{ access_token: string; userInfo: Record<string, any> }> {
    this.jwtSecret = this.configService.get('jwt_secret')!;

    const { userName, password } = data;

    const user = await this.userService.findUserBy({ userName });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { password: _, ...userInfo } = user;

    const payload = { sub: userInfo._id, ...userInfo };

    return {
      access_token: await this.jwtService.signAsync(payload),
      userInfo,
    };
  }

  async register(data: CreateUserDto) {
    const { password, ...resetData } = data;

    const existingUser = await this.userService.findUserBy({
      $or: [{ email: resetData.email }, { userName: resetData.userName }],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with provided credentials already exists',
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const emailToken = this.jwtService.sign({
      email: data.email,
    });

    try {
      const user = await this.userService.createUser({
        password: passwordHash,
        token: emailToken,
        ...resetData,
        isVerified: false,
      });

      if (!user) {
        throw new HttpException('User creation failed', 404);
      }

      await this.emailService.sendEmail(
        data.firstName,
        data.email,
        emailToken,
        EMAIL_SUBJECT.verify,
      );

      const { password: _, ...userInfo } = user;

      const payload = { sub: userInfo._id, ...userInfo };

      return {
        access_token: await this.jwtService.signAsync(payload),
        userInfo,
        message:
          'Registration successful. Please check your email to verify your account.',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'User registration failed due to an internal error.',
      );
    }
  }

  async verifyAccountEmailTrigger(email: string) {
    if (!email) {
      throw new HttpException('Password reset failed', 404);
    }

    const user = await this.userService.findUserBy({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign({
      email,
    });

    if (user._id) {
      await this.userService.updateUser(user._id, {
        set: {
          token,
        },
      });
      await this.emailService.sendEmail(
        user.firstName,
        user.email,
        token,
        EMAIL_SUBJECT.verify,
      );
      return { message: 'success' };
    }

    throw new NotFoundException('User not found');
  }

  async changePasswordEmailTrigger(email: string) {
    if (!email) {
      throw new HttpException('Password reset failed', 404);
    }

    const user = await this.userService.findUserBy({ email });
    const userId = user?._id;

    if (!user || !userId) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign({
      email,
    });

    await this.userService.updateUser(userId, {
      set: {
        token,
      },
    });

    await this.emailService.sendEmail(
      user.firstName,
      user.email,
      token,
      EMAIL_SUBJECT.reset,
    );

    return { message: 'success' };
  }

  async changePassword({
    email,
    password,
    token,
  }: {
    email: string;
    password: string;
    token: string;
  }) {
    try {
      const user = await this.userService.findUserBy({ email });

      console.log('user is user', user);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (!token || token !== user.token) {
        throw new BadRequestException('Invalid or expired email token');
      }

      const userId = user._id;
      const isPasswordMatching = await bcrypt.compare(password, user.password);

      if (isPasswordMatching) {
        throw new BadRequestException(
          'New password cannot be the same as the old password.',
        );
      }

      const newPasswordHash = await bcrypt.hash(password, 10);

      await this.userService.updateUser(userId!, {
        set: {
          password: newPasswordHash,
        },
        unset: ['token'],
      });

      return { message: 'success' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  async verifyEmail(token: string) {
    try {
      const user = await this.userService.findUserBy({ token });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userId = user._id;

      if (user.token !== token) {
        throw new HttpException('Token is not valid or expired', 400);
      }

      await this.userService.updateUser(userId!, {
        set: {
          isVerified: true,
        },
        unset: ['token'],
      });

      console.log('should be successful');

      return { success: true };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof HttpException
      ) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }
}
