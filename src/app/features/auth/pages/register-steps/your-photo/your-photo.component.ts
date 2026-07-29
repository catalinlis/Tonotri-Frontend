import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/auth.service';
import { UsersService } from '../../../../../core/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-your-photo',
  imports: [ CommonModule ],
  templateUrl: './your-photo.component.html',
  styleUrl: './your-photo.component.css',
})
export class YourPhotoComponent {
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  toastrService = inject(ToastrService);
  authService = inject(AuthService);
  usersService = inject(UsersService);
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  onFileSelected(event: any){
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 3 MB
    const input = event.target as HTMLInputElement;

    if(!file) return;

    if(file.size > maxSize){
      const sizeMB = (file.size / (1024*1024)).toFixed(2);
    
      this.toastrService.error(
        `File size is ${sizeMB}MB. Max allowed is 5MB`,
        'Upload Error'
      );
      input.value = '';
      this.previewUrl = null;

      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
      this.cdr.detectChanges();
    }
    reader.readAsDataURL(file);

  }

  async nextStep(){
    const nextRegistrationStep = "/onboarding/visited-countries";

    try{
      if(this.selectedFile)
        await this.uploadProfilePhoto(this.selectedFile);

      this.authService.nextRegistrationStep().subscribe({
        next: (res) => this.router.navigate([nextRegistrationStep])
      });
    }
    catch(error){
      console.log(error);
    }
  }

  uploadProfilePhoto(file: File):Promise<any>{
    return firstValueFrom(
      this.usersService.uploadProfilePhoto(file)
    );
  }
}

