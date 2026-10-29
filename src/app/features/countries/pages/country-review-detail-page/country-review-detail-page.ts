import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-country-review-detail-page',
  imports: [RouterLink],
  templateUrl: './country-review-detail-page.html',
  styleUrl: './country-review-detail-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryReviewDetailPage {
  private readonly route = inject(ActivatedRoute);

  readonly countrySlug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('countrySlug') ?? '')),
    { initialValue: '' },
  );
  readonly reviewId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('reviewId') ?? '')),
    { initialValue: '' },
  );
  readonly countryName = computed(() =>
    this.countrySlug()
      .split('-')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  );
}
