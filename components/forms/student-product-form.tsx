'use client';
import * as z from 'zod';
import { useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CalendarIcon, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { useToast } from '../ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { AlertModal } from '../modal/alert-modal';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import axios, { AxiosError } from 'axios';
import FormData from 'form-data';

export const IMG_MAX_LIMIT = 6;
const formSchema = z.object({
  image: z.any().refine((file) => file.size !== 0, 'Please upload an image'),
  firstName: z.string().min(3, { message: 'First Name must be at least 3 characters' }),
  middleName: z.string().min(3, { message: 'Middle Name must be at least 3 characters' }),
  lastName: z.string().min(3, { message: 'Last Name must be at least 3 characters' }),
  birthDate: z.date(),
  studentNo: z.string().min(3, { message: 'Student Name must be at least 3 characters' }),
  email: z.string().email({ message: 'Email Required' })
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: any | null;
  categories: any;
}

export const StudentProductForm: React.FC<ProductFormProps> = ({ initialData, categories }) => {
  const [date, setDate] = useState<any>(initialData && initialData.birthDate);
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Edit student' : 'Create student';
  const description = initialData ? 'Edit a student.' : 'Add a new student';
  const toastMessage = initialData ? 'Student updated.' : 'Student created.';
  const action = initialData ? 'Save changes' : 'Create';
  const [preview, setPreview] = useState<any>(initialData && initialData.images);
  const defaultValues = initialData
    ? initialData
    : {
        studentNo: '',
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        images: {},
        birthDate: new Date()
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const reader = new FileReader();
    try {
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(acceptedFiles[0]);
      form.setValue('image', acceptedFiles[0]);
      form.clearErrors('image');
    } catch (error) {
      setPreview(null);
      form.resetField('image');
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1000000,
    accept: { 'image/png': [], 'image/jpg': [], 'image/jpeg': [] },
    multiple: false
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        const formData = new FormData();
        console.log(data.image);
        formData.append('studentNo', data.studentNo);
        formData.append('firstName', data.firstName);
        formData.append('middleName', data.middleName);
        formData.append('lastName', data.lastName);
        formData.append('email', data.email);
        formData.append('birthDate', data.birthDate);
        formData.append('images', data.image);
        const response = await axios.put(`/api/student/${initialData.id}`, formData);
        if (Object.keys(response.data)[0] === 'id') {
          toast({
            variant: 'default',
            title: 'Information Updated',
            description: 'The Student information has been updated.'
          });
          router.refresh();
          return router.push('/dashboard/student');
        }
      } else {
        const formData = new FormData();
        formData.append('studentNo', data.studentNo);
        formData.append('firstName', data.firstName);
        formData.append('middleName', data.middleName);
        formData.append('lastName', data.lastName);
        formData.append('email', data.email);
        formData.append('birthDate', data.birthDate);
        formData.append('images', data.image);

        const response = await axios.post('/api/student', formData);
        const dataResponse = await response.data;
        if (dataResponse.message === 'Student Created') {
          toast({
            variant: 'default',
            title: 'Student Created',
            description: 'The Student information profile has been created.'
          });
          router.refresh();
          return router.push('/dashboard/student');
        }
      }
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.data.message === 'Email Already Exist') {
          return toast({
            variant: 'destructive',
            title: 'Email Already Exist',
            description: 'The email you enter is already existing'
          });
        }
        if (err.response?.data.message === 'All Field Required') {
          return toast({
            variant: 'destructive',
            title: 'All Field Required',
            description: 'It is required to fill up the required field.'
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

  const onDelete = async () => {
    try {
      setLoading(true);
      //   await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params?.storeId}/products`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.setValue('image', initialData.images, { shouldValidate: false, shouldTouch: false });
    }
    // form.tri
  }, [initialData && initialData.images]);

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
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
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <div {...getRootProps()} className="overflow-hidden">
                    <Input {...getInputProps()} type="file" disabled={loading} />
                    <Image src={preview || '/image-placeholder.png'} priority alt="Image Placeholder" width={200} height={200} className=" rounded-md object-cover" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="studentNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student No.</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Student no" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Middle name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Last name" {...field} />
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
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Email Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild disabled={loading} className=" flex">
                        <Button variant={'outline'} className={cn(' w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          disabled={field.disabled}
                          mode="single"
                          selected={date}
                          onSelect={(e) => {
                            field.onChange(e);
                            setDate(e);
                          }}
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={2024}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
