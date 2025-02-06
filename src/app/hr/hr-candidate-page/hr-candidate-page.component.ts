import { CandidateMapperService } from '../../mappers/candidate-mapper-commander';
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Candidate } from '../../models/candidates.model';
import { Job } from '../../models/jobs.model';
import { CandidateService } from '../../services/candidates.service';
import { JobService } from '../../services/jobs.service';
import { HrBottomNavigationComponent } from '../popups/hr-bottom-navigation/hr-bottom-navigation.component';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ApplyCandidatePopupComponent } from '../popups/apply-candidate-popup/apply-candidate-popup.component';
import { AddNewCandidatePopupComponent } from '../popups/add-new-candidate-popup/add-new-candidate-popup.component';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-hr-candidate-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HrBottomNavigationComponent,
    ApplyCandidatePopupComponent,
    AddNewCandidatePopupComponent
  ],
  templateUrl: './hr-candidate-page.component.html',
  styleUrl: './hr-candidate-page.component.css'
})
export class HrCandidatePageComponent implements OnInit, OnDestroy {
  searchQuery = '';
  currentCandidate: Candidate | undefined;
  jobs: Job[] = [];
  candidates: Candidate[] = [];
  jobId: string | undefined;
  isJobSpecificList = false;
  isModalOpen = false;
  isAddCandidateModalOpen = false;
  isPreferredModalOpen: boolean = false;
  selectedJobName: string | undefined;
  selectedJobUnit: string | undefined;
  selectedCandidateId: string | undefined;
  isProfileDropdownOpen = false;
  private routerSubscription: Subscription;

  filteredCandidates: Candidate[] = [];
  isNameAscending = true;

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private router: Router,
    private loginService: LoginService
  ) {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentUrl = this.router.url;
      this.isJobSpecificList = /\/job-roles\/\d+\/candidate-list$/.test(currentUrl);

      if (this.isJobSpecificList) {
        const matches = currentUrl.match(/\/job-roles\/(\d+)\/candidate-list/);
        this.jobId = matches ? matches[1] : undefined;
      }
    });
  }

  ngOnInit(): void {
    document.documentElement.style.setProperty('--background-color', 'white');

    if (this.isJobSpecificList && this.jobId) {
      // Fetch filtered candidates for the specific job
      this.candidateService.getCandidatesForHR().subscribe({
        next: (candidates: Candidate[]) => {
          const mappedCandidates = CandidateMapperService.mapCandidatesForHRModel(candidates);
          this.candidates = mappedCandidates.filter(candidate =>
            candidate.jobStatuses && candidate.jobStatuses[this.jobId!]
          );
          this.filteredCandidates = [...this.candidates];
        },
        error: (error) => {
          console.error('Error loading candidates for job:', error);
        }
      });
    } else {
      // Fetch all candidates
      this.candidateService.getCandidatesForHR().subscribe({
        next: (candidates: Candidate[]) => {
          this.candidates = CandidateMapperService.mapCandidatesForHRModel(candidates);
          this.filteredCandidates = [...this.candidates];
        },
        error: (error) => {
          console.error('Error loading candidates:', error);
        }
      });
    }

    this.jobService.getJobs().subscribe({
      next: (jobs: Job[]) => {
        this.jobs = jobs.filter(job => job.status.toLowerCase() !== 'closed');
      },
      error: (jobsError) => {
        console.error('Error loading jobs:', jobsError);
      }
    });

    this.candidateService.getCurrentUser().subscribe({
      next: (candidate: Candidate) => {
        this.currentCandidate = CandidateMapperService.mapVolunteerCandidateModel(candidate);
      },
      error: (error) => {
        console.error('Error loading current user:', error);
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  getStatusButton(candidate: Candidate): { text: string; class: string } {
    if (!this.isJobSpecificList || !this.jobId) {
      return { text: '', class: '' };
    }

    const status = candidate.jobStatuses?.[this.jobId]?.toLowerCase();
    if (status === 'preferred_final') {
      return {
        text: 'נבחר',
        class: 'btn btn-outline-success status-button'
      };
    }

    switch (status) {
      case 'preferred':
        return { text: 'מועדף', class: 'btn btn-outline-primary status-button' };
      case 'pending':
        return { text: 'ממתין', class: 'btn btn-outline-warning status-button' };
      case 'rejected':
        return { text: 'נדחה', class: 'btn btn-outline-danger status-button' };
      case 'hired':
        return { text: 'שובץ', class: 'btn btn-outline-info status-button' };
      default:
        return { text: 'לשבץ', class: 'btn btn-outline-primary status-button' };
    }
  }

  selectJob(jobId: string): void {
    this.selectedCandidateId = localStorage.getItem('candidateId') || undefined;

    if (!this.selectedCandidateId) {
      console.error('No candidate selected');
      return;
    }

    this.jobService.getJobById(jobId).subscribe({
      next: (job: Job) => {
        this.selectedJobName = job.jobName;
        this.selectedJobUnit = job.unit;
        this.jobId = jobId;
        this.isModalOpen = true;
      },
      error: (err) => {
        console.error('Error fetching job details:', err);
      }
    });
  }

  onAssignmentComplete(success: boolean): void {
    if (success) {
      const jobId = localStorage.getItem('jobId');

      this.candidateService.getCandidatesForHR().subscribe({
        next: (candidates: Candidate[]) => {
          this.candidates = CandidateMapperService.mapCandidatesForHRModel(candidates);

          this.filteredCandidates = this.candidates.filter(candidate => candidate.jobStatuses && candidate.jobStatuses.hasOwnProperty(jobId!));
        },
        error: (error) => {
          console.error('Error refreshing candidates:', error);
        }
      });
    }

    setTimeout(() => {
      this.isModalOpen = false;
      this.selectedCandidateId = undefined;
    }, 2000);
  }


  closePopup(): void {
    this.isModalOpen = false;
    this.selectedCandidateId = undefined;
  }

  selectCandidate(candidateId: string, status: string): void {
    localStorage.setItem('candidateId', candidateId);
    this.selectedCandidateId = candidateId;

    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === 'נבחר' || normalizedStatus === 'preferred_final') {
      if (this.jobId) {
        this.jobService.getJobById(this.jobId).subscribe({
          next: (job: Job) => {
            this.selectedJobName = job.jobName;
            this.selectedJobUnit = job.unit;
            this.isPreferredModalOpen = true;
          },
          error: (err) => {
            console.error('Error fetching job details:', err);
          }
        });
      }
    }
  }

  closeApplyPopup(): void {
    this.isPreferredModalOpen = false;
  }

  openAddCandidatePopup(): void {
    this.isAddCandidateModalOpen = true;
  }

  closeAddCandidatePopup(): void {
    this.isAddCandidateModalOpen = false;
    this.loadCandidates();
    window.location.reload();
  }

  onCandidateAdded(): void {
    this.loadCandidates();
  }

  private loadCandidates(): void {
    this.candidateService.getCandidatesForHR().subscribe({
      next: (candidates: Candidate[]) => {
        this.candidates = CandidateMapperService.mapCandidatesForHRModel(candidates);
      },
      error: (error) => {
        console.error('Error loading candidates:', error);
      }
    });
  }

  toggleSortByName(): void {
    this.isNameAscending = !this.isNameAscending;
    this.filteredCandidates.sort((a, b) => {
      const nameA = a.fullName.toLowerCase();
      const nameB = b.fullName.toLowerCase();
      if (this.isNameAscending) {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }

  filterCandidates(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredCandidates = this.candidates.filter((candidate) =>
      candidate.fullName.toLowerCase().includes(query)
    );
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  // Optional: Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const dropdownElement = document.querySelector('.profile-dropdown');
    const targetElement = event.target as HTMLElement;

    if (dropdownElement && !dropdownElement.contains(targetElement)) {
      this.isProfileDropdownOpen = false;
    }
  }

  Logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
