import { Component, inject } from '@angular/core';
import { CountrySelectComponent } from '@wlucha/ng-country-select';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IgxCircularProgressBarComponent } from 'igniteui-angular/progressbar';
import { firstValueFrom } from 'rxjs';
import { ExploreService } from '../../services/explore.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { CountryDescription } from '../../models/country-description';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';


@Component({
  selector: 'app-countries',
  imports: [CountrySelectComponent, 
            FormsModule, 
            CommonModule, 
            IgxCircularProgressBarComponent,
            GalleryModule,
            LightboxModule
          ],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css',
})
export class CountriesComponent {
  exploreService = inject(ExploreService);
  sanitizer = inject(DomSanitizer);
  photoGallery = inject(MatDialog);
  overlay = inject(Overlay);
  cdr=inject(ChangeDetectorRef);
  gallery = inject(Gallery);
  selectedCountry: any;
  countrySearch: boolean = false;
  descriptionReady: boolean = false;
  imagesReady = false;
  imagesUrls: SafeUrl[] = [];
  country: string = "";
  countryDescription: CountryDescription | null = null;
  items: GalleryItem[] = [];
  galleryId = 'myLightbox';

  async onSearch() {
    try {
      this.countrySearch = true;
      const selectedCountryName = this.selectedCountry.translations?.en;

      if (!selectedCountryName) {
        return;
      }

      await Promise.all([
        this.loadCountryPhotos(selectedCountryName),
        this.loadCountryDescription(selectedCountryName)
      ]);

    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      this.countrySearch = false;
      this.cdr.detectChanges();
    }
  }

  async loadCountryPhotos(country: string){
    this.imagesReady = false;

    try{
      const response = await firstValueFrom(this.exploreService.getLocationPhotos(country));
      const urls = response.photo_urls;
      this.country = response.location;
      this.imagesUrls = await this.preloadImages(urls);
      this.loadGalleryImages(urls);
      this.imagesReady=true;
      this.cdr.detectChanges();
    } catch(error){
      console.error(error);
    }
  }

  loadGalleryImages(urls: string[]){
    this.items = urls.map(
        img => new ImageItem({ src: img, thumb: img })
    );

    const galleryRef = this.gallery.ref(this.galleryId);
    galleryRef.load(this.items);
  }

  preloadImages(urls: string[]): Promise<SafeUrl[]>{
    const promises = urls.map(url => {
      return new Promise<SafeUrl>((resolve) => {
        const img = new Image();
        
        img.onload = () => {
          resolve(this.sanitizer.bypassSecurityTrustUrl(url));
        }
        
        img.onerror = () => {
          console.warn('Failed image:', url);
          resolve(this.sanitizer.bypassSecurityTrustUrl(url))
        }
        img.src = url;

      });
    });
    
    return Promise.all(promises);
  }

  async loadCountryDescription(country: string){
    this.descriptionReady = false;

    try{
      this.countryDescription = await firstValueFrom(this.exploreService.getCountryDescription(country));
      this.descriptionReady=true;
      this.cdr.detectChanges();
    } catch(error){
      console.error(error);
    }
  }

}
