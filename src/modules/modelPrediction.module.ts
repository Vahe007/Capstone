import { Module } from '@nestjs/common';
import { ModelPredictionService } from '../services/modelPrediction.service';
import { ConfigModule } from '@nestjs/config';
import { ModelPredicitonController } from 'src/controllers/modelPrediction.controller';
import { HttpModule } from '@nestjs/axios';
import { Diagnosis, DiagnosisSchema } from 'src/schemas/diagnosis.schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([
      {
        name: Diagnosis.name,
        schema: DiagnosisSchema,
      },
    ]),
  ],
  exports: [ModelPredictionService],
  controllers: [ModelPredicitonController],
  providers: [ModelPredictionService],
})
export class ModelPredictionModule {}
