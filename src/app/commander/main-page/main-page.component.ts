import { map } from 'rxjs';
import { JobMapper } from '../../mappers/job-mapper';
import { CandidateService } from './../../services/candidates.service';
import { Component, OnInit } from '@angular/core';
import { Job } from '../../models/jobs.model';
import { JobService } from '../../services/jobs.service';
import { ImageComponent } from "../../shared/image/image.component";
import { ControlIconsComponent } from '../popups/control-icons/control-icons.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Candidate } from '../../models/candidates.model';

@Component({
  selector: 'commander-main-page',
  standalone: true,
  imports: [
    ImageComponent,
    ControlIconsComponent,
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  jobs: Job[] = [];
  candidates: Candidate[] = [];
  allCandidates: Candidate[] = [];
  currentFilter: 'preferred' | 'rejected' | 'pending' | 'all' = 'all';
  allCandidatesCount: number = 0;

  jobCandidatesCount: { [jobId: string]: { preferred: number; rejected: number; total: number } } = {};

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private router: Router) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  private loadJobs(): void {
  this.jobService.getJobs().subscribe({
    next: (jobs: Job[]) => {
      this.jobs = jobs.filter(j => this.isJobOpen(j)).map((job) => JobMapper.mapJobResponse(job));
      this.initializeJobCandidatesCount();
      this.loadApplicationsForJobs();
    },
    error: (error) => {
      console.error('Error loading jobs:', error);
      alert('Failed to load jobs. Please try again later.');
    },
  });
}

  private initializeJobCandidatesCount(): void {
    this.jobs.forEach((job) => {
      this.jobCandidatesCount[job.id] = { preferred: 0, rejected: 0, total: 0 };
    });
  }

  private loadApplicationsForJobs(): void {
    this.jobs.forEach((job) => {
      this.jobService.getJobApplications(job.id).subscribe({
        next: (applications) => {
          this.updateJobCandidatesCount(job.id, applications);
        },
        error: (error) => {
          console.error(`Error loading applications for job ${job.id}:`, error);
        },
      });
    });
  }

  private updateJobCandidatesCount(jobId: string, applications: any[]): void {
    const counts = { preferred: 0, rejected: 0, total: 0 };
    applications.forEach((application) => {
      if (application.status !== 'hired')
      {
        counts.total++;
      }
      if (application.status === 'preferred' ||
        application.status === 'preferred_final'
      ) {
        counts.preferred++;
      } else if (application.status === 'rejected') {
        counts.rejected++;
      }
    });
    this.jobCandidatesCount[jobId] = counts;
  }

  getPreferredAndRejectedCountForJob(jobId: string): string {
    const counts = this.jobCandidatesCount[jobId] || { preferred: 0, rejected: 0 };
    return `${counts.preferred}/${counts.rejected}`;
  }

  getPreferredCountForJob(jobId: string): string {
    const counts = this.jobCandidatesCount[jobId] || { preferred: 0 };
    return `${counts.preferred}`;
  }

  getTotalCandidatesCountForJob(jobId: string): string {
    const counts = this.jobCandidatesCount[jobId] || { total: 0 };
    return `${counts.total}`;
  }

  isJobOpen(job: Job): boolean {
    return job.status === 'OPEN';
  }

  navigateToJob(jobId: string) {
    this.router.navigate(['/job-details', jobId]);
  }

  createJob() {
    this.router.navigate(['/create-job']);
  }
}
