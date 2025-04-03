import React, { useEffect } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Pencil, Trash2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { updateUser, deleteUser } from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/custom/button'

// Define the schema for user data
const userSchema = z.object({
  user_name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  user_role: z.enum(['admin', 'data entry'], {
    required_error: 'Please select a role.',
  }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
})

type User = z.infer<typeof userSchema>

export default function EditAndDeleteBtn({ sampleUser }: { sampleUser: any }) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  console.log(sampleUser)

  const form = useForm<any>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      user_name: sampleUser.user_name,
      email: sampleUser.email,
      user_role: sampleUser.user_role,
      password: sampleUser.password,
    },
  })

  useEffect(() => {
    if (isEditOpen) {
      form.reset({
        user_name: sampleUser.user_name,
        email: sampleUser.email,
        user_role: sampleUser.user_role,
        password: sampleUser.password,
      })
    }
  }, [sampleUser, isEditOpen, form])

  const mutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: any }) =>
      updateUser(userId, data),
    onSuccess: () => {
      toast({
        title: 'User updated successfully',
        description: 'User has been successfully updated.',
        variant: 'success',
      })

      form.reset({
        user_name: sampleUser.user_name,
        email: sampleUser.email,
        user_role: sampleUser.user_role,
        password: sampleUser.password,
      })
      setIsEditOpen(false)

      queryClient.invalidateQueries({ queryKey: ['userslist'] })
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || 'Failed to update User.'
      toast({
        title: `${errorMessage}`,
        variant: 'destructive',
      })
      console.log('user update failed', errorMessage)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: any }) =>
      deleteUser(userId, data),
    onSuccess: () => {
      toast({
        title: 'User deleted successfully',
        description: 'User has been successfully deleted.',
        variant: 'success',
      })
      setIsDeleteOpen(false)
      queryClient.invalidateQueries({ queryKey: ['userslist'] })
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || 'Failed to delete User.'
      toast({
        title: `${errorMessage}`,
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: any) => {
    console.log(data)
    mutation.mutate({ userId: sampleUser.user_id, data })
  }

  const handleDelete = () => {
    deleteMutation.mutate({ userId: sampleUser.user_id, data: {} })
  }

  const handleEditDialogChange = (open: boolean) => {
    setIsEditOpen(open)
    if (!open) {
      form.reset({
        user_name: sampleUser.user_name,
        email: sampleUser.email,
        user_role: sampleUser.user_role,
        password: sampleUser.password,
      })
    }
  }

  return (
    <div className='flex space-x-2'>
      <Dialog open={isEditOpen} onOpenChange={handleEditDialogChange}>
        <DialogTrigger asChild>
          <Button variant='outline' size='icon'>
            <Pencil className='h-4 w-4' />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='user_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='user_role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='admin'>Admin</SelectItem>
                        <SelectItem value='data entry'>
                          Data Entry Operator
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button disabled={mutation.isPending} loading={mutation.isPending} type='submit'>Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' size='icon'>
            <Trash2 className='h-4 w-4' />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this user?</p>
          <DialogFooter>
            <Button variant='destructive' onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
