export interface Interview {
  candidateId: string;
  jobId: string;
  interviewNotes: string;
  interviewDate: Date | null;
  automaticMessage: string;
  fullName: string;
  email: string;
  status: string;
}
