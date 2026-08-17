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
      const request = httpController.expectOne((req) => req.url.includes('heroes'));
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

      expect(request.request.params.get('name:contains')).toBe('Batman');
      request.flush(paginationResponse);
    });
  });

  describe('createHero', () => {
    it('debería crear un héroe', () => {
      const heroCreation: HeroDTOCreation = {
        name: 'Spider-Man',
        realName: 'Peter Parker',
        power: 800000,
        intelligence: 1281900,
        universe: 'ULTIMATE',
      };

      const heroResponse = {
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
  });
  describe('editHero', () => {
    it('debería actualizar un héroe', () => {
      const heroId = 'c83Y8d';
      const heroUpdate: HeroDTOCreation = {
        name: 'Batman',
        realName: 'Bruce Wayne',
        power: 1000,
        intelligence: 100000000,
        universe: 'RTJ-47',
      };

      const heroResponse = {
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
  });

  describe('deleteHero', () => {
    it('debería eliminar un héroe', () => {
      const heroId = 'SA_PUbVgqds';

      const responseExpected: HeroDTO = {
        name: 'La Mole',
        power: 7000000,
        intelligence: 777,
        realName: 'Ben Grimm',
        universe: 'ULTIMATE',
        id: 'SA_PUbVgqds',
      };

      service.deleteHero(heroId).subscribe({
        next: (response) => expect(response).toEqual(responseExpected),
      });

      const request = httpController.expectOne(`${BASE_URL}/${heroId}`);

      expect(request.request.method).toBe('DELETE');

      request.flush(responseExpected);
    });
  });
});
