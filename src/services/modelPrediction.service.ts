import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import {
  FeaturesDto,
  ModelPredictionResponseDto,
} from 'src/dto/modelPrediction.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Diagnosis, DiagnosisDocument } from 'src/schemas/diagnosis.schemas';

@Injectable()
export class ModelPredictionService {
  private readonly customModelFastApiUrl: string;

  constructor(
    @InjectModel(Diagnosis.name)
    private diagnosisModel: Model<DiagnosisDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.customModelFastApiUrl =
      this.configService.get<string>('diagnosis_ml_url')!;

    console.log(
      'this.configService.get<string>(diagnosis_ml_url)',
      this.configService.get<string>('diagnosis_ml_url')!,
    );
    if (!this.customModelFastApiUrl) {
      throw new Error('diagnosis_ml_url is not configured.');
    }
  }

  async saveMLDiagnosis(
    userId: Types.ObjectId | string,
    requestInput: FeaturesDto,
    modelName: string,
    predictionResult: number,
  ) {
    try {
      const newDiagnosisEntry = await this.diagnosisModel.create({
        userId: new Types.ObjectId(userId),
        requestInput: requestInput,
        mlModelUsed: modelName,
        mlPredictionResult: predictionResult,
        initialDiagnosisResult: null,
      });

      return newDiagnosisEntry.save();
    } catch (error) {
      return null;
    }
  }

  async predictFromFeatures(
    features: FeaturesDto,
    modelType: string,
  ): Promise<ModelPredictionResponseDto> {
    const endpointUrl = `${this.customModelFastApiUrl}/predict/${modelType}`;
    try {
      const requestBody = { features };

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
        // saving the diagnosis result entry
        const dataSaved = !!(await this.saveMLDiagnosis(
          'userId',
          features,
          modelType,
          response.data.prediction,
        ));

        return {
          prediction: response.data.prediction,
          model_name: response.data.model_name || modelType,
          dataSaved,
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
