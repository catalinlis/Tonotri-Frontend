import { Component, inject } from '@angular/core';
import { Router, RouterLinkActive, RouterModule } from "@angular/router";
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLinkActive, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  isMenuOpen = false;
  isExploreOpen = false;
  menuSectionActive = 'community';

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout(){
    this.authService.logout().subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: () => this.router.navigateByUrl('/login')
    });
  }

  onClick(event: Event) {
    const button = event.target as HTMLButtonElement;
    
    switch(button.id){
      case 'community': {
        this.menuSectionActive = 'community';
        break;
      }
      case 'explore': {
        this.menuSectionActive = 'explore';
        break;
      }
      default: break;
    }
  }
}
