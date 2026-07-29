import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const landingGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getRegisterStep().pipe(
    map(res => {
      const currentStep = res.step;
        
      if(currentStep !== "DONE")
        return router.createUrlTree(['/onboarding']);

      return true;
    }),
    catchError(err => {
      console.error('Landing guard error:', err);
      return of(router.createUrlTree(['/']));
    })
  );  
};