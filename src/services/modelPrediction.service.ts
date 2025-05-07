import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import * as xlsx from 'xlsx'; // Import xlsx library (npm install xlsx)
import { ModelPredictionResponseDto } from 'src/dto/modelPrediction.dto';

@Injectable()
export class ModelPredictionService {
  private readonly customModelFastApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.customModelFastApiUrl = this.configService.get<string>(
      'CUSTOM_MODEL_FASTAPI_URL',
    )!;
    if (!this.customModelFastApiUrl) {
      throw new Error('CUSTOM_MODEL_FASTAPI_URL is not configured.');
    }
  }

  private parseExcelAndExtractFeatures(fileBuffer: Buffer): number[] {
    try {
      const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

      if (!jsonData || jsonData.length < 2) {
        throw new BadRequestException(
          'Excel file is empty or not formatted correctly (expected header and at least one data row).',
        );
      }

      const featureRow: any[] = jsonData[1] as any[];

      if (!featureRow || !Array.isArray(featureRow)) {
        throw new BadRequestException(
          'Could not extract a valid feature row from the Excel file.',
        );
      }

      const numericalFeatures: number[] = featureRow.map((value) => {
        const num = parseFloat(String(value));
        if (isNaN(num)) {
          throw new BadRequestException(
            `Invalid non-numeric value '${value}' found in Excel data. All feature values must be numbers.`,
          );
        }
        return num;
      });

      const EXPECTED_FEATURE_COUNT = 11;
      if (numericalFeatures.length !== EXPECTED_FEATURE_COUNT) {
        throw new BadRequestException(
          `Invalid number of features. Expected ${EXPECTED_FEATURE_COUNT}, but found ${numericalFeatures.length}.`,
        );
      }

      return numericalFeatures;
    } catch (error) {
      if (error instanceof BadRequestException) throw error; // Re-throw known bad request errors
      throw new InternalServerErrorException(
        'Failed to parse the uploaded Excel file.',
      );
    }
  }

  async predictFromFeatures(
    features: number[],
    modelType: string,
  ): Promise<ModelPredictionResponseDto> {
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

  async processUploadedFile(
    file: Express.Multer.File,
    modelType: string,
  ): Promise<ModelPredictionResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    const featuresArray = this.parseExcelAndExtractFeatures(file.buffer);
    return this.predictFromFeatures(featuresArray, modelType);
  }
}
