
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { isAuthenticated, isAdmin, currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-quiz-primary mb-6">
          Welcome to Test YourLevel
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A real-time quiz platform designed for students and educators
        </p>
        
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          {!isAuthenticated ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
              <p className="text-gray-600 mb-6">
                Register as a student and take quizzes created by administrators.
                Your registration will need admin approval before you can log in.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button className="bg-quiz-primary hover:bg-opacity-90 w-full sm:w-auto px-8">
                    Register as Student
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="w-full sm:w-auto px-8">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">
                Welcome back, {currentUser?.name}!
              </h2>
              
              {isAdmin ? (
                <div>
                  <p className="text-gray-600 mb-6">
                    Access your admin dashboard to manage students, courses, and quizzes.
                  </p>
                  <Link to="/admin/dashboard">
                    <Button className="bg-quiz-primary hover:bg-opacity-90 px-8">
                      Go to Admin Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-6">
                    Browse available quizzes and test your knowledge.
                  </p>
                  <Link to="/student/dashboard">
                    <Button className="bg-quiz-primary hover:bg-opacity-90 px-8">
                      Go to Student Dashboard
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-quiz-primary">Students</h3>
            <p className="text-gray-600">
              Take quizzes and track your progress. Registration requires admin approval.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-quiz-primary">Quizzes</h3>
            <p className="text-gray-600">
              Multiple-choice questions designed to test your knowledge in various subjects.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-quiz-primary">Administrators</h3>
            <p className="text-gray-600">
              Create quizzes, manage students, and view submission results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
