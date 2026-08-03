import { Component, inject, signal } from '@angular/core';
import { HeroFilter } from '../../components/hero-filter/hero-filter';
import { HeroTable } from '../../components/hero-table/hero-table';
import { SuperHeroService } from '../../services/super-hero-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ColumnTableData } from '../../interfaces/column-table-data.interface';
import { HeroDTO } from '../../interfaces/hero-dto.interface';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-hero-list-page',
  imports: [HeroFilter, HeroTable],
  templateUrl: './hero-list-page.html',
  styleUrl: './hero-list-page.scss',
})
export default class HeroListPage {
  router = inject(Router);
  heroSvc = inject(SuperHeroService);

  dialog = inject(MatDialog);

  queryToSearch = signal<string>('');
  refreshResource = signal<number>(0);

  heroListResource = rxResource({
    params: () => ({ query: this.queryToSearch(), refresh: this.refreshResource() }),
    stream: ({ params }) => {
      return this.heroSvc.getHeroesPagination({ page: 1, perPage: 5, sort: {} }, params.query);
    },
  });

  editHero(hero: HeroDTO) {
    this.router.navigate([`/heroes/edit/${hero.id}`]);
  }

  deleteHero(hero: HeroDTO) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Eliminar héroe',
        message: '¿Esta seguro de eliminar al héroe?',
      },
    });
    dialogRef.afterClosed().subscribe((shouldDelete) => {
      if (shouldDelete) {
        this.heroSvc.deleteHero(hero.id).subscribe({
          complete: () => {
            this.refreshResource.update((curr) => curr + 1);
          },
        });
      }
    });
  }

  columnsTable: ColumnTableData[] = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'name',
      label: 'Nombre de héroe',
    },
    {
      key: 'realName',
      label: 'Nombre real',
    },
    {
      key: 'power',
      label: 'Poder',
    },
    {
      key: 'intelligence',
      label: 'Inteligencia',
    },
    {
      key: 'universe',
      label: 'Universo',
    },
  ];
}
