import { Pricing } from './pricing';
import { ServerType } from './server-type';
import { Location } from './location';

export interface Server {
  id: string;
  name: string;
  server_type_id: string;
  location_id: string;
  server_type: ServerType;
  location: Location;
  pricing: Pricing[];
  isOpen?: boolean;
}
