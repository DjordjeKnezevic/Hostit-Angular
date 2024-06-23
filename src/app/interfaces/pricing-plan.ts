export interface PricingOptions {
  hourly: string;
  monthly: string;
  yearly: string;
}

export interface MaxSpecs {
  [key: string]: number;
  cpu: number;
  ram: number;
  storage: number;
  network_speed: number;
}

export interface PricingResponse {
  pricingOptions: PricingOptions;
  maxSpecs: MaxSpecs;
}

export interface PricingOption {
  period: string;
  price: string;
}
