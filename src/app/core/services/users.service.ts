import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfilePhoto } from '../../features/auth/models/profile-photo';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  http = inject(HttpClient);

  uploadProfilePhoto(file: File): Observable<any>{
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<ProfilePhoto>(`/api/users/me/profile-photo/`, formData);
  }

  addVisitedCountries(codes: string[]): Observable<any>{
    
    return this.http.put(`/api/users/me/countries/`, {
      'codes': codes
    });
  }


}
