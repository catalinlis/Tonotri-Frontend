import { Injectable, inject } from '@angular/core';
import { ProfileMediaDialogService } from './profile-media-dialog.service';
import { PostPhotoDetails, PostPhotoDetailsContext } from '../components/post-photo-details/post-photo-details';
import type { PostMediaEntry } from '../models/post-media-entry';

@Injectable({ providedIn: 'root' })
export class PostMediaDialogService {
  private readonly mediaDialog = inject(ProfileMediaDialogService);

  open(entry: PostMediaEntry, startIndex: number, fallbackLocation = ''): void {
    const post = entry.journey ?? entry.post;
    if (startIndex < 0 || startIndex >= post.images.length) return;

    const context: PostPhotoDetailsContext = {
      author: entry.author,
      authorImage: entry.authorImage ?? 'assets/user.png',
      publishedAt: post.publishedAt,
      location: post.location ?? fallbackLocation,
      description: post.description ?? '',
      tags: [...post.tags],
      likes: post.likes,
      comments: post.comments,
      commentItems: (entry.commentItems ?? []).map(comment => ({ ...comment })),
      type: entry.journey ? 'journey' : 'post',
      journeyDetails: entry.journey ? {
        title: entry.journey.title,
        days: entry.journey.days,
        places: entry.journey.places,
        rating: entry.journey.rating,
        stops: entry.journey.stops.map(stop => ({ ...stop })),
        tips: [...entry.journey.tips],
      } : undefined,
    };

    this.mediaDialog.open({
      images: post.images.map(image => ({ ...image })),
      startIndex,
      eyebrow: entry.journey ? 'Journey gallery' : 'Post gallery',
      showThumbnails: false,
      detailsComponent: PostPhotoDetails,
      detailsContext: context,
    });
  }
}
