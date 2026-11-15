import { Component, inject, OnInit } from '@angular/core';
import { CountrySelectComponent } from '@wlucha/ng-country-select';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { ExploreService } from '../../services/explore.service';
import { City } from '../../models/city';
import { ClickOutsideDirective } from '../../../../core/directives/click-outside';
import { ChangeDetectorRef } from '@angular/core';
import { IgxCircularProgressBarComponent } from 'igniteui-angular/progressbar'; 
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CityDescription } from '../../models/city-description';
import { firstValueFrom, of } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { PhotoGalleryDialogComponent } from '../../../../shared/components/photo-gallery-dialog/photo-gallery-dialog.component';

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
            ClickOutsideDirective
          ],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css',
})
export class CitiesComponent implements OnInit{
  exploreService = inject(ExploreService);
  cdr = inject(ChangeDetectorRef);
  sanitizer = inject(DomSanitizer);
  photoGallery = inject(Dialog);
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
  private searchId = 0;

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
            return this.exploreService.getCountryCities(country, value!).pipe(
              catchError(error => {
                this.toastr.error('Unable to search for cities. Please try again.', 'Explore Error');
                this.dropdownOpen = false;
                return of([] as City[]);
              })
            );
          }
        )
      )
      .subscribe({
        next: (response) => {
          this.cities = response;
          this.searchFlag = false;
          this.cdr.detectChanges();
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
    this.searchControl.setValue(value, { emitEvent: false });
    this.selectedCity = city;
    this.dropdownOpen = false;
    this.searchFlag = false;
    this.cdr.detectChanges();
  }

  closeDropdown() {
    this.dropdownOpen = false;
    this.cdr.detectChanges();
  }

  async onSearch() {
    if (this.citySearch || !this.selectedCity || !this.selectedCountry) return;
    const searchId = ++this.searchId;
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
      this.toastr.error('Unable to search for this city. Please try again.', 'Explore Error');
    } finally {
      if (searchId === this.searchId) {
        this.citySearch = false;
        this.cdr.detectChanges();
      }
    }
  }

  async loadPhotos(country: string, city: string, population: number){
    const searchId = this.searchId;
    this.imagesReady = false;
    this.imagesUrls = [];

    try{
      const response = await firstValueFrom(this.exploreService.getLocationPhotos(country, city, population));
      if (searchId !== this.searchId) return;
      if(response.count > 0){
        const urls = response.photo_urls;
        const images = await this.preloadImages(urls);
        if (searchId !== this.searchId) return;
        this.country = response.country;
        this.imagesUrls = images;
        this.imagesReady=true;
        this.cdr.detectChanges();
      }
    } catch(error){
      if (searchId !== this.searchId) return;
      this.stopSearch();
      this.toastr.error('Unable to load city photos. Please try again.', 'Explore Error');
    }
  }

  openGallery(startIndex: number): void {
    if (!this.imagesUrls[startIndex]) {
      return;
    }

    const cityName = this.selectedCity?.name;
    const title = cityName ? `${cityName}, ${this.country}` : this.country;

    this.photoGallery.open(PhotoGalleryDialogComponent, {
      data: {
        images: this.imagesUrls,
        startIndex,
        title
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

  async loadCityDescription(country: string, city: string, population: number){
    const searchId = this.searchId;
    this.descriptionReady = false;

    try{
      const description = await firstValueFrom(this.exploreService.getCityDescription(country, city, population));
      if (searchId !== this.searchId) return;
      this.cityDescription = description;
      this.descriptionReady=true;
      this.cdr.detectChanges();
    } catch(error){
      if (searchId !== this.searchId) return;
      this.stopSearch();
      this.toastr.error('Unable to load the city description. Please try again.', 'Explore Error');
    }
  }

  private stopSearch(): void {
    // Ignore outstanding results from the failed search, including after a retry.
    ++this.searchId;
    this.citySearch = false;
    this.cdr.detectChanges();
  }
}
