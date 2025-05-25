'use client'

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Axios from '@/lib/Axios';
import Loader from '@/components/ui/loader';

const formSchema = z.object({
  email: z.string({ message: 'Email is required' }).email({ message: "Enter a valid email address" }),
});

const ForgotPassword = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const response = await Axios.post("/api/auth/forgot-password", {
        email: values.email,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        form.reset();
        router.push("/login");
      } else {
        toast.error(response.data.error || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="lg:p-10 space-y-7">
      <h1 className="text-xl font-semibold text-center">Forgot Password</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    disabled={isLoading}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading ? <Loader className="mr-2 h-4 w-4" /> : 'Submit'}
          </Button>
        </form>
      </Form>

      <div className="max-w-md mx-auto">
        <p>
          Already have an account?{" "}
          <Link href="/login" className="text-primary drop-shadow-md">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
