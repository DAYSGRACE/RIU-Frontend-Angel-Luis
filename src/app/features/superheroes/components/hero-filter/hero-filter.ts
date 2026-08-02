import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'hero-filter-input',
  imports: [MatFormField, MatInput, MatLabel],
  templateUrl: './hero-filter.html',
  styleUrl: './hero-filter.css',
})
export class HeroFilter {
  private destroyRef = inject(DestroyRef);

  debounceTime = input<number>(500);

  labelInput = input.required<string>();

  query = output<string>();

  private querySubject = new Subject<string>();

  constructor() {
    this.querySubject
      .pipe(
        debounceTime(this.debounceTime()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.query.emit(value);
      });
  }

  onInput(value: string): void {
    this.querySubject.next(value);
  }
}
