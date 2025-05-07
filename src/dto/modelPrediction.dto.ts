import { ApiProperty } from '@nestjs/swagger'; // Optional for API docs
import { IsInt, Min, Max } from 'class-validator';

export class ModelPredictionResponseDto {
  @ApiProperty({
    example: 1,
    description:
      'The prediction from the custom ML model (0 for no disease, 1 for disease).',
  })
  @IsInt()
  @Min(0)
  @Max(1)
  prediction: number;

  @ApiProperty({
    example: 'decision_tree',
    description: 'The name of the model that made the prediction.',
    required: false,
  })
  model_name?: string;

  @ApiProperty({
    example: 'pred_xyz789',
    description: 'A unique identifier for this prediction interaction.',
    required: false,
  })
  interaction_id?: string;
}
