import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  http = inject(HttpClient);
  
  getProfilePhoto(id: string): Observable<any>{
      return this.http.get<{url: string}>(`/api/media/images/${id}`);
  }
}
