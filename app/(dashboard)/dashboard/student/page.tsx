import BreadCrumb from '@/components/breadcrumb';
import { StudentClient } from '@/components/tables/user-tables/student-client';
import prisma from '@/lib/prisma';

const breadcrumbItems = [{ title: 'Student', link: '/dashboard/student' }];
export default async function page() {
  const data = await prisma.students.findMany();
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <StudentClient data={data} />
      </div>
    </>
  );
}
