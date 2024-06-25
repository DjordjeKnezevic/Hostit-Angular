import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AdminService } from '../admin.service';
import { User, Role } from '../admin';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  userForm: FormGroup;
  editingUser: User | null = null;
  isFormVisible: boolean = false;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.userForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role_id: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.adminService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  loadRoles() {
    this.adminService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    if (group.get('password')?.value === group.get('confirmPassword')?.value) {
      return null;
    }
    return { 'mismatch': true };
  }

  submitForm() {
    console.log(`submitForm: valid = ${this.userForm.valid}`);
    this.markFormGroupTouched(this.userForm);
    if (this.userForm.valid) {
      if (this.editingUser) {
        const { password, confirmPassword, ...userData } = this.userForm.value;
        this.adminService.updateUser(this.editingUser.id, userData).subscribe(() => {
          this.loadUsers();
          this.resetForm();
          this.toastr.success('User updated successfully', 'Success');
        }, error => {
          this.toastr.error('Failed to update user', 'Error');
        });
      } else {
        const { confirmPassword, ...userData } = this.userForm.value;
        this.adminService.createUser(userData).subscribe(() => {
          this.loadUsers();
          this.resetForm();
          this.toastr.success('User created successfully', 'Success');
        }, error => {
          this.toastr.error('Failed to create user', 'Error');
        });
      }
    } else {
      this.toastr.error('Please fill in all required fields', 'Error');
    }
  }

  editUser(user: User) {
    this.editingUser = user;
    this.userForm.patchValue(user);
    this.userForm.get('password')?.disable();
    this.userForm.get('confirmPassword')?.disable();
    this.isFormVisible = true;
  }

  deleteUser(id: number) {
    this.adminService.deleteUser(id).subscribe(() => {
      this.loadUsers();
      this.toastr.success('User deleted successfully', 'Success');
    }, error => {
      this.toastr.error('Failed to delete user', 'Error');
    });
  }

  resetForm() {
    this.editingUser = null;
    this.userForm.reset();
    this.userForm.get('password')?.enable();
    this.userForm.get('confirmPassword')?.enable();
    this.isFormVisible = false;
  }

  showForm() {
    this.isFormVisible = true;
  }

  hideForm() {
    this.isFormVisible = false;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.userForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isPasswordMismatch(): boolean {
    return this.userForm.hasError('mismatch') && this.userForm.get('confirmPassword')?.touched === true;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      console.log(`markFormGroupTouched: ${key}, touched = ${control?.touched}`);
    });
  }
}
