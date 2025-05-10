import { Module } from '@nestjs/common';
import { ModelPredictionService } from '../services/modelPrediction.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModelPredicitonController } from 'src/controllers/modelPrediction.controller';
import { HttpModule } from '@nestjs/axios';
import { Diagnosis, DiagnosisSchema } from 'src/schemas/diagnosis.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    UsersModule,
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
    MongooseModule.forFeature([
      {
        name: Diagnosis.name,
        schema: DiagnosisSchema,
      },
    ]),
  ],
  providers: [ModelPredictionService],
  controllers: [ModelPredicitonController],
})
export class ModelPredictionModule {}
