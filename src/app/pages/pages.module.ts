import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { PriceComponent } from './price/price.component';
import { ServiceComponent } from './service/service.component';
import { RouterModule } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { RentServerComponent } from './rent-server/rent-server.component';
import { NgbModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    ContactComponent,
    PriceComponent,
    ServiceComponent,
    RentServerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AuthModule,
    NgbModule,
    NgbCarouselModule,
    SharedModule
  ]
})
export class PagesModule { }
