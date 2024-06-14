import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocationDetailsComponent } from './location-details/location-details.component';
import { PricingDetailsComponent } from './pricing-details/pricing-details.component';
import { SliderComponent } from './slider/slider.component';
import { NgbModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceComponentComponent } from './service-component/service-component.component';
import { AboutComponentComponent } from './about-component/about-component.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { ContactComponent } from './contact/contact.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LocationDetailsComponent,
    PricingDetailsComponent,
    SliderComponent,
    ServiceComponentComponent,
    AboutComponentComponent,
    TestimonialComponent,
    ContactComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    NgbCarouselModule,
    ReactiveFormsModule
  ],
  exports: [
    LocationDetailsComponent,
    PricingDetailsComponent,
    SliderComponent,
    ServiceComponentComponent,
    AboutComponentComponent,
    TestimonialComponent,
    ContactComponent,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
