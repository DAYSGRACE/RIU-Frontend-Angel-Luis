import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  imports: [MatProgressSpinner],
  templateUrl: './spinner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Spinner {
  loadingService = inject(LoadingService);
}
