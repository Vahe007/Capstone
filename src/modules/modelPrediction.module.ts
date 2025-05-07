import { Module } from '@nestjs/common';
import { ModelPredictionService } from '../services/modelPrediction.service';
import { ConfigModule } from '@nestjs/config';
import { ModelPredicitonController } from 'src/controllers/modelPrediction.controller';

@Module({
  imports:[
    ConfigModule,
  ],
  exports: [ModelPredictionService],
  controllers: [ModelPredicitonController],
  providers: [ModelPredictionService],
})
export class ModelPredictionModule {}
