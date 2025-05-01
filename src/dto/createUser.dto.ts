import { IsStringLiteral } from 'ts-jest/node_modules/type-fest/source/is-literal';
import { IsArray, IsEmail, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

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
    passwordHash: string;

    @IsNotEmpty()
    @IsArray()
    medicalData: string[];

    @IsNumberString()
    hasHeartDisease: number;
}