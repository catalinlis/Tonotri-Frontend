import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLinkActive, RouterModule } from "@angular/router";
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
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
 
  get hideMainNavigation(): boolean {
    const currentPath = this.router.url.split('?')[0].split('#')[0];

    return currentPath === '/onboarding/your-photo'
      || currentPath === '/onboarding/visited-countries';
  }

  get isExploreRoute(): boolean {
    return this.router.url.split('?')[0].split('#')[0].startsWith('/explore');
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.isProfileMenuOpen = false;

    if (this.isMenuOpen && this.isExploreRoute) {
      this.isExploreOpen = true;
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleExplore(): void {
    this.isExploreOpen = !this.isExploreOpen;
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

}
