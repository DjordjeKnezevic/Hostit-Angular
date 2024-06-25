import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { adminGuard } from '../../services/auth-guard.service';

const routes: Routes = [
  {
    path: '', component: AdminComponent, canActivate: [adminGuard], children: [
      { path: 'locations', component: LocationsComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'users', component: UsersComponent },
      { path: 'testimonials', component: TestimonialsComponent },
      { path: 'servers', component: ServersComponent },
      { path: 'server-statuses', component: ServerStatusesComponent },
      { path: 'server-types', component: ServerTypesComponent },
      { path: 'subscriptions', component: SubscriptionsComponent },
      { path: 'pricing', component: PricingComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
