
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface StudentListProps {
  students: User[];
  onRemoveStudent: (userId: string) => void;
}

export const StudentList = ({ students, onRemoveStudent }: StudentListProps) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const handleRemove = (userId: string) => {
    if (window.confirm("Are you sure you want to remove this student?")) {
      setProcessingId(userId);
      
      // Simulate delay for better UX
      setTimeout(() => {
        onRemoveStudent(userId);
        setProcessingId(null);
        toast({
          title: "Student Removed",
          description: "The student has been removed from the system",
        });
      }, 500);
    }
  };

  if (students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registered Students</CardTitle>
          <CardDescription>Manage student accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No registered students found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Students</CardTitle>
        <CardDescription>Manage student accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.map((student) => (
            <div 
              key={student.id} 
              className="p-4 border rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white"
            >
              <div>
                <h3 className="font-medium">{student.name}</h3>
                <p className="text-sm text-gray-500">{student.email}</p>
                <p className="text-xs text-gray-400">Username: {student.username}</p>
                <p className="text-xs text-gray-400">
                  <span className="approved-badge">Approved</span>
                </p>
              </div>
              <div className="flex gap-2 self-end sm:self-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => handleRemove(student.id)}
                  disabled={processingId === student.id}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
