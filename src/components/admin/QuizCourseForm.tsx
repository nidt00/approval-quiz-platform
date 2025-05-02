
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface QuizCourseFormProps {
  onSubmit: (title: string, description: string) => void;
  isLoading: boolean;
}

export const QuizCourseForm = ({ onSubmit, isLoading }: QuizCourseFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onSubmit(title, description);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Quiz Course</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Course Title
            </label>
            <Input
              id="title"
              placeholder="Enter course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Course Description
            </label>
            <Textarea
              id="description"
              placeholder="Enter course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit"
            className="bg-quiz-primary hover:bg-opacity-90 w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Quiz Course"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
