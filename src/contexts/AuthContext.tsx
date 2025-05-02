
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (name: string, email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const MOCK_ADMIN: User = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'admin@testyourlevel.com',
  username: 'admin',
  role: 'admin',
  status: 'approved',
  createdAt: new Date(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Save user to storage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Admin hardcoded login
    if (username === 'admin' && password === 'admin123') {
      setCurrentUser(MOCK_ADMIN);
      setIsLoading(false);
      return;
    }
    
    // For students, check if they're in localStorage and if they're approved
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find((u: any) => u.username === username);
    
    if (user && user.status === 'approved') {
      setCurrentUser(user);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(false);
    if (!user) {
      throw new Error('Invalid username or password');
    } else if (user.status === 'pending') {
      throw new Error('Your account is pending approval');
    } else {
      throw new Error('Your registration has been rejected');
    }
  };

  const register = async (name: string, email: string, username: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Check if username or email already exists
    if (registeredUsers.some((u: any) => u.username === username)) {
      setIsLoading(false);
      throw new Error('Username already exists');
    }
    
    if (registeredUsers.some((u: any) => u.email === email)) {
      setIsLoading(false);
      throw new Error('Email already exists');
    }
    
    // Create new user with pending status
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      username,
      role: 'student',
      status: 'pending',
      createdAt: new Date(),
    };
    
    // Store password separately (in a real app this would be hashed)
    const userWithPassword = { ...newUser, password };
    
    // Save to localStorage
    localStorage.setItem('registeredUsers', JSON.stringify([...registeredUsers, userWithPassword]));
    
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
