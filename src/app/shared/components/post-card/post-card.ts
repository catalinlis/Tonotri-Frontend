import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export interface PostCardData {
  readonly publishedAt: string;
  readonly location?: string;
  readonly description?: string;
  readonly images: readonly { url: string; alt: string }[];
  readonly tags: readonly string[];
  readonly likes: number;
  readonly comments: number;
}

export interface JourneyCardData extends PostCardData {
  readonly title: string;
  readonly days: number;
  readonly places: number;
  readonly rating: number;
  readonly stops: readonly { day: string; place: string; detail: string }[];
  readonly tips: readonly string[];
  readonly shares: number;
}

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.html',
  styleUrl: './post-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCard {
  readonly post = input.required<PostCardData>();
  readonly journey = input<JourneyCardData>();
  readonly author = input.required<string>();
  readonly authorImage = input('assets/user.png');
  readonly openPhoto = output<number>();
  readonly previewImages = computed(() => (this.journey() ?? this.post()).images.slice(0, 5));
  readonly remainingPhotos = computed(() => Math.max((this.journey() ?? this.post()).images.length - 5, 0));
}
