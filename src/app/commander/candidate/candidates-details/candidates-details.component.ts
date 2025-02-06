import { CandidateMapperService } from '../../../mappers/candidate-mapper-commander';
import { CandidateService } from '../../../services/candidates.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Candidate } from '../../../models/candidates.model';
import { catchError, firstValueFrom, map, Observable, of, Subscription, throwError } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Job } from '../../../models/jobs.model';
import { JobService } from '../../../services/jobs.service';
import { ApproveRejectPopupComponent } from '../../popups/approve-reject-popup/approve-reject-popup.component';
import { ApproveRejectEditPopupComponent } from '../../popups/approve-reject-edit-popup/approve-reject-edit-popup.component';
import { Interview } from '../../../models/interview.model';
import { InterviewSummaryPopupComponent } from '../../popups/interview-summary-popup/interview-summary-popup.component';
import { InterviewMapper } from '../../../mappers/interview-mapper';

@Component({
  selector: 'app-candidates-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ApproveRejectPopupComponent,
    ApproveRejectEditPopupComponent,
    InterviewSummaryPopupComponent],
  templateUrl: './candidates-details.component.html',
  styleUrl: './candidates-details.component.css'
})
export class CandidatesDetailsComponent implements OnInit, OnDestroy{
  interviewMap: Map<string, Interview | null> = new Map();
  showInterviewPopup = false;
  interview: Interview | null = null;
  private interviewSub: Subscription | undefined;

  candidate: Candidate | undefined;
  candidateSummary: Candidate | undefined;
  job: Job | undefined;
  jobId: string = '';
  candidateSub: Subscription | undefined;
  jobSub: Subscription | undefined;
  showPopup = false;
  isApproved = true;
  isPreviewOpen: boolean = false;
  showEditPopup = false;

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.jobId = localStorage.getItem('jobId')!;
    localStorage.setItem('candidateId', id!);
    if (id) {
      this.candidateSub = this.candidateService.getCommanderCandidateById(id).subscribe({
        next: candidate => {
          this.candidate = CandidateMapperService.mapCommanderCandidateForProfile(candidate);
        }
      });
    } else {
      console.log('Candidate ID not found');
    }

    if (this.jobId) {
      this.jobSub = this.jobService.getJobById(this.jobId).subscribe({
        next: job => {
          this.job = job;
        },
        error: err => {
          console.log('Error fetching job details:', err);
        }
      });
    } else {
      console.log('Job ID not found in localStorage');
    }
  }

  onCandidatePreferredFinal() {
    if (this.candidate?.jobStatuses[this.jobId] === 'preferred') {
      this.isApproved = true;
      this.updateCandidateStatus('preferred_final');
      this.showPopup = true;
    } else {
      console.log('Cannot transition to Preferred Final unless the status is "preferred"');
    }
  }

  updateCandidateStatus(status: 'preferred' | 'rejected' | 'preferred_final') {
    if (this.jobId && this.candidate?.id) {
      this.candidateService
        .updateCandidateStatus(this.jobId, this.candidate.id, status)
        .subscribe({
          next: () => {
            if (this.candidate?.jobStatuses) {
              this.candidate.jobStatuses[this.jobId] = status;
            }
          },
          error: (err) => {
            console.log('Error updating status:', err);
          },
        });
    }
  }

  getCandidate(id: string): void {
    this.candidateService.getCandidateById(id).subscribe({
      next: candidate => this.candidate = candidate
    });
  }

  goBack() {
    this.router.navigate([`/job-details/${this.jobId}/candidates`]);
  }

  goToCandidateProfile(candidateId: string) {
    this.router.navigate([`/candidate-profile/${candidateId}`]);
  }

  ngOnDestroy(): void {
    if (this.candidateSub) {
      this.candidateSub.unsubscribe();
    }
    if (this.jobSub) {
      this.jobSub.unsubscribe();
    }
    this.interviewMap.clear();
  }

  openPreview(event: MouseEvent): void {
    event.stopPropagation();
    this.isPreviewOpen = true;
  }

  closePreview(event: MouseEvent): void {
    event.stopPropagation();
    this.isPreviewOpen = false;
  }

  closePreviewOnClickOutside(event: MouseEvent): void {
    if (this.isPreviewOpen) {
      this.isPreviewOpen = false;
    }
  }

  onCandidateAgree() {
    this.isApproved = true;
    if (this.candidate?.jobStatuses[this.jobId] === 'pending') {
      this.updateCandidateStatus('preferred');
    }

    if (this.candidate?.jobStatuses[this.jobId] === 'preferred') {
      this.updateCandidateStatus('preferred_final');
    }
    this.showPopup = true;
  }

  onCandidateReject() {
    this.isApproved = false;
    this.updateCandidateStatus('rejected');
    this.showPopup = true;
  }

  closeCandidatePopup() {
    this.showPopup = false;
    this.showEditPopup = false;
  }

  handleClose() {
    this.showEditPopup = false;
  }

  private loadInterview(): Observable<Interview | null> {
    if (!this.jobId || !this.candidateSummary?.id) {
      console.error('Job ID or Candidate ID is missing');
      return of(null);
    }

    return this.candidateService.getInterview(this.jobId, this.candidateSummary.id).pipe(
      map(response => {
        if (!response) {
          console.log("Response is null or undefined");
          return null;
        }
        try {
          const mappedInterview = InterviewMapper.mapToInterviewModel(response);
          return mappedInterview;
        } catch (mapError) {
          console.error("Error mapping interview:", mapError, response);
          return null;
        }
      }),
      catchError(error => {
        console.error(`Error fetching interview for jobId ${this.jobId} and volunteerId ${this.candidateSummary?.id}:`, error);
        if (error.status === 404) {
          console.log("404 Error caught, returning null");
          return of(null);
        }
        return throwError(() => new Error('Unable to fetch interview'));
      })
    );
  }

  async openInterviewSummary(candidate: Candidate): Promise<void> {
    this.candidateSummary = candidate;

    try {
      this.interview = await firstValueFrom(this.loadInterview());
      this.showInterviewPopup = true;

    } catch (error) {
      console.error("Error loading interview:", error);
    }
  }

  hasInterview(candidate: Candidate): boolean {
    if (!this.interviewMap.has(candidate.id)) {
      this.candidateService
        .getInterview(this.jobId, candidate.id)
        .subscribe({
          next: (interview) => {
            this.interviewMap.set(candidate.id, interview);
          },
          error: () => {
            this.interviewMap.set(candidate.id, null);
          }
        });
      return false;
    }
    return this.interviewMap.get(candidate.id) !== null;
  }

  handleInterviewSave(result: any): void {
    if (!this.candidateSummary || !this.jobId) {
      console.error('Candidate or Job ID is missing.');
      return;
    }

    const interviewData: Interview = {
      candidateId: this.candidateSummary.id,
      jobId: this.jobId,
      interviewNotes: result.summary,
      interviewDate: null,
      automaticMessage: '',
      fullName: this.candidateSummary.fullName,
      email: this.candidateSummary.email,
      status: this.candidateSummary.jobStatuses[this.jobId],
    };

    if (this.interview) {
      this.candidateService.updateInterview(interviewData, this.jobId, this.candidateSummary.id).subscribe({
        next: () => {
          this.loadInterview();
          this.showInterviewPopup = false;
        },
        error: (error) => console.error('Failed to update interview:', error),
      });
    } else {

      this.candidateService.saveInterview(interviewData, this.jobId, this.candidateSummary.id).subscribe({
        next: () => {
          this.loadInterview();
          this.showInterviewPopup = false;
        },
        error: (error) => console.error('Failed to save interview:', error),
      });
    }
  }
}
