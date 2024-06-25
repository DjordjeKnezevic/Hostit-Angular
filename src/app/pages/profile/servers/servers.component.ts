import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../../services/server.service';
import { ServerStatus } from '../../../interfaces/server-status';
import { Location } from '../../../interfaces/location';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  subscriptions: any[] = [];
  locations: Location[] = [];
  statuses: string[] = ['good', 'pending', 'down', 'stopped', 'terminated'];
  selectedStatus: string = '';
  selectedLocation: string = '';
  sortOrder: string = 'desc';
  currentPage: number = 1;
  totalSubscriptions: number = 0;

  statusOptions = this.statuses.map(status => ({ value: status, label: status }));
  locationOptions: { value: string, label: string }[] = [];
  sortOptions = [
    { value: 'desc', label: 'Newest First' },
    { value: 'asc', label: 'Oldest First' }
  ];

  nextPageUrl: string | null = null;
  prevPageUrl: string | null = null;

  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.fetchServers();
    this.fetchLocations();
  }

  fetchServers(url: string | null = null): void {
    this.serverService.getUserServers(url, this.selectedStatus, this.selectedLocation, this.sortOrder).subscribe(data => {
      this.subscriptions = data.servers.data;
      this.totalSubscriptions = data.servers.total;
      this.nextPageUrl = data.servers.next_page_url;
      this.prevPageUrl = data.servers.prev_page_url;
    });
  }

  fetchLocations(): void {
    this.serverService.getLocations().subscribe((locations: Location[]) => {
      this.locations = locations;
      this.locationOptions = this.locations.map(location => ({ value: location.id.toString(), label: location.name }));
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'good': return 'green';
      case 'pending': return 'yellow';
      case 'down': return 'red';
      case 'stopped': return 'gray';
      case 'terminated': return 'black';
      default: return 'gray';
    }
  }

  updateServerStatus(subscriptionId: string, action: string): void {
    const subscription = this.subscriptions.find(sub => sub.id === subscriptionId);
    if (!subscription) return;

    const statusUpdate = () => {
      subscription.server_status.status = action;
      if (action === 'good') {
        subscription.server_status.last_started_at = new Date().toISOString().split('.')[0].replace('T', ' ');
      } else if (action === 'stopped' || action === 'terminated') {
        subscription.server_status.last_stopped_at = new Date().toISOString().split('.')[0].replace('T', ' ');
        if (action === 'terminated') {
          subscription.end_date = new Date().toISOString().split('.')[0].replace('T', ' ');
        }
      }
    };

    switch (action) {
      case 'good':
        this.serverService.startServer(subscriptionId).subscribe(statusUpdate);
        break;
      case 'stopped':
        this.serverService.stopServer(subscriptionId).subscribe(statusUpdate);
        break;
      case 'pending':
        this.serverService.restartServer(subscriptionId).subscribe(statusUpdate);
        break;
      case 'terminated':
        this.serverService.terminateServer(subscriptionId).subscribe(statusUpdate);
        break;
    }
  }

  formatDateTime(dateTime: string): string {
    return dateTime.split('.')[0].replace('T', ' ');
  }

  getLocationName(locationId: number): string {
    const location = this.locations.find(loc => parseInt(loc.id) === locationId);
    return location ? location.city : 'Unknown City';
  }

  getLocationZone(locationId: number): string {
    const location = this.locations.find(loc => parseInt(loc.id) === locationId);
    return location ? location.network_zone : 'Unknown Zone';
  }

  changePage(url: string | null): void {
    if (url) {
      const newUrl = this.constructUrlWithFilters(url);
      this.fetchServers(newUrl);
      window.scrollTo(0, 0);
    }
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.fetchServers();
  }

  clearFilters(): void {
    this.selectedStatus = '';
    this.selectedLocation = '';
    this.sortOrder = 'desc';
    this.applyFilters();
  }

  constructUrlWithFilters(url: string): string {
    const urlObj = new URL(url);
    if (this.selectedStatus) {
      urlObj.searchParams.set('state', this.selectedStatus);
    }
    if (this.selectedLocation) {
      urlObj.searchParams.set('location', this.selectedLocation);
    }
    urlObj.searchParams.set('sort', this.sortOrder);
    return urlObj.toString();
  }
}
