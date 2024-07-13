'use client';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Students } from '@/constants/data';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './student-columns';

interface ProductsClientProps {
  data: Students[];
}

export const StudentClient: React.FC<ProductsClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Student (${data.length})`} description="Manage student (Client side table functionalities.)" />
        <Button className="text-xs md:text-sm" onClick={() => router.push(`/dashboard/student/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="studentNo" columns={columns} data={data} />
    </>
  );
};
