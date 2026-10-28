import { Component, ElementRef, computed, effect, input, signal, viewChild } from '@angular/core';
import { MediaGalleryImage } from '../../../../../shared/components/profile-media-dialog/profile-media-dialog.component';

export interface ProfilePhotoMetadata {
  country: string;
  countryCode: string;
  date: string;
  story: string;
  tags: string[];
  comments: Array<{
    author: string;
    authorImage: string;
    text: string;
    postedAt: string;
  }>;
}

export interface ProfilePhotoDetailsContext {
  author: string;
  authorImage: string;
  likes: number;
  comments: number;
}

@Component({
  selector: 'app-photo-details',
  imports: [],
  templateUrl: './photo-details.html',
  styleUrl: './photo-details.css',
})
export class PhotoDetails {
  private readonly commentTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('commentTextarea');

  readonly photo = input.required<MediaGalleryImage<ProfilePhotoMetadata>>();
  readonly context = input.required<ProfilePhotoDetailsContext>();
  readonly index = input.required<number>();
  readonly total = input.required<number>();
  private readonly likedPhotos = signal<ReadonlySet<number>>(new Set());
  private readonly savedPhotos = signal<ReadonlySet<number>>(new Set());
  readonly commentDraft = signal('');
  readonly isLiked = computed(() => this.likedPhotos().has(this.index()));
  readonly isSaved = computed(() => this.savedPhotos().has(this.index()));
  readonly displayedLikes = computed(() => this.context().likes + (this.isLiked() ? 1 : 0));

  constructor() {
    effect(() => {
      this.index();
      this.commentDraft.set('');
    });
  }

  toggleLike(): void {
    const updatedLikes = new Set(this.likedPhotos());
    const photoIndex = this.index();

    if (updatedLikes.has(photoIndex)) {
      updatedLikes.delete(photoIndex);
    } else {
      updatedLikes.add(photoIndex);
    }

    this.likedPhotos.set(updatedLikes);
  }

  toggleSave(): void {
    const updatedSaves = new Set(this.savedPhotos());
    const photoIndex = this.index();

    if (updatedSaves.has(photoIndex)) {
      updatedSaves.delete(photoIndex);
    } else {
      updatedSaves.add(photoIndex);
    }

    this.savedPhotos.set(updatedSaves);
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
}
