import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'john_doe',
    description: 'Username (3-20 alphanumeric characters)',
  })
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Username can only contain alphanumeric characters and underscores',
  })
  userName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'P@ssword123',
    description: 'Password (min 8 characters)',
  })
  @MinLength(8)
  password: string;
}
