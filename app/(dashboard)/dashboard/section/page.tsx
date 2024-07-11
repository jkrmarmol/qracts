'use client';

import { useEffect, useState } from 'react';
import BreadCrumb from '@/components/breadcrumb';
import { SectionClient } from '@/components/tables/user-tables/section-client';
import { Section } from '@/constants/data';
import axios from 'axios';

const breadcrumbItems = [{ title: 'Section', link: '/dashboard/section' }];
export default function page() {
  const [data, setData] = useState<Array<Section>>([]);
  useEffect(() => {
    (async () => {
      const response = await axios.get('/api/section');
      setData(response.data);
    })();
  }, []);
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <SectionClient data={data} />
      </div>
    </>
  );
}
