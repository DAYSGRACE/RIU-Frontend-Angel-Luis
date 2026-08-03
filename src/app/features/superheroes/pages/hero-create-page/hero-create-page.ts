import { Component, inject } from '@angular/core';
import { HeroForm } from '../../components/hero-form/hero-form';
import { HERO_FORM_TEMPLATE } from '../../configs/hero-form.config';
import { HeroMapper } from '../../mappers/hero.mapper';
import { SuperHeroService } from '../../services/super-hero-service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialog } from '../../../../shared/components/message-dialog/message-dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-create-page',
  imports: [HeroForm],
  templateUrl: './hero-create-page.html',
  styleUrl: './hero-create-page.scss',
})
export default class HeroCreatePage {
  heroFormTemplate = HERO_FORM_TEMPLATE;

  router = inject(Router);

  heroSvc = inject(SuperHeroService);

  dialog = inject(MatDialog);

  createHero(formData: { [key: string]: unknown }): void {
    const heroDTOCreation = HeroMapper.toDTO(formData);
    this.heroSvc.createHero(heroDTOCreation).subscribe({
      next: (_data) => {
        const dialogRef = this.dialog.open(MessageDialog, {
          data: {
            title: 'Éxito',
            message: 'El héroe fue creado correctamente',
          },
        });

        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/']);
        });
      },
    });
  }
}
