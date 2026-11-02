import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
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
import { AppLoaderComponent } from '../../../../shared/components/app-loader/loader.component';

@Component({
  selector: 'app-country-overview-page',
  imports: [RouterLink, SectionNavigation, Overview, Posts, Photos, Reviews, AppLoaderComponent],
  templateUrl: './country-overview-page.html',
  styleUrl: './country-overview-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryOverviewPage {
  private readonly route = inject(ActivatedRoute);
  readonly loadedHeaderImages = signal<ReadonlySet<string>>(new Set());

  readonly posts = input<readonly CountryPost[]>();
  readonly photos = input<readonly CountryPhoto[]>();
  readonly reviews = input<readonly ProfileReview[]>();
  readonly description = input('');

  readonly countrySlug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('countrySlug') ?? '')),
    { initialValue: '' },
  );

  readonly activeSection = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('section') ?? 'overview')),
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

  markHeaderImageLoaded(image: string): void {
    this.loadedHeaderImages.update((loadedImages) => {
      if (loadedImages.has(image)) return loadedImages;
      return new Set([...loadedImages, image]);
    });
  }

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
