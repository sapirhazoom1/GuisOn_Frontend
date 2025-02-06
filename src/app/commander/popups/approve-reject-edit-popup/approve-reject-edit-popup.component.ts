import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-approve-reject-edit-popup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './approve-reject-edit-popup.component.html',
  styleUrl: './approve-reject-edit-popup.component.css'
})
export class ApproveRejectEditPopupComponent {
  @Input() isVisible: boolean = false;

  @Output() approve = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onAccept(): void {
    this.approve.emit();
  }

  onReject(): void {
    this.reject.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
