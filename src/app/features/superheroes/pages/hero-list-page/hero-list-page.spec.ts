import { ComponentFixture, TestBed } from '@angular/core/testing';

import HeroListPage from './hero-list-page';
import { of } from 'rxjs';
import { SuperHeroService } from '../../services/super-hero-service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

describe('HeroListPage', () => {
  const heroServiceMock = {
    getHeroesPagination: vi.fn().mockReturnValue(
      of({
        first: 1,
        prev: null,
        next: null,
        last: 1,
        pages: 1,
        items: 0,
        data: [],
      }),
    ),

    deleteHero: vi.fn().mockReturnValue(of(null)),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  const dialogMock = {
    open: vi.fn(),
  };

  let component: HeroListPage;
  let fixture: ComponentFixture<HeroListPage>;

  beforeEach(async () => {
    vi.clearAllMocks();
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
    await fixture.whenStable();
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('Debería cargar datos al iniciar', () => {
    expect(heroServiceMock.getHeroesPagination).toHaveBeenCalledWith(
      {
        page: 1,
        perPage: 10,
        sort: {},
      },
      '',
    );
  });

  it('Debería actualizar paginación', () => {
    component.managePaginationEvents({
      pageIndex: 2,
      pageSize: 20,
      length: 100,
    });

    expect(component.pageIndex()).toBe(2);

    expect(component.pageSize()).toBe(20);
  });

  it('Debería navegar a la página de edición', () => {
    const hero = {
      id: '123',
      name: 'Spider-Man',
      realName: 'Peter Parker',
      power: 100,
      intelligence: 90,
      universe: 'ULTIMATE',
    };

    component.editHero(hero);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/heroes/edit/123']);
  });

  it('Debería borrar al héroe luego de confirmar', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(true),
    });

    const hero = {
      id: '1',
      name: 'Batman',
      realName: 'Bruce Wayne',
      power: 100,
      intelligence: 100,
      universe: 'DC',
    };

    component.deleteHero(hero);

    expect(dialogMock.open).toHaveBeenCalled();

    expect(heroServiceMock.deleteHero).toHaveBeenCalledWith('1');
  });

  it('No debería eliminar la héroe si cancela', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(false),
    });

    component.deleteHero({
      id: '1',
      name: 'Batman',
      realName: 'Bruce Wayne',
      power: 100,
      intelligence: 100,
      universe: 'DC',
    });

    expect(heroServiceMock.deleteHero).not.toHaveBeenCalled();
  });

  it('Debería actualizar la señal', () => {
    component.queryToSearch.set('iron');

    expect(component.queryToSearch()).toBe('iron');
  });
});
