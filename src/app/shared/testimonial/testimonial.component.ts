import { Component, OnInit } from '@angular/core';
import { TestimonialService } from '../../services/testimonial.service';
import { Testimonial } from '../../interfaces/testimonial';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.css']
})
export class TestimonialComponent implements OnInit {
  testimonials: Testimonial[] = [];

  constructor(private testimonialService: TestimonialService) {}

  ngOnInit(): void {
    this.testimonialService.getTestimonials().subscribe(data => {
      this.testimonials = data;
    });
  }
}
