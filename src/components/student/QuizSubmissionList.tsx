
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuizSubmission, User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface QuizSubmissionListProps {
  submissions: (QuizSubmission & { student: User })[];
  courseTitle: string;
}

export const QuizSubmissionList = ({ submissions, courseTitle }: QuizSubmissionListProps) => {
  const { currentUser } = useAuth();
  const [sendingStatus, setSendingStatus] = useState<{[key: string]: boolean}>({});
  
  const handleSendResult = (submission: QuizSubmission & { student: User }) => {
    // Set this submission as sending
    setSendingStatus(prev => ({ ...prev, [submission.id]: true }));
    
    // Simulate sending the result (in a real app this would be an API call)
    setTimeout(() => {
      // Create a record of the result being sent
      const sentResults = JSON.parse(localStorage.getItem('sentResults') || '[]');
      sentResults.push({
        submissionId: submission.id,
        studentId: submission.studentId,
        courseId: submission.courseId,
        sentBy: currentUser?.id,
        senderName: currentUser?.name,
        sentAt: new Date(),
      });
      
      localStorage.setItem('sentResults', JSON.stringify(sentResults));
      
      // Update the status
      setSendingStatus(prev => ({ ...prev, [submission.id]: false }));
      
      // Show success message
      toast({
        title: "Result Sent Successfully",
        description: `Result sent to ${submission.student.name} by ${currentUser?.name} (${currentUser?.id})`,
      });
    }, 1000);
  };

  if (submissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Submissions: {courseTitle}</CardTitle>
          <CardDescription>View student submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No students have submitted this quiz yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Submissions: {courseTitle}</CardTitle>
        <CardDescription>View student submissions and scores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => {
                // Check if this result was already sent
                const sentResults = JSON.parse(localStorage.getItem('sentResults') || '[]');
                const alreadySent = sentResults.some((result: any) => result.submissionId === submission.id);
                
                return (
                  <tr key={submission.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{submission.student.name}</div>
                      <div className="text-xs text-gray-500">{submission.student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {submission.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {alreadySent ? (
                        <div className="text-xs text-green-600">
                          Result sent by: {sentResults.find((r: any) => r.submissionId === submission.id)?.senderName || 'Admin'}
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendResult(submission)}
                          disabled={sendingStatus[submission.id]}
                          className="text-quiz-primary hover:text-quiz-primary-dark"
                        >
                          {sendingStatus[submission.id] ? "Sending..." : "Send Result"}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
