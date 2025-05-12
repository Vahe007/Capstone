import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/decorators';
import {
  InitialDiagnosisRequestDto,
  InitialDiagnosisResponseDto,
} from 'src/dto/initialDiagnosis.dto';
import { InitialDiagnosisService } from 'src/services/initialDiagnosis.service';

@Controller('initialDiagnosis')
export class InitialDiagnosisController {
  constructor(
    private readonly initialDiagnosisService: InitialDiagnosisService,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @ApiOperation({
    summary:
      'Get an AI-powered initial diagnostic assessment based on text input.',
  })
  @ApiResponse({
    status: 200,
    description: 'Initial diagnostic assessment retrieved successfully.',
    type: InitialDiagnosisResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async getInitialDiagnosis(
    @Body() requestDto: InitialDiagnosisRequestDto,
  ): Promise<InitialDiagnosisResponseDto> {
    return this.initialDiagnosisService.getInitialDiagnosis(requestDto);
  }
}
