
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question } from '@/types';

interface QuestionListProps {
  questions: Question[];
  onDeleteQuestion: (questionId: string) => void;
}

export const QuestionList = ({ questions, onDeleteQuestion }: QuestionListProps) => {
  if (questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
          <CardDescription>Add questions to this quiz course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No questions found. Add your first question.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions</CardTitle>
        <CardDescription>Manage questions for this quiz course</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="p-4 border rounded-md bg-white">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-quiz-dark">
                  {index + 1}. {question.text}
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50 ml-2"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this question?")) {
                      onDeleteQuestion(question.id);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
              
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {question.options.map((option, optIndex) => (
                  <div 
                    key={optIndex}
                    className={`p-2 text-sm rounded-md ${
                      optIndex === question.correctOptionIndex 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span className="font-medium mr-1">{String.fromCharCode(65 + optIndex)}:</span>
                    <span>
                      {option}
                      {optIndex === question.correctOptionIndex && (
                        <span className="text-green-600 text-xs font-medium ml-2">(Correct)</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
