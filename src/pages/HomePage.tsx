import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';

const HomePage = () => {
  const { currentUser, isAuthenticated, isAdmin } = useAuth();
  const isSupabaseReady = isSupabaseConfigured();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-quiz-primary mb-6">Welcome to QuizMaster</h1>
        <p className="text-xl mb-8">The ultimate platform for creating and taking quizzes online</p>
        
        {!isSupabaseReady && (
          <Card className="mb-8 border-red-300 bg-red-50">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-red-700 mb-2">⚠️ Supabase Configuration Missing</h2>
              <p className="mb-4 text-red-600">
                Your Supabase environment variables are missing. Please follow these steps to configure Supabase:
              </p>
              <ol className="text-left text-red-600 list-decimal pl-6 mb-4 space-y-2">
                <li>Click on the Supabase button in the top right corner of your Lovable editor</li>
                <li>Make sure your Lovable project is connected to Supabase</li>
                <li>Add the required environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)</li>
                <li>Refresh the page after setting up the environment variables</li>
              </ol>
              <p className="text-sm text-red-500">
                Without these configuration values, authentication and data storage features will not work.
              </p>
            </CardContent>
          </Card>
        )}
        
        {isAuthenticated ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Welcome back, {currentUser?.name}!</h2>
            <div className="flex justify-center space-x-4">
              {isAdmin ? (
                <Link to="/admin/dashboard">
                  <Button size="lg" className="bg-quiz-primary hover:bg-quiz-primary-dark">
                    Go to Admin Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/student/dashboard">
                  <Button size="lg" className="bg-quiz-primary hover:bg-quiz-primary-dark">
                    Go to Student Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <path d="M12 11.5v5M10 13.5h4" /><circle cx="12" cy="7.5" r="1" />
                      <path d="M5 5.5a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M20 22.5l-4 -4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Engage with Quizzes</h3>
                  <p className="text-gray-600 mb-4">Take quizzes created by our team of experts and test your knowledge</p>
                </CardContent>
              </Card>
              
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                      <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /><path d="M12 8v8" /><path d="M8 12h8" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                  <p className="text-gray-600 mb-4">Monitor your learning journey with detailed progress tracking</p>
                </CardContent>
              </Card>
              
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                      <path d="M3 8h18M3 12h18M3 16h18" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Get Results</h3>
                  <p className="text-gray-600 mb-4">Receive instant feedback on your performance from instructors</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto bg-quiz-primary hover:bg-quiz-primary-dark">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
