// types/Exam.ts


export interface Exam {
  _id: string ; // Unique identifier (ObjectId in MongoDB)
  title: string; // Name of the exam (e.g., "Midterm Math Exam")
  description?: string; // Optional description
  questions?: Array<string | { questionText: string; options: string[]; correctAnswer: string }>; // Array of question IDs or full question objects
  duration?: number; // Duration in minutes (optional)
  totalMarks?: number; // Total possible marks (optional)
  isPreliminary?: boolean; // Flag for preliminary exams (based on your course patterns)
  isDeleted?: boolean; // For soft deletes (mirroring your backend patterns)
  createdAt?: Date; // Timestamp for creation
  updatedAt?: Date; // Timestamp for last update
  // Add any other fields from your ExamSchema, e.g., schoolId, courseId, etc.
}
