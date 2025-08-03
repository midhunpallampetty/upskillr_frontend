export interface Question {
  _id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  marks: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ExamAnswer {
  questionId: string;
  selectedAnswer: string;
}

export interface ExamState {
  questions: Question[];
  answers: ExamAnswer[];
  currentQuestionIndex: number;
  timeRemaining: number;
  isSubmitted: boolean;
  isLoading: boolean;
  error: string | null;
}