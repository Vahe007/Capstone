import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users.module';
import { EmailModule } from './email.module';

@Module({
  imports: [
    UsersModule,
    EmailModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get('jwt_secret');
        console.log('jwtSecret is', jwtSecret);
        return {
          global: true,
          secret: jwtSecret,
          signOptions: { expiresIn: '30m' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
