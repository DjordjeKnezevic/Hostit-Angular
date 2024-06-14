import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationService } from './services/navigation.service';
import { UserService } from './services/user.service';
import { NavigationLink } from './interfaces/navigation-link';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  navbarLinks: NavigationLink[] = [];
  footerLinks: NavigationLink[] = [];
  shouldShowSlider = false;

  constructor(
    private navigationService: NavigationService,
    private userService: UserService,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.shouldShowSlider = event.url === '/' || event.url === '/price';
      if (event.url !== '/') {
        console.log(event.url)
        this.renderer.addClass(document.body, 'sub_page');
      } else {
        console.log("here")
        this.renderer.removeClass(document.body, 'sub_page');
      }
    });
  }

  ngOnInit(): void {
    this.navigationService.getNavigationLinks().subscribe(links => {
      this.navbarLinks = links.filter(link => link.is_navbar);
      this.footerLinks = links;
    });

    this.userService.user.subscribe();
  }
}
