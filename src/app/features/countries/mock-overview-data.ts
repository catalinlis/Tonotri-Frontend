import { CountryPost } from './components/posts/posts';
import { JourneyCardData } from '../../shared/components/post-card/post-card';
import { ProfileReview } from '../../shared/components/review-card/review-card';

// Preview content for the overview while country feeds are not connected to an API.
export function createMockOverviewData(country: string, countrySlug: string, image: string): {
  posts: readonly CountryPost[];
  reviews: readonly ProfileReview[];
} {
  const countryCodes: Record<string, string> = {
    italy: 'IT', france: 'FR', spain: 'ES', romania: 'RO',
    'united-states-of-america': 'US', greece: 'GR', switzerland: 'CH',
  };
  const landscape = { url: image, alt: `Travel inspiration for ${country}` };
  const citiesByCountry: Record<string, readonly string[]> = {
    italy: ['Rome', 'Florence', 'Venice'],
    france: ['Paris', 'Lyon', 'Nice'],
    spain: ['Madrid', 'Barcelona', 'Seville'],
    'united-states-of-america': ['New York', 'San Francisco', 'Chicago'],
    romania: ['Bucharest', 'Brasov', 'Cluj-Napoca'],
    greece: ['Athens', 'Thessaloniki', 'Chania'],
    switzerland: ['Zurich', 'Geneva', 'Lucerne'],
  };
  const cities = citiesByCountry[countrySlug] ?? [];
  const nature = { url: 'assets/mountain.jpg', alt: 'Mountain landscape from a sample travel journal' };

  const slowJourney: JourneyCardData = {
    title: `A week of little discoveries in ${country}`,
    publishedAt: 'Oct 26, 2026',
    location: country,
    description: 'We left room between the big sights for neighborhood walks, local markets, and long lunches. The unplanned stops became the moments we remember most.',
    images: [landscape, nature],
    tags: [country, 'Slow travel', 'Local discoveries'],
    days: 7,
    places: 4,
    rating: 4.9,
    stops: [
      { day: 'Days 1–2', place: 'First impressions', detail: 'Settle in, explore on foot, and find a favorite neighborhood café.' },
      { day: 'Days 3–5', place: 'Beyond the main sights', detail: 'Spend time at local markets and leave an afternoon for a spontaneous day trip.' },
      { day: 'Days 6–7', place: 'A slower finish', detail: 'Return to favorite places and enjoy one last sunset before heading home.' },
    ],
    tips: ['Choose a walkable base for the first few nights.', 'Keep one day free for a local recommendation.', 'Book popular attractions ahead of time.'],
    likes: 246,
    comments: 31,
    shares: 18,
  };

  const weekendJourney: JourneyCardData = {
    title: `A long weekend in ${country}`,
    publishedAt: 'Oct 23, 2026',
    location: country,
    description: 'Three days, one small bag, and a plan built around good food and time outside. A short escape that felt much longer in the best possible way.',
    images: [landscape],
    tags: [country, 'Weekend escape', 'Food'],
    days: 3,
    places: 2,
    rating: 4.7,
    stops: [
      { day: 'Day 1', place: 'Arrive and wander', detail: 'Drop the bags, take a relaxed walk, and try a local dinner spot.' },
      { day: 'Day 2', place: 'A full day exploring', detail: 'Start early at a favorite sight, then spend the afternoon outdoors.' },
      { day: 'Day 3', place: 'One last morning', detail: 'Pick up breakfast, revisit a favorite view, and leave time for the journey home.' },
    ],
    tips: ['Travel light so arrival and departure days stay flexible.', 'Pick just one must-see attraction each day.'],
    likes: 93,
    comments: 8,
    shares: 6,
  };

  return {
    posts: [
      {
        id: 'mock-post-1', author: 'Elena Rossi', authorImage: 'assets/woman1.png',
        cities: cities.slice(0, 1),
        post: {
          publishedAt: 'Oct 30, 2026', location: country,
          description: `The best part of this morning in ${country}: taking the long way back, finding a quiet corner, and realizing there was no need to rush.`,
          images: [landscape], tags: [country, 'Morning walks', 'Travel moments'], likes: 128, comments: 14,
        },
      },
      {
        id: 'mock-journey-1', author: 'Alex Petrescu', authorImage: 'assets/man1.png',
        cities: cities.slice(0, 2),
        post: slowJourney, journey: slowJourney,
      },
      {
        id: 'mock-post-2', author: 'Sofia Marin', authorImage: 'assets/woman2.png',
        cities: cities.slice(1, 2),
        post: {
          publishedAt: 'Oct 25, 2026', location: country,
          description: 'A little fresh air between city days. We packed a picnic, put our phones away for a while, and let the afternoon unfold.',
          images: [nature, landscape], tags: ['Outdoors', country, 'Slow afternoons'], likes: 84, comments: 7,
        },
      },
      {
        id: 'mock-journey-2', author: 'Marco Silva', authorImage: 'assets/man2.png',
        cities: cities.slice(1, 3),
        post: weekendJourney, journey: weekendJourney,
      },
      {
        id: 'mock-post-3', author: 'Maya Chen', authorImage: 'assets/user.png',
        cities: cities.slice(2, 3),
        post: {
          publishedAt: 'Oct 21, 2026', location: country,
          description: `One last postcard from ${country}. Already making a list of all the places we want to come back to.`,
          images: [landscape], tags: [country, 'Postcards', 'Until next time'], likes: 62, comments: 5,
        },
      },
    ],
    reviews: [
      {
        id: 1, country, countryCode: countryCodes[countrySlug] ?? '—', location: cities[0] ?? country, cities: cities.slice(0, 1),
        image, imageAlt: `Travel inspiration for ${country}`, rating: 4.9, category: 'Culture & food',
        title: 'A trip worth taking slowly',
        excerpt: 'The most memorable days combined a few planned sights with plenty of time to wander. Local meals and small neighborhood discoveries made this trip special.',
        publishedAt: '2026-10-29', dateLabel: 'Oct 29, 2026', helpfulCount: 24,
      },
      {
        id: 2, country, countryCode: countryCodes[countrySlug] ?? '—', location: cities[1] ?? country, cities: cities.slice(1, 2),
        image, imageAlt: `Travel inspiration for ${country}`, rating: 4.7, category: 'Weekend escape',
        title: 'A rewarding first visit, even with just three days',
        excerpt: 'Staying in one base kept the weekend relaxed. We chose one main activity each day, left room for long lunches, and came home with plenty of reasons to return.',
        publishedAt: '2026-10-24', dateLabel: 'Oct 24, 2026', helpfulCount: 16,
      },
      {
        id: 3, country, countryCode: countryCodes[countrySlug] ?? '—', location: cities[2] ?? country, cities: cities.slice(2, 3),
        image, imageAlt: `Travel inspiration for ${country}`, rating: 4.8, category: 'Independent travel',
        title: 'Leave some room for the unexpected',
        excerpt: 'A flexible itinerary worked well for us. Booking the busiest sights ahead helped, while free afternoons led to some of our favorite conversations and discoveries.',
        publishedAt: '2026-10-20', dateLabel: 'Oct 20, 2026', helpfulCount: 31,
      },
    ],
  };
}
