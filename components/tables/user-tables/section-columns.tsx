'use client';
import { ColumnDef } from '@tanstack/react-table';
import { SectionCellAction } from './section-cell-action';
import { Section } from '@/constants/data';
import { Checkbox } from '@/components/ui/checkbox';
import moment from 'moment';

export const columns: ColumnDef<Section>[] = [
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
    accessorKey: 'name',
    header: 'NAME'
  },
  {
    accessorKey: 'createdAt',
    header: 'CREATED AT',
    cell: ({ row }) =>
      moment(row.original.createdAt).format('MMMM Do YYYY, h:mm:ss a')
  },
  {
    id: 'actions',
    cell: ({ row }) => <SectionCellAction data={row.original} />
  }
];
