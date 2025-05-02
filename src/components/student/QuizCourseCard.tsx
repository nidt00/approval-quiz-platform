
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuizCourse } from '@/types';
import { Link } from 'react-router-dom';

interface QuizCourseCardProps {
  course: QuizCourse;
}

export const QuizCourseCard = ({ course }: QuizCourseCardProps) => {
  return (
    <Card className="quiz-card h-full flex flex-col">
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600">{course.description}</p>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            {course.questions.length} {course.questions.length === 1 ? 'question' : 'questions'}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/student/quiz/${course.id}`} className="w-full">
          <Button className="w-full bg-quiz-primary hover:bg-opacity-90">
            Start Quiz
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
