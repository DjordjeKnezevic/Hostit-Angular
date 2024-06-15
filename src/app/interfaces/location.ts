import { Server } from './server';

export interface Location {
  id: string;
  name: string;
  network_zone: string;
  city: string;
  image: string;
}

export interface LocationWithServers extends Location {
  servers: Server[];
  isOpen?: boolean;
}
