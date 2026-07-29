import { Component, OnInit } from '@angular/core';
import { CountrySelectComponent } from '@wlucha/ng-country-select';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as L from 'leaflet';
import worldData from '../../../../../../assets/world.json';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { UsersService } from '../../../../../core/services/users.service';
import { firstValueFrom } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-choose-visited-countries',
  imports: [CountrySelectComponent, CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './choose-visited-countries.component.html',
  styleUrl: './choose-visited-countries.component.css',
})
export class ChooseVisitedCountriesComponent implements OnInit{
  countriesChoosed: boolean = false;
  countriesChoosenCounter = 0;
  selectedCountries: any[] = [];
  countryControl = new FormControl(null);
  map!: L.Map;
  geoJsonLayer!: L.GeoJSON;
  highlightedCountries: string[] = [];

  constructor(private authService: AuthService, private usersService: UsersService, private router: Router){}

  ngOnInit(): void {
    this.map = L.map('map', {
      attributionControl: false,
      zoomSnap: 0.1,   // ✅ Allows fractional zoom levels
      zoomDelta: 0.1,  // ✅ Smoother manual zooming
      zoomControl: false
    }).setView([20, 20], 2);
      
    L.control.zoom({
      zoomInText: '<img src="assets/plus.png" width="30px">',
      zoomOutText: '<img src="assets/minus.png" width="30px">',
      position: 'topright'
    }).addTo(this.map);
  
    this.geoJsonLayer = L.geoJSON(worldData as any, {
      style: (feature: any) => {
        const isHighlighted = this.highlightedCountries.includes(feature.properties.iso_a2_eh.toLowerCase());
  
        return {
          color: '#fff',
          weight: 1,
          fillColor: isHighlighted ? '#f9c700' : '#e0e0e0',
          fillOpacity: 1
        };
      },
  
      onEachFeature: (feature: any, layer: L.Layer) => {
  
        // ✅ Tooltip (text on hover)
        layer.bindTooltip(feature.properties.name, {
          sticky: true // follows mouse
        });
  
        // ✅ Optional: highlight on hover
        
        layer.on({
          mouseover: (e: any) => {
            const isSelected = this.highlightedCountries.includes(feature.properties.iso_a2_eh.toLowerCase());
  
            e.target.setStyle({
              fillColor: isSelected ? '#f9c700' : '#2b7bff'
            });
          },
  
          mouseout: (e: any) => {
            const isSelected = this.highlightedCountries.includes(feature.properties.iso_a2_eh.toLowerCase());
            e.target.setStyle({
              fillColor: isSelected ? '#f9c700' : '#e0e0e0'
            })
          }
        });
      }
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
      this.map.fitBounds(this.geoJsonLayer.getBounds(), {
        padding: [25, 25] // Keeps the continent from touching the div edges
      });
    }, 0);
  
    L.control.attribution({
      prefix: false
    }).addTo(this.map);
  }

  selectCountryOnMap(feature: any){
    const isHighlighted = this.highlightedCountries.includes(feature.properties.iso_a2_eh.toLowerCase());

    return {
      color: '#fff',
      weight: 1,
      fillColor: isHighlighted ? '#f9c700' : '#e0e0e0',
      fillOpacity: 1
    }
  }

  updateMap() {
    if (!this.geoJsonLayer) return;

    this.geoJsonLayer.setStyle((feature: any) =>
      this.selectCountryOnMap(feature)
    );
  }
  
  onCountryChange(country: any){
    if(!this.selectedCountries.find(c => c.alpha2 === country.alpha2)){
      this.selectedCountries.push(country);
      this.highlightedCountries.push(country.alpha2);
      this.updateMap();
      this.countriesChoosed = true;
      this.countriesChoosenCounter++;
    }
  }

  async skipToNextStep(){
    const nextRegistrationStep = "/";

    try{
      if(this.countriesChoosed)
        await this.addCountries(this.highlightedCountries);

      this.authService.nextRegistrationStep().subscribe({
        next: (res) => this.router.navigate([nextRegistrationStep])
      })
    }
    catch(error){
      console.log(error);
    }
  }

  addCountries(codes: string[]): Promise<any>{
    return firstValueFrom(
      this.usersService.addVisitedCountries(codes)
    );
  }
}
