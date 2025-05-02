
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const RegistrationPendingPage = () => {
  return (
    <div className="container max-w-screen-md mx-auto px-4 py-10">
      <Card className="animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-quiz-primary">Registration Pending</CardTitle>
          <CardDescription>
            Your registration request has been submitted and is pending approval
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">What happens next?</h3>
            <p className="text-yellow-700">
              An administrator will review your registration request. Once approved, you'll be able to log in to the platform.
              This process usually takes 1-2 business days.
            </p>
          </div>
          
          <div>
            <Link to="/login">
              <Button variant="outline" className="mx-auto">
                Return to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationPendingPage;
