import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PriceComponent } from './pages/price/price.component';
import { ServiceComponent } from './pages/service/service.component';
import { RentServerComponent } from './pages/rent-server/rent-server.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ServersComponent } from './pages/servers/servers.component';
import { authGuard, requireAuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'price', component: PriceComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [authGuard] },
  { path: 'servers', component: ServersComponent },
  { path: 'rent-server', component: RentServerComponent, canActivate: [requireAuthGuard]},
  { path: 'rent-server/:serverId', component: RentServerComponent, canActivate: [requireAuthGuard]},
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
