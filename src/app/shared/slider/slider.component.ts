import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  slides = [
    {
      title: 'Welcome to Next-Gen Hosting',
      description: 'Join us on a journey to seamless web hosting with our innovative technologies designed for developers and businesses alike.',
      image: 'assets/img/slider-img.png',
      readMoreLink: '/about',
      contactLink: '/contact'
    },
    {
      title: 'Fast & Secure Web Hosting',
      description: 'Experience cutting-edge performance and speed with our cloud hosting solutions. Tailored to your needs for scalability and reliability.',
      image: 'assets/img/server-img.jpg',
      readMoreLink: '/about',
      contactLink: '/contact'
    },
    {
      title: 'Reliable Cloud Infrastructure',
      description: 'Our cloud infrastructure provides a reliable foundation for your business, ensuring high availability and consistent performance.',
      image: 'assets/img/server-img.png',
      readMoreLink: '/about',
      contactLink: '/contact'
    }
  ];

  constructor() { }

  ngOnInit(): void { }
}
