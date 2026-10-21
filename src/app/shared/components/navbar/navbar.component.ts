import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLinkActive, RouterModule } from "@angular/router";
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../core/services/users.service';
import { ClickOutsideDirective } from '../../../core/directives/click-outside';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLinkActive, RouterModule, CommonModule, ClickOutsideDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent{
  authService = inject(AuthService);
  router = inject(Router);
  isMenuOpen = false;
  isExploreOpen = false;
  isProfileMenuOpen = false;
  profileImageFailed = false;
  menuSectionActive = 'community';
 
  get hideMainNavigation(): boolean {
    const currentPath = this.router.url.split('?')[0].split('#')[0];

    return currentPath === '/onboarding/your-photo'
      || currentPath === '/onboarding/visited-countries';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.isProfileMenuOpen = false;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout(){
    this.isProfileMenuOpen = false;
    this.authService.logout().subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: () => this.router.navigateByUrl('/login')
    });
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen = false;
  }

  onProfileImageError(): void {
    this.profileImageFailed = true;
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
