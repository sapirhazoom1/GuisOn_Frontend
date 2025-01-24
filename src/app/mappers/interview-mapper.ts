import { Interview } from "../models/interview.model";

export class InterviewMapper {
  static mapToInterviewModel(response: any): Interview {
    return {
      candidateId: response.candidateId || '',
      jobId: response.jobId || '',
      interviewNotes: response.interviewNotes || '',
      interviewDate: response.interviewDate ? new Date(response.interviewDate) : null,
      automaticMessage: response.automaticMessage || '',
      status: response.status || '',
      fullName: response.fullName || '',
      email: response.email || '',
    };
  }
}
