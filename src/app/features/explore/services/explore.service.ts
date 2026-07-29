import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CountryDescription } from '../models/country-description';
import { City } from '../models/city';
import { CityDescription } from '../models/city-description';

@Injectable({
  providedIn: 'root',
})
export class ExploreService {
  http = inject(HttpClient);

  getLocationPhotos(country: string, city?: string, population?: number){
    const query = city ? `/api/explore/location-photos/?country=${country}&city=${city}&population=${population}` 
                       : `/api/explore/location-photos/?country=${country}`;
    
    return this.http.get<{photo_urls:string[]; location: string, count: number}>(query);
  }

  getCountryDescription(country: string){
    return this.http.get<CountryDescription>(`api/explore/country-description/?country=${country}`);
  }

  getCountryCities(country: string, search: string){
    return this.http.get<City[]>(`/api/explore/country-cities/?country=${country}&search=${search}`);
  }

  getCityDescription(country: string, city: string, population: number){
    return this.http.get<CityDescription>(`/api/explore/city-description/?country=${country}&city=${city}&population=${population}`);
  }
}
