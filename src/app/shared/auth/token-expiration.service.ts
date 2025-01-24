import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenExpirationService {
  constructor(private router: Router) {}

  checkTokenExpiration(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
