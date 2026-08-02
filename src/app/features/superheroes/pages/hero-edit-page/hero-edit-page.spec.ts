import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroEditPage } from './hero-edit-page';

describe('HeroEditPage', () => {
  let component: HeroEditPage;
  let fixture: ComponentFixture<HeroEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroEditPage],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroEditPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
