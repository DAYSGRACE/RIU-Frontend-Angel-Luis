import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { HeroForm } from '../../components/hero-form/hero-form';
import { SuperHeroService } from '../../services/super-hero-service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialog } from '../../../../shared/components/message-dialog/message-dialog';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeroDTOCreation } from '../../interfaces/hero-dto.interface';

@Component({
  selector: 'app-hero-create-page',
  imports: [HeroForm],
  templateUrl: './hero-create-page.html',
  styleUrl: './hero-create-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HeroCreatePage {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly heroSvc = inject(SuperHeroService);
  private readonly dialog = inject(MatDialog);

  createHero(formData: HeroDTOCreation): void {
    this.heroSvc.createHero(formData).subscribe({
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
        const dialogRef = this.dialog.open(MessageDialog, {
          data: {
            title: 'Error',
            message: `${error.message}, se redirigira a la página principal`,
          },
        });
        dialogRef
          .afterClosed()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.router.navigate(['/']);
          });
      },
    });
  }
}
