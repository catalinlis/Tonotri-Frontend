import type { PostCardData, JourneyCardData } from '../components/post-card/post-card';

export interface PostComment {
  readonly author: string;
  readonly authorImage: string;
  readonly text: string;
  readonly postedAt: string;
}

export interface PostMediaEntry {
  readonly author: string;
  readonly authorImage?: string;
  readonly post: PostCardData;
  readonly journey?: JourneyCardData;
  readonly commentItems?: readonly PostComment[];
}
