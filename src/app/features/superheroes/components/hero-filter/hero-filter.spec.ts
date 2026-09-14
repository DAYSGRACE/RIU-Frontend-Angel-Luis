import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroFilter } from './hero-filter';

describe('HeroFilter', () => {
  let component: HeroFilter;
  let fixture: ComponentFixture<HeroFilter>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFilter);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('labelInput', 'Buscar héroe');

    fixture.detectChanges();
    await fixture.whenStable();

    input = fixture.nativeElement.querySelector('input');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('Debería renderizar el label pasado por input', () => {
    const label = fixture.nativeElement.querySelector('mat-label');

    expect(label.textContent).toContain('Buscar héroe');
  });

  describe('Entrada de texto', () => {
    it('No debería emitir la query antes de que finalice el debounce', () => {
      vi.useFakeTimers();

      const spy = vi.spyOn(component.query, 'emit');

      input.value = 'Batman';
      input.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      vi.advanceTimersByTime(499);

      expect(spy).not.toHaveBeenCalled();
    });

    it('Debería emitir la query después del tiempo de debounce', () => {
      vi.useFakeTimers();

      const spy = vi.spyOn(component.query, 'emit');

      input.value = 'Batman';
      input.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      vi.advanceTimersByTime(500);

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith('Batman');
    });

    it('No debería emitir valores consecutivos iguales', () => {
      vi.useFakeTimers();

      const spy = vi.spyOn(component.query, 'emit');

      input.value = 'Batman';
      input.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      vi.advanceTimersByTime(500);

      input.value = 'Batman';
      input.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      vi.advanceTimersByTime(500);

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith('Batman');
    });

    it('Debería emitir nuevamente cuando la query cambia', () => {
      vi.useFakeTimers();

      const spy = vi.spyOn(component.query, 'emit');

      input.value = 'Batman';
      input.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      vi.advanceTimersByTime(500);

      input.value = 'Superman';
      input.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      vi.advanceTimersByTime(500);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenNthCalledWith(1, 'Batman');
      expect(spy).toHaveBeenNthCalledWith(2, 'Superman');
    });

    it('Debería respetar el debounceMs configurado', () => {
      vi.useFakeTimers();

      const customFixture = TestBed.createComponent(HeroFilter);
      const customComponent = customFixture.componentInstance;

      customFixture.componentRef.setInput('labelInput', 'Buscar héroe');
      customFixture.componentRef.setInput('debounceMs', 1000);

      customFixture.detectChanges();

      const input = customFixture.nativeElement.querySelector('input') as HTMLInputElement;

      const spy = vi.spyOn(customComponent.query, 'emit');

      input.value = 'Batman';
      input.dispatchEvent(new Event('input'));

      vi.advanceTimersByTime(500);

      expect(spy).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith('Batman');

      customFixture.destroy();
    });

    it('Debería emitir solamente el último valor cuando se escriben varios valores durante el debounce', () => {
      vi.useFakeTimers();

      const spy = vi.spyOn(component.query, 'emit');

      input.value = 'B';
      input.dispatchEvent(new Event('input'));

      vi.advanceTimersByTime(100);

      input.value = 'Ba';
      input.dispatchEvent(new Event('input'));

      vi.advanceTimersByTime(100);

      input.value = 'Bat';
      input.dispatchEvent(new Event('input'));

      vi.advanceTimersByTime(500);

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith('Bat');
    });
  });

  describe('Destrucción', () => {
    it('No debería emitir una query pendiente después de destruirse', () => {
      vi.useFakeTimers();

      const spy = vi.spyOn(component.query, 'emit');

      input.value = 'Batman';
      input.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      fixture.destroy();

      vi.advanceTimersByTime(500);

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
