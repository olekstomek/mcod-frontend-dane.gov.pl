import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';

@Component({
  selector: 'app-favorite-datasets-tile',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, LocalizeRouterPipe],
  templateUrl: './favorite-datasets-tile.component.html',
})
export class FavoriteDatasetsTileComponent {
  datasetsCount = input<number>(0);
}
