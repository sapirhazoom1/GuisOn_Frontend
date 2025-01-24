export interface Candidate {
  id:string;
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  profile: string;
  phone: string;
  email: string;
  address: string;
  experience: string;
  education: string;
  courses: string;
  languages: string;
  interests: string;
  personalSummary: string;
  jobStatuses: {
    [jobId: string]: 'preferred_final' | 'preferred' | 'rejected' | 'pending' | 'hired';
  };
  imageUrl: string;
}
