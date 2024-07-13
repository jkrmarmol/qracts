import BreadCrumb from '@/components/breadcrumb';
import { StudentProductForm } from '@/components/forms/student-product-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import prisma from '@/lib/prisma';

export default async function Page({ params }: { params: { userId: string } }) {
  const breadcrumbItems = [
    { title: 'Student', link: '/dashboard/student' },
    { title: 'Create', link: '/dashboard/student/create' }
  ];
  const response = await prisma.students.findFirst({ where: { id: params.userId } });
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <StudentProductForm
          categories={[
            { _id: 'shirts', name: 'shirts' },
            { _id: 'pants', name: 'pants' }
          ]}
          initialData={response}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
