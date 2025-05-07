import { Module } from '@nestjs/common';
import { ModelPredictionService } from '../services/modelPrediction.service';

@Module({
  providers: [ModelPredictionService],
})
export class ModelPredictionModule {}
