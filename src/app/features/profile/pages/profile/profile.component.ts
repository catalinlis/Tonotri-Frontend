import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private authService = inject(AuthService);

  logout(){
    this.authService.logout().subscribe();
  }
}
