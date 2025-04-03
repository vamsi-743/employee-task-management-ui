'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useMutation } from '@tanstack/react-query'
import { createUser } from '@/http/api'
import { useToast } from '@/components/ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import EditAndDeleteBtn from './edit-and-delete-btn'
import { useAuth } from '@/hooks/use-auth'

const userSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  role: z.enum(['data entry'], { required_error: 'Role is required' }),
})

type UserFormValues = z.infer<typeof userSchema>

type User = {
  id: number
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive'
}

export default function UserManagement({ usersList }: any) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const organization_id = user?.organization_id

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 4

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'data entry',
    },
  })

  const {
    watch,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = form

  const role = watch('role')
  console.log('role', role)
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast({
        title: 'User created successfully',
        description: 'User has been successfully created.',
        variant: 'success',
      })

      reset({
        name: '',
        email: '',
        password: '',
        role: 'data entry',
      })

      // Invalidate and refetch the userslist query
      queryClient.invalidateQueries({ queryKey: ['userslist'] })
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || 'Failed to create user.'

      toast({
        title: `${errorMessage}`,
        variant: 'destructive',
      })
      console.log('user creation failed', errorMessage)
    },
  })
  const onSubmit = (data: UserFormValues) => {
    const newUser = {
      user_name: data.name,
      email: data.email,
      password: data.password,
      user_role: data.role,
      organization_id: organization_id,
    }
    mutation.mutate(newUser)
  }

  const filteredUsers = usersList.filter(
    (user: any) =>
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  return (
    <Card className='mx-auto w-full max-w-4xl'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>
          Admin User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='mb-6 space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <FormField
                control={control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter name' {...field} />
                    </FormControl>
                    <FormMessage>{errors.name?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='Enter email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{errors.email?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Enter password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{errors.password?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='data entry'>
                          Data Entry Operator
                        </SelectItem>
                        <SelectItem value='admin'>Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage>{errors.role?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <Button
              type='submit'
              className='w-full'
              loading={mutation.isPending}
            >
              Add User
            </Button>
          </form>
        </Form>

        <div className='mb-4 flex items-center justify-between'>
          <div className='relative'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search users...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-8'
            />
          </div>
          <div className='text-sm text-muted-foreground'>
            Total Users:{' '}
            <span className='font-medium text-foreground'>
              {filteredUsers.length}
            </span>
          </div>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                {/* <TableHead>Status</TableHead> */}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((userItem: any) => (
                <TableRow key={userItem.id}>
                  <TableCell className='font-medium'>
                    {userItem.user_name}
                  </TableCell>
                  <TableCell>{userItem.email}</TableCell>
                  <TableCell>{userItem.user_role}</TableCell>
                  {/* <TableCell>
                    <Badge
                      variant={
                        userItem.status === 'Active' ? 'default' : 'secondary'
                      }
                    >
                      {userItem.status}
                    </Badge>
                  </TableCell> */}
                  <TableCell>
                    {userItem.user_id === user?.user_id ? (
                      <div>
                        <p>You cannot edit or delete yourself.</p>
                      </div>
                    ) : (
                      <EditAndDeleteBtn sampleUser={userItem} />
                    )}
                    {
                      
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className='flex items-center justify-between space-x-2 py-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className='mr-2 h-4 w-4' />
            Previous
          </Button>
          <div className='text-sm text-muted-foreground'>
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
