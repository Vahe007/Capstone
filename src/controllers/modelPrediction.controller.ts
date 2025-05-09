import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { Public } from 'src/decorators';

import {
  ModelPredictionRequestDto,
  ModelPredictionResponseDto,
} from 'src/dto/modelPrediction.dto';
import { ModelPredictionService } from 'src/services/modelPrediction.service';

@Controller('modelPrediction')
export class ModelPredicitonController {
  constructor(
    private readonly modelPredictionService: ModelPredictionService,
  ) {}

  @Public()
  @Post(':modelType') // e.g., /api/v1/predict/custom-model/decision_tree
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async predictFromFeatures(
    @Param('modelType') modelType: string,
    @Body() predictionRequestDto: ModelPredictionRequestDto,
  ): Promise<ModelPredictionResponseDto> {
    console.log('model type is', modelType);
    return this.modelPredictionService.predictFromFeatures(
      predictionRequestDto.features,
      modelType,
    );
  }
}
