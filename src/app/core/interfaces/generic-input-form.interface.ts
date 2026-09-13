export interface RuleWithValue<T> {
  value: T;
  message: string;
}

export interface ValidationRules {
  /** Si está definido, el campo es requerido y este es su mensaje de error */
  required?: string;
  minLength?: RuleWithValue<number>;
  maxLength?: RuleWithValue<number>;
  min?: RuleWithValue<number>;
  max?: RuleWithValue<number>;
}

export interface FormFieldInput<T extends object = object> {
  key: keyof T;
  label: string;
  type: 'text' | 'number';
  rules?: ValidationRules;
}
