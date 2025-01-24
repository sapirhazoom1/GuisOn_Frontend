import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { JobEditPopupComponent } from '../../popups/job-edit-popup/job-edit-popup.component';
import { CloseJobPopupComponent } from "../../popups/close-job-popup/close-job-popup.component";
import { JobService } from '../../../services/jobs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from '../../../models/jobs.model';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { JobDetailsBarComponent } from '../../job-details-bar/job-details-bar.component';
import { JobMapper } from '../../../mappers/job-mapper';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'commander-job-details',
  standalone: true,
  imports: [FormsModule, JobEditPopupComponent, CommonModule, JobDetailsBarComponent],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css'
})
export class JobDetailsComponent implements OnInit, OnDestroy {
  job: Job | undefined;
  jobSub: Subscription | undefined;
  jobId: string = '';
  @ViewChild(JobEditPopupComponent) popup!: JobEditPopupComponent;
  @ViewChild(CloseJobPopupComponent) closePopup!: CloseJobPopupComponent;

  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id')!;
    if (this.jobId) {
      localStorage.setItem('jobId', this.jobId);
      this.jobSub = this.jobService.getJobById(this.jobId).subscribe({
        next: job => {
          this.job = JobMapper.mapJobResponse(job);
        }
      });
    } else {
      console.log('Job ID not found');
    }
  }

  isJobOpen(job: Job): boolean {
    return job && job.status.toLowerCase() === 'open';
  }

  openJobPopup() {
    this.popup.openPopup();
  }

  goBack() {
    this.router.navigate(['/open-jobs']);
  }

  ngOnDestroy(): void {
    if (this.jobSub) {
      this.jobSub.unsubscribe();
    }
  }
}
