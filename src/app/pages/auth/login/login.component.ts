import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  remember: boolean = false;
  error: string | null = null;

  constructor(private userService: UserService, private router: Router) { }

  onSubmit() {
    this.userService.login(this.email, this.password).subscribe({
      next: user => {
        this.router.navigate(['/']);
      },
      error: err => {
        this.error = 'Invalid email or password';
      }
    });
  }
}
