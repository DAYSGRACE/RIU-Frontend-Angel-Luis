import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroLayout } from './hero-layout';

describe('HeroLayout', () => {
  let component: HeroLayout;
  let fixture: ComponentFixture<HeroLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
