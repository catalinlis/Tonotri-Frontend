import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  googleLogin(idToken: string) {
    return this.http.post(
      `/api/auth/social/google/`,
      { code: idToken },
      { withCredentials: true }
    );
  }

  isAuthenticated(): boolean {
    return document.cookie.split("; ")
            .find(row => row.startsWith('loggedIn='))
            ?.split('=')[1] === 'true';
  }

  clearLoginCookie() {
    document.cookie = 'loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }


  login(model: any){
    return this.http.post(`/api/auth/login/`, model);
  }

  register(model: FormData){
    return this.http.post<{guid: string}>(`/api/auth/register/`, model);
  }

  logout(): Observable<any> {
    return this.http.post(`/api/auth/logout/`, {});
  }

  getProfile(): Observable<any> {
    return this.http.get(`/api/auth/profile/`);
  }

  tokenCheck(guid: string): Observable<any>{
    return this.http.get(`/api/token/check/?guid=${guid}`);
  }

  tokenGeneration(guid: string | null): Observable<any>{
    const form = new FormData();
    form.append('guid', guid!);
    return this.http.post(`/api/token/generation/`, form);
  }

  tokenValidation(guid: string | null, code: string): Observable<any>{
    const form = new FormData();
    form.append('guid', guid!);
    form.append('code', code);
    return this.http.post(`/api/token/validation/`, form);
  }

  getRegisterStep(): Observable<any>{
    return this.http.get<{step: string}>(`/api/registration/step/`);
  }

  nextRegistrationStep(): Observable<any>{
    return this.http.post(`/api/registration/next/`, null);
  }

  
}
