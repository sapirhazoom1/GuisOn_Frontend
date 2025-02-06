import { LoginService } from '../../../services/login.service';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CandidateService } from '../../../services/candidates.service';
import { CandidateMapperService } from '../../../mappers/candidate-mapper-commander';
import { Candidate } from '../../../models/candidates.model';

@Component({
  selector: 'control-icons',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './control-icons.component.html',
  styleUrl: './control-icons.component.css'
})
export class ControlIconsComponent {
candidate: Candidate | undefined;
  constructor(private loginService: LoginService, private candidateService: CandidateService,private router: Router) {}

  ngOnInit(): void {
      this.candidateService.getCurrentUser().subscribe({
        next: (candidate: Candidate) => {
          this.candidate = CandidateMapperService.mapVolunteerCandidateModel(candidate);
        },
        error: (error) => {
          console.error('Error loading user:', error);
        }
      });
    }

  Logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
