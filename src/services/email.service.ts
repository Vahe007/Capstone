import { UserService } from 'src/services/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HttpException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { Document } from 'mongoose';
import { EMAIL_SUBJECT, emailSubject } from 'src/utils';
import * as fs from 'fs';
import path from 'path';

@Injectable()
export class EmailService {
  private emailTransporter: nodemailer.Transporter;
  private hostEmail: string;
  private jwtSecret: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {
    console.log('host_email', configService.get('host_email'));
    console.log('host_pass', configService.get('host_pass'));

    this.hostEmail = configService.get('host_email')!;
    this.jwtSecret = configService.get('jwt_secret')!;

    this.emailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: configService.get('host_email'),
        pass: configService.get('host_pass'),
      },
    });
  }

  private renderTemplate(
    template: string,
    variables: Record<string, string>,
  ): string {
    return template.replace(
      /{{(.*?)}}/g,
      (_, key) => variables[key.trim()] || '',
    );
  }

  async sendEmail(
    email: string,
    token: string,
    subject: EMAIL_SUBJECT,
  ): Promise<void> {
    // Generating and sending a verification email
    const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;
    const filePath = path.join(
      process.cwd(),
      'src',
      'view',
      'resetPassword.html',
    );
    const html = fs.readFileSync(filePath, 'utf-8');
    const template = this.renderTemplate(html, {
      name: 'Raffi',
      verificationUrl,
    });

    const mailOptions = {
      from: `"Healthcare" <${this.hostEmail}>`,
      to: email,
      sub: emailSubject[subject],
      // subject: emailSubject[subject],
      html: template,
    };

    this.emailTransporter.sendMail(mailOptions);
  }

  async verifyEmail(token: string) {
    const user = await this.userService.findUser({ token });

    if (!user) {
      throw new HttpException('Unable to verify the account', 400);
    }

    const isValid = this.jwtService.verify(token, {
      secret: this.jwtSecret,
    });

    const decoded = this.jwtService.decode(token);

    console.log('isValid', isValid);
    console.log('decoded jwt token for email verification', decoded);

    if (!isValid) {
      throw new HttpException('Token is expired', 400);
    }

    return this.userService.updateUser(user.id, {
      $unset: {
        token: 1,
      },
      $set: {
        isVerified: true,
      },
    });
  }

  async generateToken(payload) {
    return this.jwtService.sign(payload);
  }
}
