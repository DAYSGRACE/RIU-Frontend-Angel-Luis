import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroForm } from './hero-form';
import { FormFieldInput } from '../../../../core/interfaces/generic-input-form.interface';
import { Validators } from '@angular/forms';

describe('HeroForm', () => {
  let component: HeroForm;
  let fixture: ComponentFixture<HeroForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroForm],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroForm);
    component = fixture.componentInstance;
    const formTemplate: FormFieldInput[] = [];
    fixture.componentRef.setInput('formTemplate', formTemplate);
    await fixture.whenStable();
  });

  it('Debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('Debería renderizar los campos del formulario', () => {
    const template: FormFieldInput[] = [
      {
        key: 'skill',
        label: 'Habilidad',
        type: 'text',
      },
      {
        key: 'power',
        label: 'Poder',
        type: 'number',
      },
    ];

    fixture.componentRef.setInput('formTemplate', template);
    fixture.detectChanges();

    const inputs = fixture.nativeElement.querySelectorAll('input');

    expect(inputs.length).toBe(2);
  });

  describe('Validación', () => {
    it('Debería mostrar mensaje de error cuando el campo sea inválido', () => {
      const template: FormFieldInput[] = [
        {
          key: 'name',
          label: 'Nombre',
          type: 'text',
          validators: [Validators.required],
          errors: {
            required: 'El nombre es obligatorio',
          },
        },
      ];

      fixture.componentRef.setInput('formTemplate', template);
      fixture.detectChanges();

      const control = component.form().get('name');

      control?.markAsTouched();
      control?.updateValueAndValidity();

      fixture.detectChanges();

      const error = fixture.nativeElement.querySelector('mat-error');

      expect(error.textContent).toContain('El nombre es obligatorio');
    });

    it('Debería mostrar error cuando el valor sea menor al permitido', () => {
      const template: FormFieldInput[] = [
        {
          key: 'power',
          label: 'Poder',
          type: 'number',
          validators: [Validators.min(100)],
          errors: {
            min: 'El poder mínimo es 100',
          },
        },
      ];

      fixture.componentRef.setInput('formTemplate', template);
      fixture.detectChanges();

      component.form().patchValue({
        power: 50,
      });

      const control = component.form().get('power');
      control?.markAsTouched();

      fixture.detectChanges();

      const error = fixture.nativeElement.querySelector('mat-error');

      expect(error.textContent).toContain('El poder mínimo es 100');
    });
  });

  describe('save()', () => {
    const template: FormFieldInput[] = [
      {
        key: 'name',
        label: 'Nombre',
        type: 'text',
        validators: [Validators.required],
      },
      {
        key: 'power',
        label: 'Poder',
        type: 'number',
        validators: [Validators.required, Validators.min(0)],
      },
    ];

    it('Debería emitir el formulario cuando sea válido', () => {
      fixture.componentRef.setInput('formTemplate', template);
      fixture.detectChanges();

      const spy = vi.spyOn(component.formSubmitted, 'emit');

      component.form().patchValue({
        name: 'Spider-Man',
        power: 1,
      });

      component.save();

      expect(spy).toHaveBeenCalledWith({
        name: 'Spider-Man',
        power: 1,
      });
    });

    it('No debería emitir el formulario cuando sea inválido', () => {
      fixture.componentRef.setInput('formTemplate', template);
      fixture.detectChanges();

      const spy = vi.spyOn(component.formSubmitted, 'emit');

      component.save();

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
