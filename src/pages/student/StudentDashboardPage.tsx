
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { QuizCourseCard } from '@/components/student/QuizCourseCard';
import { QuizCourse } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SentResult {
  submissionId: string;
  studentId: string;
  courseId: string;
  sentBy: string;
  senderName: string;
  sentAt: string | Date;
  score?: number;
}

const StudentDashboardPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [quizCourses, setQuizCourses] = useState<QuizCourse[]>([]);
  const [sentResults, setSentResults] = useState<SentResult[]>([]);
  
  useEffect(() => {
    // Load quiz courses from localStorage
    const courses = JSON.parse(localStorage.getItem('quizCourses') || '[]');
    setQuizCourses(courses);
    
    // Load sent results from localStorage
    const results = JSON.parse(localStorage.getItem('sentResults') || '[]');
    
    // Filter results for the current student
    if (currentUser) {
      const studentResults = results.filter((result: SentResult) => 
        result.studentId === currentUser.id
      );
      setSentResults(studentResults);
    }
  }, [currentUser]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (currentUser?.role !== 'student') {
    return <Navigate to="/" />;
  }

  // Function to find the course title by courseId
  const getCourseTitle = (courseId: string): string => {
    const course = quizCourses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2 text-quiz-primary">Student Dashboard</h1>
      <p className="mb-8 text-gray-600">Welcome, {currentUser?.name}. Browse available quizzes below.</p>
      
      {/* Results Section */}
      {sentResults.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Quiz Results</CardTitle>
            <CardDescription>Results sent by instructors</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Sent By</TableHead>
                  <TableHead>Sent At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentResults.map((result) => {
                  // Find the corresponding submission to get the score
                  const submissions = JSON.parse(localStorage.getItem('quizSubmissions') || '[]');
                  const submission = submissions.find((sub: any) => sub.id === result.submissionId);
                  
                  return (
                    <TableRow key={result.submissionId}>
                      <TableCell>{getCourseTitle(result.courseId)}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {submission?.score}%
                        </span>
                      </TableCell>
                      <TableCell>{result.senderName || 'Admin'}</TableCell>
                      <TableCell>
                        {new Date(result.sentAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Available Quizzes Section */}
      <h2 className="text-xl font-bold mb-4">Available Quizzes</h2>
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
