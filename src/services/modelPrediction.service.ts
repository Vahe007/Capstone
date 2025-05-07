import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { FeaturesDto, ModelPredictionResponseDto } from 'src/dto/modelPrediction.dto';

@Injectable()
export class ModelPredictionService {
    private readonly customModelFastApiUrl: string;

    constructor(
      private readonly httpService: HttpService,
      private readonly configService: ConfigService,
    ) {
      this.customModelFastApiUrl = this.configService.get<string>('CUSTOM_MODEL_FASTAPI_URL')!;
      if (!this.customModelFastApiUrl) {
        throw new Error('CUSTOM_MODEL_FASTAPI_URL is not configured.');
      }
    }

  async predictFromFeatures(features: FeaturesDto, modelType: string): Promise<ModelPredictionResponseDto> {
    console.log('features are features', features)
    console.log('modelType are modelType', modelType)

    const endpointUrl = `${this.customModelFastApiUrl}/predict/${modelType}`;
    try {
      const requestBody = { features: features };

      const response = await firstValueFrom(
        this.httpService.post<{ prediction: number; model_name?: string }>(
          endpointUrl,
          requestBody,
          {
            timeout: 10000,
          },
        ),
      );

      if (
        response.status === 200 &&
        response.data &&
        typeof response.data.prediction === 'number'
      ) {
        return {
          prediction: response.data.prediction,
          model_name: response.data.model_name || modelType,
        };
      } else {
        throw new InternalServerErrorException(
          'Failed to get a valid response from the custom model service.',
        );
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status || 500;
        const message =
          error.response?.data?.detail ||
          'Error communicating with the custom model service.';
        throw new InternalServerErrorException({ statusCode, message });
      } else {
        throw new InternalServerErrorException(
          'An unexpected error occurred while fetching the model prediction.',
        );
      }
    }
  }
}
