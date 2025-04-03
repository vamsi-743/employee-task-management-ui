'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Input } from '@/components/ui/input'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PencilIcon } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useToast } from './ui/use-toast'
import { useAuth } from '@/hooks/use-auth'
import {
  getAllDepartments,
  getAllDesignations,
  updateEmployee,
} from '@/http/api'
import { Button } from './custom/button'
import { DatePicker } from './date-picker'

const schema = z.object({
  first_name: z.string().min(1, 'First Name is required'),
  last_name: z.string().min(1, 'Last Name is required'),
  email: z.string().email('Invalid email address'),
  gender: z.string().min(1, 'Gender is required'),
  work_location: z.string().min(1, 'Work Location is required'),
  designation_id: z.number().min(1, 'Designation is required'),
  department_id: z.number().min(1, 'Department is required'),
  date_of_joining: z.string().min(1, 'Date of Joining is required'),
})

type FormData = z.infer<typeof schema>

export default function BasicInfoBtn({ employeeProfile }: any) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: employeeProfile.first_name,
      last_name: employeeProfile.last_name,
      email: employeeProfile.email,
      gender: employeeProfile.gender,
      work_location: employeeProfile.work_location,
      designation_id: employeeProfile.designation_id,
      department_id: employeeProfile.department_id,
      date_of_joining: employeeProfile.date_of_joining,
    },
  })

  useEffect(() => {
    form.reset({
      first_name: employeeProfile.first_name,
      last_name: employeeProfile.last_name,
      email: employeeProfile.email,
      gender: employeeProfile.gender,
      work_location: employeeProfile.work_location,
      designation_id: employeeProfile.designation_id,
      department_id: employeeProfile.department_id,
      date_of_joining: employeeProfile.date_of_joining,
    })
  }, [employeeProfile, form])

  const mutation = useMutation({
    mutationFn: ({ employeeId, data }: { employeeId: string; data: any }) =>
      updateEmployee(employeeId, data),
    onSuccess: () => {
      toast({
        title: 'Employee updated successfully',
        description: 'Employee has been successfully updated.',
        variant: 'success',
      })

      form.reset()

      // Invalidate and refetch the designations query
      queryClient.invalidateQueries({
        queryKey: ['employeeProfile', employeeProfile.employee_id],
      })
    },
    onError: (error) => {
      toast({
        title: ' Employee update failed ',
        description: `Failed to update employee.`,
        variant: 'destructive',
      })
      console.log('employee update failed', error)
    },
  })

  const onSubmit = (data: any) => {
    mutation.mutate({ employeeId: employeeProfile.employee_id, data: data })
    setOpen(false)
  }
  const payload = { organization_id: user.organization_id }

  const {
    data: departmentsResponse,
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useQuery({
    queryKey: ['departments'],
    queryFn: () => getAllDepartments(payload),
  })
  const departmentsList = departmentsResponse?.data || []
  console.log('departments', departmentsList)
  const {
    data: designationResponse,
    isLoading: designationLoading,
    error: designationError,
  } = useQuery({
    queryKey: ['designations'],
    queryFn: () => getAllDesignations(payload),
  })
  const designationList = designationResponse?.data || []
  console.log('designation', designationList)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon'>
          <PencilIcon className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>basic information</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-3 gap-4'>
              <FormField
                control={form.control}
                name='first_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Name*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='First Name' />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.first_name?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='last_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Last Name' />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.last_name?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Email*</FormLabel>
                  <FormControl>
                    <Input {...field} type='email' />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.email?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select gender' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='male'>Male</SelectItem>
                        <SelectItem value='female'>Female</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage>
                      {form.formState.errors.gender?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='work_location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Location*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Work Location' />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.work_location?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='designation_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation*</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={String(field.value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select designation' />
                      </SelectTrigger>
                      <SelectContent>
                        {designationList.map((designation: any) => (
                          <SelectItem
                            key={designation.designation_id}
                            value={`${designation.designation_id}`}
                          >
                            {designation.designation_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage>
                      {form.formState.errors.designation_id?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='department_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department*</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={String(field.value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select department' />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentsList.map((department: any) => (
                          <SelectItem
                            key={department.department_id}
                            value={`${department.department_id}`}
                          >
                            {department.department_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage>
                      {form.formState.errors.department_id?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name='date_of_joining'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Joining*</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date: any) =>
                          field.onChange(date ? date.toISOString().split('T')[0] : '')
                        }
                        disabled={false}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.date_of_joining?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div className='flex justify-end space-x-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={mutation.isPending}
                loading={mutation.isPending}
                type='submit'
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
