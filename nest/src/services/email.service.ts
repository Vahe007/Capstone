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
    return template.replace(/{{(.*?)}}/g, (_, key) => {
      return variables[key.trim()] || '';
    });
  }

  async sendEmail(
    name: string,
    email: string,
    token: string,
    subject: EMAIL_SUBJECT,
  ): Promise<void> {
    // Generating and sending a verification email
    const verificationUrl = `http://localhost:3000/${subject === EMAIL_SUBJECT.verify ? 'verify-email' : 'reset-password'}?token=${token}`;
    const filePath = path.join(
      process.cwd(),
      'src',
      'view',
      subject === EMAIL_SUBJECT.verify
        ? 'verifyEmail.html'
        : 'resetPassword.html',
    );
    const html = fs.readFileSync(filePath, 'utf-8');
    const template = this.renderTemplate(html, {
      name,
      verificationUrl,
    });

    const mailOptions = {
      from: `"Healthcare" <${this.hostEmail}>`,
      to: email,
      subject: emailSubject[subject],
      html: template,
    };

    await this.emailTransporter.sendMail(mailOptions);
  }

  async generateToken(payload) {
    return this.jwtService.sign(payload);
  }
}
