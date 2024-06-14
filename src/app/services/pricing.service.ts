import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PricingPlan } from '../interfaces/pricing-plan';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private apiUrl: string = `${environment.apiUrl}/pricing_options`;

  constructor(private http: HttpClient) {}

  getPricingPlans(): Observable<PricingPlan[]> {
    return this.http.get<PricingPlan[]>(this.apiUrl);
  }
}
