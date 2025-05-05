import { IsArray, IsEmail, IsNumberString, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdateUserDto {
  @IsEmail()
  @Optional()
  email: string;

  @Optional()
  @IsString()
  firstName: string;

  @Optional()
  @IsString()
  lastName: string;

  @Optional()
  @IsString()
  userName: string;

  @Optional()
  @IsString()
  passwordHash: string;

  @Optional()
  @IsArray()
  medicalData: string[];

  @Optional()
  @IsNumberString()
  hasHeartDisease: number;
}
