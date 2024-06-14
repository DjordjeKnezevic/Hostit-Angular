import { Component } from '@angular/core';

@Component({
  selector: 'app-service-component',
  templateUrl: './service-component.component.html',
  styleUrl: './service-component.component.css'
})
export class ServiceComponentComponent {
  services: any[] = [
    {
      title: 'Server Renting',
      description: 'Rent a server with the best price and performance.',
      image: 'assets/img/s1.png',
      link: '/servers',
      linkText: 'Start Renting Now'
    },
    {
      title: 'Domain Registration',
      description: 'Secure your brand with the perfect domain name.',
      image: 'assets/img/s6.png',
      link: null,
      linkText: null
    }
  ];
}
