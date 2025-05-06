
import React, { useEffect } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      console.log("User already authenticated in LoginPage, redirecting", { isAdmin });
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
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
