import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

function IsStrongPassword() {
  return function (object: Object, propertyName: string) {
    MinLength(8)(object, propertyName);
    Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, {
      message: 'Password must contain at least one number and one special character',
    })(object, propertyName);
  };
}


export class RecoverPasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  newPassword: string;
}
