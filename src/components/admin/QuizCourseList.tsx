
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuizCourse } from '@/types';
import { Link } from 'react-router-dom';

interface QuizCourseListProps {
  courses: QuizCourse[];
  onDeleteCourse: (courseId: string) => void;
}

export const QuizCourseList = ({ courses, onDeleteCourse }: QuizCourseListProps) => {
  if (courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Courses</CardTitle>
          <CardDescription>Manage your quiz courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No quiz courses found. Create your first course.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Courses</CardTitle>
        <CardDescription>Manage your quiz courses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="p-4 border rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white"
            >
              <div className="flex-grow">
                <h3 className="font-medium">{course.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {course.questions.length} {course.questions.length === 1 ? 'question' : 'questions'} | 
                  Created: {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 self-end sm:self-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this course?")) {
                      onDeleteCourse(course.id);
                    }
                  }}
                >
                  Delete
                </Button>
                <Link to={`/admin/courses/${course.id}`}>
                  <Button size="sm" className="bg-quiz-secondary hover:bg-opacity-90">
                    Manage
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
