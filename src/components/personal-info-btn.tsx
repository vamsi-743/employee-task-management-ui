'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from './ui/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { updateEmployee } from '@/http/api'
import { DatePicker } from './date-picker'
import { differenceInYears } from 'date-fns'
import { Button } from './custom/button'

const schema = z.object({
  personal_email: z.string().email('Invalid email address'),
  mobile_number: z
    .string()
    .min(10, 'Mobile Number must be exactly 10 digits')
    .max(10, 'Mobile Number must be exactly 10 digits')
    .regex(/^\d{10}$/, { message: 'Mobile Number must be exactly 10 digits' }),
  date_of_birth: z.string().min(1, 'Date of Birth is required'),
  age: z.string().optional(),
  fathers_name: z.string().min(1, "Father's Name is required"),
  pan: z
    .string()
    .min(1, { message: 'PAN is required' })
    .length(10, { message: 'PAN must be exactly 10 characters' })
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN format' }),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function PersonalInfoBtn({ employeeProfile }: any) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      personal_email: employeeProfile.personal_email,
      mobile_number: employeeProfile.mobile_number,
      date_of_birth: employeeProfile.date_of_birth,
      age: employeeProfile.age?.toString(),
      fathers_name: employeeProfile.fathers_name,
      pan: employeeProfile.pan,
      address_line1: employeeProfile.address_line1,
      address_line2: employeeProfile.address_line2,
      city: employeeProfile.city,
      state: employeeProfile.state,
      pincode: employeeProfile.pincode,
    },
  })

  useEffect(() => {
    form.reset({
      personal_email: employeeProfile.personal_email,
      mobile_number: employeeProfile.mobile_number,
      date_of_birth: employeeProfile.date_of_birth,
      age: employeeProfile.age?.toString(),
      fathers_name: employeeProfile.fathers_name,
      pan: employeeProfile.pan,
      address_line1: employeeProfile.address_line1,
      address_line2: employeeProfile.address_line2,
      city: employeeProfile.city,
      state: employeeProfile.state,
      pincode: employeeProfile.pincode,
    })
  }, [employeeProfile, form])

  useEffect(() => {
    if (form.watch('date_of_birth')) {
      const age = differenceInYears(
        new Date(),
        new Date(form.watch('date_of_birth'))
      )
      form.setValue('age', age.toString())
    }
  }, [form.watch('date_of_birth')])

  const mutation = useMutation({
    mutationFn: ({ employeeId, data }: { employeeId: string; data: any }) =>
      updateEmployee(employeeId, data),
    onSuccess: () => {
      toast({
        title: 'Employee updated successfully',
        description:
          'Employee personal information has been successfully updated.',
        variant: 'success',
      })

      form.reset()

      // Invalidate and refetch the employee profile query
      queryClient.invalidateQueries({
        queryKey: ['employeeProfile', employeeProfile.employee_id],
      })
    },
    onError: (error) => {
      toast({
        title: 'Employee update failed',
        description: 'Failed to update employee personal information.',
        variant: 'destructive',
      })
      console.log('employee update failed', error)
    },
  })

  const onSubmit = (data: any) => {
    mutation.mutate({ employeeId: employeeProfile.employee_id, data: data })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon'>
          <PencilIcon className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>personal information</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='personal_email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='example@email.com' />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.personal_email?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='mobile_number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='1234567890'
                        maxLength={10}
                        onInput={(e: any) => {
                          e.target.value = e.target.value
                            .replace(/[^0-9]/g, '')
                            .slice(0, 10)
                        }}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.mobile_number?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='date_of_birth'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='pb-[4.5px] pt-[5px]'>
                      Date of Birth*
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date: any) =>
                          field.onChange(
                            date ? date.toISOString().split('T')[0] : ''
                          )
                        }
                        disabled={false}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.date_of_birth?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='age'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='24' disabled={true} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.age?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='fathers_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Father's Name*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.fathers_name?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='pan'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAN</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='ABCTY1234D'
                        maxLength={10}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.pan?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name='address_line1'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residential Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className='mb-2'
                        placeholder='Address Line 1'
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.address_line1?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address_line2'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className='mb-2'
                        placeholder='Address Line 2'
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.address_line2?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='City' />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.city?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='state'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='State' />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.state?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='pincode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Pincode' />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.pincode?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
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
