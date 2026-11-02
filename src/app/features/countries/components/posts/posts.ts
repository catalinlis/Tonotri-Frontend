import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { PostCard } from '../../../../shared/components/post-card/post-card';
import { PostMediaDialogService } from '../../../../shared/services/post-media-dialog.service';
import type { PostMediaEntry } from '../../../../shared/models/post-media-entry';
import { SectionDropdown } from '../section-dropdown/section-dropdown';

export interface CountryPost extends PostMediaEntry {
  readonly id: string | number;
  readonly cities?: readonly string[];
}

@Component({
  selector: 'app-country-posts',
  imports: [PostCard, SectionDropdown],
  templateUrl: './posts.html',
  styleUrls: ['../country-sections.css', './posts.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Posts {
  private readonly postDialog = inject(PostMediaDialogService);
  readonly countryName = input.required<string>();
  readonly posts = input<readonly CountryPost[]>([]);
  readonly selectedCity = signal('');
  readonly cities = computed(() => [...new Set(this.posts().flatMap(entry => entry.cities ?? []))].sort((a, b) => a.localeCompare(b)));
  readonly activeCity = computed(() => this.cities().includes(this.selectedCity()) ? this.selectedCity() : '');
  readonly cityOptions = computed(() => [{ value: '', label: 'All cities' }, ...this.cities().map(city => ({ value: city, label: city }))]);
  readonly filteredPosts = computed(() => this.activeCity()
    ? this.posts().filter(entry => entry.cities?.includes(this.activeCity()))
    : this.posts());

  openGallery(entry: CountryPost, startIndex: number): void {
    this.postDialog.open(entry, startIndex, this.countryName());
  }
}
