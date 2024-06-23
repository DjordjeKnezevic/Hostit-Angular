import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../services/user.service';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/)
      ]]
    });
  }

  ngOnInit() {
    this.registerForm.get('email')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(value => this.userService.checkUserByEmail(value).pipe(
        catchError(() => of({ exists: false }))
      ))
    ).subscribe(response => {
      if (response.exists) {
        this.registerForm.get('email')?.setErrors({ emailExists: true });
      } else {
        this.registerForm.get('email')?.setErrors(null);
      }
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onEmailBlur() {
    const emailControl = this.f['email'];
    if (emailControl.valid) {
      this.userService.checkUserByEmail(emailControl.value).subscribe(response => {
        if (response.exists) {
          emailControl.setErrors({ emailExists: true });
        } else {
          emailControl.setErrors(null);
        }
      });
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      console.log('Form is invalid');
      return;
    }

    const newUser = {
      ...this.registerForm.value,
      role_id: '1'
    };

    this.userService.register(newUser).subscribe(
      () => {
        this.userService.login(newUser.email, newUser.password).subscribe(
          () => {
            this.toastr.success('Registration successful, you are now logged in', 'Success');
            this.router.navigate(['/']);
          },
          error => {
            this.toastr.error(error.message, 'Login Error');
          }
        );
      },
      error => {
        if (error.error && error.error.email) {
          this.toastr.error(error.error.email[0], 'Registration Error');
        } else {
          this.toastr.error('Registration failed. Please try again later.', 'Registration Error');
        }
      }
    );
  }

  getFieldErrors(fieldName: string): string[] {
    const control = this.registerForm.get(fieldName);
    if (!control || !control.errors || (!control.touched && !control.dirty)) {
      return [];
    }

    const errors = control.errors;
    const errorMessages: string[] = [];

    if (errors['required']) {
      errorMessages.push(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
    }
    if (errors['minlength']) {
      errorMessages.push(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${errors['minlength'].requiredLength} characters`);
    }
    if (errors['email']) {
      errorMessages.push(`Invalid email format`);
    }
    if (errors['pattern']) {
      errorMessages.push(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must contain at least one uppercase letter, one number, and one special character`);
    }
    if (errors['emailExists']) {
      errorMessages.push(`Email already exists`);
    }

    return errorMessages;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }
}
