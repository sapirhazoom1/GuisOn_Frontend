import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cancel-vacancy-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cancel-vacancy-popup.component.html',
  styleUrls: ['./cancel-vacancy-popup.component.css']
})
export class CancelVacancyPopupComponent {
  @Output() cancelled = new EventEmitter<boolean>();
  @Output() close = new EventEmitter<void>();

  isVisible = false;
  isConfirmationView = false;

  show() {
    this.isVisible = true;
    this.isConfirmationView = false;
  }

  onCancel() {
    this.isConfirmationView = true;
  }

  onClose() {
    if (this.isConfirmationView) {
      this.cancelled.emit(true);
    }
    this.isVisible = false;
    this.isConfirmationView = false;
    this.close.emit();
  }
}
