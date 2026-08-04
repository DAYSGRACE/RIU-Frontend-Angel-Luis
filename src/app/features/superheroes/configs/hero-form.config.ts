import { Validators } from '@angular/forms';
import { FormFieldInput } from '../../../core/interfaces/generic-input-form.interface';

export const HERO_FORM_TEMPLATE: FormFieldInput[] = [
  {
    key: 'name',
    label: 'Nombre',
    type: 'text',
    validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    errors: {
      required: 'El nombre es obligatorio.',
      minlength: 'El nombre debe tener al menos 2 caracteres.',
      maxlength: 'El nombre no debe tener más de 100 caracteres.',
    },
  },
  {
    key: 'realName',
    label: 'Nombre real',
    type: 'text',
    validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    errors: {
      required: 'El nombre real es obligatorio.',
      minlength: 'El nombre real debe tener al menos 2 caracteres.',
      maxlength: 'El nombre real no debe tener más de 100 caracteres.',
    },
  },
  {
    key: 'power',
    label: 'Poder',
    type: 'number',
    validators: [Validators.required, Validators.min(1)],
    errors: {
      required: 'El poder es obligatorio.',
      min: 'El poder debe ser mayor que 0.',
    },
  },
  {
    key: 'intelligence',
    label: 'Inteligencia',
    type: 'number',
    validators: [Validators.required, Validators.min(0)],
    errors: {
      required: 'La inteligencia es obligatoria.',
      min: 'La inteligencia no puede ser negativa.',
    },
  },
  {
    key: 'universe',
    label: 'Universo',
    type: 'text',
    validators: [Validators.required, Validators.minLength(1)],
    errors: {
      required: 'El universo es obligatorio.',
      minlength: 'El universo debe tener al menos 1 caracter.',
    },
  },
];
