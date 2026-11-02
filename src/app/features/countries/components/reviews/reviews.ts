import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { ProfileReview, ReviewCard } from '../../../../shared/components/review-card/review-card';
import { SectionDropdown } from '../section-dropdown/section-dropdown';

@Component({
  selector: 'app-country-reviews',
  imports: [ReviewCard, SectionDropdown],
  templateUrl: './reviews.html',
  styleUrls: ['../country-sections.css', './reviews.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Reviews {
  readonly countryName = input.required<string>();
  readonly countrySlug = input.required<string>();
  readonly reviews = input<readonly ProfileReview[]>([]);
  readonly selectedCity = signal('');
  readonly cities = computed(() => [...new Set(this.reviews().flatMap(review => review.cities))].sort((a, b) => a.localeCompare(b)));
  readonly activeCity = computed(() => this.cities().includes(this.selectedCity()) ? this.selectedCity() : '');
  readonly cityOptions = computed(() => [{ value: '', label: 'All cities' }, ...this.cities().map(city => ({ value: city, label: city }))]);
  readonly sortOptions = [{ value: 'latest', label: 'Latest first' }, { value: 'rating', label: 'Highest rated' }];

  selectSort(value: string): void {
    if (value === 'latest' || value === 'rating') this.sort.set(value);
  }
  readonly sort = signal<'latest' | 'rating'>('latest');
  readonly visibleReviews = computed(() => {
    return this.reviews()
      .filter(review => !this.activeCity() || review.cities.includes(this.activeCity()))
      .slice()
      .sort((a, b) => this.sort() === 'rating'
        ? b.rating - a.rating
        : b.publishedAt.localeCompare(a.publishedAt));
  });
}
