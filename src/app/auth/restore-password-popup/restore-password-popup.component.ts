import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-restore-password-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restore-password-popup.component.html',
  styleUrl: './restore-password-popup.component.css'
})
export class RestorePasswordPopupComponent {
  email: string = '';
  showError: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<string>();

  closePopup() {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).className === 'popup-overlay') {
      this.closePopup();
    }
  }

  onSubmit() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(this.email)) {
      this.submit.emit(this.email);
      this.showError = false;
    } else {
      this.showError = true;
    }
  }
}
