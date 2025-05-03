
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      quiz_courses: {
        Row: {
          id: string
          title: string
          description: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          created_by?: string
          created_at?: string
        }
      }
      quiz_questions: {
        Row: {
          id: string
          course_id: string
          text: string
          options: string[]
          correct_option_index: number
        }
        Insert: {
          id?: string
          course_id: string
          text: string
          options: string[]
          correct_option_index: number
        }
        Update: {
          id?: string
          course_id?: string
          text?: string
          options?: string[]
          correct_option_index?: number
        }
      }
      quiz_submissions: {
        Row: {
          id: string
          student_id: string
          course_id: string
          answers: number[]
          submitted_at: string
          score: number | null
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          answers: number[]
          submitted_at?: string
          score?: number | null
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          answers?: number[]
          submitted_at?: string
          score?: number | null
        }
      }
      sent_results: {
        Row: {
          id: string
          submission_id: string
          student_id: string
          course_id: string
          sent_by: string
          sender_name: string
          sent_at: string
          score: number | null
        }
        Insert: {
          id?: string
          submission_id: string
          student_id: string
          course_id: string
          sent_by: string
          sender_name: string
          sent_at?: string
          score?: number | null
        }
        Update: {
          id?: string
          submission_id?: string
          student_id?: string
          course_id?: string
          sent_by?: string
          sender_name?: string
          sent_at?: string
          score?: number | null
        }
      }
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          username: string
          role: 'admin' | 'student'
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          username: string
          role?: 'admin' | 'student'
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          username?: string
          role?: 'admin' | 'student'
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
      }
    }
  }
}
