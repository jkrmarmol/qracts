'use client';

import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { useToast } from '../ui/use-toast';
import axios, { AxiosError } from 'axios';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Product Name must be at least 3 characters' })
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: any | null;
  categories: any;
  editId: string;
}

export const SectionProductForm: React.FC<ProductFormProps> = ({ initialData, categories }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Edit section' : 'Create section';
  const description = initialData ? 'Edit a section.' : 'Add a new section';
  const toastMessage = initialData ? 'Section updated.' : 'Section created.';
  const action = initialData ? 'Save changes' : 'Create';
  const defaultValues = initialData ? initialData : { name: '' };
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        const response = await axios.put(`/api/section/${initialData?.id}`, data);
        if (Object.keys(response.data)[0] === 'id') {
          toast({
            variant: 'default',
            title: 'Section Update',
            description: 'You have successfully update section'
          });
          return router.push('/dashboard/section');
        }
        return toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.'
        });
      } else {
        const response = await axios.post('/api/section', data);
        if (Object.keys(response.data)[0] === 'id') {
          toast({
            variant: 'default',
            title: 'Section Created',
            description: 'You have added new section'
          });
          return router.push('/dashboard/section');
        }
      }

      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.data.message === 'Name Already Exist') {
          return toast({
            variant: 'destructive',
            title: 'Name Already Exist',
            description: 'The name you enter is already existing'
          });
        }
        return toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button disabled={loading} variant="destructive" size="sm" onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Section name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
