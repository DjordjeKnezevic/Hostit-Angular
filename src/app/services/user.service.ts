import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.newApiUrl}`;
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User | null>(null);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.userSubject.next(response.user);
      })
    );
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No token found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.userSubject.next(null);
      })
    );
  }

  register(user: Partial<User>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.userSubject.next(response.user);
      })
    );
  }

  checkUserByEmail(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/check-email`, { email });
  }

  saveRedirectUrl(url: string): void {
    localStorage.setItem('redirectUrl', url);
  }

  getRedirectUrl(): string | null {
    return localStorage.getItem('redirectUrl');
  }

  clearRedirectUrl(): void {
    localStorage.removeItem('redirectUrl');
  }

  fetchUser(): Observable<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No token found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/user`, { headers });
  }

  initializeUser(): Observable<User | null> {
    const token = localStorage.getItem('token');
    if (token) {
      return this.fetchUser().pipe(
        tap((user: User) => this.userSubject.next(user)),
        catchError((error) => {
          this.userSubject.next(null);
          localStorage.removeItem('token');
          return throwError(error);
        })
      );
    } else {
      return of(null);
    }
  }
}
