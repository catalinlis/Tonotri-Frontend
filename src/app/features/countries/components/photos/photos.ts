import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { PhotoCard, PhotoCardData } from '../../../../shared/components/photo-card/photo-card';
import { PhotoDetails, ProfilePhotoDetailsContext, ProfilePhotoMetadata } from '../../../../shared/components/photo-details/photo-details';
import { ProfileMediaDialogService } from '../../../../shared/services/profile-media-dialog.service';
import { SectionDropdown } from '../section-dropdown/section-dropdown';

export interface CountryPhoto extends PhotoCardData {
  readonly id: string | number;
  readonly city?: string;
}

@Component({
  selector: 'app-country-photos',
  imports: [PhotoCard, SectionDropdown],
  templateUrl: './photos.html',
  styleUrls: ['../country-sections.css', './photos.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Photos {
  private readonly mediaDialog = inject(ProfileMediaDialogService);
  readonly countryName = input.required<string>();
  readonly photos = input<readonly CountryPhoto[]>([]);
  readonly layout = signal<'grid' | 'mosaic'>('grid');
  private readonly selectedCity = signal('');
  readonly cities = computed(() => [...new Set(this.photos().map(photo => photo.city?.trim()).filter((city): city is string => !!city))].sort((a, b) => a.localeCompare(b)));
  readonly activeCity = computed(() => this.cities().includes(this.selectedCity()) ? this.selectedCity() : '');
  readonly cityOptions = computed(() => [{ value: '', label: 'All cities' }, ...this.cities().map(city => ({ value: city, label: city }))]);
  readonly filteredPhotos = computed(() => this.activeCity()
    ? this.photos().filter(photo => photo.city?.trim() === this.activeCity())
    : this.photos());

  selectCity(city: string): void {
    this.selectedCity.set(city);
  }

  openGallery(startIndex: number): void {
    if (startIndex < 0 || startIndex >= this.filteredPhotos().length) return;
    this.mediaDialog.open({
      images: this.filteredPhotos().map((photo) => ({
        url: photo.url,
        alt: photo.alt,
        title: photo.title,
        metadata: {
          country: photo.country,
          countryCode: '',
          date: photo.date,
          story: photo.alt,
          tags: [photo.country],
          comments: [],
        } satisfies ProfilePhotoMetadata,
      })),
      startIndex,
      eyebrow: `${this.countryName()} photos`,
      showThumbnails: false,
      detailsComponent: PhotoDetails,
      detailsContext: {
        author: 'Traveler',
        authorImage: 'assets/user.png',
        likes: 0,
        comments: 0,
      } satisfies ProfilePhotoDetailsContext,
    });
  }
}
