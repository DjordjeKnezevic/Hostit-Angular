import { Pricing } from './pricing';
import { ServerType } from './server-type';

export interface Server {
  id: string;
  name: string;
  server_type_id: string;
  serverType: ServerType;
  pricing: Pricing[];
  isOpen?: boolean;
}
