import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ControlIconsComponent } from '../../popups/control-icons/control-icons.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Job } from '../../../models/jobs.model';
import { JobService } from '../../../services/jobs.service';

@Component({
  selector: 'commander-create-job',
  standalone: true,
  imports: [ControlIconsComponent, FormsModule, CommonModule],
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent {
  job: Job = {
    id: '',
    jobName: '',
    jobCategory: '',
    unit: '',
    address: '',
    positions: null,
    openBase: false,
    closedBase: false,
    jobDescription: '',
    additionalInfo: '',
    commonQuestions: [],
    commonAnswers: [''],
    education: '',
    techSkills: '',
    workExperience: '',
    passedCourses: '',
    candidateCount: 0,
    status: '',
    department: ''
  };

  // DropDown Variables
  jobCategories: string[] = ['לוגיסטיקה','מודיעין','תוכנה ומחשבים','אוויר'];
  jobUnits: string[] = ['תקשוב','חיל האוויר','חיל הים','מודיעין ','חט״ל'];
  jobEducations: string[] = ['תיכון', 'תואר ראשון', 'תואר שני', 'תואר שלישי', 'תעודה מקצועית'];
  // jobCategories: string[] = ['Category 1', 'Category 2', 'Category 3'];
  // jobUnits: string[] = ['Unit 1', 'Unit 2', 'Unit 3'];
  // jobEducations: string[] = ['High School', 'Bachelors', 'Masters'];


  progressNumber: number = 25;

  constructor(private router: Router, private jobService: JobService) {}

  // Flags for form validation and page transitions
  isFirstFormValid: boolean = false;
  isSecondFormValid: boolean = false;
  isThirdFormValid: boolean = false;

  isPage1Completed: boolean = false;
  isPage2Completed: boolean = false;
  isPage3Completed: boolean = false;

  // Page 1 validation
  validateFirstPageFields(): void {
    this.isFirstFormValid =
      this.job.jobName.trim() !== '' &&
      this.job.jobCategory.trim() !== '' &&
      this.job.unit.trim() !== '' &&
      this.job.address.trim() !== '' &&
      this.job.positions !== null &&
      (this.job.openBase || this.job.closedBase);

    this.isFirstFormValid = Boolean(this.isFirstFormValid);
  }

  // Page 2 validation
  validateSecondPageFields(): void {
    this.isSecondFormValid =
      this.job.jobDescription.trim() !== '' &&
      this.job.additionalInfo.trim() !== '';

    this.isSecondFormValid = Boolean(this.isSecondFormValid);
  }

  // Page 3 validation
  validateThirdPageFields(): void {
    this.isThirdFormValid =
      this.job.workExperience.trim() !== '' &&
      this.job.education.trim() !== '' &&
      this.job.passedCourses.trim() !== '' &&
      this.job.techSkills.trim() !== '';
  }

  // Navigation method to handle moving to the next page
  goToNextPage(): void {
    if (!this.isPage1Completed) {
      this.goToSecondPage();
    } else if (!this.isPage2Completed) {
      this.goToThirdPage();
    } else if (!this.isPage3Completed) {
      this.goToFourthPage();
    }
  }

  // Go Further
  goToSecondPage(): void {
    if (this.isFirstFormValid) {
      this.isPage1Completed = true;
      this.isPage2Completed = false;
      this.isPage3Completed = false;
      this.progressNumber = 50;
    }
  }

  goToThirdPage(): void {
    if (this.isSecondFormValid) {
      this.isPage2Completed = true;
      this.isPage3Completed = false;
      this.progressNumber = 75;
    }
  }

  goToFourthPage(): void {
    if (this.isThirdFormValid) {
      this.isPage3Completed = true;
      this.progressNumber = 100;
    }
  }

  // Go Back
  goBackToFirstPage(): void {
    this.isPage1Completed = false;
    this.isPage2Completed = false;
    this.isPage3Completed = false;
    this.progressNumber = 25;
  }

  goBackToSecondPage(): void {
    this.isPage1Completed = true;
    this.isPage2Completed = false;
    this.isPage3Completed = false;
    this.progressNumber = 50;
  }

  goBackToThirdPage(): void {
    this.isPage1Completed = true;
    this.isPage2Completed = true;
    this.isPage3Completed = false;
    this.progressNumber = 75;
  }

  addJob(): void {
    this.job.status = 'OPEN';
    this.job.candidateCount = 0;

    this.jobService.addJob(this.job).subscribe({
      next: (response) => {
        console.log('Job created successfully:', response);
        this.router.navigate(['/open-jobs']);
      },
      error: (error) => {
        console.error('Error creating job:', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/open-jobs']);
  }
}
