import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator, // Or custom validator
  HttpCode,
  HttpStatus,
  Logger,
  Param, // To get model type from URL
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // For file uploads
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger'; // Optional
import { ModelPredictionResponseDto } from 'src/dto/modelPrediction.dto';
import { ModelPredictionService } from 'src/services/modelPrediction.service';

@Controller('modelPrediction')
export class ModelPredicitonController {
  constructor(
    private readonly modelPredictionService: ModelPredictionService,
  ) {}

  @Post(':modelType') // e.g., /api/v1/predict/custom-model/decision_tree
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file')) // 'file' is the field name in the form-data
  @ApiConsumes('multipart/form-data') // Important for Swagger to show file upload
  @ApiOperation({
    summary:
      'Get a prediction from a custom ML model using an uploaded Excel file.',
  })
  @ApiParam({
    name: 'modelType',
    description:
      'The type of model to use for prediction (e.g., decision_tree, logistic_regression)',
    enum: ['decision_tree', 'logistic_regression', 'another_model_type'],
  })
  @ApiBody({
    description:
      'Excel file containing a row of patient medical data. The first data row after headers will be used.',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Prediction retrieved successfully.',
    type: ModelPredictionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid file or model type.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async predictFromFile(
    @UploadedFile(
      new ParseFilePipe({
        // Built-in NestJS pipe for basic file validation
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // Example: 5MB limit
          new FileTypeValidator({ fileType: '.(xlsx|xls|csv)' }), // Allow Excel and CSV
          // Add custom validators if needed for specific Excel structure
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File, // Type from @types/multer
    @Param('modelType') modelType: string,
  ): Promise<ModelPredictionResponseDto> {
    return this.modelPredictionService.processUploadedFile(file, modelType);
  }
}
