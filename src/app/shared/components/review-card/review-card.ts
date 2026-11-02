import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppLoaderComponent } from '../app-loader/loader.component';

export interface ProfileReview {
  readonly id: number;
  readonly country: string;
  readonly countryCode: string;
  readonly location: string;
  readonly cities: readonly string[];
  readonly image: string;
  readonly imageAlt: string;
  readonly rating: number;
  readonly category: string;
  readonly title: string;
  readonly excerpt: string;
  readonly publishedAt: string;
  readonly dateLabel: string;
  readonly helpfulCount: number;
}

@Component({
  selector: 'app-review-card',
  imports: [RouterLink, AppLoaderComponent],
  templateUrl: './review-card.html',
  styleUrl: './review-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCard {
  readonly loadedImages = signal<ReadonlySet<string>>(new Set());
  readonly review = input.required<ProfileReview>();
  readonly eager = input(false);
  readonly reviewLink = input<readonly (string | number)[]>();
  readonly editReview = output<number>();

  markImageLoaded(image: string): void {
    this.loadedImages.update((loadedImages) => new Set([...loadedImages, image]));
  }
}
