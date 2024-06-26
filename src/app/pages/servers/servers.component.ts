import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { UserService } from '../../services/user.service';
import { LocationWithServers } from '../../interfaces/location';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  locations: LocationWithServers[] = [];
  isAuthenticated = false;

  constructor(private serverService: ServerService, private userService: UserService) {}

  ngOnInit(): void {
    this.isAuthenticated = !!this.userService.userValue;
    this.serverService.getServerOptions().subscribe((locations: LocationWithServers[]) => {
      this.locations = locations.map(location => ({
        ...location,
        isOpen: false,
        servers: location.servers.map(server => ({
          ...server,
          isOpen: false,
          server_type: server.server_type,
          pricing: server.pricing.map(price => ({
            ...price,
            period: price.period,
            price: parseFloat(price.price.toString())
          }))
        }))
      }));
    });
  }

  toggleLocation(location: any): void {
    location.isOpen = !location.isOpen;
  }

  toggleServer(server: any): void {
    server.isOpen = !server.isOpen;
  }

  saveRedirectUrl(serverId: string): void {
    this.userService.saveRedirectUrl(`rent-server/${serverId}`);
  }

  ucfirst(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
