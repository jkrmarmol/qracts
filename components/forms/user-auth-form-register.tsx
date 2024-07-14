'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const formSchema = z
  .object({
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: z.string().min(4),
    confirmPassword: z.string().min(4)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthFormRegister() {
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    error: false,
    success: false,
    existingEmail: false
  });
  const defaultValues = {
    email: '',
    password: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/register', {
        email: data.email,
        password: data.password
      });
      const responseData = await response.data;
      setLoading(false);
      if (Object.keys(responseData)[0] === 'id') {
        setModalMessage((prev) => ({ ...prev, success: true }));
        setTimeout(() => {
          setModalMessage((prev) => ({ ...prev, success: false }));
        }, 3000);
      }
      if (responseData.message === 'Email Already Exist') {
        setModalMessage((prev) => ({ ...prev, existingEmail: true }));
        setTimeout(() => {
          setModalMessage((prev) => ({ ...prev, existingEmail: false }));
        }, 3000);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setModalMessage((prev) => ({ ...prev, error: true }));
        setTimeout(() => {
          setModalMessage((prev) => ({ ...prev, error: false }));
        }, 3000);
        return err.response?.data;
      }
    }
  };

  return (
    <>
      <Dialog open={modalMessage.success} onOpenChange={() => setModalMessage((prev) => ({ ...prev, success: false }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration Successful</DialogTitle>
            <DialogDescription>Your email has been successfully registered. Welcome aboard!</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={modalMessage.existingEmail} onOpenChange={() => setModalMessage((prev) => ({ ...prev, existingEmail: false }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Already Registered</DialogTitle>
            <DialogDescription>
              This email is already in use. Please log in or use a different email. Forgot your password? Reset it via Forgot Password.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={modalMessage.error} onOpenChange={() => setModalMessage((prev) => ({ ...prev, error: false }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Server Unavailable</DialogTitle>
            <DialogDescription>Our server is currently unavailable. Please try again later. We apologize for the inconvenience.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email..." disabled={loading} {...field} />
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
                  <Input type="password" placeholder="Enter your password..." disabled={loading} {...field} />
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
                  <Input type="password" placeholder="Enter your confirmation password" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Create Account
          </Button>
        </form>
      </Form>
    </>
  );
}
