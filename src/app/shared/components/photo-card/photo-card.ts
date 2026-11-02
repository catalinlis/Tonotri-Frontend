import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { AppLoaderComponent } from '../app-loader/loader.component';

export interface PhotoCardData {
  readonly url: string;
  readonly alt: string;
  readonly title: string;
  readonly country: string;
  readonly date: string;
}

@Component({
  selector: 'app-photo-card',
  imports: [AppLoaderComponent],
  templateUrl: './photo-card.html',
  styleUrl: './photo-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoCard {
  readonly loadedImages = signal<ReadonlySet<string>>(new Set());
  readonly photo = input.required<PhotoCardData>();
  readonly featured = input(false);
  readonly openPhoto = output<void>();
  readonly favoritePhoto = output<void>();

  markImageLoaded(image: string): void {
    this.loadedImages.update((loadedImages) => new Set([...loadedImages, image]));
  }
}
