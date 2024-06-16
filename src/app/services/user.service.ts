import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { Role } from '../interfaces/role';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = `${environment.apiUrl}/users`;
  private rolesUrl = `${environment.apiUrl}/roles`;

  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;
  public roles: Role[] = [];

  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('loggedUser')!));
    this.user = this.userSubject.asObservable();

    this.fetchRoles().subscribe(roles => {
      this.roles = roles;
      const loggedUser = this.userSubject.value;
      if (loggedUser) {
        const role = this.roles.find(r => r.id === loggedUser.role_id);
        if (role) {
          loggedUser.roleName = role.name;
          localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
          this.userSubject.next(loggedUser);
        }
      }
    });
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    return this.checkUserByEmail(email).pipe(
      map(users => {
        const user = users[0];
        if (user && this.validatePassword(user, password)) {
          const role = this.roles.find(r => r.id === user.role_id);
          if (role) {
            user.roleName = role.name;
          }
          localStorage.setItem('loggedUser', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        } else {
          throw new Error('Invalid credentials');
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.userSubject.next(null);
  }

  getUsers(): Observable<User[]> {
    return forkJoin([this.http.get<User[]>(this.usersUrl), this.http.get<Role[]>(this.rolesUrl)]).pipe(
      map(([users, roles]) => {
        return users.map(user => {
          const role = roles.find(r => r.id === user.role_id);
          if (role) {
            user.roleName = role.name;
          }
          return user;
        });
      })
    );
  }

  checkUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersUrl}?email=${email}`);
  }

  validatePassword(user: User, password: string): boolean {
    return user.password === password;
  }

  register(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.usersUrl, user);
  }

  private fetchRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.rolesUrl).pipe(
      tap(roles => {
        this.roles = roles;
      })
    );
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
}
