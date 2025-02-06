import { JobMapper } from '../../mappers/job-mapper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplyVacancyPopupComponent } from '../popups/apply-vacancy-popup/apply-vacancy-popup.component';
import { CancelVacancyPopupComponent } from '../popups/cancel-vacancy-popup/cancel-vacancy-popup.component';
import { CommonModule } from '@angular/common';
import { JobService } from '../../services/jobs.service';
import { Router } from '@angular/router';
import { Job } from '../../models/jobs.model';

@Component({
  selector: 'app-job-application-details',
  standalone: true,
  imports: [ApplyVacancyPopupComponent, CancelVacancyPopupComponent, CommonModule],
  templateUrl: './job-application-details.component.html',
  styleUrls: ['./job-application-details.component.css']
})
export class JobApplicationDetailsComponent implements OnInit {
  @ViewChild(ApplyVacancyPopupComponent) applyPopup!: ApplyVacancyPopupComponent;
  @ViewChild(CancelVacancyPopupComponent) cancelPopup!: CancelVacancyPopupComponent;

  activeTab: 'jobRequirements' | 'faq' = 'jobRequirements';
  isApplied = false;
  isCancelled = false;
  job: Job | undefined;
  jobId: string = '';

  constructor(private jobService: JobService, private router: Router) {}

  ngOnInit(): void {
    document.documentElement.style.setProperty('--background-color', '#282949');

    this.jobId = localStorage.getItem('jobId')!;
    if (this.jobId) {
      this.jobService.getJobById(this.jobId).subscribe({
        next: (job: Job) => {
          this.job = JobMapper.mapJobForVolunteerJobDetailsPage(job);
        },
        error: (err) => {
          console.error('Error fetching job details:', err);
        }
      });

      this.jobService.checkIfAlreadyApplied(parseInt(this.jobId)).subscribe({
        next: (response) => {
          this.isApplied = response.alreadyApplied;
        },
        error: (err) => {
          console.error('Error checking application status:', err);
        }
      });
    } else {
      console.error('No jobId found in localStorage.');
    }
  }


  switchTab(tab: 'jobRequirements' | 'faq') {
    this.activeTab = tab;
  }

  toggleApplyCancel() {
    if (this.isApplied && !this.isCancelled) {
      this.cancelPopup.show();
    } else {
      this.applyPopup.show();
    }
  }

  onApply(formData: { additionalInfo: string, resume: File | null }) {
    this.jobService.applyForJob(this.jobId, formData.additionalInfo, formData.resume).subscribe({
      next: (response) => {
        this.isApplied = true;
        this.isCancelled = false;
        alert("מועמדות נשלחה בהצלחה, העדכון יישלח לגורמים הרלוונטיים");
      },
      error: (error) => {
        console.error('Error applying for job:', error);
        alert('שגיאה בהגשת מועמדות לעבודה');
      },
    });
  }

  onCancel() {
    this.jobService.cancelApplication(this.jobId).subscribe({
      next: (response) => {
        console.log('Application canceled successfully:', response);
        this.isApplied = false;
        this.isCancelled = true;
        alert('הבקשה בוטלה בהצלחה');
      },
      error: (error) => {
        console.error('Error canceling application:', error);
        alert('שגיאה בביטול האפליקציה');
      },
    });
  }

  getButtonText(): string {
    if (this.isApplied) return 'ביטול מועמדות';
    return 'להגשת מועמדות';
  }

  getButtonClass(): string {
    if (this.isApplied) return 'btn-danger';
    return 'btn-primary';
  }

  goBack() {
    this.router.navigate(['/roles']);
  }
}
