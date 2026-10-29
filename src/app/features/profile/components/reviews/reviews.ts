import { ChangeDetectionStrategy, Component, HostListener, computed, output, signal } from '@angular/core';

type ReviewFilter = 'all' | 'countries' | 'cities';
type ReviewSort = 'latest' | 'rating';

interface ProfileReview {
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
  selector: 'app-reviews',
  imports: [],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Reviews {
  readonly writeReview = output<void>();
  readonly editReview = output<number>();

  readonly reviews: readonly ProfileReview[] = [
    {
      id: 1,
      country: 'Italy',
      countryCode: 'IT',
      location: 'Rome, Florence & Amalfi Coast',
      cities: ['Rome', 'Florence', 'Amalfi'],
      image: 'assets/coloseum.jpg',
      imageAlt: 'The Colosseum in Rome at sunset',
      rating: 4.9,
      category: 'Culture & food',
      title: 'A country that rewards every unhurried moment',
      excerpt:
        'The best parts of Italy happened between the landmarks: quiet lanes, long local dinners, and a train ride with no plan.',
      publishedAt: '2026-10-22',
      dateLabel: 'Oct 22, 2026',
      helpfulCount: 18,
    },
    {
      id: 2,
      country: 'Romania',
      countryCode: 'RO',
      location: 'Brasov & Piatra Craiului',
      cities: ['Brasov', 'Zarnesti'],
      image: 'assets/mountain.jpg',
      imageAlt: 'Green mountain ridges under a clear sky',
      rating: 4.8,
      category: 'Nature & hiking',
      title: 'Carpathian trails and a welcome that felt like home',
      excerpt:
        'A balanced week of mountain air, old-town evenings, and family-run stays where every recommendation felt personal.',
      publishedAt: '2026-10-11',
      dateLabel: 'Oct 11, 2026',
      helpfulCount: 11,
    },
    {
      id: 3,
      country: 'United States',
      countryCode: 'US',
      location: 'New York City',
      cities: ['New York City'],
      image: 'assets/new-york.jpg',
      imageAlt: 'New York City skyline beside the water',
      rating: 4.6,
      category: 'City break',
      title: 'The city makes more sense one neighborhood at a time',
      excerpt:
        'The skyline is unforgettable, but the small bakeries, waterfront walks, and neighborhood energy made the trip.',
      publishedAt: '2026-09-18',
      dateLabel: 'Sep 18, 2026',
      helpfulCount: 7,
    },
    {
      id: 4,
      country: 'Portugal',
      countryCode: 'PT',
      location: 'Lisbon & Sintra',
      cities: ['Lisbon', 'Sintra'],
      image: 'assets/explore1.jpg',
      imageAlt: 'Colorful travel photographs from a coastal city',
      rating: 4.7,
      category: 'Coast & culture',
      title: 'Golden light, tiled streets, and room to wander',
      excerpt:
        'Notes from a slow week between Lisbon viewpoints, neighborhood cafes, and a day among the hills of Sintra.',
      publishedAt: '2026-10-27',
      dateLabel: 'Oct 27, 2026',
      helpfulCount: 4,
    },
  ];

  readonly activeFilter = signal<ReviewFilter>('all');
  readonly selectedLocation = signal('');
  readonly activeLocationMenu = signal<Exclude<ReviewFilter, 'all'> | null>(null);
  readonly locationMenuOpensUp = signal(false);
  readonly sortMenuOpen = signal(false);
  readonly sortMenuOpensUp = signal(false);
  readonly searchTerm = signal('');
  readonly sortBy = signal<ReviewSort>('latest');

  readonly averageRating = computed(() => {
    if (!this.reviews.length) return '0.0';

    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / this.reviews.length).toFixed(1);
  });
  readonly helpfulVotes = computed(() =>
    this.reviews.reduce((sum, review) => sum + review.helpfulCount, 0),
  );
  readonly countryOptions = [...new Set(this.reviews.map((review) => review.country))].sort(
    (a, b) => a.localeCompare(b),
  );
  readonly cityOptions = [...new Set(this.reviews.flatMap((review) => review.cities))].sort(
    (a, b) => a.localeCompare(b),
  );
  readonly visibleReviews = computed(() => {
    const filter = this.activeFilter();
    const location = this.selectedLocation();
    const query = this.searchTerm().trim().toLocaleLowerCase();
    const reviews = this.reviews.filter((review) => {
      const matchesLocation =
        !location ||
        (filter === 'countries' && review.country === location) ||
        (filter === 'cities' && review.cities.includes(location));
      const matchesQuery =
        !query ||
        [review.country, review.location, review.category, review.title].some((value) =>
          value.toLocaleLowerCase().includes(query),
        );

      return matchesLocation && matchesQuery;
    });

    return reviews.sort((a, b) =>
      this.sortBy() === 'rating'
        ? b.rating - a.rating
        : b.publishedAt.localeCompare(a.publishedAt),
    );
  });

  setFilter(filter: ReviewFilter): void {
    this.activeFilter.set(filter);
    this.selectedLocation.set('');
    this.activeLocationMenu.set(null);
    this.sortMenuOpen.set(false);
  }

  toggleLocationMenu(filter: Exclude<ReviewFilter, 'all'>, event: Event): void {
    const trigger = event.currentTarget as HTMLElement;
    const triggerBounds = trigger.getBoundingClientRect();
    const spaceAbove = triggerBounds.top;
    const spaceBelow = window.innerHeight - triggerBounds.bottom;

    this.locationMenuOpensUp.set(spaceBelow < spaceAbove);
    this.sortMenuOpen.set(false);
    this.activeLocationMenu.update((openMenu) => (openMenu === filter ? null : filter));
  }

  selectLocation(filter: Exclude<ReviewFilter, 'all'>, location: string): void {
    this.activeFilter.set(filter);
    this.selectedLocation.set(location);
    this.activeLocationMenu.set(null);
  }

  @HostListener('document:click')
  @HostListener('document:keydown.escape')
  closeLocationMenus(): void {
    this.activeLocationMenu.set(null);
    this.sortMenuOpen.set(false);
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  toggleSortMenu(event: Event): void {
    const trigger = event.currentTarget as HTMLElement;
    const triggerBounds = trigger.getBoundingClientRect();

    this.sortMenuOpensUp.set(window.innerHeight - triggerBounds.bottom < triggerBounds.top);
    this.activeLocationMenu.set(null);
    this.sortMenuOpen.update((isOpen) => !isOpen);
  }

  selectSort(sort: ReviewSort): void {
    this.sortBy.set(sort);
    this.sortMenuOpen.set(false);
  }

  clearFilters(): void {
    this.activeFilter.set('all');
    this.selectedLocation.set('');
    this.searchTerm.set('');
  }
}
