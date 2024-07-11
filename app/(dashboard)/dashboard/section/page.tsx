import BreadCrumb from '@/components/breadcrumb';
import { SectionClient } from '@/components/tables/user-tables/section-client';
import { users } from '@/constants/data';

const breadcrumbItems = [{ title: 'User', link: '/dashboard/section' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <SectionClient data={users} />
      </div>
    </>
  );
}
