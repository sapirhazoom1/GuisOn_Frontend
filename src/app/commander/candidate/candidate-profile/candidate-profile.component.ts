import { CandidateMapperService } from '../../../mappers/candidate-mapper-commander';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Candidate } from '../../../models/candidates.model';
import { CandidateService } from '../../../services/candidates.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Interview } from '../../../models/interview.model';
import { InterviewSummaryPopupComponent } from '../../popups/interview-summary-popup/interview-summary-popup.component';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [CommonModule, InterviewSummaryPopupComponent],
  templateUrl: './candidate-profile.component.html',
  styleUrl: './candidate-profile.component.css'
})
export class CandidateProfileComponent implements OnInit, OnDestroy {
  candidate: Candidate | undefined;
  candidateSub: Subscription | undefined;
  jobId: string | undefined;
  candidateId: string | undefined;
  showInterviewPopup = false;
  interviewNotes: string = '';

  interview: Interview | null = null;
  private interviewSub: Subscription | undefined;

  constructor(
    private candidateService: CandidateService,
    private route: ActivatedRoute,
    private router: Router)
  {}

  ngOnInit(): void {
    this.candidateId = this.route.snapshot.paramMap.get('id')!;
    this.jobId = localStorage.getItem('jobId')!;
    if (this.candidateId) {
      this.candidateSub = this.candidateService.getCommanderCandidateById(this.candidateId).subscribe({
        next: candidate => {
          this.candidate = CandidateMapperService.mapCommanderCandidateForProfile(candidate);
        }
      });
      this.loadInterview();
    } else {
      console.log('Candidate ID not found');
    }
  }

  private loadInterview(): void {
    this.interviewSub = this.candidateService
      .getInterview(this.jobId!, this.candidateId!)
      .subscribe({
        next: (interview) => {
          this.interviewNotes = interview?.interviewNotes!;
          this.interview = {
            candidateId: this.candidateId!,
            jobId: this.jobId!,
            interviewNotes: this.interviewNotes,
            interviewDate: null,
            automaticMessage: '',
            fullName: this.candidate?.fullName || '',
            email: this.candidate?.email || '',
            status: this.candidate?.jobStatuses[this.jobId!] || ''
          };
        },
        error: (error) => console.error('Failed to load interview:', error)
      });
  }

  openInterviewSummary(): void {
    this.showInterviewPopup = true;
  }

  handleInterviewSave(result: any): void {
    if (!this.candidate || !this.jobId) {
      console.error('Candidate or Job ID is missing.');
      return;
    }

    const interviewData: Interview = {
      candidateId: this.candidate.id,
      jobId: this.jobId,
      interviewNotes: result.summary,
      interviewDate: null,
      automaticMessage: '',
      fullName: this.candidate.fullName,
      email: this.candidate.email,
      status: this.candidate.jobStatuses[this.jobId],
    };

    if (this.interviewNotes) {
      this.candidateService.updateInterview(interviewData, this.jobId, this.candidate.id).subscribe({
        next: () => {
          this.loadInterview();
          this.showInterviewPopup = false;
        },
        error: (error) => console.error('Failed to update interview:', error),
      });
    } else {
      this.candidateService.saveInterview(interviewData, this.jobId, this.candidate.id).subscribe({
        next: () => {
          this.loadInterview();
          this.showInterviewPopup = false;
        },
        error: (error) => console.error('Failed to save interview:', error),
      });
    }
  }

  downloadPdf(): void {
    if (!this.jobId || !this.candidate?.id) {
      console.error('Job ID or Candidate ID is missing');
      return;
    }

    this.candidateService.downloadResume(this.jobId, this.candidate.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `Resume_${this.candidate?.fullName}.pdf`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  getCandidate(id: string): void {
    this.candidateService.getCandidateById(id).subscribe({
      next: candidate => this.candidate = candidate
    });
  }

  goBack() {
    this.router.navigate([`/job-details/${this.jobId}/candidates`]);
  }

  ngOnDestroy(): void {
    if (this.candidateSub) {
      this.candidateSub.unsubscribe();
    }
    if (this.interviewSub) {
      this.interviewSub.unsubscribe();
    }
  }
}
