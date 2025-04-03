'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { emsUpdateEmployeeTaskStatus } from '@/http/api'

type Task = {
  employee_task_id: number
  EMS_employee_id: string
  task_id: number
  assigned_at: string
  employee_task_status: 'not_started' | 'in_progress' | 'completed'
  task_title: string
  task_description: string
  task_priority: 'low' | 'medium' | 'high'
  task_due_date: string
  project_name: string
}

const workSubmissionSchema = z.object({
  workDescription: z
    .string()
    .min(10, 'Description must be at least 10 characters long'),
  timeSpent: z.string().min(1, 'Time spent is required'),
})

export default function MyTaskTable({ tasksList }: { tasksList: Task[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [submissionTask, setSubmissionTask] = React.useState<Task | null>(null)
  const [newStatus, setNewStatus] = React.useState<
    Task['employee_task_status'] | null
  >(null)
  const [showConfirmation, setShowConfirmation] = React.useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: emsUpdateEmployeeTaskStatus,
    onSuccess: () => {
      toast({
        title: 'Task status updated successfully',
        description: 'Task status has been successfully updated.',
        variant: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['mytasks'] })
    },
    onError: (error) => {
      toast({
        title: 'Task status update failed',
        description: 'Failed to update task status.',
        variant: 'destructive',
      })
      console.log('task status update failed', error)
    },
  })

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(workSubmissionSchema),
    defaultValues: {
      workDescription: '',
      timeSpent: '',
    },
  })

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: 'task_title',
      header: 'Title',
    },
    {
      accessorKey: 'task_description',
      header: 'Description',
    },
    {
      accessorKey: 'task_due_date',
      header: 'Due Date',
      cell: ({ row }) => format(new Date(row.getValue('task_due_date')), 'PP'),
    },
    {
      accessorKey: 'task_priority',
      header: 'Priority',
      cell: ({ row }) => {
        const priority = row.getValue('task_priority') as string
        return (
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              priority === 'high'
                ? 'bg-red-100 text-red-800'
                : priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
            }`}
          >
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
        )
      },
    },
    {
      accessorKey: 'employee_task_status',
      header: 'Status',
      cell: ({ row }) => {
        const task = row.original
        return (
          <Select
            value={task.employee_task_status}
            onValueChange={(value) => {
              setSubmissionTask(task)
              setNewStatus(value as Task['employee_task_status'])
              if (value === 'in_progress') {
                setShowConfirmation(true)
              }
            }}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='not_started'>Not Started</SelectItem>
              <SelectItem value='in_progress'>In Progress</SelectItem>
              <SelectItem value='completed'>Completed</SelectItem>
            </SelectContent>
          </Select>
        )
      },
    },
  ]

  const table = useReactTable({
    data: tasksList,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const updateTaskStatus = (data: any) => {
    if (submissionTask && newStatus) {
      console.log('Work Submission:', {
        employee_task_id: submissionTask.employee_task_id,
        employee_task_status: newStatus,
        work_description: data.workDescription,
        time_spent: data.timeSpent,
        task_id: submissionTask.task_id,
      })
      mutation.mutate({
        employee_task_id: submissionTask.employee_task_id,
        task_id: submissionTask.task_id,
        employee_task_status: newStatus,
        EMS_employee_id: submissionTask.EMS_employee_id,
        employee_task_description: data.workDescription,
        employee_task_time_spent : data.timeSpent,
      })
      setSubmissionTask(null)
      setNewStatus(null)
      reset()
    }
  }

  return (
    <div className='w-full space-y-4'>
      <div className='flex items-center justify-between'>
        <Input
          placeholder='Filter tasks...'
          value={
            (table.getColumn('task_title')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('task_title')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <Dialog
        open={!!submissionTask && newStatus === 'completed'}
        onOpenChange={(open) => !open && setSubmissionTask(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Work Submission</DialogTitle>
            <DialogDescription>
              Please provide details about your work on the task "
              {submissionTask?.task_title}".
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(updateTaskStatus)}
            className='grid gap-4 py-4'
          >
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='description' className='text-right'>
                Work Description
              </Label>
              <Controller
                name='workDescription'
                control={control}
                render={({ field }) => (
                  <Textarea
                    id='description'
                    {...field}
                    className='col-span-3'
                  />
                )}
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='time' className='text-right'>
                Time Spent
              </Label>
              <Controller
                name='timeSpent'
                control={control}
                render={({ field }) => (
                  <Input
                    id='time'
                    {...field}
                    className='col-span-3'
                    placeholder='e.g., 2 hours'
                  />
                )}
              />
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setSubmissionTask(null)}>
                Cancel
              </Button>
              <Button type='submit'>Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status to "In Progress"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                mutation.mutate({
                  employee_task_id: submissionTask?.employee_task_id,
                  employee_task_status: newStatus,
                  EMS_employee_id: submissionTask?.EMS_employee_id,
                  employee_task_description: null,
                  employee_task_time_spent: null,
                  task_id: submissionTask?.task_id,
                })
                setShowConfirmation(false)
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
