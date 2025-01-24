import { JobService } from './../../../services/jobs.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Job } from '../../../models/jobs.model';
import { JobMapper } from '../../../mappers/job-mapper';

@Component({
  selector: 'app-apply-vacancy-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apply-vacancy-popup.component.html',
  styleUrl: './apply-vacancy-popup.component.css'
})
export class ApplyVacancyPopupComponent implements OnInit {
  @Output() applied = new EventEmitter<{ additionalInfo: string, resume: File | null }>();
  isVisible = false;
  fileName = '';
  additionalInfo = '';
  resume: File | null = null;
  job: Job | undefined;
  jobId: string = ''

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
      this.jobId = localStorage.getItem('jobId')!;
      if (this.jobId) {
        this.jobService.getJobById(this.jobId).subscribe({
          next: (job: Job) => {
            this.job = JobMapper.mapJobForVolunteerMainPage(job);
          },
          error: (err) => {
            console.error('Error fetching job details:', err);
          }
        });
      } else {
        console.error('No jobId found in localStorage.');
      }
  }


  show() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
    this.reset();
  }

  reset() {
    this.fileName = '';
    this.additionalInfo = '';
    this.resume = null;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.resume = file;
      this.fileName = file.name;
    }
  }

  onSubmit() {
    this.applied.emit({ additionalInfo: this.additionalInfo, resume: this.resume });
    this.close();
  }
}
