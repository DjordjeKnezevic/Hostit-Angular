import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NavigationLink } from '../interfaces/navigation-link';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private apiUrl: string = `${environment.apiUrl}/navigation_links`;
  constructor(private http: HttpClient) { }

  getNavigationLinks(): Observable<NavigationLink[]> {
    return this.http.get<NavigationLink[]>(this.apiUrl);
  }
}
