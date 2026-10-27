import { Component, computed, inject } from '@angular/core';
import { ProfileLayout } from '../../../../shared/components/profile-layout/profile-layout';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-community-page',
  standalone: true,
  imports: [ProfileLayout],
  templateUrl: './community-page.component.html',
  styleUrl: './community-page.component.css',
})
export class CommunityPageComponent {
  private readonly authService = inject(AuthService);

  readonly usersDetailedInfo = this.authService.currentUser;
  readonly profilePhotoUrl = computed(() => this.authService.currentUser()?.image_path ?? null);
  readonly profileComponentLoaded = computed(() => !this.authService.userLoading());
}
