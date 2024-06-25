import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { Subscription, User, Pricing, Server } from '../admin';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: Subscription[] = [];
  users: User[] = [];
  pricings: Pricing[] = [];
  servers: Server[] = [];
  subscriptionForm: FormGroup;
  editingSubscription: Subscription | null = null;
  isFormVisible: boolean = false;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.subscriptionForm = this.fb.group({
      id: [null],
      user_id: ['', Validators.required],
      service_id: ['', Validators.required],
      pricing_id: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: [''],
    }, { validator: this.dateValidator });
  }

  ngOnInit(): void {
    this.loadSubscriptions();
    this.loadUsers();
    this.loadPricings();
    this.loadServers();
  }

  loadSubscriptions() {
    this.adminService.getSubscriptions().subscribe((subscriptions) => {
      this.subscriptions = subscriptions;
    });
  }

  loadUsers() {
    this.adminService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  loadPricings() {
    this.adminService.getPricings().subscribe((pricings) => {
      this.pricings = pricings;
    });
  }

  loadServers() {
    this.adminService.getServers().subscribe((servers) => {
      this.servers = servers;
    });
  }

  submitForm() {
    console.log(`submitForm: valid = ${this.subscriptionForm.valid}`);
    this.markFormGroupTouched(this.subscriptionForm);
    if (this.subscriptionForm.valid) {
      if (this.editingSubscription) {
        this.adminService.updateSubscription(this.editingSubscription.id, this.subscriptionForm.value).subscribe(() => {
          this.loadSubscriptions();
          this.resetForm();
          this.toastr.success('Subscription updated successfully', 'Success');
        }, error => {
          this.toastr.error('Failed to update subscription', 'Error');
        });
      } else {
        this.adminService.createSubscription(this.subscriptionForm.value).subscribe(() => {
          this.loadSubscriptions();
          this.resetForm();
          this.toastr.success('Subscription created successfully', 'Success');
        }, error => {
          this.toastr.error('Failed to create subscription', 'Error');
        });
      }
    } else {
      this.toastr.error('Please fill in all required fields', 'Error');
    }
  }

  editSubscription(subscription: Subscription) {
    this.editingSubscription = subscription;
    this.subscriptionForm.patchValue(subscription);
    this.isFormVisible = true;
  }

  deleteSubscription(id: number) {
    this.adminService.deleteSubscription(id).subscribe(() => {
      this.loadSubscriptions();
      this.toastr.success('Subscription deleted successfully', 'Success');
    }, error => {
      this.toastr.error('Failed to delete subscription', 'Error');
    });
  }

  resetForm() {
    this.editingSubscription = null;
    this.subscriptionForm.reset();
    this.isFormVisible = false;
  }

  showForm() {
    this.isFormVisible = true;
  }

  hideForm() {
    this.isFormVisible = false;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.subscriptionForm.get(field);
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
    const startDate = formGroup.get('start_date')?.value;
    const endDate = formGroup.get('end_date')?.value;
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      formGroup.get('end_date')?.setErrors({ dateMismatch: true });
      return { dateMismatch: true };
    }
    return null;
  }
}
