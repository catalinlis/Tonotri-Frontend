import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AppLoaderComponent } from '../../../../shared/components/app-loader/loader.component';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AppLoaderComponent],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage {
  private readonly authService = inject(AuthService);

  readonly usersDetailedInfo = this.authService.currentUser;
  readonly profilePhotoUrl = computed(() => this.authService.currentUser()?.image_path ?? null);
  readonly profileImageLoading = signal(true);
  readonly achievementsExpanded = signal(false);

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
