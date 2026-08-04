import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroFilter } from './hero-filter';

describe('HeroFilter', () => {
  let component: HeroFilter;
  let fixture: ComponentFixture<HeroFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFilter);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('labelInput', 'Buscar héroe');

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('Debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('Debería renderizar el label pasado por input', () => {
    const label = fixture.nativeElement.querySelector('mat-label');

    expect(label.textContent).toContain('Buscar héroe');
  });

  it('Debería emitir la query despues del tiempo de retraso', () => {
    vi.useFakeTimers();

    const spy = vi.spyOn(component.query, 'emit');

    component.onInput('Batman');

    vi.advanceTimersByTime(500);

    expect(spy).toHaveBeenCalledWith('Batman');

    vi.useRealTimers();
  });

  it('No debería emitir valores repetidos', () => {
    vi.useFakeTimers();

    const spy = vi.spyOn(component.query, 'emit');

    component.onInput('Batman');

    vi.advanceTimersByTime(500);

    component.onInput('Batman');

    vi.advanceTimersByTime(500);

    expect(spy).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
