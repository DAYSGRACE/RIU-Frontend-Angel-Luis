import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import HeroCreatePage from './hero-create-page';
import { SuperHeroService } from '../../services/super-hero-service';

describe('HeroCreatePage', () => {
  let component: HeroCreatePage;
  let fixture: ComponentFixture<HeroCreatePage>;

  const heroMock = {
    name: 'Iron Man',
    realName: 'Tony Stark',
    power: 100,
    intelligence: 100,
    universe: 'MARVEL',
  };

  const serviceMock = {
    createHero: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  const dialogMock = {
    open: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    serviceMock.createHero.mockReturnValue(of({}));

    dialogMock.open.mockReturnValue({
      afterClosed: () => of(null),
    });

    await TestBed.configureTestingModule({
      imports: [HeroCreatePage],
      providers: [
        {
          provide: SuperHeroService,
          useValue: serviceMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
        {
          provide: MatDialog,
          useValue: dialogMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroCreatePage);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  describe('Creación del héroe', () => {
    it('Debería enviar los datos del formulario al servicio', () => {
      component.createHero(heroMock);

      expect(serviceMock.createHero).toHaveBeenCalledOnce();
      expect(serviceMock.createHero).toHaveBeenCalledWith(heroMock);
    });

    it('Debería mostrar un diálogo de éxito cuando el héroe es creado correctamente', () => {
      component.createHero(heroMock);

      expect(dialogMock.open).toHaveBeenCalledOnce();
      expect(dialogMock.open).toHaveBeenCalledWith(expect.anything(), {
        data: {
          title: 'Éxito',
          message: 'El héroe fue creado correctamente',
        },
      });
    });

    it('Debería navegar a la página principal cuando se cierra el diálogo de éxito', () => {
      component.createHero(heroMock);

      expect(routerMock.navigate).toHaveBeenCalledOnce();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Error al crear el héroe', () => {
    it('Debería mostrar un diálogo de error cuando falla la creación', () => {
      const error = new Error('No se pudo crear el héroe');

      serviceMock.createHero.mockReturnValue(throwError(() => error));

      component.createHero(heroMock);

      expect(dialogMock.open).toHaveBeenCalledOnce();
      expect(dialogMock.open).toHaveBeenCalledWith(expect.anything(), {
        data: {
          title: 'Error',
          message: 'No se pudo crear el héroe, se redirigira a la página principal',
        },
      });
    });

    it('Debería navegar a la página principal cuando se cierra el diálogo de error', () => {
      const error = new Error('No se pudo crear el héroe');

      serviceMock.createHero.mockReturnValue(throwError(() => error));

      component.createHero(heroMock);

      expect(routerMock.navigate).toHaveBeenCalledOnce();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });

    it('No debería abrir el diálogo de éxito cuando falla la creación', () => {
      serviceMock.createHero.mockReturnValue(throwError(() => new Error('Error de servidor')));

      component.createHero(heroMock);

      expect(dialogMock.open).toHaveBeenCalledOnce();

      expect(dialogMock.open).not.toHaveBeenCalledWith(expect.anything(), {
        data: {
          title: 'Éxito',
          message: 'El héroe fue creado correctamente',
        },
      });
    });
  });
});
