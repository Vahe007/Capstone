import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users.module';
import { AuthModule } from './modules/auth.module';
import configuration from './config/configuration';
import { EmailModule } from './modules/email.module';
import { InitialDiagnosisModule } from './modules/initialDiagnosis.module';
import { ModelPredictionModule } from './modules/modelPrediction.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // MongooseModule.forRoot(uri),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const dbUri = configService.get<string>('database.uri');
        console.log('dbUri is bro', dbUri);
        if (!dbUri) {
          throw new Error(
            'Database URI not configured in environment variables.',
          );
        }
        return {
          uri: dbUri,
          family: 4,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    EmailModule,
    InitialDiagnosisModule,
    ModelPredictionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
      load: [configuration],
    }),
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
