import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { REGISTRATION_STEPS } from '../constants/registration-steps';

export const registrationStepGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getRegisterStep().pipe(
    map(res => {
        const currentStep = res.step;
        const expectedUrl = REGISTRATION_STEPS[currentStep];
        const currentUrl = state.url.split('?')[0];

        // ✅ allow correct step
        if (currentUrl.includes(expectedUrl)) {
          return true;
        }
        
        return router.createUrlTree([expectedUrl]);
    }
    ),
    catchError(err => {
      console.log(err);
      return of(router.createUrlTree(['/']));
    })
  )
}