import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../../services/server.service';
import { LocationWithServers } from '../../interfaces/location';
import { Server } from '../../interfaces/server';
import { Pricing } from '../../interfaces/pricing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { Subscription } from '../../interfaces/subscription';
import { ServerStatus } from '../../interfaces/server-status';

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
  pricingPlaceholder = 'Please select a server first';

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
    this.serverInfo = null;
    this.pricingInfo = null;
    this.servers = [];
    this.pricingOptions = [];
    this.selectedServerId = '';
    this.selectedPricingId = '';
    this.serverPlaceholder = 'Loading servers...';
    this.pricingPlaceholder = 'Please select a server first';

    if (this.selectedLocationId) {
      this.serverService.getLocationById(this.selectedLocationId).subscribe((location: LocationWithServers) => {
        this.locationInfo = location;
        this.serverService.getServersByLocation(this.selectedLocationId).subscribe((servers: Server[]) => {
          this.servers = servers;
          this.serverPlaceholder = 'Select a Server';
        });
      }, error => {
        this.locationInfo = null;
        this.serverPlaceholder = 'Please select a location first';
        this.pricingPlaceholder = 'Please select a server first';
      });
    } else {
      this.locationInfo = null;
      this.serverPlaceholder = 'Please select a location first';
      this.pricingPlaceholder = 'Please select a server first';
    }
  }

  onServerChange(): void {
    this.serverInfo = null;
    this.pricingInfo = null;
    this.pricingOptions = [];
    this.selectedPricingId = '';
    this.pricingPlaceholder = 'Loading pricing...';

    if (this.selectedServerId) {
      this.serverService.getServerWithDetails(this.selectedServerId).subscribe((serverWithDetails: Server) => {
        this.serverInfo = serverWithDetails;
        this.pricingOptions = serverWithDetails.pricing;
        this.pricingPlaceholder = 'Select a Pricing Plan';
      });
    } else {
      this.serverInfo = null;
      this.pricingPlaceholder = 'Please select a server first';
    }
  }

  onPricingChange(): void {
    const selectedPricingIdString = this.selectedPricingId.toString();
    this.pricingInfo = this.pricingOptions.find(pricing => pricing.id.toString() === selectedPricingIdString) || null;
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
      const rentData = {
        location: parseInt(this.selectedLocationId, 10),
        server: parseInt(this.selectedServerId, 10),
        pricing: parseInt(this.selectedPricingId, 10)
      };

      this.serverService.processRenting(rentData).subscribe(
        () => {
          this.toastr.success('Rental successful', 'Success');
          this.router.navigate(['/profile']);
        },
        error => {
          this.toastr.error('Rental failed', 'Error');
        }
      );
    }
  }
}
