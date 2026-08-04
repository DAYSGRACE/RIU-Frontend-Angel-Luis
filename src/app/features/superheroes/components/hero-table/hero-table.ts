import { Component, computed, effect, input, output } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HeroDTO } from '../../interfaces/hero-dto.interface';
import { ColumnTableData } from '../../interfaces/column-table-data.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'hero-table',
  imports: [MatTableModule, MatProgressSpinnerModule, MatButton, MatPaginatorModule],
  templateUrl: './hero-table.html',
  styleUrl: './hero-table.scss',
})
export class HeroTable {
  data = input.required<HeroDTO[]>();
  isLoading = input.required<boolean>();
  columns = input.required<ColumnTableData[]>();
  displayedColumns = input.required<string[]>();

  pageIndex = input<number>(0);
  pageSize = input<number>(10);
  totalElements = input<number>(0);

  currentQuery = input<string>('');

  pageChange = output<PageEvent>();

  edit = output<HeroDTO>();
  delete = output<HeroDTO>();

  emptyDataMessage = computed(() => {
    if (this.isLoading()) {
      return 'Cargando datos';
    }

    return this.currentQuery().trim()
      ? `No hay datos para la búsqueda de "${this.currentQuery()}"`
      : 'No hay datos';
  });

}
