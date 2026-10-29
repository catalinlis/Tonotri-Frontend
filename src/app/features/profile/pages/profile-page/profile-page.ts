import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AppLoaderComponent } from '../../../../shared/components/app-loader/loader.component';
import { SectionNavigation } from '../../../../shared/components/section-navigation/section-navigation';

@Component({
  imports: [RouterOutlet, AppLoaderComponent, SectionNavigation],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage {
  private readonly authService = inject(AuthService);

  readonly usersDetailedInfo = this.authService.currentUser;
  readonly profilePhotoUrl = computed(() => this.authService.currentUser()?.image_path ?? null);
  readonly profileImageLoading = signal(true);
  readonly achievementsExpanded = signal(false);
  readonly profileSections = [
    { label: 'Posts', link: 'posts' },
    { label: 'Photos', link: 'photos' },
    { label: 'Visited Places', link: 'visited-places' },
    { label: 'Reviews', link: 'reviews' },
  ] as const;

  toggleAchievements(): void {
    this.achievementsExpanded.update((expanded) => !expanded);
  }

  onProfileImageLoad(): void {
    this.profileImageLoading.set(false);
  }

  onProfileImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    if (!image.src.endsWith('/assets/user.png')) {
      image.src = 'assets/user.png';
      return;
    }

    this.profileImageLoading.set(false);
  }
}
