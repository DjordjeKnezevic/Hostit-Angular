export interface Location {
  id: number;
  name: string;
  network_zone: string;
  city: string;
  image: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role: Role;
}

export interface Testimonial {
  id: number;
  name: string;
  type: string;
  description: string;
  image: string;
}

export interface ServerType {
  id: number;
  name: string;
  cpu_cores: number;
  ram: number;
  storage: number;
  network_speed: number;
}

export interface Server {
  id: number;
  name: string;
  location_id: number;
  server_type_id: number;
  location: Location;
  server_type: ServerType;
}

export interface ServerStatus {
  id: number;
  subscription_id: number;
  status: string;
  uptime: number;
  downtime: number;
  last_started_at: string | null;
  last_stopped_at: string | null;
  last_crashed_at: string | null;
}

export interface Subscription {
  id: number;
  user_id: number;
  service_id: number;
  service_type: string;
  pricing_id: number;
  start_date: string;
  end_date: string | null;
  user: User;
  service: Server;
  pricing: Pricing;
}

export interface Pricing {
  id: number;
  name: string;
  period: string;
  service_type: string;
  service_id: number;
  price: string;
  valid_from: string;
  valid_until: string | null;
  service: {
    id: number;
    name: string;
  };
}
