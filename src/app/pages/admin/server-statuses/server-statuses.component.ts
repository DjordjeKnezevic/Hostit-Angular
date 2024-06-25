import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { ServerStatus } from '../admin';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-server-statuses',
  templateUrl: './server-statuses.component.html',
  styleUrls: ['./server-statuses.component.css']
})
export class ServerStatusesComponent implements OnInit {
  serverStatuses: ServerStatus[] = [];

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadServerStatuses();
  }

  loadServerStatuses() {
    this.adminService.getServerStatuses().subscribe((serverStatuses) => {
      this.serverStatuses = serverStatuses;
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
}
