import { Component, OnInit } from '@angular/core';
import { Job } from '../../models/jobs.model';
import { JobService } from '../../services/jobs.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Candidate } from '../../models/candidates.model';
import { CandidateService } from '../../services/candidates.service';
import { CandidateMapperService } from '../../mappers/candidate-mapper-commander';

@Component({
  selector: 'app-hr-job-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hr-job-details.component.html',
  styleUrl: './hr-job-details.component.css',
})
export class HrJobDetailsComponent implements OnInit {
  job: Job | undefined;
  candidates: Candidate[] = [];
  jobId: string | undefined;
  preferredCandidatesCount: number = 0;

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private router: Router
  ) {}

  ngOnInit(): void {
    document.documentElement.style.setProperty('--background-color', '#282949');

    this.jobId = localStorage.getItem('jobId')!;

    this.jobService.getJobById(this.jobId).subscribe({
      next: (job: Job) => {
        this.job = job;
        this.loadCandidates();
      },
      error: (jobsError) => {
        console.error('Error loading jobs:', jobsError);
      },
    });
  }

  loadCandidates() {
    this.candidateService.getCandidatesForHR().subscribe({
      next: (candidates: Candidate[]) => {
        this.candidates = CandidateMapperService.mapCandidatesForHRModel(candidates);

        this.preferredCandidatesCount = this.candidates.filter(
          (candidate) =>
            candidate.jobStatuses &&
            (candidate.jobStatuses[this.jobId!] === 'preferred' ||
              candidate.jobStatuses[this.jobId!] === 'preferred_final')
        ).length;
      },
      error: (candidatesError) => {
        console.error('Error loading candidates:', candidatesError);
      },
    });
  }

  goBack() {
    this.router.navigate(['/job-roles']);
  }
}
