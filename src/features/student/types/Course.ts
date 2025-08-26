export interface Course {
  _id: string;
  courseName: string;
  description: string;
  createdAt: string;
  fee: number;
  noOfLessons: number;
  courseThumbnail: string;
}


export type VideoType = {
  _id: string;
  videoName: string;
  duration?: string;
  url: string;
  description: string;
};

export type SectionType = {
  _id: string;
  sectionName: string;
  videos: VideoType[];
};

export type CourseType = {
  _id: string;
  courseName: string;
  courseThumbnail: string;
  description: string;
  sections: SectionType[];
  isPreliminaryRequired: boolean;
};