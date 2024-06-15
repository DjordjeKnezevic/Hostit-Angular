import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LocationWithServers } from '../interfaces/location';
import { Server } from '../interfaces/server';
import { Pricing } from '../interfaces/pricing';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private serverOptionsUrl = `${environment.apiUrl}/server_options`;

  constructor(private http: HttpClient) {}

  getServerOptions(): Observable<LocationWithServers[]> {
    return this.http.get<LocationWithServers[]>(this.serverOptionsUrl);
  }

  getLocations(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/locations`);
  }

  getLocationById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/locations/${id}`);
  }

  getServersByLocation(locationId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/servers?location_id=${locationId}`);
  }

  getServerById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/servers/${id}`);
  }

  getPricingByServerId(serverId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/pricing?service_id=${serverId}`);
  }

  getServerTypeById(serverTypeId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/server_types/${serverTypeId}`);
  }

  getServerWithDetails(serverId: string): Observable<any> {
    return this.getServerById(serverId).pipe(
      switchMap((server: Server) => {
        return forkJoin({
          serverType: this.getServerTypeById(server.server_type_id),
          pricing: this.getPricingByServerId(server.id)
        }).pipe(
          map(details => ({
            ...server,
            serverType: details.serverType,
            pricing: details.pricing
          }))
        );
      })
    );
  }
}
