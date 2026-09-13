import { Observable } from 'rxjs';

export interface RuleWithValue<T> {
  value: T;
  message: string;
}

export interface AsyncRule<TContext = undefined> {
  validator: (value: string, context: TContext | undefined) => Observable<boolean>;

  message: string;
}

export interface ValidationRules<TContext = undefined> {
  required?: string;
  minLength?: RuleWithValue<number>;
  maxLength?: RuleWithValue<number>;
  min?: RuleWithValue<number>;
  max?: RuleWithValue<number>;
  async?: AsyncRule<TContext>;
}

export interface FormFieldInput<T extends object = object, TContext = undefined> {
  key: keyof T;
  label: string;
  type: 'text' | 'number';
  rules?: ValidationRules<TContext>;
}
