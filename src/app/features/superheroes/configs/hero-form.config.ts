import { FormFieldInput } from '../../../core/interfaces/generic-input-form.interface';
import { HeroDTOCreation } from '../interfaces/hero-dto.interface';

export const HERO_FORM_TEMPLATE: FormFieldInput<HeroDTOCreation>[] = [
  {
    key: 'name',
    label: 'Nombre',
    type: 'text',
    rules: {
      required: 'El nombre es obligatorio.',
      minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres.' },
      maxLength: { value: 100, message: 'El nombre no debe tener más de 100 caracteres.' },
    },
  },
  {
    key: 'realName',
    label: 'Nombre real',
    type: 'text',
    rules: {
      required: 'El nombre real es obligatorio.',
      minLength: { value: 2, message: 'El nombre real debe tener al menos 2 caracteres.' },
      maxLength: { value: 100, message: 'El nombre real no debe tener más de 100 caracteres.' },
    },
  },
  {
    key: 'power',
    label: 'Poder',
    type: 'number',
    rules: {
      required: 'El poder es obligatorio.',
      min: { value: 1, message: 'El poder debe ser mayor que 0.' },
    },
  },
  {
    key: 'intelligence',
    label: 'Inteligencia',
    type: 'number',
    rules: {
      required: 'La inteligencia es obligatoria.',
      min: { value: 0, message: 'La inteligencia no puede ser negativa.' },
    },
  },
  {
    key: 'universe',
    label: 'Universo',
    type: 'text',
    rules: {
      required: 'El universo es obligatorio.',
      minLength: { value: 1, message: 'El universo debe tener al menos 1 caracter.' },
    },
  },
];
