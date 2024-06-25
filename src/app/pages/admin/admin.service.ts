import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Location, Role, User, Testimonial, ServerType, Server, ServerStatus, Subscription, Pricing } from './admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.adminUrl}`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getLocations(): Observable<Location[]> {
    const headers = this.getHeaders();
    return this.http.get<Location[]>(`${this.apiUrl}/locations`, { headers });
  }

  getLocation(id: number): Observable<Location> {
    const headers = this.getHeaders();
    return this.http.get<Location>(`${this.apiUrl}/locations/${id}`, { headers });
  }

  createLocation(location: Location): Observable<Location> {
    const headers = this.getHeaders();
    return this.http.post<Location>(`${this.apiUrl}/locations`, location, { headers });
  }

  updateLocation(id: number, location: Location): Observable<Location> {
    const headers = this.getHeaders();
    return this.http.put<Location>(`${this.apiUrl}/locations/${id}`, location, { headers });
  }

  deleteLocation(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/locations/${id}`, { headers });
  }

  getRoles(): Observable<Role[]> {
    const headers = this.getHeaders();
    return this.http.get<Role[]>(`${this.apiUrl}/roles`, { headers });
  }

  getRole(id: number): Observable<Role> {
    const headers = this.getHeaders();
    return this.http.get<Role>(`${this.apiUrl}/roles/${id}`, { headers });
  }

  createRole(role: Role): Observable<Role> {
    const headers = this.getHeaders();
    return this.http.post<Role>(`${this.apiUrl}/roles`, role, { headers });
  }

  updateRole(id: number, role: Role): Observable<Role> {
    const headers = this.getHeaders();
    return this.http.put<Role>(`${this.apiUrl}/roles/${id}`, role, { headers });
  }

  deleteRole(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/roles/${id}`, { headers });
  }

  getUsers(): Observable<User[]> {
    const headers = this.getHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers });
  }

  getUser(id: number): Observable<User> {
    const headers = this.getHeaders();
    return this.http.get<User>(`${this.apiUrl}/users/${id}`, { headers });
  }

  createUser(user: User): Observable<User> {
    const headers = this.getHeaders();
    return this.http.post<User>(`${this.apiUrl}/users`, user, { headers });
  }

  updateUser(id: number, user: User): Observable<User> {
    const headers = this.getHeaders();
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user, { headers });
  }

  deleteUser(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`, { headers });
  }

  getTestimonials(): Observable<Testimonial[]> {
    const headers = this.getHeaders();
    return this.http.get<Testimonial[]>(`${this.apiUrl}/testimonials`, { headers });
  }

  getTestimonial(id: number): Observable<Testimonial> {
    const headers = this.getHeaders();
    return this.http.get<Testimonial>(`${this.apiUrl}/testimonials/${id}`, { headers });
  }

  createTestimonial(testimonial: Testimonial): Observable<Testimonial> {
    const headers = this.getHeaders();
    return this.http.post<Testimonial>(`${this.apiUrl}/testimonials`, testimonial, { headers });
  }

  updateTestimonial(id: number, testimonial: Testimonial): Observable<Testimonial> {
    const headers = this.getHeaders();
    return this.http.put<Testimonial>(`${this.apiUrl}/testimonials/${id}`, testimonial, { headers });
  }

  deleteTestimonial(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/testimonials/${id}`, { headers });
  }

  getServers(): Observable<Server[]> {
    const headers = this.getHeaders();
    return this.http.get<Server[]>(`${this.apiUrl}/servers`, { headers });
  }

  getServer(id: number): Observable<Server> {
    const headers = this.getHeaders();
    return this.http.get<Server>(`${this.apiUrl}/servers/${id}`, { headers });
  }

  createServer(server: Server): Observable<Server> {
    const headers = this.getHeaders();
    return this.http.post<Server>(`${this.apiUrl}/servers`, server, { headers });
  }

  updateServer(id: number, server: Server): Observable<Server> {
    const headers = this.getHeaders();
    return this.http.put<Server>(`${this.apiUrl}/servers/${id}`, server, { headers });
  }

  deleteServer(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/servers/${id}`, { headers });
  }

  getServerTypes(): Observable<ServerType[]> {
    const headers = this.getHeaders();
    return this.http.get<ServerType[]>(`${this.apiUrl}/server-types`, { headers });
  }

  getServerStatuses(): Observable<ServerStatus[]> {
    const headers = this.getHeaders();
    return this.http.get<ServerStatus[]>(`${this.apiUrl}/server-statuses`, { headers });
  }

  createServerType(serverType: ServerType): Observable<ServerType> {
    const headers = this.getHeaders();
    return this.http.post<ServerType>(`${this.apiUrl}/server-types`, serverType, { headers });
  }

  updateServerType(id: number, serverType: ServerType): Observable<ServerType> {
    const headers = this.getHeaders();
    return this.http.put<ServerType>(`${this.apiUrl}/server-types/${id}`, serverType, { headers });
  }

  deleteServerType(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/server-types/${id}`, { headers });
  }

  getSubscriptions(): Observable<Subscription[]> {
    const headers = this.getHeaders();
    return this.http.get<Subscription[]>(`${this.apiUrl}/subscriptions`, { headers });
  }

  getSubscription(id: number): Observable<Subscription> {
    const headers = this.getHeaders();
    return this.http.get<Subscription>(`${this.apiUrl}/subscriptions/${id}`, { headers });
  }

  createSubscription(subscription: Subscription): Observable<Subscription> {
    const headers = this.getHeaders();
    return this.http.post<Subscription>(`${this.apiUrl}/subscriptions`, subscription, { headers });
  }

  updateSubscription(id: number, subscription: Subscription): Observable<Subscription> {
    const headers = this.getHeaders();
    return this.http.put<Subscription>(`${this.apiUrl}/subscriptions/${id}`, subscription, { headers });
  }

  deleteSubscription(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/subscriptions/${id}`, { headers });
  }

  getPricings(): Observable<Pricing[]> {
    const headers = this.getHeaders();
    return this.http.get<Pricing[]>(`${this.apiUrl}/pricings`, { headers });
  }

  getPricing(id: number): Observable<Pricing> {
    const headers = this.getHeaders();
    return this.http.get<Pricing>(`${this.apiUrl}/pricings/${id}`, { headers });
  }

  createPricing(pricing: Pricing): Observable<Pricing> {
    const headers = this.getHeaders();
    return this.http.post<Pricing>(`${this.apiUrl}/pricings`, pricing, { headers });
  }

  updatePricing(id: number, pricing: Pricing): Observable<Pricing> {
    const headers = this.getHeaders();
    return this.http.put<Pricing>(`${this.apiUrl}/pricings/${id}`, pricing, { headers });
  }

  deletePricing(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/pricings/${id}`, { headers });
  }
}
