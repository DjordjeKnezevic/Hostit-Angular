import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LocationWithServers } from '../interfaces/location';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private serverOptionsUrl = `${environment.apiUrl}/server_options`;

  constructor(private http: HttpClient) {}

  getServerOptions(): Observable<LocationWithServers[]> {
    return this.http.get<LocationWithServers[]>(this.serverOptionsUrl);
  }
}
