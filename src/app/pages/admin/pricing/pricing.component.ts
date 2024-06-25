import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { Pricing, Server } from '../admin';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {
  pricingForm: FormGroup;
  pricings: Pricing[] = [];
  services: Server[] = [];
  editingPricing: Pricing | null = null;
  periods = ['hourly', 'monthly', 'yearly'];
  isFormVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private toastr: ToastrService
  ) {
    this.pricingForm = this.fb.group({
      name: ['', Validators.required],
      service_id: [null, Validators.required],
      price: ['', Validators.required],
      period: ['', Validators.required],
      valid_from: ['', Validators.required],
      valid_until: ['']
    }, { validator: this.dateValidator });
  }

  ngOnInit(): void {
    this.loadPricings();
    this.loadServices();
  }

  loadPricings() {
    this.adminService.getPricings().subscribe(data => {
      this.pricings = data;
    });
  }

  loadServices() {
    this.adminService.getServers().subscribe(data => {
      this.services = data;
    });
  }

  submitForm() {
    console.log(`submitForm: valid = ${this.pricingForm.valid}`);
    this.markFormGroupTouched(this.pricingForm);
    if (this.pricingForm.valid) {
      const pricing: Pricing = this.pricingForm.value;
      if (this.editingPricing) {
        this.adminService.updatePricing(this.editingPricing.id, pricing).subscribe(() => {
          this.loadPricings();
          this.resetForm();
          this.toastr.success('Pricing updated successfully', 'Success');
        }, error => {
          this.toastr.error('Failed to update pricing', 'Error');
        });
      } else {
        this.adminService.createPricing(pricing).subscribe(() => {
          this.loadPricings();
          this.resetForm();
          this.toastr.success('Pricing created successfully', 'Success');
        }, error => {
          this.toastr.error('Failed to create pricing', 'Error');
        });
      }
    } else {
      this.toastr.error('Please fill in all required fields', 'Error');
    }
  }

  editPricing(pricing: Pricing) {
    this.editingPricing = pricing;
    this.pricingForm.patchValue(pricing);
    this.isFormVisible = true;
  }

  deletePricing(id: number) {
    this.adminService.deletePricing(id).subscribe(() => {
      this.loadPricings();
      this.toastr.success('Pricing deleted successfully', 'Success');
    }, error => {
      this.toastr.error('Failed to delete pricing', 'Error');
    });
  }

  resetForm() {
    this.editingPricing = null;
    this.pricingForm.reset();
    this.isFormVisible = false;
  }

  showForm() {
    this.isFormVisible = true;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.pricingForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      console.log(`markFormGroupTouched: ${key}, touched = ${control?.touched}`);
    });
  }

  dateValidator(formGroup: FormGroup) {
    const startDate = formGroup.get('valid_from')?.value;
    const endDate = formGroup.get('valid_until')?.value;
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      formGroup.get('valid_until')?.setErrors({ dateMismatch: true });
      return { dateMismatch: true };
    }
    return null;
  }
}
