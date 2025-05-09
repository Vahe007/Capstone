import { Type } from 'class-transformer';
import {
  IsInt,
  Min,
  Max,
  IsDefined,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';

export class FeaturesDto {
  @IsDefined() @IsInt() @Min(0) age: number;
  @IsDefined() @IsInt() @Min(0) @Max(1) sex: number;
  @IsDefined() @IsInt() @Min(0) @Max(3) cp: number; // chest pain type
  @IsDefined() @IsNumber() @Min(0) trestbps: number; // resting bp s
  @IsDefined() @IsNumber() @Min(0) chol: number; // cholesterol
  @IsDefined() @IsInt() @Min(0) @Max(1) fbs: number; // fasting blood sugar
  @IsDefined() @IsInt() @Min(0) @Max(2) restecg: number; // resting ecg
  @IsDefined() @IsNumber() @Min(0) thalach: number; // max heart rate
  @IsDefined() @IsInt() @Min(0) @Max(1) exang: number; // exercise angina
  @IsDefined() @IsNumber() oldpeak: number;
  @IsDefined() @IsInt() @Min(0) @Max(2) slope: number; // ST slope
  @IsDefined() @IsInt() @Min(0) @Max(4) ca: number; // number of major vessels (assuming 0-4 based on some datasets)
  @IsDefined() @IsInt() @Min(0) @Max(3) thal: number; // thalassemia (assuming 0-3 based on some datasets)
}

export class ModelPredictionRequestDto {
  @IsDefined()
  @IsObject()
  @ValidateNested() // Validate the nested object's properties
  @Type(() => FeaturesDto) // Tell class-transformer how to validate the nested object
  features: FeaturesDto;
}

export class ModelPredictionResponseDto {
  prediction: number;
  model_name?: string;
  interaction_id?: string;
  dataSaved: boolean;
}
