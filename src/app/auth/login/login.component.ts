import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { RestorePasswordPopupComponent } from '../restore-password-popup/restore-password-popup.component';

@Component({
  selector: 'login-component',
  standalone: true,
  imports: [CommonModule, FormsModule, RestorePasswordPopupComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  showError: boolean = false;
  showRestorePassword: boolean = false;

  constructor(private router: Router, private loginService: LoginService) {}

  login(): void {
    this.showError = false;
    this.loginService.login(this.username, this.password).subscribe(
      (response) => {
        // Role-based redirection
        const userRole = response.role;
        if (userRole === 'volunteer') {
          this.router.navigate(['/roles']);
        } else if (userRole === 'commander') {
          this.router.navigate(['/open-jobs']);
        } else if (userRole === 'hr') {
          this.router.navigate(['/job-roles']);
        }
      },
      (error) => {
        console.error('Login failed:', error);
        this.showError = true;
        this.errorMessage = 'Invalid username or password';
        this.password = '';
      }
    );
  }

  onForgotPasswordClick(event: Event) {
    event.preventDefault();
    this.showRestorePassword = true;
  }

  handlePasswordReset(email: string) {
    this.loginService.requestPasswordReset(email).subscribe(
      () => {
        this.showRestorePassword = false;
      },
      (error) => {
        console.error('Password reset request failed:', error);
      }
    );
  }
}
