import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';

import {
  form,
  FormField,
  maxLength,
  min,
  minLength,
  required,
  schema,
  Schema,
  validateAsync,
} from '@angular/forms/signals';

import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { HeroDTO, HeroDTOCreation } from '../../interfaces/hero-dto.interface';
import { SuperHeroService } from '../../services/super-hero-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

@Component({
  selector: 'app-hero-form',
  imports: [MatFormFieldModule, MatInputModule, MatButton, FormField],
  templateUrl: './hero-form.html',
  styleUrl: './hero-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroForm {
  initialValue = input<HeroDTO>();

  formSubmitted = output<HeroDTOCreation>();
  readonly model = linkedSignal<HeroDTOCreation>(
    () =>
      this.initialValue() ?? {
        name: '',
        realName: '',
        power: 0,
        intelligence: 0,
        universe: '',
      },
  );
  private readonly heroService = inject(SuperHeroService);
  private readonly heroSchema: Schema<HeroDTOCreation> = schema((path) => {
    required(path.name, {
      message: 'El nombre es obligatorio.',
    });
    minLength(path.name, 2, {
      message: 'El nombre debe tener al menos 2 caracteres.',
    });
    maxLength(path.name, 100, {
      message: 'El nombre no debe tener más de 100 caracteres.',
    });

    required(path.realName, {
      message: 'El nombre real es obligatorio.',
    });
    minLength(path.realName, 2, {
      message: 'El nombre real debe tener al menos 2 caracteres.',
    });
    maxLength(path.realName, 100, {
      message: 'El nombre real no debe tener más de 100 caracteres.',
    });

    required(path.power, {
      message: 'El poder es obligatorio.',
    });
    min(path.power, 1, {
      message: 'El poder debe ser mayor que 0.',
    });

    required(path.intelligence, {
      message: 'La inteligencia es obligatoria.',
    });
    min(path.intelligence, 0, {
      message: 'La inteligencia no puede ser negativa.',
    });

    required(path.universe, {
      message: 'El universo es obligatorio.',
    });
    minLength(path.universe, 1, {
      message: 'El universo debe tener al menos 1 caracter.',
    });

    validateAsync(path.name, {
      when: ({ state }) => {
        if (this.initialValue()?.id) {
          return state.dirty();
        }
        return state.touched() && state.dirty();
      },
      debounce: 500,
      params: ({ value }) => {
        const name = value();

        if (!name || name.length < 2) {
          return undefined;
        }

        return name;
      },

      factory: (name) =>
        rxResource({
          params: () => ({ name: name() }),
          stream: ({ params }) => {
            if (!params.name) return of(false);
            return this.heroService.checkNameIfIsUsed(params.name, this.initialValue()?.id);
          },
        }),

      onSuccess: (exists: boolean) => {
        if (exists) {
          return {
            kind: 'nameTaken',
            message: 'El nombre ya está en uso',
          };
        }

        return undefined;
      },

      onError: () => ({
        kind: 'serverError',
        message: 'No verificable por el momento',
      }),
    });
  });

  protected readonly form = form(this.model, this.heroSchema);

  protected save(event: SubmitEvent): void {
    event.preventDefault();

    if (!this.form().valid()) {
      return;
    }

    this.formSubmitted.emit(this.model());
  }
}
