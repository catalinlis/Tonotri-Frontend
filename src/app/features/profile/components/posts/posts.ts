import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-posts',
  imports: [],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts {
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;
  readonly profilePhotoUrl = computed(() => this.currentUser()?.image_path ?? 'assets/user.png');
  readonly postsCount = 2;
  readonly post = {
    publishedAt: '2 hours ago',
    location: 'Carpathian Mountains, Romania',
    description: 'A quiet morning above the clouds, where every trail felt like a new story waiting to be told.',
    images: [
      { url: 'assets/mountain.jpg', alt: 'Mountain landscape beneath a blue sky' },
      { url: 'assets/new-york.jpg', alt: 'A city view from the travel collection' },
    ],
    tags: ['Mountains', 'Romania', 'Hiking'],
    likes: 128,
    comments: 14,
  };

  readonly postPreviewImages = this.post.images.slice(0, 5);
  readonly postRemainingPhotos = Math.max(this.post.images.length - 5, 0);

  readonly journey = {
    title: 'An Italian Escape',
    publishedAt: '5 days ago',
    location: 'Italy',
    images: [
      { url: 'assets/coloseum.jpg', alt: 'The Colosseum in Rome' },
      { url: 'assets/explore1.jpg', alt: 'A memorable stop during the Italian journey' },
      { url: 'assets/new-york.jpg', alt: 'An evening city view from the journey collection' },
      { url: 'assets/mountain.jpg', alt: 'A mountain landscape from the journey collection' },
    ],
    days: 8,
    places: 6,
    rating: 4.9,
    description: 'Eight unforgettable days moving from Rome’s ancient streets to Florence’s art-filled lanes and the quiet canals of Venice. This route balanced iconic landmarks, local food, and enough unplanned time to discover places away from the crowds.',
    tags: ['Italy', 'City break', 'Culture', 'Food'],
    stops: [
      { day: 'Days 1–3', place: 'Rome', detail: 'Colosseum, Trastevere and a sunrise walk through the historic center.' },
      { day: 'Days 4–5', place: 'Florence', detail: 'Renaissance art, the Duomo and a sunset from Piazzale Michelangelo.' },
      { day: 'Days 6–8', place: 'Venice', detail: 'Hidden canals, Burano and an early-morning walk around San Marco.' },
    ],
    tips: [
      'Book major attractions before the trip and keep mornings for popular sights.',
      'Travel between cities by high-speed train and stay close to each historic center.',
      'Leave one open afternoon in every city for spontaneous discoveries.',
    ],
    likes: 246,
    comments: 31,
    shares: 18,
  };

  readonly journeyPreviewImages = this.journey.images.slice(0, 5);
  readonly journeyRemainingPhotos = Math.max(this.journey.images.length - 5, 0);
}
