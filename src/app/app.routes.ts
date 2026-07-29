import { RedirectCommand, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AuthPageComponent } from './features/auth/pages/auth-page/auth-page.component';
import { guestGuard } from './core/guards/guest.guard';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { ConfirmAccountComponent } from './features/auth/pages/confirm-account/confirm-account.component';
import { tokenCheckGuard } from './core/guards/token-check.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ChooseVisitedCountriesComponent } from './features/auth/pages/register-steps/choose-visited-countries/choose-visited-countries.component';
import { YourPhotoComponent } from './features/auth/pages/register-steps/your-photo/your-photo.component';
import { registrationStepGuard } from './core/guards/registration-step.guard';
import { landingGuard } from './core/guards/landing.guard';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard, landingGuard],
        children: [
            {   path: '',   redirectTo: 'community',    pathMatch: 'full'   },
            {   path: 'community',  loadChildren: () => import('./features/community/community.routes').then(m => m.CommunityRoutingModule) },
            {   path: 'explore',  loadChildren: () => import('./features/explore/explore.routes').then(m => m.ExploreRoutingModule) }
        ]
    },
    {
        path: 'onboarding',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {   path: '',   redirectTo: 'visited-countries',    pathMatch: 'full'   },
            {   path: 'visited-countries',  component: ChooseVisitedCountriesComponent, canActivate: [registrationStepGuard]    },
            {   path: 'your-photo',         component: YourPhotoComponent,              canActivate: [registrationStepGuard]    }
        ]
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {   path: "login", component: AuthPageComponent, canActivate: [guestGuard]},
            {   path: "register", component: RegisterComponent, canActivate: [guestGuard] },
            {   path: "confirm", component: ConfirmAccountComponent, canActivate: [tokenCheckGuard] }
        ]
    }
];
