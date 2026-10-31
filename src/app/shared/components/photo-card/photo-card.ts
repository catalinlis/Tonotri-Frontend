import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface PhotoCardData {
  readonly url: string;
  readonly alt: string;
  readonly title: string;
  readonly country: string;
  readonly date: string;
}

@Component({
  selector: 'app-photo-card',
  templateUrl: './photo-card.html',
  styleUrl: './photo-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoCard {
  readonly photo = input.required<PhotoCardData>();
  readonly featured = input(false);
  readonly openPhoto = output<void>();
  readonly favoritePhoto = output<void>();
}
