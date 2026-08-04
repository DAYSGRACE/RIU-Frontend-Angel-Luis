import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroNavbar } from './hero-navbar';
import { ActivatedRoute } from '@angular/router';

describe('HeroNavbar', () => {
  let component: HeroNavbar;
  let fixture: ComponentFixture<HeroNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroNavbar],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: {},
            snapshot: {
              params: {},
              queryParams: {},
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
