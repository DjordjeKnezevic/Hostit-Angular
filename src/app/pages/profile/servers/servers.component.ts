import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../../services/server.service';
import { UserService } from '../../../services/user.service';
import { ServerStatus } from '../../../interfaces/server-status';
import { Location } from '../../../interfaces/location';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  subscriptions: any[] = [];
  filteredSubscriptions: any[] = [];
  paginatedSubscriptions: any[] = [];
  locations: Location[] = [];
  statuses: string[] = ['good', 'pending', 'down', 'stopped', 'terminated'];
  selectedStatus: string = '';
  selectedLocation: string = '';
  sortOrder: string = 'desc';
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalSubscriptions: number = 0;

  statusOptions = this.statuses.map(status => ({ value: status, label: status }));
  locationOptions: { value: string, label: string }[] = [];
  sortOptions = [
    { value: 'desc', label: 'Newest First' },
    { value: 'asc', label: 'Oldest First' }
  ];

  constructor(private serverService: ServerService, private userService: UserService) {}

  ngOnInit(): void {
    this.fetchSubscriptions();
    this.fetchLocations();
  }

  fetchSubscriptions(): void {
    const userId = this.userService.userValue?.id.toString();
    if (userId) {
      this.serverService.getUserSubscriptions(userId).subscribe(data => {
        this.subscriptions = data.subscriptions;
        this.totalSubscriptions = data.total;
        this.applyFilters();
      });
    }
  }

  fetchLocations(): void {
    this.serverService.getLocations().subscribe((locations: Location[]) => {
      this.locations = locations;
      this.locationOptions = this.locations.map(location => ({ value: location.id.toString(), label: location.name }));
    });
  }

  applyFilters(): void {
    let filtered = this.subscriptions;

    if (this.selectedStatus) {
      filtered = filtered.filter(sub => sub.status.status === this.selectedStatus);
    }

    if (this.selectedLocation) {
      filtered = filtered.filter(sub => sub.server.location.id.toString() === this.selectedLocation);
    }

    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.start_date).getTime();
      const dateB = new Date(b.start_date).getTime();
      return this.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    this.filteredSubscriptions = filtered;
    this.currentPage = 1; // Reset to first page
    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedSubscriptions = this.filteredSubscriptions.slice(start, end);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
    window.scrollTo(0, 0);
  }

  clearFilters(): void {
    this.selectedStatus = '';
    this.selectedLocation = '';
    this.sortOrder = 'desc';
    this.applyFilters();
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
    const statusId = subscription.status.id;
    const statusUpdate: Partial<ServerStatus> = { status: action };

    if (action === 'good') {
      statusUpdate.last_started_at = new Date().toISOString().split('.')[0].replace('T', ' ');
    } else if (action === 'stopped' || action === 'terminated') {
      statusUpdate.last_stopped_at = new Date().toISOString().split('.')[0].replace('T', ' ');
    }

    this.serverService.updateServerStatus(statusId, statusUpdate).subscribe(() => {
      subscription.status.status = action;
      if (action === 'terminated') {
        subscription.end_date = new Date().toISOString().split('.')[0].replace('T', ' ');
      }
      this.updatePagination();
    });
  }

  formatDateTime(dateTime: string): string {
    return dateTime.split('.')[0].replace('T', ' ');
  }

  getMaxPage(): number {
    return Math.ceil(this.filteredSubscriptions.length / this.itemsPerPage);
  }
}
