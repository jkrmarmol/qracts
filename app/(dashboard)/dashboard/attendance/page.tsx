'use client';
import { useEffect, useState, Suspense } from 'react';
import BreadCrumb from '@/components/breadcrumb';
import { columns } from '@/components/tables/employee-tables/columns';
import { EmployeeTable } from '@/components/tables/employee-tables/employee-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Attendance } from '@/constants/data';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

const breadcrumbItems = [{ title: 'Attendance', link: '/dashboard/attendance' }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function Page({ searchParams }: paramsProps) {
  const searchParamsNav = useSearchParams();
  const startDate = searchParamsNav?.get('startDate');
  const endDate = searchParamsNav?.get('endDate');
  const page = Number(searchParams.page) || 1;
  const [data, setData] = useState<Attendance[]>([]);
  const attendanceLength = data.length;

  useEffect(() => {
    (async () => {
      if (startDate && endDate) {
        const res = await axios.get(`/api/attendance?startDate=${startDate}&endDate=${endDate}`);
        const attendanceRes = await res.data;
        if (typeof attendanceRes === 'object') {
          setData(attendanceRes);
        }
      } else {
        const res = await axios.get(`/api/attendance`);
        const attendanceRes = await res.data;
        if (typeof attendanceRes === 'object') {
          setData(attendanceRes);
        }
      }
    })();
  }, [startDate && endDate]);

  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading title={`Attendance (${attendanceLength})`} description="Manage attendance" />
      </div>
      <Separator />

      <Suspense fallback={<p>Loading...</p>}>
        <EmployeeTable searchKey="studentName" pageNo={page} columns={columns} totalUsers={attendanceLength} data={data} pageCount={0} />
      </Suspense>
    </div>
  );
}
