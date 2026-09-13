import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SuperHeroService } from '../../services/super-hero-service';
import { HeroForm } from '../../components/hero-form/hero-form';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { HeroMapper } from '../../mappers/hero.mapper';
import { MessageDialog } from '../../../../shared/components/message-dialog/message-dialog';
import { HeroDTO, HeroDTOCreation } from '../../interfaces/hero-dto.interface';
import { HeroRouteData } from '../../interfaces/HeroRouteData';

@Component({
  selector: 'app-hero-edit-page',
  imports: [HeroForm],
  templateUrl: './hero-edit-page.html',
  styleUrl: './hero-edit-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HeroEditPage {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly heroSvc = inject(SuperHeroService);
  private readonly dialog = inject(MatDialog);

  private readonly heroDataDTO: HeroDTO = (this.route.snapshot.data as HeroRouteData).hero;

  protected readonly heroData = this.heroDataDTO as HeroDTOCreation;

  openDialogToConfirmEdit(hero: any) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Edición de héroe',
        message: '¿Está seguro de editarlo?',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((shouldEdit: boolean) => {
        if (shouldEdit) {
          this.editHero(hero);
        }
      });
  }

  editHero(hero: any) {
    const heroModified = HeroMapper.toDTOCreation(hero);
    this.heroSvc.editHero(heroModified, this.heroDataDTO.id).subscribe({
      next: () => {
        const dialogRef = this.dialog.open(MessageDialog, {
          data: {
            title: 'Edición finalizada con éxito',
            message: 'Se ha modificado al héroe correctamente',
          },
        });
        dialogRef
          .afterClosed()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.router.navigate(['/heroes']);
          });
      },
      error: (error: Error) => {
        const dialogRef = this.dialog.open(MessageDialog, {
          data: {
            title: 'Error al editar',
            message: `${error.message}, se redirigira a la página principal`,
          },
        });
        dialogRef
          .afterClosed()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.router.navigate(['/heroes']);
          });
      },
    });
  }
}
