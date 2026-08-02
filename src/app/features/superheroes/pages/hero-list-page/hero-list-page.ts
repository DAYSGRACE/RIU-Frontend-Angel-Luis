import { Component, inject, signal } from '@angular/core';
import { HeroFilter } from '../../components/hero-filter/hero-filter';
import { HeroTable } from '../../components/hero-table/hero-table';
import { SuperHeroService } from '../../services/super-hero-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ColumnTableData } from '../../interfaces/column-table-data.interface';

@Component({
  selector: 'app-hero-list-page',
  imports: [HeroFilter, HeroTable],
  templateUrl: './hero-list-page.html',
  styleUrl: './hero-list-page.css',
})
export default class HeroListPage {
  heroSvc = inject(SuperHeroService);

  queryToSearch = signal<string>('');

  heroListResource = rxResource({
    defaultValue: {
      pages: 2,
      data: [],
      first: 1,
      items: 2,
      last: 2,
      next: 2,
      prev: null,
    },
    params: () => ({ query: this.queryToSearch() }),
    stream: ({ params }) => {
      return this.heroSvc.getHeroesPagination({ page: 1, perPage: 5, sort: {} }, params.query);
    },
  });

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
