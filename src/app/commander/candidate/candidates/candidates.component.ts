import { Interview } from './../../../models/interview.model';
import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { CandidateService } from '../../../services/candidates.service';
import { Candidate } from '../../../models/candidates.model';
import {filter, firstValueFrom, map, Observable, of, Subscription, throwError} from 'rxjs';
import { ImageComponent } from '../../../shared/image/image.component';
import { FilterPipe } from '../../../shared/filterPipe/filter.pipe';
import { InterviewSummaryPopupComponent } from '../../popups/interview-summary-popup/interview-summary-popup.component';
import {catchError, tap} from "rxjs/operators";
import {InterviewMapper} from "../../../mappers/interview-mapper";
import { Job } from '../../../models/jobs.model';
import { JobService } from '../../../services/jobs.service';
import { JobMapper } from '../../../mappers/job-mapper';
import { JobDetailsBarComponent } from '../../job-details-bar/job-details-bar.component';

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ImageComponent,
    FilterPipe,
    InterviewSummaryPopupComponent,
    JobDetailsBarComponent
  ],
  templateUrl: './candidates.component.html',
  styleUrl: './candidates.component.css'
})
export class CandidatesComponent implements OnInit, OnDestroy {
  interviewMap: Map<string, Interview | null> = new Map();
  candidates: Candidate[] = [];
  jobId: string = '';
  job: Job | undefined;
  jobSub: Subscription | undefined;
  allCandidates: Candidate[] = [];
  currentFilter: 'preferred_final' | 'preferred' | 'rejected' | 'pending' | 'all' = 'all';
  isMainActive: boolean = false;
  isCandidatesActive: boolean = false;
  isPreferableActive: boolean = false;
  isSelectedCandidatesActive: boolean = false;
  showInterviewPopup = false;
  interviewNotes: string = '';
  candidateSummary: Candidate | undefined;
  interview: Interview | null = null;
  private interviewSub: Subscription | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private candidateService: CandidateService,
    private jobService: JobService
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentUrl = router.url;
      this.isMainActive = currentUrl === '/' || /\/job-details(\/\d+)?$/.test(currentUrl);
      this.isCandidatesActive = /\/job-details\/\d+\/candidates$/.test(currentUrl);
      this.isPreferableActive = /\/job-details\/\d+\/candidates\/preferred$/.test(currentUrl);
      this.isSelectedCandidatesActive = /\/job-details\/\d+\/candidates\/preferred$/.test(currentUrl);
    });
  }

  ngOnInit(): void {
    this.jobId = localStorage.getItem('jobId')!;
    this.loadCandidates();
    this.loadJobs();
    this.checkFilter();
  }

  private loadJobs(): void {
    this.jobSub = this.jobService.getJobById(this.jobId)
    .subscribe({
      next: job => {
        this.job = JobMapper.mapJobResponse(job);
      }});
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

  private loadCandidates(): void {
    this.candidateService.getCandidatesForJob(this.jobId).subscribe({
      next: (candidates: Candidate[]) => {
        this.allCandidates = candidates;
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error loading candidates:', error);
        alert('Failed to load candidates. Please try again later.');
      }
    });
  }

  private applyFilter(): void {
    if (this.jobId) {
      if (this.isPreferableActive) {
        this.candidates = this.allCandidates.filter(candidate =>
          candidate.jobStatuses[this.jobId] === 'preferred' ||
          candidate.jobStatuses[this.jobId] === 'preferred_final'
        );
      } else if (this.isCandidatesActive) {
        this.candidates = this.allCandidates.filter(candidate =>
          candidate.jobStatuses[this.jobId] === 'pending' ||
          candidate.jobStatuses[this.jobId] === 'rejected'
        );
      } else {
        this.candidates = this.allCandidates;
      }
    }
  }

  private checkFilter(): void {
    this.route.url.subscribe(url => {
      if (url.some(segment => segment.path === 'preferred')) {
        this.currentFilter = 'preferred';
      } else if (url.some(segment => segment.path === 'preferred_final')) {
        this.currentFilter = 'preferred_final';
      } else if (url.some(segment => segment.path === 'rejected')) {
        this.currentFilter = 'rejected';
      } else {
        this.currentFilter = 'all';
      }
      this.applyFilter();
    });
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

  async openInterviewSummary(candidate: Candidate): Promise<void> {
    this.candidateSummary = candidate;

    try {
      this.interview = await firstValueFrom(this.loadInterview());
      this.showInterviewPopup = true;

    } catch (error) {
      console.error("Error loading interview:", error);
    }
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

  goBack() {
    this.router.navigate([`/job-details/${this.jobId}`]);
  }

  goToCandidates() {
    this.router.navigate([`/job-details/${this.jobId}/candidates`]);
  }

  gotToPreferableCandidates() {
    this.router.navigate([`/job-details/${this.jobId}/candidates/preferred`]);
  }

  contactCandidate(candidateId: string) {
    this.router.navigate([`/interview-summary/${candidateId}`]);
  }

  goToCandidateProfile(candidateId: string) {
    this.router.navigate([`/candidate-profile/${candidateId}`]);
  }

  goToCandidateDetails(candidateId: string) {
    this.router.navigate([`/candidate-details/${candidateId}`]);
  }

  // For the Candidates section
  shouldShowCandidatesText(): boolean {
    const pendingCandidates = this.candidates.filter(c =>
      c.jobStatuses[this.jobId] === 'pending' ||
      c.jobStatuses[this.jobId] === 'rejected');
    const result = pendingCandidates.length === 0;
    return result;
  }

  // For the Preferable Candidates section
  shouldShowPreferableText(): boolean {
    const preferredCandidates = this.candidates.filter(c =>
      c.jobStatuses[this.jobId] === 'preferred' ||
      c.jobStatuses[this.jobId] === 'preferred_final'
    );
    return preferredCandidates.length === 0;
  }

  candidateJobStatus(jobId: string, candidate: Candidate) {
    const status = candidate.jobStatuses[jobId];

    switch (status) {
      case 'preferred_final':
        return 'נבחר';
      case 'preferred':
        return 'מועדף'
      case 'pending':
        return 'ממתין';
      case 'rejected':
        return 'נדחה';
      case 'hired':
        return 'שובץ';
      default:
        return '';
    }
  }


  ngOnDestroy(): void {
    if (this.jobSub) {
      this.jobSub.unsubscribe();
    }
    if (this.interviewSub) {
      this.interviewSub.unsubscribe();
    }
    this.interviewMap.clear();
  }
}
