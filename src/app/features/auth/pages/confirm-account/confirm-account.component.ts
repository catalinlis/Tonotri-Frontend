import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { interval, Subscribable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CONFIRM_TOKEN_ERRORS } from '../../../../core/constants/confirm-token-errors';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-confirm-account',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './confirm-account.component.html',
  styleUrl: './confirm-account.component.css',
})
export class ConfirmAccountComponent implements OnInit, OnDestroy {
    private authService = inject(AuthService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    error: string | null = null;
    oneMinute: number = 60;
    remainingSeconds: number = this.oneMinute;
    timerSub!: Subscription;
    codeExpired: boolean = false;
    sendButtonDisabled: boolean = false;
    start = false;
    guid: string | null = null;
    formError: { field: string, message: string } | null = null;
    form!: FormGroup;

    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef){
      this.form = this.fb.group(
        {
          code : ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
        }
      );
    }

    ngOnInit(): void {
      this.sendCode();
    }

    ngOnDestroy(): void {
        this.timerSub?.unsubscribe();
    }

    startTimer(){
      this.timerSub = interval(1000).subscribe(() => {
        if(this.remainingSeconds > 0)
          this.remainingSeconds--;
        else{
          this.codeExpired = true;
          this.sendButtonDisabled = false;
          this.timerSub.unsubscribe();
        }
        this.cdr.detectChanges();
      })
    }

    get timeAsDate(): Date{
      return new Date(0,0,0,0,0,this.remainingSeconds);
    }

    getFirstFormError(): { field: string; message: string } | null{
      const field = 'code';
      const control = this.form.get(field);
      const isError = control?.errors && control?.touched;
    
      if(isError){
        const control = this.form.get(field);
        const firstKey = Object.keys(control!.errors!)[0];
        const message = CONFIRM_TOKEN_ERRORS[field]?.[firstKey] ?? `Invalid: ${firstKey}`;
    
        return { field, message };
      }

      return null;
      
    }

    onSubmit(){
      this.form.markAllAsTouched();
      this.guid = this.route.snapshot.queryParamMap.get('guid');

      if(this.form.valid){
        this.authService.tokenValidation(this.guid, this.form.value.code).subscribe({
          next: (response) => this.router.navigateByUrl('/login'),
          error: (error) => {
            this.formError = { field: "backend", message: error.error.error }
          }
        });
      }
      else{
        this.formError = this.getFirstFormError();
      }
    }

    sendCode(){
      this.guid = this.route.snapshot.queryParamMap.get('guid');

      this.authService.tokenGeneration(this.guid).subscribe({
        next: (response) => {
          this.remainingSeconds = this.oneMinute;
          this.codeExpired = false;
          this.sendButtonDisabled = true;
          this.start = true;
          this.startTimer();
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.formError = { field: "backend", message: error.error.error };
          this.cdr.detectChanges();
        }
      });
    }




}
