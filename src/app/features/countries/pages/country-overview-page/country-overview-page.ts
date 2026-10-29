import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { SectionNavigation } from '../../../../shared/components/section-navigation/section-navigation';
import { FEATURED_COUNTRIES } from '../../featured-countries';

@Component({
  selector: 'app-country-overview-page',
  imports: [RouterLink, SectionNavigation],
  templateUrl: './country-overview-page.html',
  styleUrl: './country-overview-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryOverviewPage {
  private readonly route = inject(ActivatedRoute);

  readonly countrySlug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('countrySlug') ?? '')),
    { initialValue: '' },
  );

  readonly activeSection = toSignal(
    this.route.fragment.pipe(map((fragment) => fragment ?? 'overview')),
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

  readonly countrySections = computed(() => {
    const countryLink = `/countries/${this.countrySlug()}`;
    const activeSection = this.activeSection();

    return [
      { label: 'Overview', link: countryLink, active: activeSection === 'overview' },
      { label: 'Posts', link: countryLink, fragment: 'posts', active: activeSection === 'posts' },
      { label: 'Photos', link: countryLink, fragment: 'photos', active: activeSection === 'photos' },
      { label: 'Reviews', link: countryLink, fragment: 'reviews', active: activeSection === 'reviews' },
    ];
  });
}
