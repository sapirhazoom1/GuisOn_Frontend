import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CandidateMapperService } from '../../mappers/candidate-mapper-commander';
import { Candidate } from '../../models/candidates.model';
import { CandidateService } from '../../services/candidates.service';

@Component({
  selector: 'app-hr-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hr-user-profile.component.html',
  styleUrl: './hr-user-profile.component.css'
})
export class HrUserProfileComponent implements OnInit, OnDestroy{
candidate: Candidate | undefined;
  candidateSub: Subscription | undefined;
  jobId: string | undefined;
  isPreviewOpen = false;

  constructor(
    private candidateService: CandidateService,
    private route: ActivatedRoute,
    private router: Router)
  {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.jobId = localStorage.getItem('jobId')!;
    if (id) {
      this.candidateSub = this.candidateService.getVolunteerForHRById(id).subscribe({
        next: candidate => {
          this.candidate = CandidateMapperService.mapCommanderCandidateForProfile(candidate);
        }
      });
    } else {
      console.log('Candidate ID not found');
    }
  }

  goBack() {
    this.router.navigate([`/candidates-list`]);
  }

  ngOnDestroy(): void {
    if (this.candidateSub) {
      this.candidateSub.unsubscribe();
    }
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
}
