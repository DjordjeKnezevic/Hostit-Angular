import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { Location } from '../admin';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  locations: Location[] = [];
  locationForm: FormGroup;
  editingLocation: Location | null = null;
  isFormVisible: boolean = false;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.locationForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      network_zone: ['', Validators.required],
      city: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations() {
    this.adminService.getLocations().subscribe((locations) => {
      this.locations = locations;
    });
  }

  submitForm() {
    console.log(`submitForm: valid = ${this.locationForm.valid}`);
    this.markFormGroupTouched(this.locationForm);
    if (this.locationForm.valid) {
      if (this.editingLocation) {
        this.adminService.updateLocation(this.editingLocation.id, this.locationForm.value).subscribe(() => {
          this.loadLocations();
          this.resetForm();
          this.toastr.success('Location updated successfully', 'Success');
        }, error => {
          this.toastr.error('Failed to update location', 'Error');
        });
      } else {
        this.adminService.createLocation(this.locationForm.value).subscribe(() => {
          this.loadLocations();
          this.resetForm();
          this.toastr.success('Location created successfully', 'Success');
        }, error => {
          this.toastr.error('Failed to create location', 'Error');
        });
      }
    } else {
      this.toastr.error('Please fill in all required fields', 'Error');
    }
  }

  editLocation(location: Location) {
    this.editingLocation = location;
    this.locationForm.patchValue(location);
    this.isFormVisible = true;
  }

  deleteLocation(id: number) {
    this.adminService.deleteLocation(id).subscribe(() => {
      this.loadLocations();
      this.toastr.success('Location deleted successfully', 'Success');
    }, error => {
      this.toastr.error('Failed to delete location', 'Error');
    });
  }

  resetForm() {
    this.editingLocation = null;
    this.locationForm.reset();
    this.isFormVisible = false;
  }

  showForm() {
    this.isFormVisible = true;
  }

  hideForm() {
    this.isFormVisible = false;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.locationForm.get(field);
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
