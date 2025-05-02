
export type UserRole = 'admin' | 'student';

export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
}

export interface QuizCourse {
  id: string;
  title: string;
  description: string;
  createdBy: string; // admin ID
  createdAt: Date;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface QuizSubmission {
  id: string;
  studentId: string;
  courseId: string;
  answers: number[]; // Index of selected option for each question
  submittedAt: Date;
  score?: number; // Calculated score, not shown to students
}
