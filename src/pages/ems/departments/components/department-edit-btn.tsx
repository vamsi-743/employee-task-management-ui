import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { emsUpdateDepartment, updateDepartment } from '@/http/api'
import { PencilIcon } from 'lucide-react'
import { Button } from '@/components/custom/button'

const schema = z.object({
  department_name: z.string().min(1, 'Department Name is required'),
  department_description: z
    .string()
    .max(250, 'Description must be 250 characters or less')
    .optional(),
})

export default function DepartmentEditBtn({ department }: any) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      department_name: department.department_name,
      department_description: department.department_description,
    },
  })

  useEffect(() => {
    form.reset({
      department_name: department.department_name,
      department_description: department.department_description,
    })
  }, [department, form])

  const mutation = useMutation({
    mutationFn: ({ departmentId, data }: { departmentId: string; data: any }) =>
      emsUpdateDepartment(departmentId, data),
    onSuccess: () => {
      toast({
        title: 'Department updated successfully',
        description: 'Department has been successfully updated.',
        variant: 'success',
      })

      form.reset()

      // Invalidate and refetch the departments query
      queryClient.invalidateQueries({ queryKey: ['ems_departments'] })
    },
    onError: (error) => {
      toast({
        title: 'Department update failed',
        description: `Failed to update department.`,
        variant: 'destructive',
      })
      console.log('department update failed', error)
    },
  })

  const onSubmit = (data: any) => {
    mutation.mutate({ departmentId: department.department_id, data })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon'>
          <PencilIcon className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='department_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='department_description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder='Max 250 characters' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end space-x-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                loading={mutation.isPending}
                type='submit'
                className='bg-primary text-primary-foreground hover:bg-primary/90'
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
