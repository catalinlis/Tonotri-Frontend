import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, Scroll } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { AppLoaderComponent } from '../../../../shared/components/app-loader/loader.component';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AppLoaderComponent],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private savedScrollPosition: [number, number] | null = null;

  readonly usersDetailedInfo = this.authService.currentUser;
  readonly profilePhotoUrl = computed(() => this.authService.currentUser()?.image_path ?? null);
  readonly profileImageLoading = signal(true);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is Scroll => event instanceof Scroll),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        if (!this.savedScrollPosition) return;

        const [x, y] = this.savedScrollPosition;
        this.savedScrollPosition = null;
        requestAnimationFrame(() => window.scrollTo(x, y));
      });
  }

  preserveScrollPosition(): void {
    this.savedScrollPosition = [window.scrollX, window.scrollY];
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
