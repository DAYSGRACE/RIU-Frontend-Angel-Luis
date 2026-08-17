import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { HeroFilter } from '../../components/hero-filter/hero-filter';
import { HeroTable } from '../../components/hero-table/hero-table';
import { SuperHeroService } from '../../services/super-hero-service';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ColumnTableData } from '../../interfaces/column-table-data.interface';
import { HeroDTO } from '../../interfaces/hero-dto.interface';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { COLUMNS_HERO_TABLE } from '../../configs/hero-table.config';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-hero-list-page',
  imports: [HeroFilter, HeroTable],
  templateUrl: './hero-list-page.html',
  styleUrl: './hero-list-page.scss',
})
export default class HeroListPage {
  protected readonly columnsTable: ColumnTableData[] = COLUMNS_HERO_TABLE;
  public readonly queryToSearch = signal<string>('');
  public readonly pageIndex = signal<number>(0);
  public readonly pageSize = signal<number>(10);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly heroSvc = inject(SuperHeroService);
  private dialog = inject(MatDialog);
  private readonly refreshResource = signal<number>(0);

  heroListResource = rxResource({
    params: () => ({
      query: this.queryToSearch(),
      refresh: this.refreshResource(),
      pageSize: this.pageSize(),
      pageIndex: this.pageIndex(),
    }),
    stream: ({ params }) => {
      return this.heroSvc.getHeroesPagination(
        { page: params.pageIndex + 1, perPage: params.pageSize, sort: {} },
        params.query,
      );
    },
  });

  private readonly queryToSearchEffect = effect(() => {
    this.queryToSearch();
    this.pageIndex.set(0);
  });

  managePaginationEvents(events: PageEvent) {
    const { pageSize, pageIndex } = events;
    this.pageSize.set(pageSize);
    this.pageIndex.set(pageIndex);
  }

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
    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((shouldDelete: boolean) => {
        if (shouldDelete) {
          this.heroSvc
            .deleteHero(hero.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              complete: () => {
                this.refreshResource.update((curr) => curr + 1);
                this.pageIndex.set(0);
              },
            });
        }
      });
  }
}
