
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface StudentRequestListProps {
  pendingStudents: User[];
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

export const StudentRequestList = ({ 
  pendingStudents, 
  onApprove, 
  onReject 
}: StudentRequestListProps) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const handleApprove = (userId: string) => {
    setProcessingId(userId);
    
    // Simulate delay for better UX
    setTimeout(() => {
      onApprove(userId);
      setProcessingId(null);
      toast({
        title: "Student Approved",
        description: "The student can now log in to the system",
      });
    }, 500);
  };
  
  const handleReject = (userId: string) => {
    setProcessingId(userId);
    
    // Simulate delay for better UX
    setTimeout(() => {
      onReject(userId);
      setProcessingId(null);
      toast({
        title: "Student Rejected",
        description: "The registration request has been rejected",
      });
    }, 500);
  };

  if (pendingStudents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Requests</CardTitle>
          <CardDescription>Pending registration requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No pending registration requests
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Requests</CardTitle>
        <CardDescription>Pending registration requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingStudents.map((student) => (
            <div 
              key={student.id} 
              className="p-4 border rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white"
            >
              <div>
                <h3 className="font-medium">{student.name}</h3>
                <p className="text-sm text-gray-500">{student.email}</p>
                <p className="text-xs text-gray-400">Username: {student.username}</p>
                <p className="text-xs text-gray-400">Requested: {new Date(student.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 self-end sm:self-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => handleReject(student.id)}
                  disabled={processingId === student.id}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(student.id)}
                  disabled={processingId === student.id}
                >
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
