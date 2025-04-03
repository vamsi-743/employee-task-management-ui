import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MultiSelect } from '@/components/multi-select'
import * as z from 'zod'
import {
  CalendarIcon,
  Loader2,
  ClipboardList,
  Check,
  ChevronsUpDown,
  CheckCircle2,
  X,
} from 'lucide-react'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'

import { Calendar } from '@/components/ui/calendar'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { emsCreateTask } from '@/http/api'
import { Button } from '@/components/custom/button'
import { DatePicker } from '@/components/date-picker'

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
  project_id: z.string().min(1, 'Please select a project'),
})

const employees = [
  { id: '1', name: 'John Doe', avatar: '/placeholder.svg?height=40&width=40' },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: '4',
    name: 'Alice Brown',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: '5',
    name: 'Charlie Davis',
    avatar: '/placeholder.svg?height=40&width=40',
  },
]

const projects = [
  { id: '1', name: 'Project Alpha' },
  { id: '2', name: 'Project Beta' },
  { id: '3', name: 'Project Gamma' },
]

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-blue-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-red-500' },
]

export default function TaskForm({
  projectsList,
  employees,
}: {
  projectsList: any
  employees: any
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submittedValues, setSubmittedValues] = useState<z.infer<
    typeof formSchema
  > | null>(null)
  const [projectOpen, setProjectOpen] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: new Date(),
      assignedTo: [],
      priority: 'medium',
      project_id: '',
    },
  })

  const mutation = useMutation({
    mutationFn: emsCreateTask,
    onSuccess: () => {
      toast({
        title: 'Task created successfully',
        description: 'Task has been successfully created.',
        variant: 'success',
      })

      form.reset()

      queryClient.invalidateQueries({ queryKey: ['ems_tasks'] })
    },
    onError: (error) => {
      toast({
        title: 'Task creation failed ',
        description: `Failed to create task.`,
        variant: 'destructive',
      })

      console.log('task creation failed', error)
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Simulating API call
    const payload = {
      title: values.title,
      description: values.description,
      due_date: values.dueDate,
      assigned_to: values.assignedTo,
      priority: values.priority,
      project_id: values.project_id,
    }
    mutation.mutate(payload)
    setIsSubmitting(false)
    console.log('Form submitted:', values)

    setSubmittedValues(values)
    setShowSuccessModal(true)
  }

  function handleCloseModal() {
    setShowSuccessModal(false)
    form.reset()
    setSubmittedValues(null)
  }

  const formattedProjectsList = projectsList.map((project: any) => ({
    id: project.project_id.toString(),
    name: project.name,
  }))

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
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-2xl font-bold'>
            <ClipboardList className='h-6 w-6 text-primary' />
            Create New Task
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <div className='space-y-6'>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Title</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter task title' {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a clear and concise title for the task (3-100
                        characters).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Enter task description'
                          className='min-h-[100px]'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide details about the task (10-1000 characters).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='dueDate'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel className='pb-[4.5px] pt-[5px]'>
                          Due Date
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(date ? new Date(date) : undefined)
                            }
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
                      <FormItem className='flex flex-col'>
                        <FormLabel>Assign To</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={formattedEmployeesList}
                            onValueChange={(values) =>
                              form.setValue('assignedTo', values)
                            }
                            defaultValue={field.value}
                            placeholder='Select employees'
                            variant='default'
                            animation={0.3}
                            maxCount={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Choose one or more employees to assign this task to.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='project_id'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Project</FormLabel>
                        <Popover
                          open={projectOpen}
                          onOpenChange={setProjectOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                role='combobox'
                                aria-expanded={projectOpen}
                                className={cn(
                                  'w-full justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? formattedProjectsList.find(
                                      (project) => project.id === field.value
                                    )?.name
                                  : 'Select project'}

                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-[300px] p-0'>
                            <Command>
                              <CommandInput placeholder='Search project...' />
                              <CommandEmpty>No project found.</CommandEmpty>
                              <CommandGroup>
                                {formattedProjectsList.map((project) => (
                                  <CommandItem
                                    key={project.id}
                                    value={project.name}
                                    onSelect={() => {
                                      form.setValue('project_id', project.id)
                                      setProjectOpen(false)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        project.id === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {project.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Choose a project for this task.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                          className='flex flex-wrap gap-4'
                        >
                          {priorityOptions.map((option) => (
                            <FormItem
                              className='flex items-center space-x-3 space-y-0'
                              key={option.value}
                            >
                              <FormControl>
                                <RadioGroupItem value={option.value} />
                              </FormControl>
                              <Label className='font-normal'>
                                <div className='flex items-center'>
                                  <div
                                    className={`h-2 w-2 rounded-full ${option.color} mr-2`}
                                  ></div>
                                  {option.label}
                                </div>
                              </Label>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Set the priority level for this task.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='flex justify-end'>
                <Button
                  loading={mutation.isPending}
                  type='submit'
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Creating...' : 'Create Task'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
