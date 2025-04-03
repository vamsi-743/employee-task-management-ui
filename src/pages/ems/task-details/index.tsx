import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import {
  CalendarIcon,
  ClipboardList,
  Users,
  Briefcase,
  Flag,
  X,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Edit2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { DatePicker } from '@/components/date-picker'
import { MultiSelect } from '@/components/multi-select'
import {
  emsGetAllEmployees,
  emsGetAllProjects,
  emsGetTasksById,
  emsUpdateTask,
} from '@/http/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { useParams } from 'react-router-dom'
import { useEmsAuth } from '@/hooks/use-auth'
import { Button } from '@/components/custom/button'

const formSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(100, 'Title must be 100 characters or less'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long')
    .max(1000, 'Description must be 1000 characters or less'),
  dueDate: z
    .date({
      required_error: 'Due date is required',
    })
    .min(new Date(), 'Due date must be in the future'),
  assignedTo: z
    .array(z.string())
    .min(1, 'Please assign this task to at least one employee'),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select a priority level',
  }),
})

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-blue-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-red-500' },
]

interface Employee {
  id: string
  name: string
  avatar: string
  status: string
  description: string
  timeSpent: string
}

export default function TaskDetails() {
  const [task, setTask] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { taskId } = useParams()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useEmsAuth()
  console.log('user', user)
  const payload = { organization_id: user.organization_id }

  const {
    data: employeesResponse,
    isLoading: employeesIsLoading,
    error: employeesError,
  } = useQuery({
    queryKey: ['ems_employees'],
    queryFn: () => emsGetAllEmployees(payload),
  })
  const employees = employeesResponse?.data || []
  console.log(employees)
  const {
    data: taskDetailsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['taskDetails', taskId],
    queryFn: () => emsGetTasksById(taskId),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: new Date(),
      assignedTo: [],
      priority: 'medium',
    },
  })

  useEffect(() => {
    if (taskDetailsResponse && taskDetailsResponse.data) {
      const taskDetails = taskDetailsResponse.data
      const formattedTask: any = {
        id: taskDetails.task_id ? taskDetails.task_id.toString() : '',
        title: taskDetails.title,
        description: taskDetails.description,
        dueDate: new Date(taskDetails.due_date),
        assignedTo: taskDetails.employee_list.map((employee: any) => ({
          id: employee.employee_id,
          name: employee.employee_name,
          avatar: '/placeholder.svg?height=40&width=40',
          status: employee.employee_task_status,
          description: employee.employee_task_description,
          timeSpent: employee.employee_task_time_spent,
        })),
        priority: taskDetails.priority,
        project: taskDetails.project_name,
      }
      setTask(formattedTask)
      form.reset({
        title: formattedTask.title,
        description: formattedTask.description,
        dueDate: formattedTask.dueDate,
        assignedTo: formattedTask.assignedTo.map((e: Employee) => e.id),
        priority: formattedTask.priority,
      })
    }
  }, [taskDetailsResponse, form])

  const mutationUpdateTask = useMutation({
    mutationFn: (payload: any) => emsUpdateTask(taskId as string, payload),
    onSuccess: () => {
      toast({
        title: 'Task updated successfully',
        description: 'Task has been successfully updated.',
        variant: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['taskDetails', taskId] })
      setIsEditModalOpen(false)
    },
    onError: (error) => {
      toast({
        title: 'Task update failed',
        description: `Failed to update task.`,
        variant: 'destructive',
      })
      console.log('task update failed', error)
    },
  })

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center'>
        Error: {error.message}
      </div>
    )
  }

  if (!task) {
    return (
      <div className='flex h-screen items-center justify-center'>
        No task found
      </div>
    )
  }

  const priorityBadgeColor =
    priorityOptions.find((p) => p.value === task.priority)?.color ||
    'bg-gray-500'

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className='h-4 w-4 text-green-500' />
      case 'In Progress':
        return <Clock className='h-4 w-4 text-yellow-500' />
      default:
        return <X className='h-4 w-4 text-red-500' />
    }
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = task.assignedTo.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(task.assignedTo.length / itemsPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      task_id: task.id,
      title: values.title,
      description: values.description,
      due_date: values.dueDate,
      assigned_to: values.assignedTo,
      priority: values.priority,
    }
    mutationUpdateTask.mutate(payload)
  }

  const formattedEmployeesList = employees.map((employee: any) => ({
    value: employee.EMS_employee_id,
    label: `${employee.first_name} ${employee.last_name} (${employee.EMS_employee_id})`,
    icon: () => (
      <Avatar className='mr-2 h-6 w-6'>
        <AvatarImage src={employee.avatar} alt={employee.first_name} />
        <AvatarFallback>{employee.first_name.charAt(0)}</AvatarFallback>
      </Avatar>
    ),
  }))

  return (
    <div className='container mx-auto py-10'>
      <Card className='mb-6 w-full'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between gap-2 text-2xl font-bold'>
            <div className='flex items-center gap-2'>
              <ClipboardList className='h-6 w-6 text-primary' />
              Task Details
            </div>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit2 className='h-4 w-4' />
              <span className='sr-only'>Edit task</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            <div>
              <h2 className='text-2xl font-semibold'>{task.title}</h2>
              <p className='mt-2 text-muted-foreground'>{task.description}</p>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='flex cursor-help items-start'>
                      <CalendarIcon className='mr-2 mt-0.5 h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='text-sm font-medium'>Due Date</p>
                        <p className='text-sm text-muted-foreground'>
                          {format(task.dueDate, 'PPP')}
                        </p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Task deadline</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='flex cursor-help items-start'>
                      <Briefcase className='mr-2 mt-0.5 h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='text-sm font-medium'>Project</p>
                        <p className='text-sm text-muted-foreground'>
                          {task.project}
                        </p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Associated project</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='flex cursor-help items-start'>
                      <Flag className='mr-2 mt-0.5 h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='text-sm font-medium'>Priority</p>
                        <Badge className={`mt-1 ${priorityBadgeColor}`}>
                          {task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Task priority level</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-xl font-bold'>
            <Users className='h-5 w-5 text-primary' />
            Assigned Employees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Time Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((employee: Employee) => (
                <TableRow key={employee.id}>
                  <TableCell className='font-medium'>
                    <div className='flex items-center'>
                      <Avatar className='mr-2 h-8 w-8'>
                        <AvatarImage
                          src={employee.avatar}
                          alt={employee.name}
                        />
                        <AvatarFallback>
                          {employee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {employee.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='secondary'
                      className='flex items-center gap-1'
                    >
                      {getStatusIcon(employee.status || 'Not Started')}
                      {employee.status || 'Not Started'}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.description || 'N/A'}</TableCell>
                  <TableCell>{employee.timeSpent || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className='mt-4 flex items-center justify-between'>
            <Button
              variant='outline'
              size='sm'
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className='mr-2 h-4 w-4' />
              Previous
            </Button>
            <span className='text-sm text-muted-foreground'>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='dueDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='assignedTo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={formattedEmployeesList}
                        onValueChange={(values) =>
                          form.setValue('assignedTo', values)
                        }
                        defaultValue={field.value}
                        placeholder='Select employees'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='priority'
                render={({ field }) => (
                  <FormItem className='space-y-3'>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='flex flex-col space-y-1'
                      >
                        {priorityOptions.map((option) => (
                          <FormItem
                            className='flex items-center space-x-3 space-y-0'
                            key={option.value}
                          >
                            <FormControl>
                              <RadioGroupItem value={option.value} />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button loading={mutationUpdateTask.isPending} type='submit'>
                  Update Task
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
