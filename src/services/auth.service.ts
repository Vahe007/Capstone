import { EMAIL_SUBJECT } from 'src/utils';
import {
  ConflictException,
  HttpException,
  Injectable,
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
    console.log(
      'jwt secret inside the auth service is',
      this.configService.get('jwt_secret'),
    );
  }

  async signIn(data: SignInUserDto): Promise<{ access_token: string }> {
    this.jwtSecret = this.configService.get('jwt_secret')!;

    const { userName, password } = data;

    const user = await this.userService.findUser(userName);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const isPasswordMatching = await bcrypt.compare(password, password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.userName };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(data: CreateUserDto) {
    const { password, ...resetData } = data;

    console.log('poin');

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

    const user = await this.userService.createUser({
      password: passwordHash,
      token: emailToken,
      ...resetData,
      isVerified: false,
    });

    console.log('user after the registration', user);

    if (!user) {
      throw new HttpException('User creation failed', 404);
    }

    // this.emailService.sendEmail(data.email, emailToken, EMAIL_SUBJECT.verify);
  }

  // async verifyEmail({ email, token, subject }) {
  //   const user = await this.userService.findUser({ email });

  //   if (!user) {
  //     throw new HttpException('User not found', 404);
  //   }

  //   const isValid = this.jwtService.verify(token, {
  //     secret: this.jwtSecret,
  //   });

  //   const decoded = this.jwtService.decode(token);

  //   console.log('isValid', isValid);
  //   console.log('decoded jwt token for email verification', decoded);

  //   if (!isValid) {
  //     throw new HttpException('Token is expired', 400);
  //   }

  //   if (subject === EMAIL_SUBJECT.verify) {
  //     return this.userService.updateUser(user.id, {
  //       $unset: {
  //         token: 1,
  //       },
  //       $set: {
  //         isVerified: true,
  //       },
  //     });
  //   }
  // }

  async changePasswordEmailTrigger(email: string) {
    if (!email) {
      throw new HttpException('Password reset failed', 404);
    }

    const user = await this.userService.findUser({ email });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const token = this.jwtService.sign({
      email,
    });

    this.emailService.sendEmail(user.email, token, EMAIL_SUBJECT.reset);
  }

  async changePassword({ token, newPassword }: ChangePasswordDto) {
    const user = await this.userService.findUserBy({ token });

    if (!user?.isVerified) {
      throw new HttpException('Password reset failed', 404);
    }

    const userId = (user as UserDocument & { _id: ObjectId })._id;

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    if (user.password === newPasswordHash) {
      throw new HttpException('Password reset failed', 404);
    }

    // Check needs to be added in here
    // To check if the new password is not matching to old one
    await this.userService.updateUser(userId, {
      $unset: {
        token: 1,
      },
      $set: {
        passwordHash: newPasswordHash,
      },
    });
  }

  async verifyAccount(token: string) {
    const user = await this.userService.findUserBy({ token });

    console.log('user to verify is', user);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userId = (user as UserDocument & { _id: ObjectId })._id;

    console.log('userid is', userId);

    this.userService.updateUser(userId, {
      $unset: {
        token: 1,
      },
      $set: {
        isVerified: true,
      },
    });
  }
}
