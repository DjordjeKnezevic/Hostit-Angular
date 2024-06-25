import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { NgModel } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';
  redirectTo: string | null = null;

  @ViewChild('emailCtrl') emailCtrl!: NgModel;
  @ViewChild('passwordCtrl') passwordCtrl!: NgModel;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.redirectTo = params['redirect_to'];
    });
  }

  login(): void {
    this.userService.login(this.email, this.password).subscribe(
      () => {
        const redirectUrl = this.userService.getRedirectUrl();
        this.toastr.success('Login successful', 'Success');
        if (redirectUrl) {
          this.userService.clearRedirectUrl();
          this.router.navigateByUrl(redirectUrl);
        } else {
          if(this.userService.userValue?.role.name === 'Admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/profile']);
          }
        }
      },
      error => {
        this.errorMessage = error.error.error || 'An unexpected error occurred.';
      }
    );
  }
}
