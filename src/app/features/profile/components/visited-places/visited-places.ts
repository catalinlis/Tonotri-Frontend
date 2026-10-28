import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

type Region = 'world' | 'europe' | 'asia';

interface TravelPlace {
  city: string;
  country: string;
  countryCode: string;
  date: string;
  rating: number;
  coordinates: [number, number];
}

type PlaceFilter = 'all' | 'favorites';

interface VisitedPlaceCard {
  place: TravelPlace;
  image: string;
  imageAlt: string;
  favorite: boolean;
}

interface MapLibreWindow extends Window {
  maplibregl?: any;
  __tonotriMapLibrePromise?: Promise<any>;
}

@Component({
  selector: 'app-visited-places',
  imports: [],
  templateUrl: './visited-places.html',
  styleUrl: './visited-places.css',
})
export class VisitedPlaces implements AfterViewInit, OnDestroy {
  @ViewChild('travelMap') private mapContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('mapCard') private mapCard?: ElementRef<HTMLElement>;

  protected readonly places: TravelPlace[] = [
    { city: 'Rome', country: 'Italy', countryCode: 'IT', date: 'Jun 2025', rating: 5, coordinates: [12.4964, 41.9028] },
    { city: 'Paris', country: 'France', countryCode: 'FR', date: 'Apr 2025', rating: 4.8, coordinates: [2.3522, 48.8566] },
    { city: 'Lisbon', country: 'Portugal', countryCode: 'PT', date: 'Sep 2024', rating: 4.9, coordinates: [-9.1393, 38.7223] },
    { city: 'Tokyo', country: 'Japan', countryCode: 'JP', date: 'Mar 2024', rating: 4.7, coordinates: [139.6917, 35.6895] },
    { city: 'New York', country: 'United States', countryCode: 'US', date: 'Oct 2023', rating: 4.6, coordinates: [-74.006, 40.7128] },
  ];

  protected readonly visitedPlaceCards: VisitedPlaceCard[] = [
    { place: this.places[0], image: 'assets/coloseum.jpg', imageAlt: 'The Colosseum in Rome', favorite: true },
    { place: this.places[1], image: 'assets/explore1.jpg', imageAlt: 'Travel memories from Paris', favorite: false },
    { place: this.places[2], image: 'assets/explore2.jpg', imageAlt: 'Coastal travel memories from Lisbon', favorite: true },
    { place: this.places[3], image: 'assets/mountain.jpg', imageAlt: 'A mountain journey near Tokyo', favorite: false },
  ];

  protected selectedPlace: TravelPlace | null = null;
  protected activeRegion: Region = 'world';
  protected placeFilter: PlaceFilter = 'all';

  protected get filteredVisitedPlaceCards(): VisitedPlaceCard[] {
    return this.placeFilter === 'favorites'
      ? this.visitedPlaceCards.filter((card) => card.favorite)
      : this.visitedPlaceCards;
  }

  protected setPlaceFilter(filter: PlaceFilter): void {
    this.placeFilter = filter;
  }
  protected mapStatus = 'Loading interactive map…';

  private map?: any;
  private markers: any[] = [];
  private destroyed = false;

  ngAfterViewInit(): void { void this.initialiseMap(); }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.markers.forEach((marker) => marker.remove());
    this.map?.remove();
  }

  protected selectRegion(region: Region): void {
    this.activeRegion = region;
    const views: Record<Region, { center: [number, number]; zoom: number }> = {
      world: { center: [18, 25], zoom: 1.25 },
      europe: { center: [12, 50], zoom: 3.2 },
      asia: { center: [100, 34], zoom: 2.35 },
    };
    this.map?.flyTo({ ...views[region], duration: 1100, essential: true });
  }

  protected focusPlace(place: TravelPlace): void {
    this.selectedPlace = place;
    this.map?.flyTo({ center: place.coordinates, zoom: 5.5, duration: 1200, essential: true });
  }

  protected showPlaceOnMap(place: TravelPlace): void {
    this.focusPlace(place);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.mapCard?.nativeElement.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  private async initialiseMap(): Promise<void> {
    try {
      const maplibregl = await this.loadMapLibreFromWeb();
      if (this.destroyed || !this.mapContainer) return;
      this.map = new maplibregl.Map({
        container: this.mapContainer.nativeElement,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [18, 25], zoom: 1.25, minZoom: 1, attributionControl: false,
      });
      this.map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
      this.map.on('load', () => {
        this.mapStatus = 'Interactive map ready';
        this.configureMapStyle();
        this.addPlaceMarkers(maplibregl);
      });
      this.map.on('error', () => { this.mapStatus = 'The map could not be displayed. Check your connection.'; });
    } catch {
      this.mapStatus = 'The map could not be loaded. Check your connection and try again.';
    }
  }

  private addPlaceMarkers(maplibregl: any): void {
    this.places.forEach((place) => {
      const element = document.createElement('button');
      element.type = 'button';
      element.className = 'tonotri-map-marker';
      element.setAttribute('aria-label', `View ${place.city}, ${place.country}`);

      const pin = document.createElement('span');
      pin.className = 'tonotri-map-marker-pin';
      pin.setAttribute('aria-hidden', 'true');
      element.appendChild(pin);

      element.addEventListener('click', () => this.focusPlace(place));
      this.markers.push(
        new maplibregl.Marker({ element, anchor: 'bottom', offset: [0, 0] })
          .setLngLat(place.coordinates)
          .addTo(this.map),
      );
    });
  }

  private configureMapStyle(): void {
    ['geolines', 'geolines-label'].forEach((layerId) => {
      if (this.map?.getLayer(layerId)) {
        this.map.setLayoutProperty(layerId, 'visibility', 'none');
      }
    });
  }

  private loadMapLibreFromWeb(): Promise<any> {
    const browserWindow = window as MapLibreWindow;
    if (browserWindow.maplibregl) return Promise.resolve(browserWindow.maplibregl);
    if (browserWindow.__tonotriMapLibrePromise) return browserWindow.__tonotriMapLibrePromise;
    const stylesheetUrl = 'https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.css';
    if (!document.querySelector(`link[href="${stylesheetUrl}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = stylesheetUrl; document.head.appendChild(link);
    }
    browserWindow.__tonotriMapLibrePromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-tonotri-maplibre]');
      if (existing) {
        existing.addEventListener('load', () => resolve(browserWindow.maplibregl));
        existing.addEventListener('error', reject); return;
      }
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.js';
      script.async = true; script.dataset['tonotriMaplibre'] = 'true';
      script.onload = () => resolve(browserWindow.maplibregl); script.onerror = reject;
      document.head.appendChild(script);
    });
    return browserWindow.__tonotriMapLibrePromise;
  }
}
