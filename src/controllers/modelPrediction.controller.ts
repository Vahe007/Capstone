import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  UsePipes,
  ValidationPipe,
  Body,
  Req,
} from '@nestjs/common';

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

  @Post(':modelType')
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
    @Req() request,
    @Body() predictionRequestDto: ModelPredictionRequestDto,
  ): Promise<ModelPredictionResponseDto> {
    console.log('model type is', modelType);
    const payload = request['user'];

    console.log('decoded access token is', payload);
    return this.modelPredictionService.predictFromFeatures(
      payload,
      predictionRequestDto.features,
      modelType,
    );
  }
}
