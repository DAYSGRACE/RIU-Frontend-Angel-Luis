import { Component, DestroyRef, inject } from '@angular/core';
import { HeroForm } from '../../components/hero-form/hero-form';
import { HERO_FORM_TEMPLATE } from '../../configs/hero-form.config';
import { HeroMapper } from '../../mappers/hero.mapper';
import { SuperHeroService } from '../../services/super-hero-service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialog } from '../../../../shared/components/message-dialog/message-dialog';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-hero-create-page',
  imports: [HeroForm],
  templateUrl: './hero-create-page.html',
  styleUrl: './hero-create-page.scss',
})
export default class HeroCreatePage {
  protected readonly heroFormTemplate = HERO_FORM_TEMPLATE;
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly heroSvc = inject(SuperHeroService);
  private readonly dialog = inject(MatDialog);

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

        dialogRef
          .afterClosed()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.router.navigate(['/']);
          });
      },
      error: (error: Error) => {
        const dialogRef = this.dialog.open(ConfirmDialog, {
          data: {
            title: 'Error',
            message: `${error.message}, se redirigira a la página principal`,
          },
        });
        dialogRef
          .afterClosed()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((shouldNavigate: boolean) => {
            if (shouldNavigate) this.router.navigate(['/']);
          });
      },
    });
  }
}
