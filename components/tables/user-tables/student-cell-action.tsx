'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Students } from '@/constants/data';
import { AxiosError } from 'axios';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface CellActionProps {
  data: Students;
}

export const StudentCellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const onConfirm = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/student/${data.id}`);
      const dataResponse = await response.data;
      if (dataResponse.message === 'Student Profile Deleted') {
        setLoading(false);
        toast({
          variant: 'default',
          title: 'Student Profile Deleted',
          description: 'The student profile has been deleted'
        });
        setOpen(false);
        revalidatePath('/dashboard/student');
        return redirect('/dashboard/student');
      }
      setLoading(false);
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response) {
          console.log(err.response.data);
          if (err.response.data.message === "You can't delete student profile") {
            setLoading(false);
            return toast({
              variant: 'destructive',
              title: "Student profile can't delete",
              description: 'Student have already attendance, you are not allowed to delete it.'
            });
          }
          if (err.response.data.message === 'User Not Found') {
            setLoading(false);
            return toast({
              variant: 'destructive',
              title: 'User Not Found',
              description: 'Student Has not in the list, please try again.'
            });
          }
          if (err.response.data.message === 'ID Query Required') {
            setLoading(false);
            return toast({
              variant: 'destructive',
              title: 'ID Query Required',
              description: 'The ID Query is required, please try again.'
            });
          }
          if (err.response.data.message === 'Something went wrong') {
            setLoading(false);
            return toast({
              variant: 'destructive',
              title: 'Uh oh! Something went wrong.',
              description: 'There was a problem with your request.'
            });
          }
          setLoading(false);
          return toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem with your request.'
          });
        }
      }
    }
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onConfirm} loading={loading} />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => router.push(`/dashboard/student/${data.id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
