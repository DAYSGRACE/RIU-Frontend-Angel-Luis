import { Component, computed, effect, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormFieldInput } from '../../../../core/interfaces/generic-input-form.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-hero-form',
  imports: [MatFormFieldModule, MatInputModule, MatButton, ReactiveFormsModule],
  templateUrl: './hero-form.html',
  styleUrl: './hero-form.scss',
})
export class HeroForm {
  formTemplate = input.required<FormFieldInput[]>();
  initialValue = input<Record<string, unknown>>({});

  formSubmitted = output<{ [key: string]: unknown }>();

  form = computed(() => {
    const controls: Record<string, FormControl> = {};

    for (const field of this.formTemplate()) {
      controls[field.key] = new FormControl('', field.required ? Validators.required : []);
    }
    return new FormGroup(controls);
  });

  constructor() {
    effect(() => {
      const value = this.initialValue();

      if (value) {
        console.log(value);
        this.form().patchValue(value);
      }
    });
  }

  save() {
    this.formSubmitted.emit(this.form().getRawValue());
  }
}
