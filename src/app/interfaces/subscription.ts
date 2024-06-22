import { Server } from './server';
import { Pricing } from './pricing';
import { ServerStatus } from './server-status';

export interface Subscription {
  id: string;
  user_id: string;
  service_id: string;
  server: Server;
  pricing: Pricing[];
  start_date: string;
  end_date: string | null;
  status: ServerStatus;
  pricing_id?: string; 
}
