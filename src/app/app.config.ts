import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { GALLERY_CONFIG, GalleryConfig } from 'ng-gallery';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled', // NOT 'top'
        anchorScrolling: 'enabled',
      }),
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
      timeOut: 4000,
      progressBar: true,
      preventDuplicates: true,
    }),
    {
      provide: GALLERY_CONFIG,
      useValue: {
        imageSize: 'contain',   // 👈 important
        thumbPosition: 'bottom',
        autoHeight: true
      } as GalleryConfig
    }
  ],
};
