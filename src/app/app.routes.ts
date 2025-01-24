import { Routes } from '@angular/router';
import { CreateJobComponent } from './commander/job/create-job/create-job.component';
import { MainPageComponent } from './commander/main-page/main-page.component';
import { JobDetailsComponent } from './commander/job/job-details/job-details.component';
import { ClosedJobComponent } from './commander/job/closed-job/closed-job.component';
import { MainGuard } from './shared/auth/main-guard.component';
import { LoginComponent } from './auth/login/login.component';
import { CandidatesComponent } from './commander/candidate/candidates/candidates.component';
import { CandidatesDetailsComponent } from './commander/candidate/candidates-details/candidates-details.component';
import { CandidateProfileComponent } from './commander/candidate/candidate-profile/candidate-profile.component';
import { InterviewSummaryComponent } from './commander/interview-summary/interview-summary.component';
import { UserMainPageComponent } from './user/user-main-page/user-main-page.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { JobApplicationDetailsComponent } from './user/job-application-details/job-application-details.component';
import { HrMainPageComponent } from './hr/hr-main-page/hr-main-page.component';
import { HrCandidatePageComponent } from './hr/hr-candidate-page/hr-candidate-page.component';
import { HrJobDetailsComponent } from './hr/hr-job-details/hr-job-details.component';
import { LoginGuard } from './shared/auth/login.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { HrUserProfileComponent } from './hr/hr-user-profile/hr-user-profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'reset-password', component: ForgotPasswordComponent },
  //Commander
  { path: 'open-jobs', component: MainPageComponent, canActivate: [MainGuard], data: { role: 'commander' } },
  { path: 'create-job', component: CreateJobComponent, canActivate: [MainGuard], data: { role: 'commander' } },
  { path: 'job-details/:id', component: JobDetailsComponent, canActivate: [MainGuard], data: { role: 'commander' } },
  { path: 'closed-jobs', component: ClosedJobComponent, canActivate: [MainGuard], data: { role: 'commander' } },
  { path: 'job-details/:id/candidates', component: CandidatesComponent, canActivate: [MainGuard], data: { role: 'commander' } },
  { path: 'job-details/:id/candidates/preferred', component: CandidatesComponent, canActivate: [MainGuard], data: { role: 'commander' } },
  { path: 'candidate-details/:id', component: CandidatesDetailsComponent, canActivate: [MainGuard], data: { role: 'commander' } },
  { path: 'candidate-profile/:id', component: CandidateProfileComponent, canActivate: [MainGuard], data: { role: 'commander' } },
  { path: 'interview-summary/:id', component: InterviewSummaryComponent, canActivate: [MainGuard], data: { role: 'commander' } },
  // Volunteer
  { path: 'roles', component:UserMainPageComponent, canActivate: [MainGuard], data: { role: 'volunteer' } },
  { path: 'personal-profile', component: UserProfileComponent, canActivate: [MainGuard], data: { role: 'volunteer' } },
  { path: 'job-application-details/:id', component: JobApplicationDetailsComponent, canActivate: [MainGuard], data: { role: 'volunteer' } },
  //HR
  { path: 'job-roles', component:HrMainPageComponent, canActivate: [MainGuard], data: { role: 'hr' } },
  { path: 'candidates-list', component:HrCandidatePageComponent, canActivate: [MainGuard], data: { role: 'hr' } },
  { path: 'job-roles/:id/candidate-list', component:HrCandidatePageComponent, canActivate: [MainGuard], data: { role: 'hr' } },
  { path: 'job-requirements/:id', component:HrJobDetailsComponent, canActivate: [MainGuard], data: { role: 'hr' } },
  { path: 'hr-candidate-profile/:id', component:HrUserProfileComponent,  canActivate: [MainGuard], data: { role: 'hr'} },
  { path: '**', redirectTo: '/login' }
];
