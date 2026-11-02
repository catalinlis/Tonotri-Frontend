import type { CountryPhoto } from './components/photos/photos';

// Local preview images until the country photo feed is connected.
export function createMockPhotos(country: string, countrySlug: string, image: string): readonly CountryPhoto[] {
  const images = countrySlug === 'france'
    ? ['assets/arc-de-triomphe.png', image]
    : [image];
  const titles = [
    'First impressions', 'A favorite view', 'Taking the scenic route',
    'A quiet moment', 'Postcard memories', 'An afternoon exploring',
    'A different perspective', 'The highlight of our trip', 'Little discoveries',
    'One more photo', 'A place to remember', 'Until next time',
  ];
  const citiesByCountry: Record<string, readonly string[]> = {
    italy: ['Rome', 'Florence', 'Venice'],
    france: ['Paris', 'Lyon', 'Nice'],
    spain: ['Madrid', 'Barcelona', 'Seville'],
    'united-states-of-america': ['New York', 'San Francisco', 'Chicago'],
  };
  const cities = citiesByCountry[countrySlug] ?? [];

  return titles.map((title, index) => ({
    id: `mock-${countrySlug}-photo-${index + 1}`,
    url: images[index % images.length],
    alt: `Sample travel photo for ${country}: ${title}`,
    title,
    country,
    city: cities.length ? cities[index % cities.length] : undefined,
    date: index < 6 ? 'October 2026' : 'September 2026',
  }));
}
