import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsArray()
  medicalData: string[];

  @IsNumberString()
  hasHeartDisease: number;

  @IsBoolean()
  isVerified: boolean;

  @IsString()
  token?: string;
}
