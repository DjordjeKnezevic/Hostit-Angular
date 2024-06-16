import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public isAuthenticated: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }
}
