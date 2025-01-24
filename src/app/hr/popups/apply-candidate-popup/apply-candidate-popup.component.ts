import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CandidateService } from '../../../services/candidates.service';

@Component({
  selector: 'app-apply-candidate-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apply-candidate-popup.component.html',
  styleUrl: './apply-candidate-popup.component.css'
})
export class ApplyCandidatePopupComponent {
  @Input() isModalOpen: boolean = false;
  @Input() jobName: string | undefined;
  @Input() jobUnit: string | undefined;
  @Input() jobId: string | undefined;
  @Input() candidateId: string | undefined;
  @Output() closePopup = new EventEmitter<void>();
  @Output() assignmentComplete = new EventEmitter<boolean>();

  isAccepted: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private candidateService: CandidateService) {}

  accept() {
    if (!this.jobId || !this.candidateId) {
      this.errorMessage = 'Missing required information';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.candidateService.assignVolunteerToJob(this.candidateId, this.jobId).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.isAccepted = true;
        this.assignmentComplete.emit(true);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to assign volunteer';
        this.assignmentComplete.emit(false);
      }
    });
  }
}
