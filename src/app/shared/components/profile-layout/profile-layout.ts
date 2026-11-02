import { Component, computed, input, linkedSignal } from '@angular/core';
import { UserDetailedInfo } from '../../../shared/models/user-detailed-info';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppLoaderComponent } from "../../../shared/components/app-loader/loader.component";

@Component({
  selector: 'app-profile-layout',
  imports: [CommonModule, AppLoaderComponent, RouterLink],
  templateUrl: './profile-layout.html',
  styleUrl: './profile-layout.css',
})
export class ProfileLayout {
  user = input<UserDetailedInfo | null>(null);
  profilePhoto = input<string | null>(null);
  profileLoaded = input<boolean>(false);

  readonly fallbackPhoto = 'assets/user.png';
  readonly imageState = linkedSignal(() => ({
    src: this.profilePhoto() || this.fallbackPhoto,
    loaded: false,
  }));
  readonly loading = computed(() => !this.profileLoaded() || !this.user() || !this.imageState().loaded);

  onImageLoad(): void {
    this.imageState.update((state) => ({ ...state, loaded: true }));
  }

  onImageError(): void {
    this.imageState.update((state) => state.src === this.fallbackPhoto
      ? { ...state, loaded: true }
      : { src: this.fallbackPhoto, loaded: false });
  }
}
