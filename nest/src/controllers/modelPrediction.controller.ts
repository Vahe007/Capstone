import {
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UsePipes,
  ValidationPipe,
  Body,
  Req,
} from '@nestjs/common';

import {
  ModelMetricsDto,
  ModelPredictionRequestDto,
  ModelPredictionResponseDto,
} from 'src/dto/modelPrediction.dto';
import { ModelPredictionService } from 'src/services/modelPrediction.service';

@Controller('modelPrediction')
export class ModelPredicitonController {
  constructor(
    private readonly modelPredictionService: ModelPredictionService,
  ) {}

  @Get('metrics/:modelType')
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async getMetrics(
    @Param('modelType') modelType: string,
  ): Promise<ModelMetricsDto> {
    console.log('modeltype is', modelType);
    return this.modelPredictionService.getModelMetrics(modelType);
  }

  @Get('diagnosis')
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async getDiagnosis(@Req() request) {
    const payload = request['user'];
    console.log('payload inside the controller', payload);
    const diagnosis = await this.modelPredictionService.getDiagnosis(payload);

    console.log('diagnosis inside the comtroller', diagnosis);
    if (diagnosis.length) {
      return diagnosis.map((item) => ({
        requestInput: item.requestInput,
        mlPredictionResult: item.mlPredictionResult,
        mlModelUsed: item.mlModelUsed,
        createdAt: item.createdAt,
      }));
    }

    return [];
  }

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

    return this.modelPredictionService.predictFromFeatures(
      payload,
      predictionRequestDto.features,
      modelType,
    );
  }
}
