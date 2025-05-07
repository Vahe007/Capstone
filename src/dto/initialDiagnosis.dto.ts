import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitialDiagnosisRequestDto {
  @ApiProperty({
    example:
      'I have been feeling tired and have a persistent cough for a week.',
    description:
      'The freestyle text input from the user for initial diagnosis.',
    minLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  freestyle_text: string;
}

export class InitialDiagnosisResponseDto {
  @ApiProperty({
    example:
      'Based on your symptoms, it might be related to a common cold or flu, but further checks are advised...',
    description: 'The plain text diagnostic assessment from the AI service.',
  })
  @IsString()
  initial_diagnosis_text: string;

  @ApiProperty({
    example: 'diag_abc123',
    description: 'A unique identifier for this diagnosis interaction.',
    required: false,
  })
  interaction_id?: string;
}
