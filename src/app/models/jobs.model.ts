export interface Job {
  id: string;
  jobName: string;
  jobCategory: string;
  unit: string;
  address: string;
  positions: number | null;
  openBase: boolean;
  closedBase: boolean;
  jobDescription: string;
  additionalInfo: string;
  commonQuestions: string[];
  commonAnswers: string[];
  education: string;
  techSkills: string;
  workExperience: string;
  passedCourses: string;
  candidateCount: number;
  status: string;
  department: string;
}
