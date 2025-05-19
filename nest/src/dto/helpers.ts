import { Matches, MinLength } from 'class-validator';

export function IsStrongPassword() {
    return function (object: Object, propertyName: string) {
      MinLength(8)(object, propertyName);
      Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, {
        message: 'Password must contain at least one number and one special character',
      })(object, propertyName);
    };
  }
  