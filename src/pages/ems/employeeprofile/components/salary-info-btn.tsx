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
import { PencilIcon } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/hooks/use-auth'

import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/custom/button'
import { updateEmsEmployee } from '@/http/api'


const schema = z.object({
  annual_ctc: z.coerce.number().min(1, 'Annual CTC is required'),
})

type FormData = z.infer<typeof schema>

export default function SalaryInfoBtn({ employeeProfile }: any) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      annual_ctc: employeeProfile.annual_ctc,
    },
  })

  useEffect(() => {
    form.reset({
      annual_ctc: employeeProfile.annual_ctc,
    })
  }, [employeeProfile, form])

  const mutation = useMutation({
    mutationFn: ({ employeeId, data }: { employeeId: string; data: any }) =>
      updateEmsEmployee(employeeId, data),
    onSuccess: () => {
      toast({
        title: 'Employee updated successfully',
        description: 'Employee has been successfully updated.',
        variant: 'success',
      })

      form.reset()

      // Invalidate and refetch the employee profile query
      queryClient.invalidateQueries({
        queryKey: ['emsEmployeeProfile', employeeProfile.EMS_employee_id],
      })
    },
    onError: (error) => {
      toast({
        title: 'Employee update failed',
        description: `Failed to update employee.`,
        variant: 'destructive',
      })
      console.log('employee update failed', error)
    },
  })

  const onSubmit = (data: any) => {
    mutation.mutate({ employeeId: employeeProfile.EMS_employee_id, data: data })
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
          <DialogTitle>Salary Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='annual_ctc'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual CTC*</FormLabel>
                  <FormControl>
                    <Input {...field} type='number' placeholder='Annual CTC' />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.annual_ctc?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
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