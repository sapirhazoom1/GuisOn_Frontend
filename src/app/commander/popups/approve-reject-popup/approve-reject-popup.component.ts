import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-approve-reject-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approve-reject-popup.component.html',
  styleUrl: './approve-reject-popup.component.css'
})
export class ApproveRejectPopupComponent {
  @Input() isApproved: boolean = true;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
