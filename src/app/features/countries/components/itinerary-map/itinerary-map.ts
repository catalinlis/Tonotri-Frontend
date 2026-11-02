import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, PLATFORM_ID, ViewChild, inject, signal } from '@angular/core';
import { loadMapLibreFromWeb } from '../../../../shared/utils/maplibre-loader';

export interface ItineraryMapStop {
  readonly days: string;
  readonly place: string;
  readonly coordinates: readonly [number, number];
}

@Component({
  selector: 'app-itinerary-map',
  templateUrl: './itinerary-map.html',
  styleUrl: './itinerary-map.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItineraryMap implements AfterViewInit, OnDestroy {
  @Input({ required: true }) stops: readonly ItineraryMapStop[] = [];
  @ViewChild('travelMap') private mapContainer?: ElementRef<HTMLDivElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  private map?: any;
  private markers: any[] = [];
  private destroyed = false;
  private mapReady = false;
  private pendingStopIndex: number | null = null;

  readonly selectedStop = signal<ItineraryMapStop | null>(null);
  readonly mapStatus = signal('Loading interactive map…');

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.stops.length > 0) {
      void this.initialiseMap();
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.markers.forEach((marker) => marker.remove());
    this.map?.remove();
  }

  fitRoute(): void {
    if (!this.map || this.stops.length === 0) return;
    const longitudes = this.stops.map((stop) => stop.coordinates[0]);
    const latitudes = this.stops.map((stop) => stop.coordinates[1]);
    this.map.fitBounds(
      [[Math.min(...longitudes), Math.min(...latitudes)], [Math.max(...longitudes), Math.max(...latitudes)]],
      { padding: 60, maxZoom: 8, duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 750 },
    );
  }

  focusStop(index: number, scrollToMap = true): void {
    const stop = this.stops[index];
    if (!stop || this.destroyed) return;

    this.selectedStop.set(stop);
    if (scrollToMap && isPlatformBrowser(this.platformId)) {
      this.hostElement.nativeElement.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'center',
      });
    }

    if (!this.mapReady) {
      this.pendingStopIndex = index;
      return;
    }
    this.map.flyTo({
      center: stop.coordinates,
      zoom: 11,
      duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 850,
      essential: true,
    });
  }

  private async initialiseMap(): Promise<void> {
    try {
      const maplibregl = await loadMapLibreFromWeb();
      if (this.destroyed || !this.mapContainer) return;
      this.map = new maplibregl.Map({
        container: this.mapContainer.nativeElement,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [12.5, 42.2],
        zoom: 5,
        attributionControl: false,
      });
      this.map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
      this.map.on('load', () => {
        if (this.destroyed) return;
        this.mapStatus.set('Interactive itinerary map ready');
        this.configureMapStyle();
        this.addRoute();
        this.addMarkers(maplibregl);
        this.mapReady = true;
        if (this.pendingStopIndex !== null) {
          this.focusStop(this.pendingStopIndex, false);
          this.pendingStopIndex = null;
        } else {
          this.fitRoute();
        }
      });
      this.map.on('error', () => {
        if (!this.destroyed && !this.map.isStyleLoaded()) {
          this.mapStatus.set('The map could not be displayed. Check your connection.');
        }
      });
    } catch {
      if (!this.destroyed) this.mapStatus.set('The map could not be loaded. Check your connection and try again.');
    }
  }

  private configureMapStyle(): void {
    ['geolines', 'geolines-label'].forEach((layerId) => {
      if (this.map?.getLayer(layerId)) {
        this.map.setLayoutProperty(layerId, 'visibility', 'none');
      }
    });
  }

  private addRoute(): void {
    this.map.addSource('itinerary-route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: this.stops.map((stop) => stop.coordinates) },
      },
    });
    this.map.addLayer({
      id: 'itinerary-route-outline', type: 'line', source: 'itinerary-route',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#ffffff', 'line-width': 6, 'line-opacity': .95 },
    });
    this.map.addLayer({
      id: 'itinerary-route-line', type: 'line', source: 'itinerary-route',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#168ba4', 'line-width': 3, 'line-dasharray': [2, 1.5] },
    });
  }

  private addMarkers(maplibregl: any): void {
    this.stops.forEach((stop, index) => {
      const element = document.createElement('button');
      element.type = 'button';
      element.className = 'tonotri-map-marker';
      element.setAttribute('aria-label', `View stop ${index + 1}: ${stop.place}`);

      const pin = document.createElement('span');
      pin.className = 'tonotri-map-marker-pin';
      pin.setAttribute('aria-hidden', 'true');
      element.appendChild(pin);

      element.addEventListener('click', () => {
        this.focusStop(index, false);
      });
      this.markers.push(new maplibregl.Marker({ element, anchor: 'bottom', offset: [0, 0] })
        .setLngLat(stop.coordinates)
        .addTo(this.map));
    });
  }
}
