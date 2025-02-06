import { CandidateMapperService } from '../../mappers/candidate-mapper-commander';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Candidate } from '../../models/candidates.model';
import { CandidateService } from '../../services/candidates.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavigationComponent } from '../popups/bottom-navigation/bottom-navigation.component';
import { DateFormatterComponent } from '../../shared/date-formatter/date-formatter.component';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavigationComponent, DateFormatterComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  candidate: Candidate = {
    id: '',
    fullName: '',
    idNumber: '',
    dateOfBirth: '',
    age: 0,
    gender: '',
    profile: '',
    phone: '',
    email: '',
    address: '',
    experience: '',
    education: '',
    courses: '',
    languages: '',
    interests: '',
    personalSummary: '',
    jobStatuses: {},
    imageUrl: ''
  };
  candidateSub: Subscription | undefined;
  isLoading = false;
  errorMessage = '';
  isPreviewOpen: boolean = false;

  constructor(
    private candidateService: CandidateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentVolunteer();
  }

  private loadCurrentVolunteer(): void {
    this.isLoading = true;
    this.candidateSub = this.candidateService.getProfileDetails().subscribe({
      next: (candidate) => {
        this.candidate = CandidateMapperService.mapToCandidate(candidate);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching volunteer data:', error);
        this.errorMessage = 'Failed to load profile data';
        this.isLoading = false;
      }
    });
  }

  saveProfile(): void {
    if (!this.candidate) {
      return;
    }

    const formattedDateOfBirth = this.candidate.dateOfBirth ?
    this.formatDateForAPI(new Date(this.candidate.dateOfBirth)) : '';

    this.candidate.dateOfBirth = formattedDateOfBirth;

    this.isLoading = true;
    this.errorMessage = '';

    this.candidateService.updateVolunteerProfile(
      CandidateMapperService.mapToUpdateVolunteerRequest(this.candidate)
    ).subscribe({
      next: (updatedCandidate) => {
        this.candidate = updatedCandidate;
        this.isLoading = false;
        alert('User Updated Successfully!')
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      },
      error: (error) => {
        console.error('Failed to update profile:', error);
        this.errorMessage = 'Failed to save profile changes';
        this.isLoading = false;
        alert('Update Failed!')
      }
    });
  }

  openPreview(event: MouseEvent): void {
    event.stopPropagation();
    this.isPreviewOpen = true;
  }

  closePreview(event: MouseEvent): void {
    event.stopPropagation();
    this.isPreviewOpen = false;
  }

  closePreviewOnClickOutside(event: MouseEvent): void {
    if (this.isPreviewOpen) {
      this.isPreviewOpen = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/roles']);
  }

  onDateOfBirthChange(date: string): void {
    this.candidate.dateOfBirth = date;
  }

  ngOnDestroy(): void {
    if (this.candidateSub) {
      this.candidateSub.unsubscribe();
    }
  }

  private formatDateForAPI(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
