import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading-service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService],
    });

    service = TestBed.inject(LoadingService);
  });

  describe('loading', () => {
    it('debería iniciar en false', () => {
      expect(service.loading()).toBe(false);
    });

    it('debería ser true después de mostrar el loading', () => {
      service.show();

      expect(service.loading()).toBe(true);
    });

    it('debería volver a false después de ocultar el loading', () => {
      service.show();
      service.hide();

      expect(service.loading()).toBe(false);
    });

    it('debería permanecer en true mientras haya requests pendientes', () => {
      service.show();
      service.show();

      service.hide();

      expect(service.loading()).toBe(true);

      service.hide();

      expect(service.loading()).toBe(false);
    });
  });

  describe('show', () => {
    it('debería incrementar la cantidad de requests pendientes', () => {
      service.show();
      expect(service.loading()).toBe(true);

      service.show();
      expect(service.loading()).toBe(true);
    });
  });

  describe('hide', () => {
    it('debería disminuir la cantidad de requests pendientes', () => {
      service.show();
      service.show();

      service.hide();

      expect(service.loading()).toBe(true);

      service.hide();

      expect(service.loading()).toBe(false);
    });
  });
});
