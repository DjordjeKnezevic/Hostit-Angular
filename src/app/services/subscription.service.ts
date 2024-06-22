import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Subscription } from '../interfaces/subscription';
import { Server } from '../interfaces/server';
import { Location } from '../interfaces/location';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private subscriptionsUrl = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient) {}

  getUserSubscriptions(userId: string): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.subscriptionsUrl}?user_id=${userId}`);
  }

  getServerDetails(serverId: string): Observable<Server> {
    return this.http.get<Server>(`${environment.apiUrl}/servers/${serverId}`);
  }

  getLocationDetails(locationId: string): Observable<Location> {
    return this.http.get<Location>(`${environment.apiUrl}/locations/${locationId}`);
  }

  getSubscriptionDetails(subscription: Subscription): Observable<any> {
    return this.getServerDetails(subscription.service_id).pipe(
      switchMap((server: Server) => {
        return this.getLocationDetails(server.location_id).pipe(
          map((location: Location) => ({
            ...subscription,
            server,
            location
          }))
        );
      })
    );
  }

  getAllSubscriptionDetails(userId: string): Observable<any[]> {
    return this.getUserSubscriptions(userId).pipe(
      switchMap((subscriptions: Subscription[]) => {
        return forkJoin(
          subscriptions.map((subscription) => this.getSubscriptionDetails(subscription))
        );
      })
    );
  }
}
