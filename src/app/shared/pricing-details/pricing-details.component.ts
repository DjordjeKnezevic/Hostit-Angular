import { Component, OnInit } from '@angular/core';
import { PricingService } from '../../services/pricing.service';
import { PricingPlan } from '../../interfaces/pricing-plan';

@Component({
  selector: 'app-pricing-details',
  templateUrl: './pricing-details.component.html',
  styleUrls: ['./pricing-details.component.css']
})
export class PricingDetailsComponent implements OnInit {
  pricingPlans: PricingPlan[] = [];

  constructor(private pricingService: PricingService) {}

  ngOnInit(): void {
    this.pricingService.getPricingPlans().subscribe(data => {
      this.pricingPlans = data;
    });
  }
}
