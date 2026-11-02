import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { PostCard } from '../../../../shared/components/post-card/post-card';
import { ProfileReview, ReviewCard } from '../../../../shared/components/review-card/review-card';
import { PostMediaDialogService } from '../../../../shared/services/post-media-dialog.service';
import { CountryPost } from '../posts/posts';

@Component({
  selector: 'app-country-overview',
  imports: [PostCard, ReviewCard],
  templateUrl: './overview.html',
  styleUrls: ['../country-sections.css', './overview.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview {
  private readonly postDialog = inject(PostMediaDialogService);
  readonly countryName = input.required<string>();
  readonly countrySlug = input.required<string>();
  readonly description = input('');
  readonly posts = input<readonly CountryPost[]>([]);
  readonly reviews = input<readonly ProfileReview[]>([]);
  readonly storiesCount = computed(() => this.posts().length + this.reviews().length);

  openGallery(entry: CountryPost, startIndex: number): void {
    this.postDialog.open(entry, startIndex, this.countryName());
  }
}
