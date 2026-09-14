import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Spinner } from './spinner';
import { LoadingService } from '../../../core/services/loading-service';

describe('Spinner', () => {
  let component: Spinner;
  let fixture: ComponentFixture<Spinner>;

  const loading = signal(false);

  const loadingServiceMock = {
    loading,
  };

  beforeEach(async () => {
    loading.set(false);

    await TestBed.configureTestingModule({
      imports: [Spinner],
      providers: [
        {
          provide: LoadingService,
          useValue: loadingServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Spinner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('creación', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('no debería mostrar el spinner cuando no está cargando', () => {
      const spinner = fixture.nativeElement.querySelector('mat-spinner');

      expect(spinner).toBeNull();
    });

    it('debería mostrar el spinner cuando está cargando', () => {
      loading.set(true);
      fixture.detectChanges();

      const spinner = fixture.nativeElement.querySelector('mat-spinner');

      expect(spinner).not.toBeNull();
    });

    it('debería ocultar el spinner cuando deja de cargar', () => {
      loading.set(true);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('mat-spinner')).not.toBeNull();

      loading.set(false);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('mat-spinner')).toBeNull();
    });
  });
});
