'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Attendance } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';

export const columns: ColumnDef<Attendance>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'studentName',
    header: 'STUDENT NAME'
  },
  {
    accessorKey: 'sectionName',
    header: 'SECTION NAME'
  },
  {
    accessorKey: 'createdAt',
    header: 'DATE ATTENDED',
    cell: ({ row }) => moment(row.original.createdAt).format('MMMM Do YYYY, h:mm:ss a')
  }
];
