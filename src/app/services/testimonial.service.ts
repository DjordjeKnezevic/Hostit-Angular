import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Testimonial } from '../interfaces/testimonial';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  private apiUrl: string = `${environment.newApiUrl}/testimonials`;

  constructor(private http: HttpClient) {}

  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(this.apiUrl);
  }
}
