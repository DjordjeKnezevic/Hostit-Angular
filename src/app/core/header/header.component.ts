import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NavigationLink } from '../../interfaces/navigation-link';
import { User } from '../../interfaces/user';

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

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      if (user) {
        this.userName = user.name;
        this.isAdmin = user.roleName === 'admin';
      }
    });
  }

  public logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}