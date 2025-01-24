import { JobMapper } from '../../../mappers/job-mapper';
import { JobService } from '../../../services/jobs.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CloseJobPopupComponent } from '../../../commander/popups/close-job-popup/close-job-popup.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Job } from '../../../models/jobs.model';
import { UpdateJobPopupComponent } from '../update-job-popup/update-job-popup.component';

@Component({
  selector: 'commander-job-edit-popup',
  standalone: true,
  imports: [
    CommonModule,
    CloseJobPopupComponent,
    FormsModule,
    UpdateJobPopupComponent
  ],
  templateUrl: './job-edit-popup.component.html',
  styleUrls: ['./job-edit-popup.component.css']
})
export class JobEditPopupComponent implements OnInit {
  @ViewChild(CloseJobPopupComponent) closeJobPopup!: CloseJobPopupComponent;
  @ViewChild(UpdateJobPopupComponent) updateJobPopup!: UpdateJobPopupComponent;
  jobStatus: 'open' | 'closed' = 'open';
  isModalOpen = false;
  isCloseJobPopupOpen = false;
  currentJobId: string = '';
  jobSub: Subscription | undefined;
  job: Job | undefined;
  isUpdateJobPopupOpen = false;

  constructor(private route: ActivatedRoute, private jobService: JobService, private router: Router) {}

  ngOnInit(): void {
    this.currentJobId = this.route.snapshot.paramMap.get('id')!;
    if (this.currentJobId) {
      localStorage.setItem('jobId', this.currentJobId);
      this.jobSub = this.jobService.getJobById(this.currentJobId).subscribe({
        next: job => {
          this.job = JobMapper.mapJobResponse(job);
        }
      });
    } else {
      console.log('Job ID not found');
    }
  }

  openPopup() {
    this.isModalOpen = true;
  }

  closePopup() {
    this.isModalOpen = false;
  }

  closeJob() {
    if (this.job) {
      const updatedJobData = {
        ...this.job,
        status: 'closed'
      };

      this.jobService.updateJob(this.currentJobId, updatedJobData).subscribe({
        next: response => {
          console.log('Job status updated to closed successfully', response);
          this.router.navigate(['/open-jobs']);
        },
        error: error => {
          console.error('Error updating job status', error);
        }
      });
    }

    this.isModalOpen = false;
    this.isCloseJobPopupOpen = true;
  }

  closeCloseJobPopup() {
    this.isCloseJobPopupOpen = false;
  }

  openUpdateJobPopup() {
    this.isUpdateJobPopupOpen = true;
  }

  closeUpdateJobPopup() {
    this.isUpdateJobPopupOpen = false;
  }

  handleJobUpdated(updatedJob: Job) {
    this.jobService.updateJob(this.currentJobId, updatedJob).subscribe({
      next: () => {
        this.closeUpdateJobPopup();
      },
      error: error => {
        console.error('Error updating job', error);
      }
    });
  }
}
