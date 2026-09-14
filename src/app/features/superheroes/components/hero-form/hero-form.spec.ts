import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { HeroForm } from './hero-form';
import { SuperHeroService } from '../../services/super-hero-service';
import { HeroDTO, HeroDTOCreation } from '../../interfaces/hero-dto.interface';

describe('Formulario de héroe', () => {
  let fixture: ComponentFixture<HeroForm>;
  let component: HeroForm;

  const heroServiceMock = {
    checkNameIfIsUsed: vi.fn(),
  };

  async function awaitValidationAsync(): Promise<void> {
    await vi.advanceTimersByTimeAsync(500);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function inputs(): HTMLInputElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('input'));
  }

  function input(index: number): HTMLInputElement {
    return inputs()[index];
  }

  function errors(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('mat-error'));
  }

  function submitButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  function setInputValue(element: HTMLInputElement, value: string): void {
    element.value = value;
    element.dispatchEvent(
      new Event('input', {
        bubbles: true,
      }),
    );

    fixture.detectChanges();
  }

  function blur(element: HTMLInputElement): void {
    element.dispatchEvent(
      new Event('blur', {
        bubbles: true,
      }),
    );

    fixture.detectChanges();
  }

  function fillValidForm(): void {
    setInputValue(input(0), 'Batman');
    setInputValue(input(1), 'Bruce Wayne');
    setInputValue(input(2), '100');
    setInputValue(input(3), '90');
    setInputValue(input(4), 'DC');

    fixture.detectChanges();
  }

  function submitForm(): void {
    const form = fixture.nativeElement.querySelector('form');

    form.dispatchEvent(
      new SubmitEvent('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );

    fixture.detectChanges();
  }

  beforeEach(async () => {
    vi.useFakeTimers();

    heroServiceMock.checkNameIfIsUsed.mockReset();
    heroServiceMock.checkNameIfIsUsed.mockReturnValue(of(false));

    await TestBed.configureTestingModule({
      imports: [HeroForm],
      providers: [
        {
          provide: SuperHeroService,
          useValue: heroServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroForm);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('renderizado', () => {
    it('debería renderizar todos los campos del héroe', () => {
      const renderedInputs = inputs();

      expect(renderedInputs).toHaveLength(5);

      expect(renderedInputs[0].type).toBe('text');
      expect(renderedInputs[1].type).toBe('text');
      expect(renderedInputs[2].type).toBe('number');
      expect(renderedInputs[3].type).toBe('number');
      expect(renderedInputs[4].type).toBe('text');
    });

    it('debería renderizar el botón de guardar deshabilitado inicialmente', () => {
      expect(submitButton().textContent?.trim()).toBe('Guardar');
      expect(submitButton().disabled).toBe(true);
    });
  });

  describe('validación', () => {
    it('debería mostrar un error cuando el nombre del héroe está vacío', () => {
      const nameInput = input(0);

      blur(nameInput);

      expect(
        errors().some((error) => error.textContent?.includes('El nombre es obligatorio.')),
      ).toBe(true);
    });

    it('debería mostrar un error cuando el nombre del héroe tiene menos de dos caracteres', () => {
      const nameInput = input(0);

      setInputValue(nameInput, 'A');
      blur(nameInput);

      expect(
        errors().some((error) =>
          error.textContent?.includes('El nombre debe tener al menos 2 caracteres.'),
        ),
      ).toBe(true);
    });

    it('debería mostrar un error cuando el nombre del héroe supera los 100 caracteres', () => {
      const nameInput = input(0);

      setInputValue(nameInput, 'A'.repeat(101));
      blur(nameInput);

      expect(
        errors().some((error) =>
          error.textContent?.includes('El nombre no debe tener más de 100 caracteres.'),
        ),
      ).toBe(true);
    });

    it('debería mostrar un error cuando el nombre real está vacío', () => {
      const realNameInput = input(1);

      blur(realNameInput);

      expect(
        errors().some((error) => error.textContent?.includes('El nombre real es obligatorio.')),
      ).toBe(true);
    });

    it('debería mostrar un error cuando el nombre real tiene menos de dos caracteres', () => {
      const realNameInput = input(1);

      setInputValue(realNameInput, 'A');
      blur(realNameInput);

      expect(
        errors().some((error) =>
          error.textContent?.includes('El nombre real debe tener al menos 2 caracteres.'),
        ),
      ).toBe(true);
    });

    it('debería mostrar un error cuando el poder es cero', () => {
      const powerInput = input(2);

      setInputValue(powerInput, '0');
      blur(powerInput);

      expect(
        errors().some((error) => error.textContent?.includes('El poder debe ser mayor que 0.')),
      ).toBe(true);
    });

    it('debería mostrar un error cuando la inteligencia es negativa', () => {
      const intelligenceInput = input(3);

      setInputValue(intelligenceInput, '-1');
      blur(intelligenceInput);

      expect(
        errors().some((error) =>
          error.textContent?.includes('La inteligencia no puede ser negativa.'),
        ),
      ).toBe(true);
    });

    it('debería mostrar un error cuando el universo está vacío', () => {
      const universeInput = input(4);

      blur(universeInput);

      expect(
        errors().some((error) => error.textContent?.includes('El universo es obligatorio.')),
      ).toBe(true);
    });
  });

  describe('estado del formulario', () => {
    it('debería mantener el botón de guardar deshabilitado mientras el formulario sea inválido', () => {
      setInputValue(input(0), 'Batman');

      expect(submitButton().disabled).toBe(true);
    });

    it('debería habilitar el botón de guardar cuando todos los valores requeridos sean válidos', () => {
      fillValidForm();

      expect(submitButton().disabled).toBe(false);
    });
  });

  describe('envío', () => {
    it('debería emitir el héroe ingresado cuando el formulario es válido', () => {
      const emittedHeroes: HeroDTOCreation[] = [];

      const subscription = component.formSubmitted.subscribe((hero) => {
        emittedHeroes.push(hero);
      });

      fillValidForm();
      submitForm();

      expect(emittedHeroes).toEqual([
        {
          name: 'Batman',
          realName: 'Bruce Wayne',
          power: 100,
          intelligence: 90,
          universe: 'DC',
        },
      ]);

      subscription.unsubscribe();
    });

    it('no debería emitir cuando el formulario es inválido', () => {
      const emitSpy = vi.fn();

      const subscription = component.formSubmitted.subscribe(emitSpy);

      submitForm();

      expect(emitSpy).not.toHaveBeenCalled();

      subscription.unsubscribe();
    });

    it('debería evitar el envío predeterminado del formulario por parte del navegador', () => {
      fillValidForm();

      const form = fixture.nativeElement.querySelector('form');

      const event = new SubmitEvent('submit', {
        bubbles: true,
        cancelable: true,
      });

      const prevented = !form.dispatchEvent(event);

      expect(prevented).toBe(true);
    });
  });

  describe('valor inicial', () => {
    it('debería renderizar el héroe proporcionado como valor inicial del formulario', () => {
      const hero: HeroDTO = {
        id: 'hero-1',
        name: 'Superman',
        realName: 'Clark Kent',
        power: 100,
        intelligence: 95,
        universe: 'DC',
      };

      fixture.componentRef.setInput('initialValue', hero);
      fixture.detectChanges();

      expect(input(0).value).toBe('Superman');
      expect(input(1).value).toBe('Clark Kent');
      expect(input(2).value).toBe('100');
      expect(input(3).value).toBe('95');
      expect(input(4).value).toBe('DC');
    });
  });

  describe('validación de unicidad del nombre', () => {
    it('debería comprobar el nombre mediante el servicio después de modificarlo', async () => {
      heroServiceMock.checkNameIfIsUsed.mockReturnValue(of(false));

      setInputValue(input(0), 'Batman');
      blur(input(0));

      await awaitValidationAsync();

      expect(heroServiceMock.checkNameIfIsUsed).toHaveBeenCalledWith('Batman', undefined);
    });

    it('debería mostrar un error cuando el nombre ya está en uso', async () => {
      heroServiceMock.checkNameIfIsUsed.mockReturnValue(of(true));

      setInputValue(input(0), 'Batman');
      blur(input(0));

      await awaitValidationAsync();

      expect(
        errors().some((error) => error.textContent?.includes('El nombre ya está en uso')),
      ).toBe(true);

      expect(submitButton().disabled).toBe(true);
    });

    it('debería permitir el formulario cuando el nombre está disponible', async () => {
      heroServiceMock.checkNameIfIsUsed.mockReturnValue(of(false));

      fillValidForm();

      await awaitValidationAsync();

      expect(
        errors().some((error) => error.textContent?.includes('El nombre ya está en uso')),
      ).toBe(false);

      expect(submitButton().disabled).toBe(false);
    });

    it('no debería comprobar el nombre cuando tiene menos de dos caracteres', async () => {
      setInputValue(input(0), 'A');
      blur(input(0));

      await awaitValidationAsync();

      expect(heroServiceMock.checkNameIfIsUsed).not.toHaveBeenCalled();
    });

    it('debería enviar el id del héroe actual cuando se está editando', async () => {
      const hero: HeroDTO = {
        id: 'hero-1',
        name: 'Superman',
        realName: 'Clark Kent',
        power: 100,
        intelligence: 95,
        universe: 'DC',
      };

      fixture.componentRef.setInput('initialValue', hero);
      fixture.detectChanges();

      setInputValue(input(0), 'Batman');
      blur(input(0));

      await awaitValidationAsync();

      expect(heroServiceMock.checkNameIfIsUsed).toHaveBeenCalledWith('Batman', 'hero-1');
    });

    it('no debería mostrar un error de nombre en uso cuando falla la validación de unicidad', async () => {
      heroServiceMock.checkNameIfIsUsed.mockReturnValue(
        throwError(() => new Error('Request failed')),
      );

      setInputValue(input(0), 'Batman');
      blur(input(0));

      await awaitValidationAsync();

      expect(
        errors().some((error) => error.textContent?.includes('El nombre ya está en uso')),
      ).toBe(false);
    });

    it('debería ejecutar onError cuando ocurre una excepción sincrónica al validar la unicidad', async () => {
      heroServiceMock.checkNameIfIsUsed.mockImplementation(() => {
        throw new Error('Error sincrónico');
      });

      setInputValue(input(0), 'Batman');
      blur(input(0));

      await awaitValidationAsync();

      expect(
        errors().some((error) => error.textContent?.includes('El nombre ya está en uso')),
      ).toBe(false);
    });
  });
});
