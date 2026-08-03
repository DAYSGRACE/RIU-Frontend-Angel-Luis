import { Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { SuperHeroService } from '../../services/super-hero-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { HeroForm } from '../../components/hero-form/hero-form';
import { HERO_FORM_TEMPLATE } from '../../configs/hero-form.config';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { HeroMapper } from '../../mappers/hero.mapper';
import { MessageDialog } from '../../../../shared/components/message-dialog/message-dialog';

@Component({
  selector: 'app-hero-edit-page',
  imports: [MatProgressSpinner, HeroForm],
  templateUrl: './hero-edit-page.html',
  styleUrl: './hero-edit-page.scss',
})
export default class HeroEditPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  heroSvc = inject(SuperHeroService);

  dialog = inject(MatDialog);

  heroId: Signal<string> = toSignal(this.route.params.pipe(map((params) => params['id'])), {
    initialValue: '',
  });

  heroFormTemplate = HERO_FORM_TEMPLATE;

  heroData = computed(() => {
    const val = this.heroResource.value();
    return val ? (val as unknown as Record<string, unknown>) : {};
  });

  heroResource = rxResource({
    params: () => ({ heroId: this.heroId() }),
    stream: ({ params }) => {
      return this.heroSvc.getHeroById(params.heroId);
    },
  });

  openDialogToConfirmEdit(hero: { [key: string]: unknown }) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Edición de héroe',
        message: '¿Está seguro de editarlo?',
      },
    });
    dialogRef.afterClosed().subscribe((shouldEdit) => {
      console.log(shouldEdit);
      if (shouldEdit) {
        this.editHero(hero);
      }
    });
  }

  editHero(hero: { [key: string]: unknown }) {
    const heroModified = HeroMapper.toDTO(hero);
    this.heroSvc.editHero(heroModified, this.heroId()).subscribe({
      next: () => {
        const dialogRef = this.dialog.open(MessageDialog, {
          data: {
            title: 'Edición finalizada con éxito',
            message: 'Se ha modificado al héroe correctamente',
          },
        });
        dialogRef.afterClosed().subscribe((shouldEdit) => {
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
        dialogRef.afterClosed().subscribe((shouldEdit) => {
          this.router.navigate(['/heroes']);
        });
      },
    });
  }
}
