import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  imports: [RouterLink],
  templateUrl: './review-card.html',
  styleUrl: './review-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCard {
  readonly review = input.required<ProfileReview>();
  readonly eager = input(false);
  readonly reviewLink = input<readonly (string | number)[]>();
  readonly editReview = output<number>();
}
