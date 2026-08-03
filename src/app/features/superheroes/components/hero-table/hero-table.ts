import { Component, computed, effect, input, output } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HeroDTO } from '../../interfaces/hero-dto.interface';
import { ColumnTableData } from '../../interfaces/column-table-data.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'hero-table',
  imports: [MatTableModule, MatProgressSpinnerModule, MatButton],
  templateUrl: './hero-table.html',
  styleUrl: './hero-table.scss',
})
export class HeroTable {
  data = input.required<HeroDTO[]>();
  isLoading = input.required<boolean>();
  columns = input.required<ColumnTableData[]>();
  displayedColumns = input.required<string[]>();

  edit = output<HeroDTO>();
  delete = output<HeroDTO>();

  emptyDataMessage = computed(() => {
    return (this.currentQuery()?.trim()?.length ?? 0 > 0)
      ? `No hay datos para la busqueda de "${this.currentQuery()}"`
      : `No hay datos`;
  });

  currentQuery = input<string>();

  dataSource = new MatTableDataSource<HeroDTO>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.data();
    });
  }

}
