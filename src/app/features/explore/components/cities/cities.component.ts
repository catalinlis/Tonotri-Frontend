import { Component, inject, OnInit } from '@angular/core';
import { CountrySelectComponent } from '@wlucha/ng-country-select';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { ExploreService } from '../../services/explore.service';
import { City } from '../../models/city';
import { ClickOutsideDirective } from '../../../../core/directives/click-outside';
import { ChangeDetectorRef } from '@angular/core';
import { IgxCircularProgressBarComponent } from 'igniteui-angular/progressbar'; 
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CityDescription } from '../../models/city-description';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [CountrySelectComponent, 
            CommonModule, 
            FormsModule, 
            ReactiveFormsModule, 
            MatInputModule, 
            MatFormFieldModule,
            IgxCircularProgressBarComponent,
            ClickOutsideDirective,
            GalleryModule,
            LightboxModule
          ],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css',
})
export class CitiesComponent implements OnInit{
  exploreService = inject(ExploreService);
  cdr = inject(ChangeDetectorRef);
  sanitizer = inject(DomSanitizer);
  photoGallery = inject(MatDialog);
  toastr = inject(ToastrService);
  searchControl = new FormControl('');
  selectedCountry: any;
  selectedCity: City | null = null;
  cities: City[] = [];
  dropdownPosition: 'top' | 'bottom' = 'bottom';
  dropdownOpen: boolean = false;
  searchFlag: boolean = false;
  descriptionReady: boolean = false;
  imagesReady = false;
  imagesUrls: SafeUrl[] = [];
  country: string = "";
  cityDescription: CityDescription | null = null;
  citySearch: boolean = false;
  items: GalleryItem[] = [];
  gallery = inject(Gallery);
  galleryId = 'myLightbox';

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(1000), // wait after typing
        distinctUntilChanged(),
        filter(value => {
            if(!this.selectedCountry){
              if(!!value && value.length >= 1){
                this.searchControl.setValue('');
                this.toastr.error('First you have to select country');
              }

              return false;
            }

            return !!value && value.length >= 1;
          }),
        switchMap(value => {
            this.searchFlag = true;
            this.dropdownOpen = true;
            this.cdr.detectChanges();
            const country = this.selectedCountry.alpha2;
            return this.exploreService.getCountryCities(country, value!);
          }
        )
      )
      .subscribe({
        next: (response) => {
          this.cities = response;
          this.searchFlag = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.cities = [];
          this.dropdownOpen = false;
          this.searchFlag = false;
        }
      });
  }
  
  updateDropdownPosition(inputElement: HTMLElement) {
    const rect = inputElement.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const dropdownHeight = 250;

    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      this.dropdownPosition = 'top';
    } else {
      this.dropdownPosition = 'bottom';
    }
  }

  selectCity(city: City): void {
    const value = city.name;
    this.searchControl.setValue(value);
    this.selectedCity = city;
  }

  closeDropdown() {
    this.dropdownOpen = false;
    this.cdr.detectChanges();
  }

  async onSearch() {
    try {
      this.citySearch = true;
      const selectedCity = this.selectedCity;
      const selectedCountryName = this.selectedCountry.translations?.en;

      if (!selectedCity) {
        return;
      }

      const country = selectedCountryName;
      const city = selectedCity.name;
      const population = selectedCity.population;

      await Promise.all([
        this.loadPhotos(country, city, population),
        this.loadCityDescription(country, city, population)
      ]);

      this.cdr.detectChanges();

      console.log(this.cityDescription);

    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      this.citySearch = false;
      this.cdr.detectChanges();
    }
  }

  async loadPhotos(country: string, city: string, population: number){
    this.imagesReady = false;
    this.imagesUrls = [];

    try{
      const response = await firstValueFrom(this.exploreService.getLocationPhotos(country, city, population));
      if(response.count > 0){
        const urls = response.photo_urls;
        this.country = response.location;
        this.imagesUrls = await this.preloadImages(urls);
        this.loadGalleryImages(urls);
        this.imagesReady=true;
        this.cdr.detectChanges();
      }
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

  async loadCityDescription(country: string, city: string, population: number){
    this.descriptionReady = false;

    try{
      this.cityDescription = await firstValueFrom(this.exploreService.getCityDescription(country, city, population));
      this.descriptionReady=true;
      this.cdr.detectChanges();
    } catch(error){
      console.error(error);
    }
  }

}
