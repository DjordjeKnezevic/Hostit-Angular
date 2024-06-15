import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../../services/server.service';
import { LocationWithServers } from '../../interfaces/location';
import { Server } from '../../interfaces/server';
import { Pricing } from '../../interfaces/pricing';

@Component({
  selector: 'app-rent-server',
  templateUrl: './rent-server.component.html',
  styleUrls: ['./rent-server.component.css']
})
export class RentServerComponent implements OnInit {
  locations: LocationWithServers[] = [];
  servers: Server[] = [];
  pricingOptions: Pricing[] = [];

  selectedLocationId: string = '';
  selectedServerId: string = '';
  selectedPricingId: string = '';

  locationInfo: LocationWithServers | null = null;
  serverInfo: Server | null = null;
  pricingInfo: Pricing | null = null;

  constructor(private serverService: ServerService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadInitialData();

    const serverId = this.route.snapshot.paramMap.get('serverId');
    if (serverId) {
      this.initializeWithServerId(serverId);
    }
  }

  loadInitialData(): void {
    this.serverService.getServerOptions().subscribe((data: LocationWithServers[]) => {
      console.log('Fetched locations with servers:', data);
      this.locations = data;
    });
  }

  initializeWithServerId(serverId: string): void {
    this.serverService.getServerWithDetails(serverId).subscribe((server: Server) => {
      console.log('Initial Server Info:', server);

      const location = this.locations.find(loc => loc.servers.some(s => s.id === server.id));
      if (location) {
        this.selectedLocationId = location.id;
        this.locationInfo = location;
        this.servers = location.servers;
        this.selectedServerId = server.id;
        this.serverInfo = server;
        this.pricingOptions = server.pricing;
        if (server.pricing.length > 0) {
          this.selectedPricingId = server.pricing[0].id;
          this.pricingInfo = server.pricing[0];
        }
      }
    });
  }

  onLocationChange(): void {
    console.log('Selected Location ID:', this.selectedLocationId);
    this.locationInfo = this.locations.find(location => location.id === this.selectedLocationId) || null;
    if (this.locationInfo) {
      console.log('Location Info:', this.locationInfo);
      this.servers = this.locationInfo.servers;
      this.serverInfo = null;
      this.pricingOptions = [];
      this.pricingInfo = null;
      this.selectedServerId = '';
      this.selectedPricingId = '';
    }
  }

  onServerChange(): void {
    console.log('Selected Server ID:', this.selectedServerId);
    const selectedServer = this.servers.find(server => server.id === this.selectedServerId) || null;
    if (selectedServer) {
      this.serverService.getServerWithDetails(selectedServer.id).subscribe((serverWithDetails: Server) => {
        console.log('Server Info:', serverWithDetails);
        this.serverInfo = serverWithDetails;
        this.pricingOptions = serverWithDetails.pricing;
        this.pricingInfo = null;
        this.selectedPricingId = '';
      });
    }
  }

  onPricingChange(): void {
    console.log('Selected Pricing ID:', this.selectedPricingId);
    this.pricingInfo = this.pricingOptions.find(pricing => pricing.id === this.selectedPricingId) || null;
    console.log('Pricing Info:', this.pricingInfo);
  }

  completeRenting(): void {
    // Add renting logic here
  }
}
