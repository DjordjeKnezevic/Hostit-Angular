import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';

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

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.redirectTo = params['redirect_to'];
    });
  }

  login(): void {
    this.userService.login(this.email, this.password).subscribe(
      () => {
        const redirectUrl = this.userService.getRedirectUrl();
        if (redirectUrl) {
          this.userService.clearRedirectUrl();
          this.router.navigateByUrl(redirectUrl);
        } else {
          this.router.navigate(['/']);
        }
      },
      error => {
        this.errorMessage = error.message;
      }
    );
  }
}
