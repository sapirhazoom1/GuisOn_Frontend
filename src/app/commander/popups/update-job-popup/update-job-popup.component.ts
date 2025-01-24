import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Job } from '../../../models/jobs.model';

@Component({
  selector: 'app-update-job-popup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-job-popup.component.html',
  styleUrls: ['./update-job-popup.component.css']
})
export class UpdateJobPopupComponent {
  @Input() job!: Job;
  @Input() isModalOpen: boolean = false;
  @Output() closePopupEvent = new EventEmitter<void>();
  @Output() jobUpdated = new EventEmitter<Job>();

  constructor(private cdr: ChangeDetectorRef) {}

  onSubmit() {
    this.jobUpdated.emit(this.job);
    this.closePopupEvent.emit();
  }

  close() {
    this.closePopupEvent.emit();
  }

  trackByIndex(index: number): number {
    return index;
  }
}
