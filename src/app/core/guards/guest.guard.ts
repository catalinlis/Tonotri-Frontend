import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export const guestGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return of(true); // No flag → skip API call, allow login page
  }

  return auth.getProfile().pipe(
    map((res) => {
      router.navigate(['/']);  // ✅ already logged in, go to profile
      return false;
    }),
    catchError(() => {
      auth.clearLoginCookie();
      return of(true);
    } 
  ));
};
