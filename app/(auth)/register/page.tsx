'use client'
import { useState } from 'react'
import {  z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Axios from '@/lib/Axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string({ message: 'Name is required' }).min(3),
  email: z.string({ message: 'Email is required' }).email().min(5).max(50),
  password: z.string({ message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(20, { message: 'Password must be at most 20 characters long' })
    .regex(/[A-z]/, { message: 'Password must contain at least one letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character' }),
  confirmPassword: z.string({ message: 'Confirm Password is required' })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords and confirm password must be same',
  path: ['confirmPassword'],
});

const RegisterPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
    }

    try {
      setIsLoading(true);
      const response = await Axios.post("api/auth/register", payload)

      if(response.status === 201) {
        toast.success("Account created successfully")
        form.reset()
        router.push("/login")
      }
    } catch (error : any) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    } finally {
      setIsLoading(false);
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div className='lg:p-10 space-y-7'>
      <h1 className='text-xl font-semibold text-center'>Create Account</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field}
                    disabled={isLoading}
                    value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field}
                    disabled={isLoading}
                    value={field.value ?? ""} />
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
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm your password" {...field}
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
            {isLoading ? 'Loading...' : 'Create Account'}
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

export default RegisterPage