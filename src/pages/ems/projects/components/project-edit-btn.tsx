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
import { emsUpdateProject, updateDesignation } from '@/http/api'
import { PencilIcon } from 'lucide-react'
import { Button } from '@/components/custom/button'
import { DatePicker } from '@/components/date-picker'

const projectSchema = z.object({
  name: z.string().min(1, { message: 'Project Name is required' }),
  description: z
    .string()
    .max(250, { message: 'Description must be 250 characters or less' })
    .optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

export default function ProjectEditBtn({ project }: any) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
      start_date: project.start_date,
      end_date: project.end_date,
    },
  })

  useEffect(() => {
    form.reset({
      name: project.name,
      description: project.description,
      start_date: project.start_date,
      end_date: project.end_date,
    })
  }, [project, form])

  const mutation = useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: any }) =>
      emsUpdateProject(projectId, data),
    onSuccess: () => {
      toast({
        title: 'Project updated successfully',
        description: 'Project has been successfully updated.',
        variant: 'success',
      })

      form.reset()

      // Invalidate and refetch the departments query
      queryClient.invalidateQueries({ queryKey: ['ems_projects'] })
    },
    onError: (error) => {
      toast({
        title: 'Project update failed',
        description: `Failed to update project.`,
        variant: 'destructive',
      })
      console.log('project update failed', error)
    },
  })

  const onSubmit = (data: any) => {
    mutation.mutate({ projectId: project.project_id, data })
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
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name *</FormLabel>
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
                    <Textarea {...field} placeholder='Max 250 characters' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='start_date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(
                          date ? date.toISOString().split('T')[0] : ''
                        )
                      }
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='end_date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(
                          date ? date.toISOString().split('T')[0] : ''
                        )
                      }
                      disabled={mutation.isPending}
                    />
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
