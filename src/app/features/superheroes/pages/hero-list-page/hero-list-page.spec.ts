import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import HeroListPage from './hero-list-page';
import { HeroFilter } from '../../components/hero-filter/hero-filter';
import { HeroTable } from '../../components/hero-table/hero-table';
import { SuperHeroService } from '../../services/super-hero-service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { MessageDialog } from '../../../../shared/components/message-dialog/message-dialog';

describe('HeroListPage', () => {
  let component: HeroListPage;
  let fixture: ComponentFixture<HeroListPage>;
  let dialogClosed$: Subject<boolean>;

  const hero = {
    id: '1',
    name: 'Batman',
    realName: 'Bruce Wayne',
    power: 100,
    intelligence: 100,
    universe: 'DC',
  };

  const heroServiceMock = {
    getHeroesPagination: vi.fn(),
    deleteHero: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  const dialogMock = {
    open: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    dialogClosed$ = new Subject<boolean>();

    heroServiceMock.getHeroesPagination.mockReturnValue(
      of({
        first: 1,
        prev: null,
        next: null,
        last: 1,
        pages: 1,
        items: 0,
        data: [],
      }),
    );

    heroServiceMock.deleteHero.mockReturnValue(of(null));

    dialogMock.open.mockReturnValue({
      afterClosed: () => dialogClosed$.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [HeroListPage],
      providers: [
        {
          provide: SuperHeroService,
          useValue: heroServiceMock,
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

    fixture = TestBed.createComponent(HeroListPage);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });

  describe('Carga inicial', () => {
    it('Debería cargar los héroes al iniciar', () => {
      expect(heroServiceMock.getHeroesPagination).toHaveBeenCalledWith(
        {
          page: 1,
          perPage: 10,
          sort: {},
        },
        '',
      );
    });
  });

  describe('Búsqueda', () => {
    it('Debería actualizar la búsqueda cuando el filtro emite un valor', () => {
      const filter = fixture.debugElement.query(By.directive(HeroFilter))
        .componentInstance as HeroFilter;

      filter.query.emit('iron');

      fixture.detectChanges();

      expect(component.queryToSearch()).toBe('iron');
    });

    it('Debería volver a la primera página después de eliminar el héroe', () => {
      component.pageIndex.set(3);

      component.deleteHero(hero);

      dialogClosed$.next(true);

      expect(component.pageIndex()).toBe(0);
    });

    it('Debería volver a cargar los héroes cuando cambia la búsqueda', async () => {
      heroServiceMock.getHeroesPagination.mockClear();

      const filter = fixture.debugElement.query(By.directive(HeroFilter))
        .componentInstance as HeroFilter;

      filter.query.emit('iron');

      fixture.detectChanges();
      await fixture.whenStable();

      expect(heroServiceMock.getHeroesPagination).toHaveBeenCalledWith(
        {
          page: 1,
          perPage: 10,
          sort: {},
        },
        'iron',
      );
    });
  });

  describe('Paginación', () => {
    it('Debería actualizar el índice y tamaño de página', () => {
      const pageEvent: PageEvent = {
        pageIndex: 2,
        pageSize: 20,
        length: 100,
      };

      component.managePaginationEvents(pageEvent);

      expect(component.pageIndex()).toBe(2);
      expect(component.pageSize()).toBe(20);
    });

    it('Debería actualizar la paginación cuando la tabla emite un cambio de página', () => {
      const table = fixture.debugElement.query(By.directive(HeroTable))
        .componentInstance as HeroTable;

      table.pageChange.emit({
        pageIndex: 2,
        pageSize: 20,
        length: 100,
      });

      fixture.detectChanges();

      expect(component.pageIndex()).toBe(2);
      expect(component.pageSize()).toBe(20);
    });
  });

  describe('Edición', () => {
    it('Debería navegar a la página de edición del héroe', () => {
      component.editHero(hero);

      expect(routerMock.navigate).toHaveBeenCalledOnce();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/heroes/edit/1']);
    });

    it('Debería navegar a la edición cuando la tabla emite el héroe a editar', () => {
      const table = fixture.debugElement.query(By.directive(HeroTable))
        .componentInstance as HeroTable;

      table.edit.emit(hero);

      expect(routerMock.navigate).toHaveBeenCalledOnce();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/heroes/edit/1']);
    });
  });

  describe('Eliminación', () => {
    it('Debería abrir el diálogo de confirmación', () => {
      component.deleteHero(hero);

      expect(dialogMock.open).toHaveBeenCalledOnce();
      expect(dialogMock.open).toHaveBeenCalledWith(ConfirmDialog, {
        data: {
          title: 'Eliminar héroe',
          message: '¿Esta seguro de eliminar al héroe?',
        },
      });
    });

    it('No debería eliminar el héroe antes de confirmar', () => {
      component.deleteHero(hero);

      expect(heroServiceMock.deleteHero).not.toHaveBeenCalled();
    });

    it('Debería eliminar el héroe cuando se confirma la eliminación', () => {
      component.deleteHero(hero);

      dialogClosed$.next(true);

      expect(heroServiceMock.deleteHero).toHaveBeenCalledOnce();
      expect(heroServiceMock.deleteHero).toHaveBeenCalledWith('1');
    });

    it('No debería eliminar el héroe cuando se cancela la eliminación', () => {
      component.deleteHero(hero);

      dialogClosed$.next(false);

      expect(heroServiceMock.deleteHero).not.toHaveBeenCalled();
    });

    it('Debería volver a la primera página después de eliminar el héroe', () => {
      component.pageIndex.set(3);

      component.deleteHero(hero);

      dialogClosed$.next(true);

      expect(component.pageIndex()).toBe(0);
    });

    it('Debería refrescar la lista después de eliminar el héroe', async () => {
      heroServiceMock.getHeroesPagination.mockClear();

      component.deleteHero(hero);

      dialogClosed$.next(true);

      await fixture.whenStable();

      expect(heroServiceMock.getHeroesPagination).toHaveBeenCalledWith(
        {
          page: 1,
          perPage: 10,
          sort: {},
        },
        '',
      );
    });

    it('Debería mostrar un diálogo de error si falla la eliminación', () => {
      const error = new Error('No se pudo eliminar el héroe');

      heroServiceMock.deleteHero.mockReturnValue(throwError(() => error));

      component.deleteHero(hero);

      dialogClosed$.next(true);

      expect(dialogMock.open).toHaveBeenCalledWith(MessageDialog, {
        data: {
          title: 'Error al eliminar héroe',
          message: 'No se pudo eliminar el héroe',
        },
      });
    });

    it('Debería ejecutar la eliminación cuando la tabla emite el héroe a eliminar', () => {
      const table = fixture.debugElement.query(By.directive(HeroTable))
        .componentInstance as HeroTable;

      table.delete.emit(hero);

      expect(dialogMock.open).toHaveBeenCalledWith(ConfirmDialog, {
        data: {
          title: 'Eliminar héroe',
          message: '¿Esta seguro de eliminar al héroe?',
        },
      });
    });
  });

  describe('Datos de la tabla', () => {
    it('Debería mostrar la tabla de héroes', () => {
      const table = fixture.debugElement.query(By.directive(HeroTable));

      expect(table).toBeTruthy();
    });

    it('Debería pasar la búsqueda actual a la tabla', () => {
      component.queryToSearch.set('iron');

      fixture.detectChanges();

      const table = fixture.debugElement.query(By.directive(HeroTable))
        .componentInstance as HeroTable;

      expect(table.currentQuery()).toBe('iron');
    });
  });
});
