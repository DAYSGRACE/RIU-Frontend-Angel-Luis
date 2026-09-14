import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { LoadingService } from '../services/loading-service';
import { loadingInterceptor } from './loading-interceptor';

describe('loadingInterceptor', () => {
  let loadingService: LoadingService;
  let next: HttpHandlerFn;

  beforeEach(() => {
    loadingService = {
      show: vi.fn(),
      hide: vi.fn(),
    } as unknown as LoadingService;

    next = vi.fn(() =>
      of({
        type: 0,
      } as HttpEvent<unknown>),
    );

    TestBed.configureTestingModule({
      providers: [
        {
          provide: LoadingService,
          useValue: loadingService,
        },
      ],
    });
  });

  it('debería mostrar el loading antes de ejecutar el request', () => {
    const request = new HttpRequest('GET', '/heroes');

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(request, next);
    });

    expect(loadingService.show).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledOnce();
  });

  it('debería ocultar el loading cuando el request finaliza', () => {
    const request = new HttpRequest('GET', '/heroes');

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(request, next).subscribe();
    });

    expect(loadingService.show).toHaveBeenCalledOnce();
    expect(loadingService.hide).toHaveBeenCalledOnce();
  });

  it('debería ocultar el loading cuando el request falla', () => {
    const request = new HttpRequest('GET', '/heroes');

    next = vi.fn(() => throwError(() => new Error('Error en el request')));

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(request, next).subscribe({
        error: () => undefined,
      });
    });

    expect(loadingService.show).toHaveBeenCalledOnce();
    expect(loadingService.hide).toHaveBeenCalledOnce();
  });
});
