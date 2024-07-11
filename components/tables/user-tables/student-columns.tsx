'use client';
import { ColumnDef } from '@tanstack/react-table';
import { StudentCellAction } from './student-cell-action';
import { Students } from '@/constants/data';
import { Checkbox } from '@/components/ui/checkbox';
import moment from 'moment';

export const columns: ColumnDef<Students>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'studentNo',
    header: 'STUDENT NO'
  },
  {
    accessorKey: 'firstName',
    header: 'FIRST NAME'
  },
  {
    accessorKey: 'middleName',
    header: 'MIDDLE NAME'
  },
  {
    accessorKey: 'lastName',
    header: 'LAST NAME'
  },
  {
    accessorKey: 'birthDate',
    header: 'BIRTH DATE',
    cell: ({ row }) => moment(row.original.birthDate).format('MMMM Do YYYY')
  },
  {
    id: 'actions',
    cell: ({ row }) => <StudentCellAction data={row.original} />
  }
];
