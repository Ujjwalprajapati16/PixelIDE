'use client';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Axios from '@/lib/Axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import Loader from '@/components/ui/loader';

const formSchema = z.object({
  password: z.string({ message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(20, { message: 'Password must be at most 20 characters long' })
    .regex(/[A-Za-z]/, { message: 'Password must contain at least one letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character' }),
  confirmPassword: z.string({ message: 'Confirm Password is required' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords and confirm password must be the same',
  path: ['confirmPassword'],
});

const ResetPassword = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenExpired, setIsTokenExpired] = useState(false); 
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPasswordToken = searchParams.get('token');
  const [userId, setUserId] = useState<string | null>(null);

  const verifyResetPasswordToken = async () => {
    try {
      const payload = { token: resetPasswordToken };
      const response = await Axios.post('api/auth/verify-forgot-password-token', payload);

      if (response.status !== 200 || response.data.expired) {
        setIsTokenExpired(true); 
        toast.error('Reset password link expired or invalid.');
      } else {
        setUserId(response?.data?.userId);
        setIsTokenExpired(response?.data?.expired || false);
        setIsVerifying(false);
        toast.success('Token verified successfully!');
      }
    } catch (error: any) {
      setIsTokenExpired(true); 
      toast.error(error?.response?.data?.error || 'Invalid or expired token');
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (!resetPasswordToken) {
      toast.error('Token is required');
      router.push('/forgot-password');
    } else {
      verifyResetPasswordToken();
    }
  }, [resetPasswordToken, router]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!resetPasswordToken) {
      toast.error('Token missing.');
      return;
    }

    if (isTokenExpired) {
      toast.error('Your token has expired. Please request a new reset link.');
      router.push('/forgot-password');
      return;
    }

    try {
      setIsLoading(true);
      const payload = { password: values.password, userId: userId, token: resetPasswordToken };
      const response = await Axios.post('api/auth/reset-password', payload);

      if (response.status === 200) {
        toast.success('Password reset successfully!');
        form.reset();
        router.push('/login');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <Card className="text-center py-20">
        <h2 className="text-xl font-semibold">Verifying token...</h2>
      </Card>
    );
  }

  if (isTokenExpired) {
    return (
      <Card className="text-center py-20">
        <h2 className="text-xl font-semibold text-red-500">Token Expired</h2>
        <p className="mt-4">Your reset link has expired. Please request a new one.</p>
        <Link href="/forgot-password">
          <Button className="mt-6">Request New Link</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="lg:p-10 space-y-7">
      <h1 className="text-xl font-semibold text-center">Reset Password</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your new password"
                    disabled={isLoading}
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your new password"
                    disabled={isLoading}
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader className="mr-2 h-4 w-4" />}
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Form>
      <div className="max-w-md mx-auto text-center">
        <p>
          Remembered your password?{' '}
          <Link href="/login" className="text-primary font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
