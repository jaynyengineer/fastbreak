import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-cyan-500" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription className="text-base">
            We've sent you a confirmation email to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="font-medium text-foreground">Next steps:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Open the email we sent you</li>
                <li>Click the confirmation link</li>
                <li>You'll be automatically redirected to your dashboard</li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium text-foreground">Didn't receive the email?</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Check your spam or junk folder</li>
                <li>Make sure you entered the correct email address</li>
                <li>Wait a few minutes - emails can take time to arrive</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Already confirmed?{' '}
              <Link href="/login" className="text-cyan-500 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
