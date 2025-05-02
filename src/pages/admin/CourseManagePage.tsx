
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QuizCourse, Question, QuizSubmission, User } from '@/types';
import { QuestionForm } from '@/components/admin/QuestionForm';
import { QuestionList } from '@/components/admin/QuestionList';
import { QuizSubmissionList } from '@/components/student/QuizSubmissionList';
import { toast } from '@/components/ui/use-toast';

const CourseManagePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { isAdmin, isAuthenticated } = useAuth();
  
  const [course, setCourse] = useState<QuizCourse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submissions, setSubmissions] = useState<(QuizSubmission & { student: User })[]>([]);
  
  useEffect(() => {
    loadCourse();
    loadSubmissions();
  }, [courseId]);
  
  const loadCourse = () => {
    const courses = JSON.parse(localStorage.getItem('quizCourses') || '[]');
    const foundCourse = courses.find((c: QuizCourse) => c.id === courseId);
    
    if (foundCourse) {
      setCourse(foundCourse);
    }
  };
  
  const loadSubmissions = () => {
    const allSubmissions = JSON.parse(localStorage.getItem('quizSubmissions') || '[]');
    const courseSubmissions = allSubmissions.filter((s: QuizSubmission) => s.courseId === courseId);
    
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    const submissionsWithStudents = courseSubmissions.map((submission: QuizSubmission) => {
      const student = users.find((u: User) => u.id === submission.studentId);
      const { password, ...studentWithoutPassword } = student || {};
      
      return {
        ...submission,
        student: studentWithoutPassword,
      };
    });
    
    setSubmissions(submissionsWithStudents);
  };
  
  const handleAddQuestion = (questionText: string, options: string[], correctIndex: number) => {
    if (!course) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const newQuestion: Question = {
        id: `question-${Date.now()}`,
        text: questionText,
        options,
        correctOptionIndex: correctIndex,
      };
      
      const courses = JSON.parse(localStorage.getItem('quizCourses') || '[]');
      const updatedCourses = courses.map((c: QuizCourse) => {
        if (c.id === courseId) {
          return {
            ...c,
            questions: [...c.questions, newQuestion],
          };
        }
        return c;
      });
      
      localStorage.setItem('quizCourses', JSON.stringify(updatedCourses));
      loadCourse();
      setIsLoading(false);
      
      toast({
        title: "Question Added",
        description: "The question has been added to the quiz course",
      });
    }, 500);
  };
  
  const handleDeleteQuestion = (questionId: string) => {
    if (!course) return;
    
    const courses = JSON.parse(localStorage.getItem('quizCourses') || '[]');
    const updatedCourses = courses.map((c: QuizCourse) => {
      if (c.id === courseId) {
        return {
          ...c,
          questions: c.questions.filter(q => q.id !== questionId),
        };
      }
      return c;
    });
    
    localStorage.setItem('quizCourses', JSON.stringify(updatedCourses));
    loadCourse();
    
    toast({
      title: "Question Deleted",
      description: "The question has been removed from the quiz course",
    });
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Course not found</h2>
          <Link to="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-quiz-primary">
          {course.title}
        </h1>
        <Link to="/admin/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      
      <p className="text-gray-600 mb-8">
        {course.description}
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div>
          <QuestionForm 
            courseId={courseId || ''}
            onSubmit={handleAddQuestion}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-2">
          <QuestionList 
            questions={course.questions}
            onDeleteQuestion={handleDeleteQuestion}
          />
        </div>
      </div>
      
      <div className="mt-10">
        <QuizSubmissionList 
          submissions={submissions}
          courseTitle={course.title}
        />
      </div>
    </div>
  );
};

export default CourseManagePage;
