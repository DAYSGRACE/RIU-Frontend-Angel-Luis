import { Component, effect, input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HeroDTO } from '../../interfaces/hero-dto.interface';
import { ColumnTableData } from '../../interfaces/column-table-data.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'hero-table',
  imports: [MatTableModule, MatProgressSpinnerModule],
  templateUrl: './hero-table.html',
  styleUrl: './hero-table.css',
})
export class HeroTable {
  data = input.required<HeroDTO[]>();
  isLoading = input.required<boolean>();

  currentQuery = input<string>();

  dataSource = new MatTableDataSource<HeroDTO>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.data();
    });
  }

  displayedColumns: string[] = ['id', 'name', 'realName', 'power', 'intelligence', 'universe'];
  columns = input.required<ColumnTableData[]>();
}
