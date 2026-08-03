import { FormFieldInput } from '../../../core/interfaces/generic-input-form.interface';

export const HERO_FORM_TEMPLATE: FormFieldInput[] = [
  {
    key: 'name',
    label: 'Nombre',
    type: 'text',
    required: true,
  },
  {
    key: 'realName',
    label: 'Nombre real',
    type: 'text',
    required: true,
  },
  {
    key: 'power',
    label: 'Poder',
    type: 'number',
    required: true,
  },
  {
    key: 'intelligence',
    label: 'Inteligencia',
    type: 'number',
    required: true,
  },
  {
    key: 'universe',
    label: 'Universo',
    type: 'text',
    required: true,
  },
];
