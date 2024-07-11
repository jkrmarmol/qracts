import BreadCrumb from '@/components/breadcrumb';
import { StudentClient } from '@/components/tables/user-tables/student-client';
import { users } from '@/constants/data';

const breadcrumbItems = [{ title: 'Student', link: '/dashboard/student' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <StudentClient data={users} />
      </div>
    </>
  );
}
