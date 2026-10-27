import { Component, computed, ElementRef, HostListener, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-photos',
  imports: [],
  templateUrl: './photos.html',
  styleUrl: './photos.css',
})
export class Photos {
  @ViewChild('moreCountries') private moreCountries?: ElementRef<HTMLDetailsElement>;

  readonly photos = [
    { url: 'assets/explore1.jpg', alt: 'Amalfi Coast, Italy', title: 'Amalfi Coast', country: 'Italy', countryCode: 'IT', date: 'May 2026' },
    { url: 'assets/arc-de-triomphe.png', alt: 'Paris, France', title: 'Paris', country: 'France', countryCode: 'FR', date: 'April 2026' },
    { url: 'assets/coloseum.jpg', alt: 'Rome, Italy', title: 'Rome', country: 'Italy', countryCode: 'IT', date: 'March 2026' },
    { url: 'assets/mountain.jpg', alt: 'Swiss Alps, Switzerland', title: 'Swiss Alps', country: 'Switzerland', countryCode: 'CH', date: 'February 2026' },
    { url: 'assets/explore2.jpg', alt: 'Santorini, Greece', title: 'Santorini', country: 'Greece', countryCode: 'GR', date: 'September 2025' },
    { url: 'assets/world-locations.jpg', alt: 'Cinque Terre, Italy', title: 'Cinque Terre', country: 'Italy', countryCode: 'IT', date: 'August 2025' },
    { url: 'assets/new-york.jpg', alt: 'French Riviera, France', title: 'French Riviera', country: 'France', countryCode: 'FR', date: 'July 2025' },
    { url: 'assets/mountain.jpg', alt: 'Lauterbrunnen, Switzerland', title: 'Lauterbrunnen', country: 'Switzerland', countryCode: 'CH', date: 'June 2025' },
  ] as const;
  readonly photosCount: number = this.photos.length;
  readonly countryFilters = [
    { code: 'IT', name: 'Italy' },
    { code: 'GR', name: 'Greece' },
    { code: 'FR', name: 'France' },
    { code: 'CH', name: 'Switzerland' },
  ];
  readonly moreCountryFilters = [
    { code: 'RO', name: 'Romania' },
    { code: 'ES', name: 'Spain' },
    { code: 'DE', name: 'Germany' },
    { code: 'PT', name: 'Portugal' },
  ];
  readonly dropdownCountryFilters = [...this.countryFilters, ...this.moreCountryFilters];
  readonly activeFilter = signal('all');
  readonly activeLayout = signal<'grid' | 'columns'>('grid');
  readonly countryMenuPlacement = signal<'above' | 'below'>('below');
  readonly filteredPhotos = computed(() => {
    const activeCode = this.activeFilter();

    return activeCode === 'all'
      ? this.photos
      : this.photos.filter((photo) => photo.countryCode === activeCode);
  });
  readonly activeFilterLabel = computed(() => {
    const activeCode = this.activeFilter();

    if (activeCode === 'all') return 'All photos';

    return this.dropdownCountryFilters.find((country) => country.code === activeCode)?.name ?? 'All photos';
  });
  readonly isMoreCountryActive = computed(() =>
    this.moreCountryFilters.some((country) => country.code === this.activeFilter()),
  );

  updateCountryMenuPlacement(details: HTMLDetailsElement, menu: HTMLElement): void {
    if (!details.open) return;

    const triggerBounds = details.getBoundingClientRect();
    const menuHeight = menu.offsetHeight;
    const spaceBelow = window.innerHeight - triggerBounds.bottom;
    const spaceAbove = triggerBounds.top;

    this.countryMenuPlacement.set(
      spaceBelow < menuHeight + 12 && spaceAbove > menuHeight + 12 ? 'above' : 'below',
    );
  }

  @HostListener('document:click', ['$event'])
  closeCountryMenuOnOutsideClick(event: MouseEvent): void {
    const details = this.moreCountries?.nativeElement;
    const target = event.target;

    if (details?.open && target instanceof Node && !details.contains(target)) {
      details.open = false;
    }
  }
}
