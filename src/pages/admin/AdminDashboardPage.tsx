
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { StudentRequestList } from '@/components/admin/StudentRequestList';
import { StudentList } from '@/components/admin/StudentList';
import { QuizCourseForm } from '@/components/admin/QuizCourseForm';
import { QuizCourseList } from '@/components/admin/QuizCourseList';
import { User, QuizCourse } from '@/types';
import { toast } from '@/components/ui/use-toast';

const AdminDashboardPage = () => {
  const { isAdmin, isAuthenticated, currentUser } = useAuth();
  const [pendingStudents, setPendingStudents] = useState<User[]>([]);
  const [approvedStudents, setApprovedStudents] = useState<User[]>([]);
  const [quizCourses, setQuizCourses] = useState<QuizCourse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    console.log("Admin dashboard loaded, isAdmin:", isAdmin, "currentUser:", currentUser);
    loadStudents();
    loadQuizCourses();
  }, []);
  
  const loadStudents = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    setPendingStudents(
      registeredUsers
        .filter((user: any) => user.status === 'pending' && user.role === 'student')
        .map((user: any) => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        })
    );
    
    setApprovedStudents(
      registeredUsers
        .filter((user: any) => user.status === 'approved' && user.role === 'student')
        .map((user: any) => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        })
    );
  };
  
  const loadQuizCourses = () => {
    const courses = JSON.parse(localStorage.getItem('quizCourses') || '[]');
    setQuizCourses(courses);
  };
  
  const handleApproveStudent = (userId: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    const updatedUsers = registeredUsers.map((user: any) => {
      if (user.id === userId) {
        return { ...user, status: 'approved' };
      }
      return user;
    });
    
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    loadStudents();
  };
  
  const handleRejectStudent = (userId: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    const updatedUsers = registeredUsers.map((user: any) => {
      if (user.id === userId) {
        return { ...user, status: 'rejected' };
      }
      return user;
    });
    
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    loadStudents();
  };
  
  const handleRemoveStudent = (userId: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    const updatedUsers = registeredUsers.filter((user: any) => user.id !== userId);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    loadStudents();
  };
  
  const handleCreateQuizCourse = (title: string, description: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const newCourse: QuizCourse = {
        id: `course-${Date.now()}`,
        title,
        description,
        createdBy: currentUser?.id || 'admin-1',
        createdAt: new Date(),
        questions: [],
      };
      
      const courses = JSON.parse(localStorage.getItem('quizCourses') || '[]');
      localStorage.setItem('quizCourses', JSON.stringify([...courses, newCourse]));
      
      loadQuizCourses();
      setIsLoading(false);
      
      toast({
        title: "Quiz Course Created",
        description: "Your new quiz course has been created successfully",
      });
    }, 500);
  };
  
  const handleDeleteCourse = (courseId: string) => {
    const courses = JSON.parse(localStorage.getItem('quizCourses') || '[]');
    
    const updatedCourses = courses.filter((course: QuizCourse) => course.id !== courseId);
    localStorage.setItem('quizCourses', JSON.stringify(updatedCourses));
    
    loadQuizCourses();
    
    toast({
      title: "Quiz Course Deleted",
      description: "The quiz course has been deleted successfully",
    });
  };

  // Double-check authentication and admin status
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    console.log("Not an admin, redirecting to home");
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-8 text-quiz-primary">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <StudentRequestList 
          pendingStudents={pendingStudents}
          onApprove={handleApproveStudent}
          onReject={handleRejectStudent}
        />
        
        <StudentList 
          students={approvedStudents}
          onRemoveStudent={handleRemoveStudent}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          <QuizCourseForm 
            onSubmit={handleCreateQuizCourse}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-2">
          <QuizCourseList 
            courses={quizCourses}
            onDeleteCourse={handleDeleteCourse}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
