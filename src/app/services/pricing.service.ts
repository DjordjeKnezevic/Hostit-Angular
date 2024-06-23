import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PricingResponse } from '../interfaces/pricing-plan';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private apiUrl: string = `${environment.newApiUrl}/pricing-options`;

  constructor(private http: HttpClient) {}

  getPricingPlans(): Observable<PricingResponse> {
    return this.http.get<PricingResponse>(this.apiUrl);
  }
}
