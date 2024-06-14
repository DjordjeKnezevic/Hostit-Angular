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

    this.userService.checkUserByEmail(this.email).subscribe(users => {
      const user = users[0];

      if (!user) {
        this.errorMessage = 'User does not exist';
        this.toastr.error(this.errorMessage, 'Error');
      } else if (!this.userService.validatePassword(user, this.password)) {
        this.errorMessage = 'Incorrect password';
        this.toastr.error(this.errorMessage, 'Error');
      } else {
        this.userService.login(user.email, this.password).subscribe(
          () => {
            this.toastr.success('Login successful', 'Success');
            this.router.navigate(['/']);
          },
          (error) => {
            this.errorMessage = error.message;
            this.toastr.error(this.errorMessage, 'Error');
          }
        );
      }
    });
  }
}
