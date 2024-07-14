import BreadCrumb from '@/components/breadcrumb';
import { StudentProductForm } from '@/components/forms/student-product-form';
import React from 'react';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Employee', link: '/dashboard/employee' },
    { title: 'Create', link: '/dashboard/employee/create' }
  ];
  return (
    <div className="flex-1 space-y-4 p-8">
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
  );
}
