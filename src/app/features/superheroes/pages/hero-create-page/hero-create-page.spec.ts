import { ComponentFixture, TestBed } from '@angular/core/testing';

import HeroCreatePage from './hero-create-page';
import { SuperHeroService } from '../../services/super-hero-service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('HeroCreatePage', () => {
  let component: HeroCreatePage;
  let fixture: ComponentFixture<HeroCreatePage>;

  const serviceMock = {
    createHero: vi.fn().mockReturnValue(of({})),
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

  it('Debería crear al héroe', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(),
    });

    component.createHero({
      name: 'Iron Man',
      realName: 'Tony Stark',
      power: 100,
      intelligence: 100,
      universe: 'MARVEL',
    });

    expect(serviceMock.createHero).toHaveBeenCalled();
  });

  it('Debería navegar a la página principal al cerra el modal', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(null),
    });

    component.createHero({
      name: 'Iron Man',
      realName: 'Tony Stark',
      power: 100,
      intelligence: 100,
      universe: 'MARVEL',
    });

    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
