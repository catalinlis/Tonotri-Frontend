import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, Observable, of, switchMap, tap } from 'rxjs';
import { UserDetailedInfo } from '../../features/community/models/user-detailed-info';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  readonly currentUser = signal<UserDetailedInfo | null>(null);
  readonly userLoading = signal(true);

  googleLogin(idToken: string) {
    return this.http.post(
      `/api/auth/social/google/`,
      { code: idToken },
      { withCredentials: true }
    ).pipe(
      switchMap(() => this.restoreSession())
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
    return this.http.post(`/api/auth/login/`, model).pipe(
      switchMap(() => this.restoreSession())
    );
  }

  register(model: FormData){
    return this.http.post<{guid: string}>(`/api/auth/register/`, model);
  }

  logout(): Observable<any> {
    return this.http.post(`/api/auth/logout/`, {}).pipe(
      finalize(() => {
        this.currentUser.set(null);
        this.clearLoginCookie();
      })
    );
  }

  getProfile(): Observable<any> {
    return this.http.get(`/api/auth/profile/`);
  }

  getDetailedPersonalInfo(): Observable<UserDetailedInfo>{
    return this.http.get<UserDetailedInfo>(`/api/users/me`);
  }

  restoreSession(): Observable<UserDetailedInfo | null> {
    this.userLoading.set(true);

    if (!this.isAuthenticated()) {
      this.currentUser.set(null);
      this.userLoading.set(false);
      return of(null);
    }

    return this.getDetailedPersonalInfo().pipe(
      tap(user => this.currentUser.set(user)),
      catchError(() => {
        this.currentUser.set(null);
        this.clearLoginCookie();
        return of(null);
      }),
      finalize(() => this.userLoading.set(false))
    );
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
