import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ControlIconsComponent } from '../../popups/control-icons/control-icons.component';
import { Job } from '../../../models/jobs.model';
import { JobService } from '../../../services/jobs.service';
import { JobMapper } from '../../../mappers/job-mapper';

@Component({
  selector: 'app-closed-job',
  standalone: true,
  imports: [CommonModule, RouterModule, ControlIconsComponent],
  templateUrl: './closed-job.component.html',
  styleUrl: './closed-job.component.css'
})
export class ClosedJobComponent {
  jobs: Job[] = [];

  jobCandidatesCount: { [jobId: string]: { preferred: number; rejected: number; total: number } } = {};

  constructor(private jobService: JobService, private router: Router) {}

    ngOnInit(): void {
      this.loadJobs();
    }

  private loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (jobs: Job[]) => {
        this.jobs = jobs.filter(j => this.isJobClosed(j)).map((job) => JobMapper.mapJobResponse(job));
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
      counts.total++;
      if (application.status === 'preferred') {
        counts.preferred++;
      } else if (application.status === 'rejected') {
        counts.rejected++;
      }
    });
    this.jobCandidatesCount[jobId] = counts;
  }

    navigateToJob(jobId: string) {
      this.router.navigate(['/job-details', jobId]);
    }

    isJobClosed(job: Job): boolean {
      return job.status.toLowerCase() === 'closed';
    }

    getTotalCandidatesCountForJob(jobId: string): string {
      const counts = this.jobCandidatesCount[jobId] || { total: 0 };
      return `${counts.total}`;
    }

    getPreferredCountForJob(jobId: string): string {
      const counts = this.jobCandidatesCount[jobId] || { preferred: 0 };
      return `${counts.preferred}`;
    }
}
