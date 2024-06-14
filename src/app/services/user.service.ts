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

  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('loggedUser')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.usersUrl}?email=${email}`).pipe(
      map(users => {
        const user: User = users[0];
        if (user && user.password === password) {
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
}
