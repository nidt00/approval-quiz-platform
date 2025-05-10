
import React, { useEffect } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { isAuthenticated, isAdmin, currentUser } = useAuth();
  const navigate = useNavigate();

  // Debug authentication state
  useEffect(() => {
    console.log("Auth state in LoginPage:", { 
      isAuthenticated, 
      isAdmin, 
      currentUser: currentUser ? {
        role: currentUser.role,
        email: currentUser.email
      } : null
    });
  }, [isAuthenticated, isAdmin, currentUser]);

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      console.log("User already authenticated in LoginPage, redirecting", { isAdmin });
      if (isAdmin) {
        console.log("Redirecting to admin dashboard from LoginPage");
        navigate('/admin/dashboard', { replace: true });
      } else {
        console.log("Redirecting to student dashboard from LoginPage");
        navigate('/student/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <div className="container max-w-screen-sm mx-auto px-4 py-10">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
