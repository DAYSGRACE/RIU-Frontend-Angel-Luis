import { ComponentFixture, TestBed } from '@angular/core/testing';

import HeroLayout from './hero-layout';
import { ActivatedRoute } from '@angular/router';

describe('HeroLayout', () => {
  let component: HeroLayout;
  let fixture: ComponentFixture<HeroLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroLayout],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
              queryParams: {},
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroLayout);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
