import { Component, Input } from '@angular/core';
import { faMapMarker, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { NavigationLink } from '../../interfaces/navigation-link';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  @Input() footerLinks: NavigationLink[] = [];

  faMapMarker = faMapMarker;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  faLinkedin = faLinkedin;
  faInstagram = faInstagram;

  constructor() { }

  public subscribe($event: any) {
    alert('You have successfully subscribed to our newsletter!');
  }
}
