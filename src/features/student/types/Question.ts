export interface Question {
  _id: string;
  marks: number;
  correctAnswer: string;
  isDeleted: boolean;
  [key: string]: any;
}