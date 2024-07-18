'use client';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import moment from 'moment';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  pageNo: number;
  totalUsers: number;
  pageSizeOptions?: number[];
  pageCount: number;
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

export function EmployeeTable<TData, TValue>({ columns, data, searchKey, pageCount }: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true
  });

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  });
  if (date?.from) {
    console.log(moment(date.from).format('YYYY-MM-DD'));
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());

    if (date?.from) {
      params.set('startDate', moment(date.from).format('YYYY-MM-DD'));
    } else {
      params.delete('startDate');
    }

    if (date?.to) {
      params.set('endDate', moment(date.to).format('YYYY-MM-DD'));
    } else {
      params.delete('endDate');
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [date, pathname, router, searchParams]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Input
          placeholder={`Search ${searchKey}...`}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
          className="w-full md:max-w-sm"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button id="date" variant={'outline'} className={cn('w-[300px] justify-start text-left font-normal', !date && 'text-muted-foreground')}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} />
          </PopoverContent>
        </Popover>
      </div>

      <ScrollArea className="h-[calc(80vh-220px)] rounded-md border">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
        <div className="flex w-full items-center justify-between">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        </div>
      </div>
    </>
  );
}
