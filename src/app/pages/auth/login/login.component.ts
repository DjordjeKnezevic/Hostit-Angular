import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  remember: boolean = false;
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  onSubmit() {
    this.errorMessage = '';

    this.userService.checkUserByEmail(this.email).subscribe(user => {
      if (!user) {
        this.errorMessage = 'User does not exist';
      } else if (!this.userService.validatePassword(user, this.password)) {
        this.errorMessage = 'Incorrect password';
      } else {
        this.userService.login(user.email, this.password).subscribe(
          () => {
            this.toastr.success('Login successful', 'Success');
            this.router.navigate(['/']);
          },
          (error) => {
            this.errorMessage = error.message;
          }
        );
      }
    });
  }
}
