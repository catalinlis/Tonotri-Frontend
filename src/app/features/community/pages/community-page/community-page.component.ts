import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProfileLayout } from '../../components/profile-layout/profile-layout';
import { UsersService } from '../../../../core/services/users.service';
import { firstValueFrom } from 'rxjs';
import { UserDetailedInfo } from '../../models/user-detailed-info';
import { MediaService } from '../../../../core/services/media.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-community-page',
  standalone: true,
  imports: [ProfileLayout],
  templateUrl: './community-page.component.html',
  styleUrl: './community-page.component.css',
})
export class CommunityPageComponent implements OnInit{
  userService = inject(UsersService);
  mediaService = inject(MediaService);
  cdr = inject(ChangeDetectorRef);
  usersDetailedInfo: UserDetailedInfo | null = null;
  profilePhotoUrl: string | null = null;
  profileComponentLoaded: boolean = false;

  ngOnInit(): void {
    try {
      this.getDetailedPersonalInfo();
    } catch (error) {
      console.error('Search failed:', error);
    }  
  }
  

  getDetailedPersonalInfo(){
    try{
      this.userService.getDetailedPersonalInfo().subscribe({
        next: (response) => {
          this.usersDetailedInfo = response;
          if(this.usersDetailedInfo.profile_image){
            let photo_id_string = this.usersDetailedInfo.profile_image.toString();
            this.getProfilePhoto(photo_id_string);
          }
          
        }
      });
    } catch(error){
      console.error(error);
    }
  }

  getProfilePhoto(id: string){
    this.mediaService.getProfilePhoto(id).subscribe({
      next: (response) => {
        const img = new Image();
        const url = response.url;

        img.onload = () => {
          console.log('IMAGE LOADED:', url);
          this.profilePhotoUrl = url;
          this.profileComponentLoaded = true;
          this.cdr.detectChanges();
        };

        img.onerror = () => {
          console.error('Failed to load profile photo');
        };

        img.src = response.url;
      },
      error: (err) => {
        console.error(err.error);
        this.profilePhotoUrl = null;
        this.profileComponentLoaded = true;
      }
        
    })
  }
  
  

}
