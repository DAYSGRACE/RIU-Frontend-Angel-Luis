import {
  max,
  maxLength,
  min,
  minLength,
  required,
  schema,
  Schema,
  SchemaPath,
} from '@angular/forms/signals';
import { FormFieldInput } from './interfaces/generic-input-form.interface';

export function createSchemaFromConfig<T extends object = object>(
  config: FormFieldInput<T>[],
): Schema<T> {
  return schema<T>((s) => {
    const schemaFields = s as unknown as Record<keyof T, SchemaPath<string | number>>;

    for (const field of config) {
      const fieldPath = schemaFields[field.key];
      const rules = field.rules;

      if (!rules || !fieldPath) continue;

      if (rules.required) {
        required(fieldPath, { message: rules.required });
      }
      if (rules.minLength) {
        minLength(fieldPath as SchemaPath<string>, rules.minLength.value, {
          message: rules.minLength.message,
        });
      }
      if (rules.maxLength) {
        maxLength(fieldPath as SchemaPath<string>, rules.maxLength.value, {
          message: rules.maxLength.message,
        });
      }
      if (rules.min) {
        min(fieldPath as SchemaPath<number>, rules.min.value, { message: rules.min.message });
      }
      if (rules.max) {
        max(fieldPath as SchemaPath<number>, rules.max.value, { message: rules.max.message });
      }
    }
  });
}
