import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { HeroDTO } from '../../interfaces/hero-dto.interface';
import { ColumnTableData } from '../../interfaces/column-table-data.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'hero-table',
  imports: [
    MatTableModule,
    MatProgressSpinnerModule,
    MatButton,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './hero-table.html',
  styleUrl: './hero-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroTable {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

  onPageJump(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const targetPage = Number(inputElement.value) - 1;

    if (!this.paginator) return;

    const totalPages = this.paginator.getNumberOfPages();

    if (targetPage >= 0 && targetPage < totalPages) {
      this.pageChange.emit({
        pageIndex: targetPage,
        pageSize: this.pageSize(),
        length: this.totalElements(),
        previousPageIndex: this.pageIndex(),
      });
    } else {
      inputElement.value = (this.pageIndex() + 1).toString();
    }
  }
}
