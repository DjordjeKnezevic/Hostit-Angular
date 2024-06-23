import { Component, OnInit } from '@angular/core';
import { PricingService } from '../../services/pricing.service';
import { PricingOption, PricingResponse } from '../../interfaces/pricing-plan';

@Component({
  selector: 'app-pricing-details',
  templateUrl: './pricing-details.component.html',
  styleUrls: ['./pricing-details.component.css']
})
export class PricingDetailsComponent implements OnInit {
  pricingPlans: PricingOption[] = [];
  maxSpecs: { [key: string]: number } | null = null;

  constructor(private pricingService: PricingService) {}

  ngOnInit(): void {
    this.pricingService.getPricingPlans().subscribe((data: PricingResponse) => {
      this.pricingPlans = [
        { period: 'hourly', price: data.pricingOptions.hourly },
        { period: 'monthly', price: data.pricingOptions.monthly },
        { period: 'yearly', price: data.pricingOptions.yearly }
      ];
      this.maxSpecs = data.maxSpecs;
    });
  }
}
