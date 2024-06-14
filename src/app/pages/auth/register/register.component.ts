import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
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
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onEmailBlur() {
    const emailControl = this.f['email'];
    if (emailControl.valid) {
      this.userService.checkUserByEmail(emailControl.value).subscribe(users => {
        if (users && users.length > 0) {
          emailControl.setErrors({ emailExists: true });
          this.toastr.error('Email already exists', 'Registration Error');
        }
      });
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
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
        this.toastr.error(error.message, 'Registration Error');
      }
    );
  }
}
