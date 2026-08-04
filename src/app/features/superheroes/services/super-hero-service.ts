import { inject, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  PaginationRequestDTO,
  PaginationResponseDTO,
} from '../../../core/interfaces/http-pagination.interface';
import { HeroDTO, HeroDTOCreation } from '../interfaces/hero-dto.interface';
import { Observable } from 'rxjs';

@Service()
export class SuperHeroService {
  private httpClient = inject(HttpClient);

  private URL = 'http://localhost:8080';
  private URL_HEROES = `${this.URL}/heroes`;

  getHeroesPagination(pagination: PaginationRequestDTO, queryStr?: string) {
    let params = new HttpParams();
    params = params.set('_page', pagination.page);
    params = params.set('_per_page', pagination.perPage);
    if (pagination.sort && Object.keys(pagination.sort).length > 0) {
      Object.entries(pagination.sort).forEach(([key, value]) => {
        params = params.set('_sort', `${value}${key}`);
      });
    }
    if (queryStr && queryStr.trim().length > 0) {
      params = params.set('name:contains', queryStr);
    }
    return this.httpClient.get<PaginationResponseDTO<HeroDTO>>(`${this.URL_HEROES}`, {
      params,
    });
  }

  getHeroById(id: string): Observable<HeroDTO> {
    return this.httpClient.get<HeroDTO>(`${this.URL_HEROES}/${id}`);
  }

  createHero(heroDTO: HeroDTOCreation): Observable<HeroDTO> {
    return this.httpClient.post<HeroDTO>(`${this.URL_HEROES}`, heroDTO);
  }

  editHero(heroDTO: HeroDTOCreation, id: string): Observable<HeroDTO> {
    return this.httpClient.put<HeroDTO>(`${this.URL_HEROES}/${id}`, heroDTO);
  }

  deleteHero(id: string): Observable<HeroDTO> {
    return this.httpClient.delete<HeroDTO>(`${this.URL_HEROES}/${id}`);
  }
}
