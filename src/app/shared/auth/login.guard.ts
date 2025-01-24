import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.loginService.isAuthenticated()) {
      const userRole = this.loginService.getUserRole();

      // Redirect to appropriate dashboard based on user role
      switch(userRole) {
        case 'commander':
          this.router.navigate(['/open-jobs']);
          break;
        case 'volunteer':
          this.router.navigate(['/roles']);
          break;
        case 'hr':
          this.router.navigate(['/job-roles']);
          break;
        default:
          this.router.navigate(['/login']);
      }
      return false;
    }
    return true;
  }
}
