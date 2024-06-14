export interface PricingPlan {
  period: string;
  price: number;
  cpu: number;
  ram: number;
  storage: number;
  network_speed: number;
  link: string;
  linkText: string;
}
