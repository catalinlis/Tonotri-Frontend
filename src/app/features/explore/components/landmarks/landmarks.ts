import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ExploreService } from '../../services/explore.service';
import { Landmark } from '../../models/landmark';
import { IgxCircularProgressBarComponent } from 'igniteui-angular/progressbar';
import { LandmarkDescription } from '../../models/landmark-description';

@Component({
  selector: 'app-landmarks',
  imports: [
            CommonModule, 
            FormsModule, 
            ReactiveFormsModule, 
            MatInputModule, 
            MatFormFieldModule,
            IgxCircularProgressBarComponent
  ],
  templateUrl: './landmarks.html',
  styleUrl: './landmarks.css',
})
export class Landmarks {
  exploreService = inject(ExploreService);
  toastr = inject(ToastrService);
  cdr = inject(ChangeDetectorRef);
  searchControl = new FormControl('');
  landmark: Landmark | null = null;
  descriptionReady: boolean = false;
  landmarkDescription: LandmarkDescription | null = null;
  searchFlag = false;

  async onSearchLandmark() {
    if (this.searchFlag) return;
    try {
      this.searchFlag = true;
      this.descriptionReady = false;
      this.landmarkDescription = null;
      this.landmark = null;
      const landmarkName = this.searchControl.value;

      if (!landmarkName) {
        return;
      }

      await Promise.all([
        this.loadLandmarkVariation(landmarkName)
      ]);

    } catch (error) {
      this.toastr.error('Unable to search for this landmark. Please try again.', 'Explore Error');
    } finally {
      this.searchFlag = false;
      this.cdr.detectChanges();
    }
  }

  async loadLandmarkVariation(landmark: string){
  
    try{
      this.landmark = await firstValueFrom(this.exploreService.getLandmarkVariations(landmark));
    } catch(error){
      this.searchFlag = false;
      this.cdr.detectChanges();
      this.toastr.error('Unable to find this landmark. Please try again.', 'Explore Error');
    }
  }

  async onSearchLandmarkDescription() {
    if (this.searchFlag) return;
    try {
      this.searchFlag = true;
      const landmarkDetails = this.landmark;

      if (!landmarkDetails) {
        return;
      }

      const landmark = landmarkDetails.official_name;
      const city = landmarkDetails.city;
      const country = landmarkDetails.country;

      await Promise.all([
        this.loadLandmarkDescription(landmark, city, country)
      ]);

      console.log(this.landmarkDescription);

    } catch (error) {
      this.toastr.error('Unable to load landmark details. Please try again.', 'Explore Error');
    } finally {
      this.searchFlag = false;
      this.cdr.detectChanges();
    }
  }

  async loadLandmarkDescription(landmark: string, country: string, city: string){
    this.descriptionReady = false;

    try{
      this.landmarkDescription = await firstValueFrom(this.exploreService.getLandmarkDescription(landmark, country, city));
      this.descriptionReady=true;
      this.cdr.detectChanges();
    } catch(error){
      this.searchFlag = false;
      this.cdr.detectChanges();
      this.toastr.error('Unable to load the landmark description. Please try again.', 'Explore Error');
    }
  }

}
