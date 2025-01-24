import { Component, HostListener, OnInit } from '@angular/core';
import { Candidate } from '../../models/candidates.model';
import { Job } from '../../models/jobs.model';
import { CandidateService } from '../../services/candidates.service';
import { JobService } from '../../services/jobs.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HrBottomNavigationComponent } from "../popups/hr-bottom-navigation/hr-bottom-navigation.component";
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { JobMapper } from '../../mappers/job-mapper';
import { CandidateMapperService } from '../../mappers/candidate-mapper-commander';

@Component({
  selector: 'app-hr-main-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HrBottomNavigationComponent],
  templateUrl: './hr-main-page.component.html',
  styleUrl: './hr-main-page.component.css'
})
export class HrMainPageComponent implements OnInit {
  searchQuery = '';
  candidate: Candidate | undefined;
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  isNameAscending = true;
  isProfileDropdownOpen = false;

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    document.documentElement.style.setProperty('--background-color', 'white');

    this.candidateService.getCurrentUser().subscribe({
      next: (candidate: Candidate) => {
        this.candidate = CandidateMapperService.mapVolunteerCandidateModel(candidate);
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });

    this.jobService.getJobs().subscribe({
      next: (jobs: Job[]) => {
        this.jobs = JobMapper.mapJobsForHRMainPage(jobs).filter(job => job.status !== 'CLOSED');
        this.filteredJobs = [...this.jobs];
      },
      error: (jobsError) => {
        console.error('Error loading jobs:', jobsError);
      }
    });
  }

  selectJob(jobId: string): void {
    localStorage.setItem('jobId', jobId);
  }

  toggleSortByName(): void {
    this.isNameAscending = !this.isNameAscending;
    this.filteredJobs.sort((a, b) => {
      const nameA = a.jobName.toLowerCase();
      const nameB = b.jobName.toLowerCase();
      if (this.isNameAscending) {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }

  filterJobs(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredJobs = this.jobs.filter((job) =>
      job.jobName.toLowerCase().includes(query)
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

