interface SectionPayload {
  sectionName: string;
  examRequired: boolean;
  videos: any[];
}

export interface CoursePayload {
  courseName: string;
  isPreliminaryRequired: boolean;
  courseThumbnail: string;
  fee: number;
  sections: SectionPayload[];
  forum: null;
  schoolId: string;
}