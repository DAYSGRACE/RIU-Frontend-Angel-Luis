import { TestBed } from '@angular/core/testing';

import { SuperHeroService } from './super-hero-service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HeroDTO, HeroDTOCreation } from '../interfaces/hero-dto.interface';
import {
  PaginationRequestDTO,
  PaginationResponseDTO,
} from '../../../core/interfaces/http-pagination.interface';

describe('SuperHeroService', () => {
  let service: SuperHeroService;
  let httpController: HttpTestingController;

  const BASE_URL = '/api/heroes';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SuperHeroService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(SuperHeroService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('Debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('getHeroById', () => {
    it('debería obtener un héroe por su id', () => {
      const heroId = 'jdkf823';

      const hero: HeroDTO = {
        id: heroId,
        name: 'Superman',
        realName: 'Clark Kent',
        power: 38200,
        intelligence: 4700,
        universe: 'RTJ-8',
      };

      service.getHeroById(heroId).subscribe((response) => {
        expect(response).toEqual(hero);
      });

      const request = httpController.expectOne((req) => req.url === `${BASE_URL}/${heroId}`);

      expect(request.request.method).toBe('GET');

      request.flush(hero);
    });

    it('debería propagar un error 404', () => {
      const heroId = 'ydfskj';

      service.getHeroById(heroId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const request = httpController.expectOne(`${BASE_URL}/${heroId}`);

      request.flush(
        {
          error: 'Not Found',
        },
        {
          status: 404,
          statusText: 'Not Found',
        },
      );
    });
  });

  describe('getHeroesPagination', () => {
    const paginationResponse: PaginationResponseDTO<HeroDTO> = {
      pages: 2,
      data: [],
      first: 1,
      items: 2,
      last: 2,
      next: 2,
      prev: null,
    };

    const paginationRequest: PaginationRequestDTO = {
      page: 1,
      perPage: 1,
      sort: {
        id: '+',
      },
    };

    it('debería obtener una lista paginada de héroes', () => {
      service.getHeroesPagination(paginationRequest).subscribe((heroResponse) => {
        expect(heroResponse).toEqual(paginationResponse);
      });

      const request = httpController.expectOne((req) => req.url === BASE_URL);

      expect(request.request.method).toBe('GET');
      expect(request.request.params.get('_page')).toBe('1');
      expect(request.request.params.get('_per_page')).toBe('1');
      expect(request.request.params.get('_sort')).toBe('+id');

      request.flush(paginationResponse);
    });

    it('debería filtrar por nombre', () => {
      service.getHeroesPagination(paginationRequest, 'Batman').subscribe((heroResponse) => {
        expect(heroResponse).toEqual(paginationResponse);
      });

      const request = httpController.expectOne((req) => req.url === BASE_URL);

      expect(request.request.method).toBe('GET');
      expect(request.request.params.get('_page')).toBe('1');
      expect(request.request.params.get('_per_page')).toBe('1');
      expect(request.request.params.get('_sort')).toBe('+id');
      expect(request.request.params.get('name:contains')).toBe('Batman');

      request.flush(paginationResponse);
    });
  });

  describe('createHero', () => {
    const heroCreation: HeroDTOCreation = {
      name: 'Spider-Man',
      realName: 'Peter Parker',
      power: 800000,
      intelligence: 1281900,
      universe: 'ULTIMATE',
    };

    it('debería crear un héroe', () => {
      const heroResponse: HeroDTO = {
        id: 'fff8300',
        ...heroCreation,
      };

      service.createHero(heroCreation).subscribe((response) => {
        expect(response).toEqual(heroResponse);
      });

      const request = httpController.expectOne(BASE_URL);

      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual(heroCreation);

      request.flush(heroResponse);
    });

    it('debería devolver un error de conexión al crear un héroe', () => {
      service.createHero(heroCreation).subscribe({
        error: (error: Error) => {
          expect(error.message).toBe(
            'No se logro crear el héroe, se perdio la conexión con el servidor, pruebe en otro momento',
          );
        },
      });

      const request = httpController.expectOne(BASE_URL);

      expect(request.request.method).toBe('POST');

      request.flush(null, {
        status: 0,
        statusText: 'Unknown Error',
      });
    });

    it('debería devolver un error inesperado al crear un héroe', () => {
      service.createHero(heroCreation).subscribe({
        error: (error: Error) => {
          expect(error.message).toBe('No se logro crear el héroe, ocurrio un error inesperado');
        },
      });

      const request = httpController.expectOne(BASE_URL);

      expect(request.request.method).toBe('POST');

      request.flush(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });

  describe('editHero', () => {
    const heroId = 'c83Y8d';

    const heroUpdate: HeroDTOCreation = {
      name: 'Batman',
      realName: 'Bruce Wayne',
      power: 1000,
      intelligence: 100000000,
      universe: 'RTJ-47',
    };

    it('debería actualizar un héroe', () => {
      const heroResponse: HeroDTO = {
        id: heroId,
        ...heroUpdate,
      };

      service.editHero(heroUpdate, heroId).subscribe((response) => {
        expect(response).toEqual(heroResponse);
      });

      const request = httpController.expectOne(`${BASE_URL}/${heroId}`);

      expect(request.request.method).toBe('PUT');
      expect(request.request.body).toEqual(heroUpdate);

      request.flush(heroResponse);
    });

    it('debería devolver un error de conexión al editar un héroe', () => {
      service.editHero(heroUpdate, heroId).subscribe({
        error: (error: Error) => {
          expect(error.message).toBe(
            'No se logro editar el héroe, se perdio la conexión con el servidor, pruebe en otro momento',
          );
        },
      });

      const request = httpController.expectOne(`${BASE_URL}/${heroId}`);

      expect(request.request.method).toBe('PUT');

      request.flush(null, {
        status: 0,
        statusText: 'Unknown Error',
      });
    });

    it('debería devolver un error inesperado al editar un héroe', () => {
      service.editHero(heroUpdate, heroId).subscribe({
        error: (error: Error) => {
          expect(error.message).toBe('No se logro editar el héroe, ocurrio un error inesperado');
        },
      });

      const request = httpController.expectOne(`${BASE_URL}/${heroId}`);

      expect(request.request.method).toBe('PUT');

      request.flush(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });

  describe('deleteHero', () => {
    const heroId = 'SA_PUbVgqds';

    const responseExpected: HeroDTO = {
      name: 'La Mole',
      power: 7000000,
      intelligence: 777,
      realName: 'Ben Grimm',
      universe: 'ULTIMATE',
      id: heroId,
    };

    it('debería eliminar un héroe', () => {
      service.deleteHero(heroId).subscribe({
        next: (response) => {
          expect(response).toEqual(responseExpected);
        },
      });

      const request = httpController.expectOne(`${BASE_URL}/${heroId}`);

      expect(request.request.method).toBe('DELETE');

      request.flush(responseExpected);
    });

    it('debería devolver un error de conexión al eliminar un héroe', () => {
      service.deleteHero(heroId).subscribe({
        error: (error: Error) => {
          expect(error.message).toBe(
            'No se logro eliminar el héroe, se perdio la conexión con el servidor, pruebe en otro momento',
          );
        },
      });

      const request = httpController.expectOne(`${BASE_URL}/${heroId}`);

      expect(request.request.method).toBe('DELETE');

      request.flush(null, {
        status: 0,
        statusText: 'Unknown Error',
      });
    });

    it('debería devolver un error inesperado al eliminar un héroe', () => {
      service.deleteHero(heroId).subscribe({
        error: (error: Error) => {
          expect(error.message).toBe('No se logro eliminar el héroe, ocurrio un error inesperado');
        },
      });

      const request = httpController.expectOne(`${BASE_URL}/${heroId}`);

      expect(request.request.method).toBe('DELETE');

      request.flush(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });

  describe('checkNameIfIsUsed', () => {
    it('debería devolver true cuando el nombre ya está siendo utilizado', () => {
      const heroes: HeroDTO[] = [
        {
          id: 'hero-1',
          name: 'Superman',
          realName: 'Clark Kent',
          power: 38200,
          intelligence: 4700,
          universe: 'RTJ-8',
        },
      ];

      service.checkNameIfIsUsed('Superman').subscribe((isUsed) => {
        expect(isUsed).toBe(true);
      });

      const request = httpController.expectOne((req) => req.url === BASE_URL);

      expect(request.request.method).toBe('GET');
      expect(request.request.params.get('name:eq')).toBe('Superman');

      request.flush(heroes);
    });

    it('debería devolver false cuando el nombre no está siendo utilizado', () => {
      service.checkNameIfIsUsed('Superman').subscribe((isUsed) => {
        expect(isUsed).toBe(false);
      });

      const request = httpController.expectOne((req) => req.url === BASE_URL);

      expect(request.request.method).toBe('GET');
      expect(request.request.params.get('name:eq')).toBe('Superman');

      request.flush([]);
    });

    it('debería ignorar el héroe cuyo id coincide con excludedId', () => {
      const heroes: HeroDTO[] = [
        {
          id: 'hero-1',
          name: 'Superman',
          realName: 'Clark Kent',
          power: 38200,
          intelligence: 4700,
          universe: 'RTJ-8',
        },
      ];

      service.checkNameIfIsUsed('Superman', 'hero-1').subscribe((isUsed) => {
        expect(isUsed).toBe(false);
      });

      const request = httpController.expectOne((req) => req.url === BASE_URL);

      expect(request.request.method).toBe('GET');
      expect(request.request.params.get('name:eq')).toBe('Superman');

      request.flush(heroes);
    });

    it('debería devolver true cuando existe otro héroe con el mismo nombre', () => {
      const heroes: HeroDTO[] = [
        {
          id: 'hero-1',
          name: 'Superman',
          realName: 'Clark Kent',
          power: 38200,
          intelligence: 4700,
          universe: 'RTJ-8',
        },
        {
          id: 'hero-2',
          name: 'Superman',
          realName: 'Otro héroe',
          power: 100,
          intelligence: 100,
          universe: 'RTJ-9',
        },
      ];

      service.checkNameIfIsUsed('Superman', 'hero-1').subscribe((isUsed) => {
        expect(isUsed).toBe(true);
      });

      const request = httpController.expectOne((req) => req.url === BASE_URL);

      expect(request.request.method).toBe('GET');
      expect(request.request.params.get('name:eq')).toBe('Superman');

      request.flush(heroes);
    });

    it('debería eliminar los espacios del nombre antes de consultar', () => {
      service.checkNameIfIsUsed('  Superman  ').subscribe((isUsed) => {
        expect(isUsed).toBe(false);
      });

      const request = httpController.expectOne((req) => req.url === BASE_URL);

      expect(request.request.method).toBe('GET');
      expect(request.request.params.get('name:eq')).toBe('Superman');

      request.flush([]);
    });
  });
});
