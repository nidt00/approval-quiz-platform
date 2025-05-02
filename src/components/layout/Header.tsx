
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-quiz-primary">
            <Link to="/">Test YourLevel</Link>
          </h1>
        </div>
        
        <div>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentUser?.role === 'admin' ? 'Admin' : 'Student'}: {currentUser?.name}
              </span>
              <Button 
                variant="ghost" 
                onClick={logout} 
                className="text-gray-600 hover:text-quiz-primary"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" className="text-quiz-primary">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-quiz-primary hover:bg-opacity-90">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
