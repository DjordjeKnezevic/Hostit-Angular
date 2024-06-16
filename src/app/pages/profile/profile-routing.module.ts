import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ServersComponent } from './servers/servers.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { requireAuthGuard } from '../../services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [requireAuthGuard],
    children: [
      { path: '', redirectTo: 'servers', pathMatch: 'full' },
      { path: 'servers', component: ServersComponent },
      { path: 'invoices', component: InvoicesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
