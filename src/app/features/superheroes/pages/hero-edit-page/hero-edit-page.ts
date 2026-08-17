import { Component, computed, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { SuperHeroService } from '../../services/super-hero-service';
import { HeroForm } from '../../components/hero-form/hero-form';
import { HERO_FORM_TEMPLATE } from '../../configs/hero-form.config';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { HeroMapper } from '../../mappers/hero.mapper';
import { MessageDialog } from '../../../../shared/components/message-dialog/message-dialog';
import { HeroDTO } from '../../interfaces/hero-dto.interface';

@Component({
  selector: 'app-hero-edit-page',
  imports: [HeroForm],
  templateUrl: './hero-edit-page.html',
  styleUrl: './hero-edit-page.scss',
})
export default class HeroEditPage {
  protected readonly heroFormTemplate = HERO_FORM_TEMPLATE;
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly heroSvc = inject(SuperHeroService);
  private readonly dialog = inject(MatDialog);
  private readonly hero = toSignal<HeroDTO>(
    this.route.data.pipe(map((data): HeroDTO => data['hero'])),
  );

  private readonly heroDataDTO = computed<HeroDTO>(() => {
    const hero = this.hero();
    if (hero === undefined) {
      this.router.navigate(['/heroes']);
      throw new Error('No se encontro al héroe');
    }
    return hero;
  });

  protected readonly heroData = computed<Record<string, unknown>>(() =>
    Object.fromEntries(Object.entries(this.heroDataDTO())),
  );

  openDialogToConfirmEdit(hero: { [key: string]: unknown }) {
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

  editHero(hero: { [key: string]: unknown }) {
    const heroModified = HeroMapper.toDTO(hero);
    this.heroSvc.editHero(heroModified, this.heroDataDTO().id).subscribe({
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
      error: () => {
        const dialogRef = this.dialog.open(MessageDialog, {
          data: {
            title: 'Error al editar',
            message: 'Hubo un problema al editar al héroe',
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
