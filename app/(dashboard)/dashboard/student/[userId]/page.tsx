import BreadCrumb from '@/components/breadcrumb';
import { StudentProductForm } from '@/components/forms/student-product-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Student', link: '/dashboard/student' },
    { title: 'Create', link: '/dashboard/student/create' }
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <StudentProductForm
          categories={[
            { _id: 'shirts', name: 'shirts' },
            { _id: 'pants', name: 'pants' }
          ]}
          initialData={null}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
