import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NavigationLink } from '../../interfaces/navigation-link';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() navbarLinks: NavigationLink[] = [];

  public isAdmin: boolean = false;
  public isAuthenticated: boolean = false;
  public userName: string = 'User';

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) {}

  ngOnInit() {
    this.userService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      if (user) {
        this.userName = user.name;
        this.isAdmin = user.role.name === 'admin';
      } else {
        this.userName = 'User';
        this.isAdmin = false;
      }
    });
  }

  public logout() {
    this.userService.logout().subscribe(
      () => {
        this.toastr.success('Logout successful', 'Success');
        this.router.navigate(['/login']);
      },
      error => {
        this.toastr.error('Logout failed', 'Error');
        console.error('Logout error:', error);
      }
    );
  }
}
