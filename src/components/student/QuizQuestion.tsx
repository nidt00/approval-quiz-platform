
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Question } from '@/types';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: number | null;
  onOptionSelect: (optionIndex: number) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onSubmitQuiz: () => void;
  isLastQuestion: boolean;
  isFirstQuestion: boolean;
}

export const QuizQuestion = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onOptionSelect,
  onNextQuestion,
  onPreviousQuestion,
  onSubmitQuiz,
  isLastQuestion,
  isFirstQuestion
}: QuizQuestionProps) => {
  return (
    <Card className="quiz-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>
        <CardTitle className="text-xl">{question.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption?.toString()} onValueChange={(value) => onOptionSelect(parseInt(value))}>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={onPreviousQuestion}
          disabled={isFirstQuestion}
        >
          Previous
        </Button>
        
        <div className="flex space-x-2">
          {isLastQuestion ? (
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={onSubmitQuiz}
              disabled={selectedOption === null}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button 
              className="bg-quiz-primary hover:bg-opacity-90"
              onClick={onNextQuestion}
              disabled={selectedOption === null}
            >
              Next
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
