import { Injectable } from '@angular/core';
import { Candidate } from '../models/candidates.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateMapperService {

    // This mapping is used in: Commander, Hr and volunteer
  // Hr Candidate page - OnInit
  // Hr main page - OnInit
  // Control icons - OnInit
  // User main page - OnInit
  static mapVolunteerCandidateModel(response: any): Candidate {
    return {
      id: response.id?.toString() || '',
      fullName: response.full_name || '',
      idNumber: response.national_id || '',
      dateOfBirth: response.date_of_birth || '',
      age: response.age || null,
      gender: response.gender || '',
      profile: response.profile?.toString() || '',
      phone: response.phone,
      email: response.email || '',
      address: response.address || '',
      experience: response.experience || '',
      education: response.education || '',
      courses: response.courses || '',
      languages: response.languages || '',
      interests: response.interests || '',
      personalSummary: response.personal_summary || '',
      jobStatuses: {},
      imageUrl: response.imageUrl || '',
    };
  }

  /* Commander Mappers */
  static mapToCommandersCandidatesModel(rawData: any, jobId?: string): Candidate {
    const jobStatuses: { [key: string]: 'preferred_final' | 'preferred' | 'rejected' | 'pending' | 'hired' } = {};

    if (jobId && rawData.status) {
      jobStatuses[jobId] = rawData.status as 'preferred_final' | 'preferred' | 'rejected' | 'pending' | 'hired';
    }

    return {
      id: rawData.candidateUserId?.toString() || '',
      fullName: rawData.name || '',
      idNumber: '',
      dateOfBirth: '',
      age: rawData.age || 0,
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
      jobStatuses: jobStatuses,
      imageUrl: rawData.imageUrl || ''
    };
  }

  // CandidatesService - getCandidatesForJob
  static mapCommandersCandidateModelArray(rawDataArray: any[], jobId?: string): Candidate[] {
    return rawDataArray.map(item => CandidateMapperService.mapToCommandersCandidatesModel(item, jobId));
  }
  // Candidate Profile - OnInit
  // Candidate Details - OnInit
  // Interview Summary - loadInitialData
  static mapCommanderCandidateForProfile(candidate: Candidate): any {
    return {
      id: candidate?.id || '',
      fullName: candidate?.fullName || '',
      idNumber: candidate?.idNumber || '',
      dateOfBirth: candidate?.dateOfBirth || '',
      age: candidate?.age || null,
      gender: candidate?.gender || null,
      profile: candidate?.profile || '',
      phone: candidate?.phone || '',
      email: candidate?.email || '',
      address: candidate?.address || '',
      experience: candidate?.experience || '',
      education: candidate?.education || '',
      courses: candidate?.courses || '',
      languages: candidate?.languages || '',
      interests: candidate?.interests || '',
      personalSummary: candidate?.personalSummary || '',
      jobStatuses: candidate?.jobStatuses
        ? Object.entries(candidate.jobStatuses).reduce((acc, [jobId, status]) => {
            acc[jobId] = status;
            return acc;
          }, {} as { [jobId: string]: 'preferred_final' | 'preferred' | 'rejected' | 'pending' | 'hired' })
        : {},
      imageUrl: candidate?.imageUrl || '',
    };
  }

  /*
    Volunteer Mapping
  */

  // User profile - SaveProfile(UpdateRequest)
  static mapToUpdateVolunteerRequest(candidate: Candidate): any {
    return {
      id: candidate.id || null,
      full_name: candidate.fullName || null,
      address: candidate.address || null,
      primary_profession: candidate.profile || null,
      education: candidate.education || null,
      area_of_interest: candidate.interests || null,
      contact_reference: null,
      profile: candidate.profile || null,
      date_of_birth: candidate.dateOfBirth,
      gender: candidate.gender.toUpperCase() || null,
      experience: candidate.experience || null,
      courses: candidate.courses || null,
      languages: candidate.languages || null,
      personal_summary: candidate.personalSummary || null,
      phone: candidate.phone || null,
      email: candidate.email || null
    };
  }

  // CandidateService - updateVolunteerProfile(UpdateResponse)
  static mapFromUpdateVolunteerResponse(response: any, existingCandidate: Candidate): Candidate {
    if (!response) {
      throw new Error('Invalid response data');
    }

    return {
      id: response.id?.toString() || existingCandidate.id,
      fullName: response.full_name || existingCandidate.fullName,
      idNumber: existingCandidate.idNumber,
      dateOfBirth: response.date_of_birth || existingCandidate.dateOfBirth,
      age: response.age || existingCandidate.age,
      gender: response.gender || existingCandidate.gender,
      profile: response.profile || existingCandidate.profile,
      phone: response.phone || existingCandidate.phone,
      email: response.email || existingCandidate.email,
      address: response.address || existingCandidate.address,
      experience: response.experience || existingCandidate.experience,
      education: response.education || existingCandidate.education,
      courses: response.courses || existingCandidate.courses,
      languages: response.languages || existingCandidate.languages,
      interests: response.area_of_interest || existingCandidate.interests,
      personalSummary: response.personal_summary || existingCandidate.personalSummary,
      jobStatuses: existingCandidate.jobStatuses || {},
      imageUrl: response.imageUrl || existingCandidate.imageUrl
    };
  }

  // User Profile - loadCurrentVolunteer
  static mapToCandidate(input: any): Candidate {
    return {
      id: input?.id?.toString() || '',
      fullName: input?.full_name || '',
      idNumber: input?.national_id || '',
      dateOfBirth: input?.date_of_birth || '',
      age: input?.age || null,
      gender: input?.gender || '',
      profile: input?.profile?.toString() || '',
      phone: input?.phone || '',
      email: input?.email || '',
      address: input?.address || '',
      experience: input?.experience || '',
      education: input?.education || '',
      courses: input?.courses || '',
      languages: input?.languages || '',
      interests: input?.area_of_interest || '',
      personalSummary: input?.personal_summary || '',
      jobStatuses: {},
      imageUrl: input.imageUrl || '',
    };
  }

  /*
    HR Mapping
  */

  // Hr Candidate page - OnInit, onAssignmentComplete, loadCandidates
  // hr job details - loadCandidates
  static mapCandidatesForHRModel(responseArray: any[]): Candidate[] {
    return responseArray.map(response => ({
        id: response.id?.toString() || '',
        fullName: response.fullName || '',
        idNumber: response.idNumber || '',
        dateOfBirth: new Date(response.dateOfBirth).toISOString() || '',
        age: response.age || null,
        gender: response.gender || '',
        profile: response.profile?.toString() || '',
        phone: response.phone || '',
        email: response.email || '',
        address: response.address || '',
        experience: response.experience || '',
        education: response.education || '',
        courses: response.courses || '',
        languages: response.languages || '',
        interests: response.interests || '',
        personalSummary: response.personalSummary || '',
        jobStatuses: response.jobStatuses || {},
        imageUrl: response.imageUrl || ''
    }));
  }
}
