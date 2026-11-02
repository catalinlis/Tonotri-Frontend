import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { SectionNavigation } from '../../../../shared/components/section-navigation/section-navigation';
import { FEATURED_COUNTRIES } from '../../featured-countries';
import { Overview } from '../../components/overview/overview';
import { Posts, CountryPost } from '../../components/posts/posts';
import { Photos, CountryPhoto } from '../../components/photos/photos';
import { Reviews } from '../../components/reviews/reviews';
import { ProfileReview } from '../../../../shared/components/review-card/review-card';
import { createMockOverviewData } from '../../mock-overview-data';
import { createMockPhotos } from '../../mock-photos';

@Component({
  selector: 'app-country-overview-page',
  imports: [RouterLink, SectionNavigation, Overview, Posts, Photos, Reviews],
  templateUrl: './country-overview-page.html',
  styleUrl: './country-overview-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryOverviewPage {
  private readonly route = inject(ActivatedRoute);

  readonly posts = input<readonly CountryPost[]>();
  readonly photos = input<readonly CountryPhoto[]>();
  readonly reviews = input<readonly ProfileReview[]>();
  readonly description = input('');

  readonly countrySlug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('countrySlug') ?? '')),
    { initialValue: '' },
  );

  readonly activeSection = toSignal(
    this.route.data.pipe(map((data) => data['section'] as string ?? 'overview')),
    { initialValue: 'overview' },
  );

  readonly countryName = computed(() =>
    this.countrySlug()
      .split('-')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  );

  readonly countryImage = computed(
    () =>
      FEATURED_COUNTRIES.find((country) => country.slug === this.countrySlug())?.image ??
      'assets/earth.jpg',
  );

  readonly overviewMockData = computed(() =>
    createMockOverviewData(this.countryName(), this.countrySlug(), this.countryImage()),
  );

  readonly countryPhotos = computed(() =>
    this.photos() ?? createMockPhotos(this.countryName(), this.countrySlug(), this.countryImage()),
  );

  readonly countryPosts = computed(() => this.posts() ?? this.overviewMockData().posts);
  readonly countryReviews = computed(() => this.reviews() ?? this.overviewMockData().reviews);

  readonly countrySections = computed(() => {
    const countryLink = `/countries/${this.countrySlug()}`;
    const activeSection = this.activeSection();

    return [
      { label: 'Overview', link: `${countryLink}/overview`, active: activeSection === 'overview' },
      { label: 'Posts', link: `${countryLink}/posts`, active: activeSection === 'posts' },
      { label: 'Photos', link: `${countryLink}/photos`, active: activeSection === 'photos' },
      { label: 'Reviews', link: `${countryLink}/reviews`, active: activeSection === 'reviews' },
    ];
  });
}
