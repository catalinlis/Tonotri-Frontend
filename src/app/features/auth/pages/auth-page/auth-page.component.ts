import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { config } from '../../../../core/constants/app.constants';
import { CommonModule } from '@angular/common';
import { LOGIN_ERRORS } from '../../../../core/constants/login-errors';
import { ChangeDetectorRef } from '@angular/core';

declare const google: any;

@Component({
    selector: 'app-auth-page',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './auth-page.component.html',
    styleUrl: './auth-page.component.css'
})
export class AuthPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  error: { field: string, message: string } | null = null;
  fieldsOrder: string[] = ['login', 'password'];
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef){
    this.loginForm = this.fb.group(
      {
        username: ["", [Validators.required]],
        password: ["", [Validators.required]]
      }
    );
  }

  getFirstFormError(): { field: string; message: string } | null{
    const field = this.fieldsOrder.find(field => {
      const control = this.loginForm.get(field);
      return control?.errors;
    });
  
    if(field){
      const control = this.loginForm.get(field);
      const firstKey = Object.keys(control!.errors!)[0];
      const message = LOGIN_ERRORS[field]?.[firstKey] ?? `Invalid: ${firstKey}`;
  
      return { field, message };
    }
  
    return null;
  
  }

  signInWithGoogle() {
    const client = google.accounts.oauth2.initCodeClient({
      client_id: config.googleClientId,
      scope: 'openid email profile',
      redirect_uri: 'postmessage',
      callback: (response: any) => {
        this.handleAuthCode(response.code);
      }
    });

    client.requestCode(); // 👈 THIS triggers popup
  }

  handleAuthCode(code: string) {
    // Send the code to your Django backend
    this.authService.googleLogin(code).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        console.error('Google login error', err);
      }
    });
  }
  
  login(): void{
    if(this.loginForm.valid){
      console.log(this.loginForm);
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          
          // If there is any error of the form delete them
          if(this.error!==null){
            this.error=null; 
          }
          
          // Redirect to the / page which is the profile
          this.router.navigateByUrl('/');
        },
        error: (err) => {
            
            if(err.error && err.status===403 && 'guid' in err.error){
              this.router.navigateByUrl(`/confirm?guid=${err.error.guid}`);
              return;
            }

            this.error = { field: 'backend', message: LOGIN_ERRORS['backend']['credentials'] }
            this.cdr.detectChanges();
        }
      });
    } else{
      this.error = this.getFirstFormError();
    }
  }

  signUp(){
    this.router.navigateByUrl('/register');
  }
}
