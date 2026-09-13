import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Field, form, FormField } from '@angular/forms/signals';
import { FormFieldInput } from '../../../../core/interfaces/generic-input-form.interface';
import { HeroDTOCreation } from '../../interfaces/hero-dto.interface';
import { HERO_FORM_TEMPLATE } from '../../configs/hero-form.config';
import { createSchemaFromConfig } from '../../../../core/schema-builder.util';

@Component({
  selector: 'app-hero-form',
  imports: [MatFormFieldModule, MatInputModule, MatButton, FormField],
  templateUrl: './hero-form.html',
  styleUrl: './hero-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroForm {
  initialValue = input<HeroDTOCreation>();
  formSubmitted = output<HeroDTOCreation>();

  protected readonly formTemplate = HERO_FORM_TEMPLATE;

  protected readonly model = linkedSignal<HeroDTOCreation>(() => {
    return (
      this.initialValue() ?? {
        name: '',
        realName: '',
        power: 0,
        intelligence: 0,
        universe: '',
      }
    );
  });

  protected readonly form = form(this.model, createSchemaFromConfig(this.formTemplate));

  save(event: SubmitEvent) {
    event.preventDefault();
    if (!this.form().valid()) {
      return;
    }

    this.formSubmitted.emit(this.model());
  }

  protected getErrorMessage(field: FormFieldInput<HeroDTOCreation>): string {
    const fieldErrors = this.getField(field.key)().errors();

    if (!fieldErrors.length) {
      return '';
    }

    return fieldErrors[0].message ?? '';
  }

  protected getField(key: keyof HeroDTOCreation): Field<string | number> {
    return this.form[key];
  }
}
