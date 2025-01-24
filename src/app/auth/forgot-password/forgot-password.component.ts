import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  resetToken: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    // Get the reset token from the URL
    this.route.queryParams.subscribe(params => {
      this.resetToken = params['token'];
      if (!this.resetToken) {
        this.router.navigate(['/login']);
      }
    });
  }

  validatePasswords(): boolean {
    this.passwordError = '';
    this.confirmPasswordError = '';

    if (!this.newPassword) {
      this.passwordError = 'Password is required';
      return false;
    }

    if (this.newPassword.length < 8) {
      this.passwordError = 'Password must be at least 8 characters long';
      return false;
    }

    if (!this.confirmPassword) {
      this.confirmPasswordError = 'Please confirm your password';
      return false;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
      return false;
    }

    return true;
  }

  resetPassword() {
    if (!this.validatePasswords()) {
      return;
    }

    this.loginService.resetPassword(this.resetToken, this.newPassword).subscribe(
      () => {
        this.successMessage = 'Password successfully reset';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      (error) => {
        console.error('Password reset failed:', error);
        this.errorMessage = error.error?.message || 'Password reset failed. Please try again.';
      }
    );
  }
}
