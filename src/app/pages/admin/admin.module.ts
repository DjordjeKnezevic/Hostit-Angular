import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { LocationsComponent } from './locations/locations.component';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { ServersComponent } from './servers/servers.component';
import { ServerStatusesComponent } from './server-statuses/server-statuses.component';
import { ServerTypesComponent } from './server-types/server-types.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { PricingComponent } from './pricing/pricing.component';

@NgModule({
  declarations: [
    AdminComponent,
    LocationsComponent,
    RolesComponent,
    UsersComponent,
    TestimonialsComponent,
    ServersComponent,
    ServerStatusesComponent,
    ServerTypesComponent,
    SubscriptionsComponent,
    PricingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
