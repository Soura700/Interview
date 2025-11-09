import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Auth {
  private baseUrl = 'http://localhost:5147/api/Auth';

  currentUser = signal<any | null>(null);
  isLoggedIn = signal(false);
  userRole = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((response: any) => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userRole', response.role);
        localStorage.setItem('userName', response.fullName);
        this.currentUser.set(response.fullName);
        this.userRole.set(response.role);
        this.isLoggedIn.set(true);
      })
    );
  }
}