import { ComponentFixture, TestBed } from '@angular/core/testing';

import HeroEditPage from './hero-edit-page';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { SuperHeroService } from '../../services/super-hero-service';
import { MatDialog } from '@angular/material/dialog';

describe('HeroEditPage', () => {
  let component: HeroEditPage;
  let fixture: ComponentFixture<HeroEditPage>;

  const heroServiceMock = {
    getHeroById: vi.fn().mockReturnValue(
      of({
        id: '1',
        name: 'Batman',
        realName: 'Bruce Wayne',
        power: 100,
        intelligence: 100,
        universe: 'DC',
      }),
    ),

    editHero: vi.fn().mockReturnValue(of({})),
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
            params: of({ id: 'jsklfdjs' }),
            snapshot: {
              params: { id: 'jsklfdjs' },
              queryParams: {},
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

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('Debería editar al héroe al confirmar', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(true),
    });

    const hero = {
      name: 'Batman',
      realName: 'Bruce Wayne',
      power: 200,
      intelligence: 100,
      universe: 'DC',
    };

    component.openDialogToConfirmEdit(hero);

    expect(dialogMock.open).toHaveBeenCalled();

    expect(heroServiceMock.editHero).toHaveBeenCalled();
  });

  it('No debería al héroe al cancelar', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(false),
    });

    component.openDialogToConfirmEdit({
      name: 'Batman',
    });

    expect(heroServiceMock.editHero).not.toHaveBeenCalled();
  });

  it('Debería navegar a la página principal cerrar el modal de éxito', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(true),
    });

    component.editHero({
      name: 'Batman',
      realName: 'Bruce Wayne',
      power: 100,
      intelligence: 100,
      universe: 'DC',
    });

    expect(routerMock.navigate).toHaveBeenCalledWith(['/heroes']);
  });
});
