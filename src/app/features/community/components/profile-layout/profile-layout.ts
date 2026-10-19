import { Component, effect, input } from '@angular/core';
import { UserDetailedInfo } from '../../models/user-detailed-info';
import { SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppLoaderComponent } from "../../../../shared/components/app-loader/loader.component";

@Component({
  selector: 'app-profile-layout',
  imports: [CommonModule, AppLoaderComponent],
  templateUrl: './profile-layout.html',
  styleUrl: './profile-layout.css',
})
export class ProfileLayout {
  user = input<UserDetailedInfo | null>(null);
  profilePhoto = input<string | null>(null);
  profileLoaded = input<boolean>(false);

  constructor() {
    effect(() => {
      console.log('CHILD PHOTO:', this.profileLoaded());
    });
  }
}
