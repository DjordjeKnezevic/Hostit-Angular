import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Server } from '../interfaces/server';
import { ServerStatus } from '../interfaces/server-status';
import { Subscription } from '../interfaces/subscription';
import { LocationWithServers } from '../interfaces/location';
import { Location } from '../interfaces/location';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private serverOptionsUrl = `${environment.newApiUrl}/server-options`;
  private subscriptionsUrl = `${environment.newApiUrl}/subscriptions`;
  private statusesUrl = `${environment.newApiUrl}/server_statuses`;
  private locationsUrl = `${environment.newApiUrl}/locations`;
  private processRentingUrl = `${environment.newApiUrl}/process-renting`;
  private userServersUrl = `${environment.newApiUrl}/user-servers`;

  private startServerUrl = `${environment.newApiUrl}/servers`;
  private stopServerUrl = `${environment.newApiUrl}/servers`;
  private restartServerUrl = `${environment.newApiUrl}/servers`;
  private terminateServerUrl = `${environment.newApiUrl}/servers`;

  constructor(private http: HttpClient) {}

  getServerOptions(): Observable<LocationWithServers[]> {
    return this.http.get<LocationWithServers[]>(this.serverOptionsUrl).pipe(
      map(locations => locations.map(location => ({
        ...location,
        servers: location.servers.map(server => ({
          ...server,
          server_type: server.server_type,
          pricing: server.pricing.map(price => ({
            id: price.id,
            period: price.period,
            price: parseFloat(price.price.toString())
          }))
        }))
      })))
    );
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
    return this.http.get<any>(`${environment.newApiUrl}/pricing/${pricingId}`);
  }

  getServerWithDetails(serverId: string): Observable<Server> {
    return this.getServerById(serverId).pipe(
      switchMap((server: Server) =>
        forkJoin({
          server_type: this.getServerTypeById(server.server_type_id),
          pricing: this.getPricingByServerId(server.id),
          location: this.getLocationById(server.location_id)
        }).pipe(
          map(details => ({
            ...server,
            server_type: details.server_type,
            pricing: details.pricing,
            location: details.location
          }))
        )
      )
    );
  }

  getServerById(id: string): Observable<Server> {
    return this.http.get<Server>(`${environment.newApiUrl}/servers/${id}`);
  }

  getServerTypeById(serverTypeId: string): Observable<any> {
    return this.http.get<any>(`${environment.newApiUrl}/server_types/${serverTypeId}`);
  }

  getPricingByServerId(serverId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.newApiUrl}/pricing?service_id=${serverId}`);
  }

  getLocationById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.newApiUrl}/locations/${id}`);
  }

  getServerStatus(subscriptionId: string): Observable<ServerStatus> {
    return this.http.get<ServerStatus[]>(`${this.statusesUrl}?subscription_id=${subscriptionId}`).pipe(
      map(statuses => statuses[0])
    );
  }

  updateServerStatus(statusId: string, statusUpdate: Partial<ServerStatus>): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.patch(`${this.statusesUrl}/${statusId}`, statusUpdate, { headers });
  }

  createServerStatus(status: Partial<ServerStatus>): Observable<ServerStatus> {
    return this.http.post<ServerStatus>(this.statusesUrl, status);
  }

  updateSubscription(subscriptionId: string, subscriptionUpdate: Partial<any>): Observable<any> {
    return this.http.patch(`${environment.newApiUrl}/subscriptions/${subscriptionId}`, subscriptionUpdate);
  }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.locationsUrl);
  }

  getServersByLocation(locationId: string): Observable<Server[]> {
    return this.http.get<Server[]>(`${this.locationsUrl}/${locationId}/servers`);
  }

  processRenting(rentData: { location: number; server: number; pricing: number }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(this.processRentingUrl, rentData, { headers });
  }

  getUserServers(url: string | null = null, state: string = '', location: string = '', sort: string = 'desc'): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let fetchUrl = url ? url : this.userServersUrl;
    const params = [];

    if (state) params.push(`state=${state}`);
    if (location) params.push(`location=${location}`);
    params.push(`sort=${sort}`);

    if (params.length && !url) {
      fetchUrl += `?${params.join('&')}`;
    } else if (params.length && url) {
      const urlObj = new URL(url);
      params.forEach(param => {
        const [key, value] = param.split('=');
        urlObj.searchParams.set(key, value);
      });
      fetchUrl = urlObj.toString();
    }

    return this.http.get<any>(fetchUrl, { headers });
  }

  startServer(serverId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.patch(`${this.startServerUrl}/${serverId}/start`, {}, { headers });
  }

  stopServer(serverId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.patch(`${this.stopServerUrl}/${serverId}/stop`, {}, { headers });
  }

  restartServer(serverId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.patch(`${this.restartServerUrl}/${serverId}/restart`, {}, { headers });
  }

  terminateServer(serverId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.patch(`${this.terminateServerUrl}/${serverId}/terminate`, {}, { headers });
  }
}
