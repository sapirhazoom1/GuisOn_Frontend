import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Candidate } from '../models/candidates.model';
import { environment } from '../../environments/environment';
import { CandidateMapperService } from '../mappers/candidate-mapper-commander';
import { Interview } from '../models/interview.model';
import { InterviewMapper } from '../mappers/interview-mapper';
import { LoginService } from './login.service';
import { CreateCandidateRequest } from '../models/createCandidate.model';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private commanderCandidatesUrl = `${environment.baseUrl}/api/commander`;
  private volunteerUrl = `${environment.baseUrl}/api/volunteer`;
  private hrUrl = `${environment.baseUrl}/api/hr`;

  constructor(
    private http: HttpClient, private loginService: LoginService) {}

  getProfileDetails(): Observable<Candidate> {
    const url = `${this.volunteerUrl}/get-profile-details`;

    return this.http.get<Candidate>(url).pipe(
      map((response: Candidate) => {
        return response;
      }),
      catchError(error => {
        console.error('Error fetching profile details:', error);
        return throwError(() => new Error('Unable to fetch profile details'));
      })
    );
  }

  getCurrentUser(): Observable<Candidate> {
    return new Observable(observer => {
      const cachedUser = this.loginService.getCurrentUser();

      if (!cachedUser) {
        observer.error(new Error('No volunteer data found'));
        return;
      }
      observer.next(cachedUser);
      observer.complete();
    });
  }

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<any[]>(this.commanderCandidatesUrl);
  }

  getCandidatesForHR(): Observable<Candidate[]> {
    return this.http.get<any[]>(`${this.hrUrl}/volunteers`);
  }


  getVolunteerForHRById(id: string): Observable<Candidate> {
    return this.getCandidatesForHR().pipe(
      map(candidates => {
        const candidate = candidates.find(candidate => String(candidate.id) === id);
        if (!candidate) {
          throw new Error(`candidate with id ${id} not found`);
        }

        if (candidate.dateOfBirth) {
          candidate.age = this.calculateAge(candidate.dateOfBirth);
        }

        return candidate;
      })
    );
  }

  getCandidateById(id: string): Observable<Candidate> {
    return this.getCandidates().pipe(
      map(candidates => {
        const candidate = candidates.find(candidate => candidate.id === id);
        if (!candidate) {
          throw new Error(`candidate with id ${id} not found`);
        }

        if (candidate.dateOfBirth) {
          candidate.age = this.calculateAge(candidate.dateOfBirth);
        }

        return candidate;
      })
    );
  }

  updateVolunteerProfile(candidate: Candidate): Observable<Candidate> {
    const userId = candidate.id;
    return this.http.patch<any>(`${this.volunteerUrl}/${userId}`, candidate)
      .pipe(
        map(response => {
          return CandidateMapperService.mapFromUpdateVolunteerResponse(response, candidate);
        }),
        catchError(error => {
          console.error('Error updating volunteer profile:', error);
          return throwError(() => new Error('Failed to update volunteer profile'));
        })
      );
  }

  /*
    Commander Field
  */

  getCandidatesForJob(id: string): Observable<Candidate[]> {
    return this.http.get<any[]>(`${this.commanderCandidatesUrl}/jobs/${id}/applications`).pipe(
      map(response => CandidateMapperService.mapCommandersCandidateModelArray(response, id))
    );
  }

  getCommanderCandidateById(id: string): Observable<Candidate> {
    const candidateUrl = `${this.commanderCandidatesUrl}/volunteers/${id}`;
    return this.http.get<Candidate>(candidateUrl).pipe(
      map(candidate => {
        if (!candidate) {
          throw new Error(`Candidate with ID ${id} not found`);
        }

        if (candidate.dateOfBirth) {
          candidate.age = this.calculateAge(candidate.dateOfBirth);
        }

        return candidate;
      }),
      catchError(error => {
        console.error(`Error fetching candidate with ID ${id}:`, error);
        return throwError(() => new Error('Unable to fetch candidate data'));
      })
    );
  }

  updateCandidateStatus(jobId: string, candidateId: string, status: 'preferred_final' | 'preferred' | 'rejected'): Observable<any> {
    const url = `${this.commanderCandidatesUrl}/jobs/${jobId}/volunteers/${candidateId}`;
    return this.http.patch(url, { status }).pipe(
      catchError((error) => {
        console.error('Error updating candidate status:', error);
        return throwError(() => new Error('Unable to update candidate status'));
      })
    );
  }

  updateCandidate(candidate: Candidate): Observable<Candidate> {
    return this.http.put<Candidate>(`/api/candidates/${candidate.id}`, candidate);
  }

  getInterview(jobId: string, volunteerId: string): Observable<Interview | null> {
    const url = `${this.commanderCandidatesUrl}/jobs/${jobId}/volunteers/${volunteerId}/interviews`;
    return this.http.get<any>(url).pipe(
      map(response => {
        if (!response) {
          return null;
        }
        return InterviewMapper.mapToInterviewModel(response);
      }),
      catchError(error => {
        if (error.status === 404) {
          return of(null);
        }
        console.error(`Error fetching interview for jobId ${jobId} and volunteerId ${volunteerId}:`, error);
        return throwError(() => new Error('Unable to fetch interview'));
      })
    );
  }

  saveInterview(interview: Interview, jobId: string, volunteerId: string): Observable<any> {
    const url = `${this.commanderCandidatesUrl}/jobs/${jobId}/volunteers/${volunteerId}/interviews`;
    return this.http.post(url, interview).pipe(
      catchError(error => {
        console.error('Error creating interview:', error);
        return throwError(() => new Error('Unable to create interview'));
      })
    );
  }

  updateInterview(interview: Interview, jobId: string, volunteerId: string): Observable<any> {
    const url = `${this.commanderCandidatesUrl}/jobs/${jobId}/volunteers/${volunteerId}/interviews`;
    return this.http.patch(url, interview).pipe(
      catchError(error => {
        console.error('Error updating interview:', error);
        return throwError(() => new Error('Unable to update interview'));
      })
    );
  }

  deleteInterview(jobId: string, candidateId: string): Observable<void> {
    return this.http.delete<void>(`${this.commanderCandidatesUrl}/jobs/${jobId}/volunteers/${candidateId}/interviews`);
  }

  sendInterviewData(interviewData: any): void {
    const url = `${this.commanderCandidatesUrl}/send-interview-invitation`;
    console.log(interviewData)
    this.http.post(url, interviewData).pipe(
      catchError(error => {
        console.error('Error sending interview invitation:', error);
        return throwError(() => new Error('Unable to send interview invitation'));
      })
    ).subscribe({
      next: response => {
        console.log('Interview invitation sent successfully:', response);
      },
      error: err => {
        console.error('Error sending interview invitation:', err);
      }
    });
  }

  assignVolunteerToJob(volunteerId: string, jobId: string): Observable<any> {
    const url = `${this.hrUrl}/assignments`;
    const payload = {
      volunteer_id: volunteerId,
      job_id: jobId
    };

    return this.http.post<any>(url, payload).pipe(
      map(response => {
        return {
          success: true,
          applicationId: response.application_id,
          message: response.message
        };
      }),
      catchError(error => {
        console.error('Error assigning volunteer:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to assign volunteer'));
      })
    );
  }

  createCandidate(candidateData: CreateCandidateRequest): Observable<any> {
    return this.http.post<any>(`${this.hrUrl}/volunteers`, candidateData).pipe(
      map(response => ({
        success: true,
        userId: response.user_id,
        volunteerId: response.volunteer_id,
        message: response.message
      })),
      catchError(error => {
        console.error('Error creating candidate:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to create candidate'));
      })
    );
  }

  downloadResume(jobId: string, userId: string): Observable<Blob> {
    const url = `${this.commanderCandidatesUrl}/jobs/${jobId}/volunteers/${userId}/resume`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      catchError(error => {
        alert('Error downloading resume');
        return throwError(() => new Error('Unable to download resume'));
      })
    );
  }


  private calculateAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
