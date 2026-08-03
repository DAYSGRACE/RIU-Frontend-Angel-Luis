import { FormFieldInput } from '../../../core/interfaces/generic-input-form.interface';
import { ColumnTableData } from '../interfaces/column-table-data.interface';

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


export const COLUMNS_HERO_TABLE: ColumnTableData[] = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    key: 'name',
    label: 'Nombre de héroe',
  },
  {
    key: 'realName',
    label: 'Nombre real',
  },
  {
    key: 'power',
    label: 'Poder',
  },
  {
    key: 'intelligence',
    label: 'Inteligencia',
  },
  {
    key: 'universe',
    label: 'Universo',
  },
];