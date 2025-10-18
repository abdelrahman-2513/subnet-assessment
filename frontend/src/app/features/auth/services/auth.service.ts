import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { RegisterRequest, LoginRequest, AuthResponse } from '../interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private api: ApiService, private router: Router) {}

  register(user: RegisterRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/register', user);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/login', credentials);
  }

  
  logout(): void {
    console.log('AuthService: Logging out user');
    this.removeToken();
    console.log('AuthService: Token removed, navigating to login');
    this.router.navigate(['/auth/login']);
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token') && localStorage.getItem('token') !== 'null' && localStorage.getItem('token') !== "undefined" ? localStorage.getItem('token') : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}