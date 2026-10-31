import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, PLATFORM_ID, ViewChild, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { FEATURED_COUNTRIES } from '../../featured-countries';
import { ItineraryMap } from '../../components/itinerary-map/itinerary-map';

interface ReviewComment {
  id: number;
  author: string;
  initials: string;
  time: string;
  text: string;
  own?: boolean;
}

@Component({
  selector: 'app-country-review-detail-page',
  imports: [RouterLink, ItineraryMap],
  templateUrl: './country-review-detail-page.html',
  styleUrl: './country-review-detail-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryReviewDetailPage implements AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private revealObserver?: IntersectionObserver;
  @ViewChild(ItineraryMap) private itineraryMap?: ItineraryMap;
  @ViewChild('commentsList') private commentsList?: ElementRef<HTMLDivElement>;
  private readonly tagHueSeed = Math.random() * 360;

  readonly travelerTags = ['Culture lover', 'Food explorer', 'City traveler'].map((label, index) => ({
    label,
    hue: `${Math.round((this.tagHueSeed + index * 137.508) % 360)}deg`,
  }));
  readonly profileImageFailed = signal(false);
  readonly profilePhotoUrl = computed(() =>
    this.profileImageFailed() ? 'assets/user.png' : (this.authService.currentUser()?.image_path || 'assets/user.png'),
  );

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

  readonly countryImage = computed(
    () =>
      FEATURED_COUNTRIES.find((country) => country.slug === this.countrySlug())?.image ??
      'assets/earth.jpg',
  );

  readonly categoryRatings = [
    { label: 'Food', score: 5, icon: 'fork' },
    { label: 'Hospitality', score: 4.9, icon: 'heart' },
    { label: 'Safety', score: 4.8, icon: 'shield' },
    { label: 'Transportation', score: 4.6, icon: 'train' },
    { label: 'Value for money', score: 4.5, icon: 'coins' },
    { label: 'Attractions', score: 4.9, icon: 'camera' },
  ] as const;

  readonly gallery = [
    { src: 'assets/coloseum.jpg', alt: 'The Colosseum in Rome' },
    { src: 'assets/explore1.jpg', alt: 'A memorable destination from the trip' },
    { src: 'assets/explore2.jpg', alt: 'A city explored during the journey' },
    { src: 'assets/world-locations.jpg', alt: 'A scenic view from the trip' },
  ] as const;

  readonly highlights = [
    { title: 'History that feels alive', text: 'Ancient streets and landmarks around every corner.', icon: 'landmark' },
    { title: 'Food worth the journey', text: 'Simple ingredients, memorable flavors, warm tables.', icon: 'food' },
    { title: 'Slow, beautiful moments', text: 'Morning walks and evenings made for lingering.', icon: 'sun' },
  ] as const;

  readonly itinerary = [
    { days: 'Days 1–4', place: 'Rome', coordinates: [12.4964, 41.9028] as [number, number], description: 'Ancient streets, monumental history, and long evenings around the table set the tone for the trip.', highlight: 'History & food' },
    { days: 'Days 5–7', place: 'Florence', coordinates: [11.2558, 43.7696] as [number, number], description: 'Art-filled days gave way to relaxed walks through the city and time to enjoy its quieter corners.', highlight: 'Art & architecture' },
    { days: 'Days 8–12', place: 'Amalfi Coast', coordinates: [14.6029, 40.6281] as [number, number], description: 'The final days slowed down beside the sea, with dramatic coastal views and room to simply linger.', highlight: 'Coast & scenery' },
    { days: 'Days 1–4', place: 'Rome', coordinates: [12.4964, 41.9028] as [number, number], description: 'Ancient streets, monumental history, and long evenings around the table set the tone for the trip.', highlight: 'History & food' },
    { days: 'Days 5–7', place: 'Florence', coordinates: [11.2558, 43.7696] as [number, number], description: 'Art-filled days gave way to relaxed walks through the city and time to enjoy its quieter corners.', highlight: 'Art & architecture' },
    { days: 'Days 8–12', place: 'Amalfi Coast', coordinates: [14.6029, 40.6281] as [number, number], description: 'The final days slowed down beside the sea, with dramatic coastal views and room to simply linger.', highlight: 'Coast & scenery' },
  ] as const;

  readonly comments = signal<ReviewComment[]>([
    { id: 1, author: 'Maya Chen', initials: 'MC', time: '2 days ago', text: 'The way you described Florence makes me want to go back. Did you find a favorite neighborhood?' },
    { id: 2, author: 'Alex Rivera', initials: 'AR', time: '4 days ago', text: 'Rome and the Amalfi Coast in one trip sounds perfect. Thanks for sharing your route!' },
    { id: 3, author: 'Nina Patel', initials: 'NP', time: '1 week ago', text: 'I love the slower pace you chose for the coast. Those views are worth taking time for.' },
    { id: 4, author: 'Oliver Brooks', initials: 'OB', time: '2 weeks ago', text: 'Such a thoughtful itinerary. Your food recommendations have me planning my next visit.' },
  ]);
  readonly commentDraft = signal('');
  private nextCommentId = 5;

  readonly saved = signal(false);
  readonly helpful = signal(false);
  readonly helpfulCount = computed(() => 324 + (this.helpful() ? 1 : 0));

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

    const sections = this.elementRef.nativeElement.querySelectorAll<HTMLElement>('.review-reveal');
    this.revealObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        this.revealObserver?.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

    this.elementRef.nativeElement.classList.add('review-motion-ready');
    sections.forEach((section) => this.revealObserver?.observe(section));
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
  }

  toggleSaved(): void {
    this.saved.update((value) => !value);
  }

  toggleHelpful(): void {
    this.helpful.update((value) => !value);
  }

  showStopOnMap(index: number): void {
    this.itineraryMap?.focusStop(index);
  }

  postComment(event: Event): void {
    event.preventDefault();
    const text = this.commentDraft().trim();
    if (!text) return;

    this.comments.update((comments) => [
      { id: this.nextCommentId++, author: 'You', initials: 'YO', time: 'Just now', text, own: true },
      ...comments,
    ]);
    this.commentDraft.set('');
    this.commentsList?.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onProfileImageError(): void {
    this.profileImageFailed.set(true);
  }
}
