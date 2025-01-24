
import { Job } from "../models/jobs.model";

export class JobMapper {
  static mapJobResponse(job: any): Job {
    return {
      id: job.id,
      jobName: job.jobName,
      jobCategory: job.jobCategory,
      unit: job.unit,
      address: job.address,
      positions: job.positions,
      openBase: job.openBase,
      closedBase: job.closedBase,
      jobDescription: job.jobDescription,
      additionalInfo: job.additionalInfo,
      commonQuestions: job.questions.map((q: any) => q.question_text),
      commonAnswers: job.questions.map((q: any) => q.answer_text),
      education: job.education,
      techSkills: job.techSkills,
      workExperience: job.workExperience,
      passedCourses: job.passedCourses,
      candidateCount: job.candidateCount,
      status: job.status,
      department: job.department,
    };
  }

  static mapJobForUpdate(job: Job): any {
    return {
      name: job.jobName,
      description: job.jobDescription,
      positions: job.positions,
      category: job.jobCategory,
      unit: job.unit,
      address: job.address,
      openbase: job.openBase,
      additionalinfo: job.additionalInfo,
      questions: job.commonQuestions.map((questionText: string, index: number) => ({
        id: job.commonAnswers[index] ? `${index}` : '',
        question_text: questionText,
        answer_text: job.commonAnswers[index] || ''
      })),
      workexperience: job.workExperience,
      education: job.education,
      passedcourses: job.passedCourses,
      techskills: job.techSkills,
      status: job.status.toLowerCase()
    };
  }




  static mapJobForAdd(job: Job): any {
    return {
      name: job.jobName,
      description: job.jobDescription,
      positions: job.positions,
      category: job.jobCategory,
      unit: job.unit,
      address: job.address,
      openBase: job.openBase,
      additionalInfo: job.additionalInfo,
      questions: job.commonQuestions.map((questionText: string, index: number) => ({
        id: job.commonAnswers[index] ? `${index}` : '',
        question_text: questionText,
        answer_text: job.commonAnswers[index] || ''
      })),
      answers: job.commonAnswers,
      workExperience: job.workExperience,
      education: job.education,
      passedCourses: job.passedCourses,
      techSkills: job.techSkills
    };
  }

  static mapJobForVolunteerMainPage(input: any): Job {
    return {
      jobName: input.title,
      id: input.id,
      jobDescription: input.description,
      positions: input.vacant_positions,
      jobCategory: input.jobCategory,
      unit: input.unit,
      address: input.address,
      openBase: input.openBase,
      closedBase: input.closedBase,
      additionalInfo: input.additionalInfo,
      commonQuestions: input.commonQuestions,
      commonAnswers: input.commonAnswers,
      education: input.education,
      techSkills: input.techSkills,
      workExperience: input.workExperience,
      passedCourses: input.passedCourses,
      candidateCount: input.candidateCount,
      status: input.status,
      department: input.department
    };
  }

  static mapJobForVolunteerJobDetailsPage(input: any): Job {
    return {
      id: input.id,
      jobName: input.title,
      jobCategory: '',
      unit: input.unit,
      address: '',
      positions: input.vacant_positions,
      openBase: false,
      closedBase: false,
      jobDescription: input.description,
      additionalInfo: input.additional_info,
      commonQuestions: input.questions?.map((q: any) => q.question_text) || [],
      commonAnswers: input.questions?.map((q: any) => q.answer_text) || [],
      education: input.education,
      techSkills: input.tech_skills,
      workExperience: input.experience,
      passedCourses: input.passed_courses,
      candidateCount: 0,
      status: '',
      department: ''
    };
  }

  static mapJobsForVolunteerMainPage(input: any[]): Job[] {
    return input.map(item => ({
      jobName: item.title,
      id: item.id,
      jobDescription: item.description,
      positions: item.vacant_positions,
      jobCategory: item.jobCategory,
      unit: item.unit,
      address: item.address,
      openBase: item.openBase,
      closedBase: item.closedBase,
      additionalInfo: item.additionalInfo,
      commonQuestions: item.commonQuestions,
      commonAnswers: item.commonAnswers,
      education: item.education,
      techSkills: item.techSkills,
      workExperience: item.workExperience,
      passedCourses: item.passedCourses,
      candidateCount: item.candidateCount,
      status: item.status,
      department: item.department
    }));
  }

  static mapJobForHRMainPage(input: any): Job {
    return {
        jobName: input.jobName,
        id: input.id,
        jobDescription: input.jobDescription,
        positions: input.positions,
        jobCategory: input.jobCategory,
        unit: input.unit,
        address: input.address,
        openBase: input.openBase,
        closedBase: input.closedBase,
        additionalInfo: input.additionalInfo,
        commonQuestions: input.commonQuestions,
        commonAnswers: input.commonAnswers,
        education: input.education,
        techSkills: input.techSkills,
        workExperience: input.workExperience,
        passedCourses: input.passedCourses,
        candidateCount: input.candidateCount,
        department: input.department,
        status: input.status
    };
}

static mapJobsForHRMainPage(input: any[]): Job[] {
    return input.map(item => ({
        jobName: item.jobName,
        id: item.id,
        jobDescription: item.jobDescription,
        positions: item.positions,
        jobCategory: item.jobCategory,
        unit: item.unit,
        address: item.address,
        openBase: item.openBase,
        closedBase: item.closedBase,
        additionalInfo: item.additionalInfo,
        commonQuestions: item.commonQuestions,
        commonAnswers: item.commonAnswers,
        education: item.education,
        techSkills: item.techSkills,
        workExperience: item.workExperience,
        passedCourses: item.passedCourses,
        candidateCount: item.candidateCount,
        applications_count: item.applications_count,
        commanderId: item.commanderId,
        department: item.department,
        status: item.status
    }));
  }
}
