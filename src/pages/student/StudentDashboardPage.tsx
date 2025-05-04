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
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface SentResult {
  id: string;
  submission_id: string;
  student_id: string;
  course_id: string;
  sent_by: string;
  sender_name: string;
  sent_at: string;
  score: number | null;
}

const StudentDashboardPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [quizCourses, setQuizCourses] = useState<QuizCourse[]>([]);
  const [sentResults, setSentResults] = useState<SentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      
      try {
        // Fetch quiz courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('quiz_courses')
          .select('*, quiz_questions(*)');
          
        if (coursesError) throw coursesError;
        
        // Transform data to match QuizCourse type
        const transformedCourses: QuizCourse[] = coursesData.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          createdBy: course.created_by,
          createdAt: new Date(course.created_at),
          questions: course.quiz_questions.map((q: any) => ({
            id: q.id,
            text: q.text,
            options: q.options,
            correctOptionIndex: q.correct_option_index
          }))
        }));
        
        setQuizCourses(transformedCourses);
        
        // Fetch sent results for the current student
        const { data: resultsData, error: resultsError } = await supabase
          .from('sent_results')
          .select('*')
          .eq('student_id', currentUser.id);
          
        if (resultsError) throw resultsError;
        
        setSentResults(resultsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (currentUser?.role !== 'student') {
    return <Navigate to="/" />;
  }

  // Function to find the course title by courseId
  function getCourseTitle(courseId: string): string {
    const course = quizCourses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2 text-quiz-primary">Student Dashboard</h1>
      <p className="mb-8 text-gray-600">Welcome, {currentUser?.name}. Browse available quizzes below.</p>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <p>Loading your dashboard...</p>
        </div>
      ) : (
        <>
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
                    {sentResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>{getCourseTitle(result.course_id)}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {result.score}%
                          </span>
                        </TableCell>
                        <TableCell>{result.sender_name || 'Admin'}</TableCell>
                        <TableCell>
                          {new Date(result.sent_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
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
        </>
      )}
    </div>
  );
};

export default StudentDashboardPage;
