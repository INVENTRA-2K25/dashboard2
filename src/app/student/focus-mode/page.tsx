'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useUser } from '@/firebase'; // Import the useUser hook

export default function FocusModePage() {
    const { user } = useUser(); // Get the currently logged-in user

    const handleLaunchFocusMode = () => {
        if (!user) {
            // Handle case where user is not logged in, though this page should be protected
            console.error("User not found");
            return;
        }

        // The base URL of your deployed focus mode application
        const focusModeBaseUrl = 'https://study-zen-vision-main.vercel.app/';
        
        // Append the user's UID as a query parameter
        const focusModeUrlWithUser = `${focusModeBaseUrl}?userId=${user.uid}`;
        
        window.open(focusModeUrlWithUser, '_blank', 'noopener,noreferrer');
    };

    return (
        <DashboardLayout role="student">
            <div className="space-y-8 fade-in">
                <h1 className="text-3xl font-headline font-bold">AI Focus Mode</h1>
                
                <Card className="w-full max-w-lg mx-auto">
                    <CardHeader className="text-center">
                        <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
                        <CardTitle>Start a Focused Study Session</CardTitle>
                        <CardDescription>
                            Launch a distraction-free environment with an AI assistant to help you study.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button className="w-full" onClick={handleLaunchFocusMode}>
                            Turn On Focus Mode
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </DashboardLayout>
    );
}