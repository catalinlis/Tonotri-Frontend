import { Component, ElementRef, computed, effect, input, signal, viewChild } from '@angular/core';
import { MediaGalleryImage } from '../../../../../shared/components/profile-media-dialog/profile-media-dialog.component';

export interface PostPhotoDetailsContext {
  author: string;
  authorImage: string;
  publishedAt: string;
  location: string;
  description: string;
  tags: string[];
  likes: number;
  comments: number;
  commentItems: Array<{
    author: string;
    authorImage: string;
    text: string;
    postedAt: string;
  }>;
  type: 'post' | 'journey';
  journeyDetails?: {
    title: string;
    days: number;
    places: number;
    rating: number;
    stops: Array<{ day: string; place: string; detail: string }>;
    tips: string[];
  };
}

@Component({
  selector: 'app-post-photo-details',
  imports: [],
  templateUrl: './post-photo-details.html',
  styleUrl: './post-photo-details.css',
})
export class PostPhotoDetails {
  private readonly commentTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('commentTextarea');

  readonly photo = input.required<MediaGalleryImage>();
  readonly context = input.required<PostPhotoDetailsContext>();
  readonly index = input.required<number>();
  readonly total = input.required<number>();
  private readonly likedPhotos = signal<ReadonlySet<number>>(new Set());
  private readonly savedPhotos = signal<ReadonlySet<number>>(new Set());
  readonly isLiked = computed(() => this.likedPhotos().has(this.index()));
  readonly isSaved = computed(() => this.savedPhotos().has(this.index()));
  readonly displayedLikes = computed(() => this.context().likes + (this.isLiked() ? 1 : 0));
  readonly commentDraft = signal('');

  constructor() {
    effect(() => {
      this.index();
      this.commentDraft.set('');
    });
  }

  toggleLike(): void {
    this.toggleSelection(this.likedPhotos);
  }

  toggleSave(): void {
    this.toggleSelection(this.savedPhotos);
  }

  updateCommentDraft(event: Event): void {
    this.commentDraft.set((event.target as HTMLTextAreaElement).value);
  }

  focusCommentTextarea(): void {
    const textarea = this.commentTextarea()?.nativeElement;
    if (!textarea) return;

    textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    textarea.focus({ preventScroll: true });
  }

  private toggleSelection(selection: typeof this.likedPhotos): void {
    const updatedSelection = new Set(selection());
    const photoIndex = this.index();

    if (updatedSelection.has(photoIndex)) {
      updatedSelection.delete(photoIndex);
    } else {
      updatedSelection.add(photoIndex);
    }

    selection.set(updatedSelection);
  }
}
