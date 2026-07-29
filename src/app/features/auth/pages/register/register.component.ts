import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { REGISTER_ERRORS } from '../../../../core/constants/register-errors';
import { AuthService } from '../../../../core/services/auth.service';
import { getDayFromDateObject } from '../../../../shared/utils/date-functions';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        MatButtonToggleModule,
        ReactiveFormsModule,
        CommonModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent{
    private readonly fieldOrder = [
        'username',
        'email',
        'first_name', 
        'last_name',
        'birthday',
        'gender',
        'password1',
        'password2',
        'form'
    ];
    error: { field: string, message: string } | null = null;
    step: string = 'register';
    registerForm!: FormGroup;

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {
        this.registerForm = this.fb.group(
            {
                username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*$/)]],
                first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(/^[A-Za-z]+(-[A-Za-z]+)?$/)]],
                last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(/^[A-Za-z]+(-[A-Za-z]+)?$/)]],
                email: ['', [Validators.required, Validators.email]],
                birthday: [null, [Validators.required, this.ageValidator(18)]],
                gender: [null, [Validators.required]],
                password1: ['', [Validators.required, Validators.minLength(8),
                            Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).*$/)]],
                password2: ['', Validators.required]
            },
            {
                validators: this.passwordMatchValidator()
            }
        );
    }

    toggleForms(){
        if(this.step === 'verify')
            this.step = 'register';
        else
            this.step = 'verify';
    }

    passwordMatchValidator(): ValidatorFn{
        return (group: AbstractControl): ValidationErrors | null => {
            const password = group.get('password1')?.value;
            const repeatPassword = group.get('password2')?.value;
            return password === repeatPassword ? null : { passwordMismatch: true };
        };
    }

    ageValidator(minAge: number = 18): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {

        if (!control.value) return null; // let required handle empty

            const birthDate = new Date(control.value);
            const today     = new Date();

            if (isNaN(birthDate.getTime())) {
                return { invalidDate: true };
            }

            if (birthDate > today) {
                return { futureDate: true };
            }

            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff   = today.getDate()  - birthDate.getDate();

            const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;

            if (actualAge < minAge) {  
                return { underage: { requiredAge: minAge, actualAge } };
            }

            return null;
        };
    }

    getFirstFormError(): { field: string; message: string } | null{
        const field = this.fieldOrder.find(field => {
            const control = this.registerForm.get(field);
            return control?.errors && control?.touched;
        });

        if(field){
            const control = this.registerForm.get(field);
            const firstKey = Object.keys(control!.errors!)[0];
            const message = REGISTER_ERRORS[field]?.[firstKey] ?? `Invalid: ${firstKey}`;

            return { field, message };
        }

        // 2. Check form-level errors (e.g., passwordMismatch)
        if (this.registerForm.errors) {
            const firstKey = Object.keys(this.registerForm.errors)[0];
            const message =
            REGISTER_ERRORS['form'][firstKey] ?? `Invalid: ${firstKey}`;

            return { field: 'form', message };
        }

        return null;

    }

    getFirstBackendError(error: HttpErrorResponse): {field: string, message: string} | null {
        const field = this.fieldOrder.find(field => {
            const key = error.error[field];
            return key && key.length > 0;
        });

        if(field)
            return { field: field, message: error.error[field][0] };

        return null;
    }

    onSubmit(): void{
        this.registerForm.markAllAsTouched();

        if(this.registerForm.valid){

            const formData = {
                ...this.registerForm.value,
                birthday: getDayFromDateObject(this.registerForm.value.birthday)
            }

            this.authService.register(formData).subscribe({
                next: (response) => {
                    this.router.navigateByUrl(`/confirm?guid=${response.guid}`);
                },
                error: (error: HttpErrorResponse) => {
                    this.error = this.getFirstBackendError(error);

                    this.cdr.detectChanges();
                }

            })
        }
        else{
            this.error = this.getFirstFormError();
        }
        
    }
}
