import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { isCuid } from '@paralleldrive/cuid2';

export function IsCuid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCuid',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return typeof value === 'string' && isCuid(value); // ✅ validate the format
        },
        defaultMessage(_args: ValidationArguments) {
          return '$property must be a valid CUID';
        },
      },
    });
  };
}
