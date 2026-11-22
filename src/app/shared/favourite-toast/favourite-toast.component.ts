import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FavouriteToastService } from '@app/services/favourite-intent/favourite-toast.service';

@Component({
  selector: 'app-favourite-toast',
  standalone: true, // TODO(v22): usunąć (domyślne od v19)
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './favourite-toast.component.html',
  styleUrl: './favourite-toast.component.scss',
})
export class FavouriteToastComponent {
  private readonly toastService = inject(FavouriteToastService);

  protected readonly toasts = this.toastService.toasts;

  protected dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
