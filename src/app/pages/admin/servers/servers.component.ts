import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { Server, Location, ServerType } from '../admin';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  servers: Server[] = [];
  locations: Location[] = [];
  serverTypes: ServerType[] = [];
  serverForm: FormGroup;
  editingServer: Server | null = null;
  isFormVisible: boolean = false;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.serverForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      location_id: ['', Validators.required],
      server_type_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadServers();
    this.loadLocations();
    this.loadServerTypes();
  }

  loadServers() {
    this.adminService.getServers().subscribe((servers) => {
      this.servers = servers;
    });
  }

  loadLocations() {
    this.adminService.getLocations().subscribe((locations) => {
      this.locations = locations;
    });
  }

  loadServerTypes() {
    this.adminService.getServerTypes().subscribe((serverTypes) => {
      this.serverTypes = serverTypes;
    });
  }

  submitForm() {
    console.log(`submitForm: valid = ${this.serverForm.valid}`);
    this.markFormGroupTouched(this.serverForm);
    if (this.serverForm.valid) {
      if (this.editingServer) {
        this.adminService.updateServer(this.editingServer.id, this.serverForm.value).subscribe(() => {
          this.loadServers();
          this.resetForm();
          this.toastr.success('Server updated successfully', 'Success');
        }, error => {
          this.toastr.error('Failed to update server', 'Error');
        });
      } else {
        this.adminService.createServer(this.serverForm.value).subscribe(() => {
          this.loadServers();
          this.resetForm();
          this.toastr.success('Server created successfully', 'Success');
        }, error => {
          this.toastr.error('Failed to create server', 'Error');
        });
      }
    } else {
      this.toastr.error('Please fill in all required fields', 'Error');
    }
  }

  editServer(server: Server) {
    this.editingServer = server;
    this.serverForm.patchValue(server);
    this.isFormVisible = true;
  }

  deleteServer(id: number) {
    this.adminService.deleteServer(id).subscribe(() => {
      this.loadServers();
      this.toastr.success('Server deleted successfully', 'Success');
    }, error => {
      this.toastr.error('Failed to delete server', 'Error');
    });
  }

  resetForm() {
    this.editingServer = null;
    this.serverForm.reset();
    this.isFormVisible = false;
  }

  showForm() {
    this.isFormVisible = true;
  }

  hideForm() {
    this.isFormVisible = false;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.serverForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      console.log(`markFormGroupTouched: ${key}, touched = ${control?.touched}`);
    });
  }
}
