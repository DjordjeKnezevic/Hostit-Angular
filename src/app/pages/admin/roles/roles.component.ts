import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { Role } from '../admin';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  roles: Role[] = [];
  roleForm: FormGroup;
  editingRole: Role | null = null;
  isFormVisible: boolean = false;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.roleForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.adminService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  submitForm() {
    console.log(`submitForm: valid = ${this.roleForm.valid}`);
    this.markFormGroupTouched(this.roleForm);
    if (this.roleForm.valid) {
      if (this.editingRole) {
        this.adminService.updateRole(this.editingRole.id, this.roleForm.value).subscribe(() => {
          this.loadRoles();
          this.resetForm();
          this.toastr.success('Role updated successfully', 'Success');
        }, error => {
          this.toastr.error('Failed to update role', 'Error');
        });
      } else {
        this.adminService.createRole(this.roleForm.value).subscribe(() => {
          this.loadRoles();
          this.resetForm();
          this.toastr.success('Role created successfully', 'Success');
        }, error => {
          this.toastr.error('Failed to create role', 'Error');
        });
      }
    } else {
      this.toastr.error('Please fill in all required fields', 'Error');
    }
  }

  editRole(role: Role) {
    this.editingRole = role;
    this.roleForm.patchValue(role);
    this.isFormVisible = true;
  }

  deleteRole(id: number) {
    this.adminService.deleteRole(id).subscribe(() => {
      this.loadRoles();
      this.toastr.success('Role deleted successfully', 'Success');
    }, error => {
      this.toastr.error('Failed to delete role', 'Error');
    });
  }

  resetForm() {
    this.editingRole = null;
    this.roleForm.reset();
    this.isFormVisible = false;
  }

  showForm() {
    this.isFormVisible = true;
  }

  hideForm() {
    this.isFormVisible = false;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.roleForm.get(field);
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
