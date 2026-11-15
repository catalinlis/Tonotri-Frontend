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
import { Dialog } from '@angular/cdk/dialog';
import { ToastrService } from 'ngx-toastr';
import { PhotoGalleryDialogComponent } from '../../../../shared/components/photo-gallery-dialog/photo-gallery-dialog.component';


@Component({
  selector: 'app-countries',
  imports: [CountrySelectComponent, 
            FormsModule, 
            CommonModule, 
            IgxCircularProgressBarComponent
          ],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css',
})
export class CountriesComponent {
  exploreService = inject(ExploreService);
  toastr = inject(ToastrService);
  sanitizer = inject(DomSanitizer);
  photoGallery = inject(Dialog);
  cdr=inject(ChangeDetectorRef);
  selectedCountry: any;
  countrySearch: boolean = false;
  descriptionReady: boolean = false;
  imagesReady = false;
  imagesUrls: SafeUrl[] = [];
  country: string = "";
  countryDescription: CountryDescription | null = null;
  private searchId = 0;

  async onSearch() {
    const selectedCountryName = this.selectedCountry?.translations?.en;

    if (!selectedCountryName || this.countrySearch) {
      return;
    }

    const searchId = ++this.searchId;
    try {
      this.countrySearch = true;
      this.imagesReady = false;
      this.descriptionReady = false;

      await Promise.all([
        this.loadCountryPhotos(selectedCountryName),
        this.loadCountryDescription(selectedCountryName)
      ]);

    } catch (error) {
      this.toastr.error('Unable to search for this country. Please try again.', 'Explore Error');
    } finally {
      if (searchId === this.searchId) {
        this.countrySearch = false;
        this.cdr.detectChanges();
      }
    }
  }

  async loadCountryPhotos(country: string){
    const searchId = this.searchId;
    this.imagesReady = false;

    try{
      const response = await firstValueFrom(this.exploreService.getLocationPhotos(country));
      if (searchId !== this.searchId) return;
      const urls = response.photo_urls;
      const images = await this.preloadImages(urls);
      if (searchId !== this.searchId) return;
      this.country = response.country;
      this.imagesUrls = images;
      this.imagesReady=true;
      this.cdr.detectChanges();
    } catch(error){
      if (searchId !== this.searchId) return;
      this.stopSearch();
      this.toastr.error('Unable to load country photos. Please try again.', 'Explore Error');
    }
  }

  openGallery(startIndex: number): void {
    if (!this.imagesUrls[startIndex]) {
      return;
    }

    this.photoGallery.open(PhotoGalleryDialogComponent, {
      data: {
        images: this.imagesUrls,
        startIndex,
        title: this.country
      },
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      panelClass: 'photo-gallery-dialog',
      backdropClass: 'photo-gallery-backdrop'
    });
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
    const searchId = this.searchId;
    this.descriptionReady = false;

    try{
      const description = await firstValueFrom(this.exploreService.getCountryDescription(country));
      if (searchId !== this.searchId) return;
      this.countryDescription = description;
      this.descriptionReady=true;
      this.cdr.detectChanges();
    } catch(error){
      if (searchId !== this.searchId) return;
      this.stopSearch();
      this.toastr.error('Unable to load the country description. Please try again.', 'Explore Error');
    }
  }

  private stopSearch(): void {
    // Ignore outstanding results from the failed search, including after a retry.
    ++this.searchId;
    this.countrySearch = false;
    this.cdr.detectChanges();
  }
}
