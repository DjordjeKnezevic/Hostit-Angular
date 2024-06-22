import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Server } from '../interfaces/server';
import { ServerStatus } from '../interfaces/server-status';
import { Subscription } from '../interfaces/subscription';
import { Location } from '../interfaces/location';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private serverOptionsUrl = `${environment.apiUrl}/server_options`;
  private subscriptionsUrl = `${environment.apiUrl}/subscriptions`;
  private statusesUrl = `${environment.apiUrl}/server_statuses`;
  private locationsUrl = `${environment.apiUrl}/locations`;

  constructor(private http: HttpClient) {}

  getServerOptions(): Observable<any> {
    return this.http.get<any>(this.serverOptionsUrl);
  }

  createSubscription(subscription: Partial<Subscription>): Observable<Subscription> {
    return this.http.post<Subscription>(this.subscriptionsUrl, subscription);
  }

  getUserSubscriptions(userId: string): Observable<any> {
    const params = `?user_id=${userId}`;
    return this.http.get<any[]>(`${this.subscriptionsUrl}${params}`).pipe(
      switchMap(subscriptions => {
        const serverDetails$ = subscriptions.map(subscription =>
          forkJoin({
            server: this.getServerWithDetails(subscription.service_id),
            status: this.getServerStatus(subscription.id),
            pricing: this.getPricingById(subscription.pricing_id)
          }).pipe(
            map(details => ({
              ...subscription,
              server: details.server,
              status: details.status,
              pricing: details.pricing
            }))
          )
        );
        return forkJoin(serverDetails$).pipe(
          map(detailedSubscriptions => ({
            subscriptions: detailedSubscriptions,
            total: subscriptions.length
          }))
        );
      })
    );
  }

  getPricingById(pricingId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/pricing/${pricingId}`);
  }

  getServerWithDetails(serverId: string): Observable<Server> {
    return this.getServerById(serverId).pipe(
      switchMap((server: Server) =>
        forkJoin({
          serverType: this.getServerTypeById(server.server_type_id),
          pricing: this.getPricingByServerId(server.id),
          location: this.getLocationById(server.location_id)
        }).pipe(
          map(details => ({
            ...server,
            serverType: details.serverType,
            pricing: details.pricing,
            location: details.location
          }))
        )
      )
    );
  }

  getServerById(id: string): Observable<Server> {
    return this.http.get<Server>(`${environment.apiUrl}/servers/${id}`);
  }

  getServerTypeById(serverTypeId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/server_types/${serverTypeId}`);
  }

  getPricingByServerId(serverId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/pricing?service_id=${serverId}`);
  }

  getLocationById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/locations/${id}`);
  }

  getServerStatus(subscriptionId: string): Observable<ServerStatus> {
    return this.http.get<ServerStatus[]>(`${this.statusesUrl}?subscription_id=${subscriptionId}`).pipe(
      map(statuses => statuses[0])
    );
  }

  updateServerStatus(statusId: string, statusUpdate: Partial<ServerStatus>): Observable<any> {
    return this.http.patch(`${this.statusesUrl}/${statusId}`, statusUpdate);
  }

  createServerStatus(status: Partial<ServerStatus>): Observable<ServerStatus> {
    return this.http.post<ServerStatus>(this.statusesUrl, status);
  }

  updateSubscription(subscriptionId: string, subscriptionUpdate: Partial<any>): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/subscriptions/${subscriptionId}`, subscriptionUpdate);
  }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.locationsUrl);
  }
}
