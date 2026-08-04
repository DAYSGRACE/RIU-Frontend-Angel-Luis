import { computed, Service, Signal, signal } from '@angular/core';

@Service()
export class LoadingService {
  private requests = signal(0);

  readonly loading: Signal<boolean> = computed(() => this.requests() > 0);

  show(): void {
    this.requests.update((value) => value + 1);
  }

  hide(): void {
    this.requests.update((value) => value - 1);
  }
}
