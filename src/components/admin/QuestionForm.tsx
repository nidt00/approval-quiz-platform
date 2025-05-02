
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

interface QuestionFormProps {
  courseId: string;
  onSubmit: (question: string, options: string[], correctIndex: number) => void;
  isLoading: boolean;
}

export const QuestionForm = ({ courseId, onSubmit, isLoading }: QuestionFormProps) => {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!questionText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }
    
    if (options.some(opt => !opt.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all four options",
        variant: "destructive",
      });
      return;
    }
    
    if (correctOption === null) {
      toast({
        title: "Error",
        description: "Please select the correct answer",
        variant: "destructive",
      });
      return;
    }
    
    // Submit
    onSubmit(questionText, options, correctOption);
    
    // Reset form
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectOption(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Question</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="questionText" className="text-sm font-medium">
              Question Text
            </label>
            <Input
              id="questionText"
              placeholder="Enter your question"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-4 mt-4">
            <p className="text-sm font-medium">Answer Options</p>
            
            {options.map((option, index) => (
              <div key={index} className="flex gap-3 items-center">
                <div className="flex-shrink-0">
                  <RadioGroup value={correctOption?.toString()} onValueChange={(value) => setCorrectOption(parseInt(value))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="text-xs">Correct</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Input
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                  className="flex-grow"
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit"
            className="bg-quiz-primary hover:bg-opacity-90 w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Question"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
