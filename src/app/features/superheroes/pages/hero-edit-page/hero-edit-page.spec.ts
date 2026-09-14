import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import HeroEditPage from './hero-edit-page';
import { SuperHeroService } from '../../services/super-hero-service';
import { HeroDTOCreation } from '../../interfaces/hero-dto.interface';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { MessageDialog } from '../../../../shared/components/message-dialog/message-dialog';

describe('HeroEditPage', () => {
  let component: HeroEditPage;
  let fixture: ComponentFixture<HeroEditPage>;

  const hero = {
    id: 'jsklfdjs',
    name: 'Batman',
    realName: 'Bruce Wayne',
    power: 100,
    intelligence: 100,
    universe: 'DC',
  };

  const heroServiceMock = {
    editHero: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  const dialogMock = {
    open: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [HeroEditPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                hero,
              },
            },
          },
        },
        {
          provide: Router,
          useValue: routerMock,
        },
        {
          provide: SuperHeroService,
          useValue: heroServiceMock,
        },
        {
          provide: MatDialog,
          useValue: dialogMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroEditPage);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  describe('creación', () => {
    it('Debería crearse', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('openDialogToConfirmEdit', () => {
    it('Debería abrir el diálogo de confirmación con los datos correctos', () => {
      dialogMock.open.mockReturnValue({
        afterClosed: () => of(false),
      });

      const heroToEdit: HeroDTOCreation = {
        name: 'Batman',
        realName: 'Bruce Wayne',
        power: 200,
        intelligence: 100,
        universe: 'DC',
      };

      component.openDialogToConfirmEdit(heroToEdit);

      expect(dialogMock.open).toHaveBeenCalledWith(ConfirmDialog, {
        data: {
          title: 'Edición de héroe',
          message: '¿Está seguro de editarlo?',
        },
      });
    });

    it('Debería editar al héroe cuando se confirma la edición', () => {
      dialogMock.open.mockReturnValue({
        afterClosed: () => of(true),
      });

      heroServiceMock.editHero.mockReturnValue(of(undefined));

      const heroToEdit: HeroDTOCreation = {
        name: 'Batman',
        realName: 'Bruce Wayne',
        power: 200,
        intelligence: 100,
        universe: 'DC',
      };

      component.openDialogToConfirmEdit(heroToEdit);

      expect(heroServiceMock.editHero).toHaveBeenCalledTimes(1);
      expect(heroServiceMock.editHero).toHaveBeenCalledWith(heroToEdit, hero.id);
    });

    it('No debería editar al héroe cuando se cancela la edición', () => {
      dialogMock.open.mockReturnValue({
        afterClosed: () => of(false),
      });

      const heroToEdit: HeroDTOCreation = {
        name: 'Batman',
        realName: 'Bruce Wayne',
        power: 200,
        intelligence: 100,
        universe: 'DC',
      };

      component.openDialogToConfirmEdit(heroToEdit);

      expect(heroServiceMock.editHero).not.toHaveBeenCalled();
    });
  });

  describe('editHero', () => {
    it('Debería editar al héroe utilizando su id', () => {
      heroServiceMock.editHero.mockReturnValue(of(undefined));

      const heroToEdit: HeroDTOCreation = {
        name: 'Batman',
        realName: 'Bruce Wayne',
        power: 200,
        intelligence: 100,
        universe: 'DC',
      };

      component.editHero(heroToEdit);

      expect(heroServiceMock.editHero).toHaveBeenCalledTimes(1);
      expect(heroServiceMock.editHero).toHaveBeenCalledWith(heroToEdit, hero.id);
    });

    it('Debería abrir el diálogo de éxito cuando la edición finaliza correctamente', () => {
      heroServiceMock.editHero.mockReturnValue(of(undefined));

      dialogMock.open.mockReturnValue({
        afterClosed: () => of(undefined),
      });

      component.editHero({
        name: 'Batman',
        realName: 'Bruce Wayne',
        power: 200,
        intelligence: 100,
        universe: 'DC',
      });

      expect(dialogMock.open).toHaveBeenCalledWith(MessageDialog, {
        data: {
          title: 'Edición finalizada con éxito',
          message: 'Se ha modificado al héroe correctamente',
        },
      });
    });

    it('Debería navegar a la página principal al cerrar el diálogo de éxito', () => {
      heroServiceMock.editHero.mockReturnValue(of(undefined));

      dialogMock.open.mockReturnValue({
        afterClosed: () => of(undefined),
      });

      component.editHero({
        name: 'Batman',
        realName: 'Bruce Wayne',
        power: 200,
        intelligence: 100,
        universe: 'DC',
      });

      expect(routerMock.navigate).toHaveBeenCalledTimes(1);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/heroes']);
    });

    it('Debería abrir el diálogo de error cuando falla la edición', () => {
      const error = new Error('No se pudo editar el héroe');

      heroServiceMock.editHero.mockReturnValue(throwError(() => error));

      dialogMock.open.mockReturnValue({
        afterClosed: () => of(undefined),
      });

      component.editHero({
        name: 'Batman',
        realName: 'Bruce Wayne',
        power: 200,
        intelligence: 100,
        universe: 'DC',
      });

      expect(dialogMock.open).toHaveBeenCalledWith(MessageDialog, {
        data: {
          title: 'Error al editar',
          message: 'No se pudo editar el héroe, se redirigira a la página principal',
        },
      });
    });

    it('Debería navegar a la página principal al cerrar el diálogo de error', () => {
      const error = new Error('No se pudo editar el héroe');

      heroServiceMock.editHero.mockReturnValue(throwError(() => error));

      dialogMock.open.mockReturnValue({
        afterClosed: () => of(undefined),
      });

      component.editHero({
        name: 'Batman',
        realName: 'Bruce Wayne',
        power: 200,
        intelligence: 100,
        universe: 'DC',
      });

      expect(routerMock.navigate).toHaveBeenCalledTimes(1);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/heroes']);
    });
  });
});
