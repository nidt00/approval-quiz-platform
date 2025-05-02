
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { QuizCourseCard } from '@/components/student/QuizCourseCard';
import { QuizCourse } from '@/types';

const StudentDashboardPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [quizCourses, setQuizCourses] = useState<QuizCourse[]>([]);
  
  useEffect(() => {
    // Load quiz courses from localStorage
    const courses = JSON.parse(localStorage.getItem('quizCourses') || '[]');
    setQuizCourses(courses);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (currentUser?.role !== 'student') {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2 text-quiz-primary">Student Dashboard</h1>
      <p className="mb-8 text-gray-600">Welcome, {currentUser?.name}. Browse available quizzes below.</p>
      
      {quizCourses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">No Quizzes Available</h2>
          <p className="text-gray-600">
            There are currently no quiz courses available. Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizCourses.map((course) => (
            <QuizCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboardPage;
