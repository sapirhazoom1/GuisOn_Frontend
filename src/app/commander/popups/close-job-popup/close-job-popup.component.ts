import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'commander-close-job-popup',
  imports:[CommonModule],
  templateUrl: './close-job-popup.component.html',
  styleUrls: ['./close-job-popup.component.css'],
  standalone: true
})
export class CloseJobPopupComponent {
  @Input() isModalOpen: boolean = false;
  @Output() closePopup = new EventEmitter<void>();

  close() {
    this.closePopup.emit();
  }
}
