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
          console.log(this.usersDetailedInfo);
          if(this.usersDetailedInfo.image_path){
            
            const img = new Image();
            const url = this.usersDetailedInfo.image_path

            img.onload = () => {
              console.log('IMAGE LOADED:', url);
              this.profilePhotoUrl = url;
              this.profileComponentLoaded = true;
              this.cdr.detectChanges();
            };

            img.onerror = () => {
              console.error('Failed to load profile photo');
            };

            img.src = this.usersDetailedInfo.image_path
          }
          else{
            this.profileComponentLoaded = true;
            this.cdr.detectChanges();
          }
        }
      });
    } catch(error){
      console.error(error);
      this.profileComponentLoaded = true;
      this.cdr.detectChanges();
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
