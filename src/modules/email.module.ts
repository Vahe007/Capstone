import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { EmailService } from 'src/services/email.service';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from './users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get('jwt_secret');
        return {
          global: true,
          secret: jwtSecret,
          signOptions: { expiresIn: '5m' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
