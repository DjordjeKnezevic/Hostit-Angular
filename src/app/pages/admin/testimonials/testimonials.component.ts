import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { Testimonial } from '../admin';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit {
  testimonials: Testimonial[] = [];
  testimonialForm: FormGroup;
  editingTestimonial: Testimonial | null = null;
  isFormVisible: boolean = false;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.testimonialForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadTestimonials();
  }

  loadTestimonials() {
    this.adminService.getTestimonials().subscribe((testimonials) => {
      this.testimonials = testimonials;
    });
  }

  submitForm() {
    console.log(`submitForm: valid = ${this.testimonialForm.valid}`);
    this.markFormGroupTouched(this.testimonialForm);
    if (this.testimonialForm.valid) {
      if (this.editingTestimonial) {
        this.adminService.updateTestimonial(this.editingTestimonial.id, this.testimonialForm.value).subscribe(() => {
          this.loadTestimonials();
          this.resetForm();
          this.toastr.success('Testimonial updated successfully', 'Success');
        }, error => {
          this.toastr.error('Failed to update testimonial', 'Error');
        });
      } else {
        this.adminService.createTestimonial(this.testimonialForm.value).subscribe(() => {
          this.loadTestimonials();
          this.resetForm();
          this.toastr.success('Testimonial created successfully', 'Success');
        }, error => {
          this.toastr.error('Failed to create testimonial', 'Error');
        });
      }
    } else {
      this.toastr.error('Please fill in all required fields', 'Error');
    }
  }

  editTestimonial(testimonial: Testimonial) {
    this.editingTestimonial = testimonial;
    this.testimonialForm.patchValue(testimonial);
    this.isFormVisible = true;
  }

  deleteTestimonial(id: number) {
    this.adminService.deleteTestimonial(id).subscribe(() => {
      this.loadTestimonials();
      this.toastr.success('Testimonial deleted successfully', 'Success');
    }, error => {
      this.toastr.error('Failed to delete testimonial', 'Error');
    });
  }

  resetForm() {
    this.editingTestimonial = null;
    this.testimonialForm.reset();
    this.isFormVisible = false;
  }

  showForm() {
    this.isFormVisible = true;
  }

  hideForm() {
    this.isFormVisible = false;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.testimonialForm.get(field);
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
