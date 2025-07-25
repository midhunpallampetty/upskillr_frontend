export interface Course {
  _id: string;
  courseName: string;
  fee: number;
  courseThumbnail: string;
  noOfLessons: number;
  isPreliminaryRequired: boolean;
  sections: { title: string }[];
  description:string;
}