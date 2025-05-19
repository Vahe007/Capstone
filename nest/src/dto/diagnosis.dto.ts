import {
  IsMongoId,
  IsOptional,
  IsString,
  IsNumber,
  IsObject,
  IsDate,
  isString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FeaturesDto } from './modelPrediction.dto';

export class DiagnosisResponseDto {
  @IsMongoId()
  readonly _id: string;

  @IsMongoId()
  readonly userId: string;

  @IsObject()
  readonly requestInput: FeaturesDto;

  @IsString()
  readonly mlModelUsed: string;

  @IsNumber()
  mlPredictionResult: number;

  @IsDate()
  @Type(() => Date)
  readonly createdAt: Date;

  @IsDate()
  @Type(() => Date)
  readonly updatedAt: Date;
}
