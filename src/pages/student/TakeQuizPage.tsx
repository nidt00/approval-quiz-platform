
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QuizCourse, Question, QuizSubmission } from '@/types';
import { QuizQuestion } from '@/components/student/QuizQuestion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const TakeQuizPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { isAuthenticated, currentUser } = useAuth();
  
  const [course, setCourse] = useState<QuizCourse | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  useEffect(() => {
    // Load quiz course
    const courses = JSON.parse(localStorage.getItem('quizCourses') || '[]');
    const foundCourse = courses.find((c: QuizCourse) => c.id === courseId);
    
    if (foundCourse) {
      setCourse(foundCourse);
      // Initialize answers array with nulls
      setAnswers(new Array(foundCourse.questions.length).fill(null));
    }
    
    // Check if user has already submitted this quiz
    const submissions = JSON.parse(localStorage.getItem('quizSubmissions') || '[]');
    const hasSubmission = submissions.some(
      (s: QuizSubmission) => s.courseId === courseId && s.studentId === currentUser?.id
    );
    
    if (hasSubmission) {
      setQuizSubmitted(true);
    }
  }, [courseId, currentUser?.id]);
  
  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < (course?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmitQuiz = () => {
    if (!course || !currentUser) return;
    
    // Calculate score (only for admin viewing, not shown to student)
    const totalQuestions = course.questions.length;
    let correctAnswers = 0;
    
    course.questions.forEach((question, index) => {
      if (answers[index] === question.correctOptionIndex) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Create submission object
    const submission: QuizSubmission = {
      id: `submission-${Date.now()}`,
      studentId: currentUser.id,
      courseId: course.id,
      answers: answers.map(a => a !== null ? a : -1), // Convert null to -1 for storage
      submittedAt: new Date(),
      score,
    };
    
    // Save to localStorage
    const submissions = JSON.parse(localStorage.getItem('quizSubmissions') || '[]');
    localStorage.setItem('quizSubmissions', JSON.stringify([...submissions, submission]));
    
    setQuizSubmitted(true);
    
    toast({
      title: "Quiz Submitted",
      description: "Your quiz has been submitted successfully",
    });
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (currentUser?.role !== 'student') {
    return <Navigate to="/" />;
  }
  
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Quiz not found</h2>
          <Link to="/student/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  if (course.questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">This quiz has no questions</h2>
          <p className="text-gray-600 mb-6">
            The administrator has not added any questions to this quiz yet.
          </p>
          <Link to="/student/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  if (quizSubmitted) {
    return (
      <div className="container max-w-xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-quiz-primary">Quiz Submitted</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-green-800 mb-2">Thank you for completing the quiz!</h3>
              <p className="text-green-700">
                Your submission has been recorded. The administrator will review your results.
              </p>
            </div>
            
            <Link to="/student/dashboard">
              <Button className="bg-quiz-primary hover:bg-opacity-90">
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = course.questions[currentQuestionIndex];

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-quiz-primary">{course.title}</h1>
        <Link to="/student/dashboard">
          <Button variant="outline" size="sm">Exit Quiz</Button>
        </Link>
      </div>
      
      <QuizQuestion
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={course.questions.length}
        selectedOption={answers[currentQuestionIndex]}
        onOptionSelect={handleOptionSelect}
        onNextQuestion={handleNextQuestion}
        onPreviousQuestion={handlePreviousQuestion}
        onSubmitQuiz={handleSubmitQuiz}
        isLastQuestion={currentQuestionIndex === course.questions.length - 1}
        isFirstQuestion={currentQuestionIndex === 0}
      />
    </div>
  );
};

export default TakeQuizPage;
