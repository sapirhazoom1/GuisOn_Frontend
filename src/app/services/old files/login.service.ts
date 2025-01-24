import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Candidate } from '../models/candidates.model';
import { CandidateMapperService } from '../mappers/candidate-mapper-commander';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = environment.baseUrl;
  private currentUser: Candidate | null = null;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response?.access_token) {
            this.setAuthToken(response.access_token);
            this.setUserRole(response.role);

            if (response.role === 'volunteer' && response.user) {
              this.setCurrentUser(response.user);
            }
            if (response.role === 'hr' && response.user) {
              this.setCurrentUser(response.user);
            }
            if (response.role === 'commander' && response.user) {
              this.setCurrentUser(response.user);
            }
          }
        })
      );
  }

  private setCurrentUser(user: Candidate): void {
    if (this.isBrowser()) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  getCurrentUser(): Candidate | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    if (this.isBrowser()) {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    }

    return null;
  }

  private setAuthToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('authToken', token);
    }
  }

  private setUserRole(role: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('userRole', role);
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  isAuthenticated(): boolean {
    return this.isBrowser() ? !!localStorage.getItem('authToken') : false;
  }

  getAuthToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('authToken') : null;
  }

  getUserRole(): string | null {
    return this.isBrowser() ? localStorage.getItem('userRole') : null;
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('currentUser');
      this.currentUser = null;

      window.location.reload();
    }
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/auth/reset-password`, { email })
      .pipe(
        tap(response => {
          console.log('Password reset email sent');
        })
      );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/auth/reset-password/confirm`, {
      token,
      newPassword
    }).pipe(
      tap(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('currentUser');
      })
    );
  }
}
