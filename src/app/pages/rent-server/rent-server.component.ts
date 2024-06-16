import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../../services/server.service';
import { LocationWithServers } from '../../interfaces/location';
import { Server } from '../../interfaces/server';
import { Pricing } from '../../interfaces/pricing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

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

  locationPlaceholder = 'Select a Location';
  serverPlaceholder = 'Please select a location first';
  pricingPlaceholder = 'Please select a location first';

  constructor(
    private serverService: ServerService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();

    const serverId = this.route.snapshot.paramMap.get('serverId');
    if (serverId) {
      this.initializeWithServerId(serverId);
    }
  }

  loadInitialData(): void {
    this.serverService.getServerOptions().subscribe((data: LocationWithServers[]) => {
      this.locations = data;
    });
  }

  initializeWithServerId(serverId: string): void {
    this.serverService.getServerWithDetails(serverId).subscribe((server: Server) => {
      const location = this.locations.find(loc => loc.servers.some(s => s.id === server.id));
      if (location) {
        this.selectedLocationId = location.id;
        this.locationInfo = location;
        this.servers = location.servers;
        this.serverPlaceholder = 'Select a Server';
        this.selectedServerId = server.id;
        this.serverInfo = server;
        this.pricingOptions = server.pricing;
        if (server.pricing.length > 0) {
          this.selectedPricingId = server.pricing[0].id;
          this.pricingInfo = server.pricing[0];
          this.pricingPlaceholder = 'Select a Pricing Plan';
        }
      }
    });
  }

  onLocationChange(): void {
    this.locationInfo = this.locations.find(location => location.id === this.selectedLocationId) || null;
    if (this.locationInfo) {
      this.servers = this.locationInfo.servers;
      this.serverInfo = null;
      this.pricingOptions = [];
      this.pricingInfo = null;
      this.selectedServerId = '';
      this.selectedPricingId = '';
      this.serverPlaceholder = 'Select a Server';
      this.pricingPlaceholder = 'Please select a server first';
    } else {
      this.resetForm();
    }
  }

  onServerChange(): void {
    const selectedServer = this.servers.find(server => server.id === this.selectedServerId) || null;
    if (selectedServer) {
      this.serverService.getServerWithDetails(selectedServer.id).subscribe((serverWithDetails: Server) => {
        this.serverInfo = serverWithDetails;
        this.pricingOptions = serverWithDetails.pricing;
        this.pricingInfo = null;
        this.selectedPricingId = '';
        this.pricingPlaceholder = 'Select a Pricing Plan';
      });
    } else {
      this.resetServerAndPricing();
    }
  }

  onPricingChange(): void {
    this.pricingInfo = this.pricingOptions.find(pricing => pricing.id === this.selectedPricingId) || null;
  }

  openConfirmationModal(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  getConfirmationMessage(): string {
    if (this.serverInfo && this.pricingInfo) {
      let message = `Are you sure you want to rent the server <b>${this.serverInfo.name}</b> in region <b>${this.locationInfo?.name}</b>? `;
      if (this.pricingInfo.period.toLowerCase() === 'monthly' || this.pricingInfo.period.toLowerCase() === 'yearly') {
        message += `This will charge you <b>$${this.pricingInfo.price}</b>.`;
      } else if (this.pricingInfo.period.toLowerCase() === 'hourly') {
        message += `This will cost you <b>$${this.pricingInfo.price}</b> per hour, you can cancel the subscription at any time.`;
      }
      return message;
    }
    return '';
  }

  completeRenting(): void {
    const user = this.userService.userValue;
    if (user && this.selectedServerId && this.selectedPricingId) {
      const subscription = {
        user_id: user.id,
        service_id: this.selectedServerId,
        pricing_id: this.selectedPricingId,
        start_date: new Date().toISOString(),
        end_date: null
      };

      this.serverService.createSubscription(subscription).subscribe(
        () => {
          this.toastr.success('Rental successful', 'Success');
          this.router.navigate(['/']);
        },
        error => {
          this.toastr.error('Rental failed', 'Error');
        }
      );
    }
  }

  private resetForm(): void {
    this.selectedLocationId = '';
    this.selectedServerId = '';
    this.selectedPricingId = '';
    this.servers = [];
    this.pricingOptions = [];
    this.locationInfo = null;
    this.serverInfo = null;
    this.pricingInfo = null;
    this.serverPlaceholder = 'Please select a location first';
    this.pricingPlaceholder = 'Please select a location first';
  }

  private resetServerAndPricing(): void {
    this.selectedServerId = '';
    this.selectedPricingId = '';
    this.serverInfo = null;
    this.pricingOptions = [];
    this.pricingInfo = null;
    this.pricingPlaceholder = 'Please select a server first';
  }
}
