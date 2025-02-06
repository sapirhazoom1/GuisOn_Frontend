import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class MainGuard implements CanActivate {

  constructor(private router: Router, private loginService: LoginService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isAuthenticated = this.isLoggedIn();
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRole = route.data['role'];
    const userRole = this.loginService.getUserRole();

    if (requiredRole && userRole !== requiredRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }

  private isLoggedIn(): boolean {
    const token = this.loginService.getAuthToken();
    return token !== null;
  }
}
