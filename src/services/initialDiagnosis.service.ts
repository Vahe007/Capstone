import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import {
  InitialDiagnosisRequestDto,
  InitialDiagnosisResponseDto,
} from 'src/dto/initialDiagnosis.dto';

@Injectable()
export class InitialDiagnosisService {
  private readonly aiDiagnosisApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aiDiagnosisApiUrl = this.configService.get<string>(
      'AI_DIAGNOSIS_FASTAPI_URL',
    )!;
    if (!this.aiDiagnosisApiUrl) {
      throw new Error('AI_DIAGNOSIS_FASTAPI_URL is not configured.');
    }
  }

  async getInitialDiagnosis(
    requestDto: InitialDiagnosisRequestDto,
  ): Promise<InitialDiagnosisResponseDto> {
    const endpointUrl = `${this.aiDiagnosisApiUrl}/diagnose/initial`;

    try {
      const requestBody = { freestyle_text: requestDto.freestyle_text };

      const response = await firstValueFrom(
        this.httpService.post<{ initial_diagnosis_text: string }>(
          endpointUrl,
          requestBody,
          {
            timeout: 15000,
          },
        ),
      );

      if (
        response.status === 200 &&
        response.data &&
        response.data.initial_diagnosis_text
      ) {
        return {
          initial_diagnosis_text: response.data.initial_diagnosis_text,
          //   interaction_id: uuidv4(),
        };
      } else {
        throw new InternalServerErrorException(
          'Failed to get a valid response from the AI diagnosis service.',
        );
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status || 500;
        const message =
          error.response?.data?.detail ||
          'Error communicating with the AI diagnosis service.';
        throw new InternalServerErrorException({ statusCode, message });
      } else {
        throw new InternalServerErrorException(
          'An unexpected error occurred while fetching the initial diagnosis.',
        );
      }
    }
  }
}
