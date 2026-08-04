import { ValidatorFn } from '@angular/forms';

export interface FormFieldInput {
  key: string;
  label: string;
  type: 'text' | 'number';
  validators?: ValidatorFn[];
  errors?: Record<string, string>;
}
