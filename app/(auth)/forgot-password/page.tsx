'use client'
import { useState } from 'react'
import { boolean, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { set } from 'mongoose';

const formSchema = z.object({
  email: z.string({ message: 'Email is required' }).email().min(5).max(50),
  password: z.string({ message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(20, { message: 'Password must be at most 20 characters long' })
    .regex(/[A-z]/, { message: 'Password must contain at least one letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character' }),
});

const ForgotPassword = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    
  }

  return (
    <div className='lg:p-10 space-y-7'>
      <h1 className='text-xl font-semibold text-center'>Forgot Password</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field}
                    disabled={isLoading}
                    value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading}
            type="submit"
            className='w-full cursor-pointer'>
            {isLoading ? 'Loading...' : 'Submit'}
          </Button>
        </form>
      </Form>

      <div className="max-w-md mx-auto">
        <p>Already have an account? {" "}
          <Link 
          href={"/login"}
          className='text-primary drop-shadow-md'>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword