import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { ServerType } from '../admin';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-server-types',
  templateUrl: './server-types.component.html',
  styleUrls: ['./server-types.component.css']
})
export class ServerTypesComponent implements OnInit {
  serverTypes: ServerType[] = [];
  serverTypeForm: FormGroup;
  editingServerType: ServerType | null = null;
  isFormVisible: boolean = false;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.serverTypeForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      cpu_cores: [0, Validators.required],
      ram: [0, Validators.required],
      storage: [0, Validators.required],
      network_speed: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadServerTypes();
  }

  loadServerTypes() {
    this.adminService.getServerTypes().subscribe((serverTypes) => {
      this.serverTypes = serverTypes;
    });
  }

  submitForm() {
    this.markFormGroupTouched(this.serverTypeForm);
    if (this.serverTypeForm.valid) {
      if (this.editingServerType) {
        this.adminService.updateServerType(this.editingServerType.id, this.serverTypeForm.value).subscribe(() => {
          this.loadServerTypes();
          this.resetForm();
          this.toastr.success('Server Type updated successfully', 'Success');
        }, error => {
          this.toastr.error('Failed to update Server Type', 'Error');
        });
      } else {
        this.adminService.createServerType(this.serverTypeForm.value).subscribe(() => {
          this.loadServerTypes();
          this.resetForm();
          this.toastr.success('Server Type created successfully', 'Success');
        }, error => {
          this.toastr.error('Failed to create Server Type', 'Error');
        });
      }
    } else {
      this.toastr.error('Please fill in all required fields', 'Error');
    }
  }

  editServerType(serverType: ServerType) {
    this.editingServerType = serverType;
    this.serverTypeForm.patchValue(serverType);
    this.isFormVisible = true;
  }

  deleteServerType(id: number) {
    this.adminService.deleteServerType(id).subscribe(() => {
      this.loadServerTypes();
      this.toastr.success('Server Type deleted successfully', 'Success');
    }, error => {
      this.toastr.error('Failed to delete Server Type', 'Error');
    });
  }

  resetForm() {
    this.editingServerType = null;
    this.serverTypeForm.reset();
    this.isFormVisible = false;
  }

  showForm() {
    this.isFormVisible = true;
  }

  hideForm() {
    this.isFormVisible = false;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.serverTypeForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
