import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

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
  templateUrl: './review-card.html',
  styleUrl: './review-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCard {
  readonly review = input.required<ProfileReview>();
  readonly eager = input(false);
  readonly editReview = output<number>();
}
