import BreadCrumb from '@/components/breadcrumb';
import { SectionProductForm } from '@/components/forms/section-product-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default async function Page({ params }: { params: { userId: string } }) {
  const breadcrumbItems = [
    { title: 'Section', link: '/dashboard/section' },
    { title: 'Create', link: '/dashboard/section/create' }
  ];
  const response = await prisma.sections.findFirst({
    where: { id: params.userId }
  });
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <SectionProductForm
          editId={params.userId}
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
