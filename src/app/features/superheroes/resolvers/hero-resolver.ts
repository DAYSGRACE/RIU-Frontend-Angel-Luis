import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';

import { HeroDTO } from '../interfaces/hero-dto.interface';
import { SuperHeroService } from '../services/super-hero-service';

export const heroResolver: ResolveFn<HeroDTO> = (route) => {
  const router = inject(Router);
  const heroService = inject(SuperHeroService);

  return heroService.getHeroById(route.params['id']).pipe(
    catchError(() => {
      router.navigate(['/heroes']);
      return EMPTY;
    }),
  );
};
