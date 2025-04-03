'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Input } from '@/components/ui/input'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Check,
  ChevronsUpDown,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { useAuth } from '@/hooks/use-auth'
import { createLoan } from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/custom/button'
import { DatePicker } from '@/components/date-picker'
import { useToast } from '@/components/ui/use-toast'

type Loan = {
  loan_id: number
  employee_id: string
  disbursement_date: string
  loan_amount: number
  organization_id: number
  loan_type: string
  reason: string
}

const formSchema = z.object({
  loan_type: z.string().nonempty('Please select a loan type.'),
  loan_amount: z.number().positive('Loan amount must be positive.'),
  disbursement_date: z.string().nonempty('Please select a disbursement date.'),
  reason: z.string().min(10, 'Reason must be at least 10 characters.'),
})

const loanTypes = [
  { value: 'Personal loan', label: 'Personal Loan' },
  { value: 'Medical loan', label: 'Medical Loan' },
  { value: 'Education loan', label: 'Education Loan' },
]

export default function LoanTable({
  loans,
  employees,
  employeeId,
  employeeProfile
}: {
  loans: any
  employees: any
  employeeId: any
  employeeProfile: any
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()
  const loansPerPage = 5
  const totalPages = Math.ceil(loans.length / loansPerPage)
  const indexOfLastLoan = currentPage * loansPerPage
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage
  const currentLoans = loans.slice(indexOfFirstLoan, indexOfLastLoan)
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loan_type: '',
      loan_amount: 0,
      disbursement_date: '',
      reason: '',
    },
  })

  const mutation = useMutation({
    mutationFn: createLoan,
    onSuccess: () => {
      toast({
        title: 'Loan created successfully',
        description: 'Loan has been successfully created.',
        variant: 'success',
      })

      form.reset()
      setIsOpen(false)

      // Invalidate and refetch the departments query
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      queryClient.invalidateQueries({ queryKey: ['employeeProfile', employeeProfile.employee_id] });
    },
    onError: (error: any) => {
      const errorMessage = error.response.data.error || 'Failed to create loan.'
      toast({
        title: `${errorMessage}`,
        variant: 'destructive',
      })
      console.log('loan creation failed', error)
    },
  })

  function onSubmit(data: any) {
    console.log('Form Data:', data)
    const newData = {
      ...data,
      organization_id: user?.organization_id,
      employee_id: employeeProfile.employee_id,
    }
    mutation.mutate(newData)
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className='container mx-auto space-y-6 p-4'>
      <Card className='shadow-lg'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-2xl font-bold'>
            Employee Loan Management
          </CardTitle>
          <Dialog
            open={isOpen}
            onOpenChange={(open) => {
              setIsOpen(open)
              if (!open) {
                form.reset()
              }
            }}
          >
            <DialogTrigger asChild>
              <Button size='sm' className='bg-blue-600 hover:bg-blue-700'>
                <PlusIcon className='mr-2 h-4 w-4' />
                Create Loan
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Create Loan</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-8'
                >
                  <div className='space-y-4'>
                    <div>
                      <strong>Employee ID:</strong> {employeeProfile.employee_id}
                    </div>
                    <div>
                      <strong>Name:</strong> {employeeProfile.first_name} {employeeProfile.last_name}
                    </div>
                    <div>
                      <strong>Email:</strong> {employeeProfile.email}
                    </div>
                    <div>
                      <strong>Mobile Number:</strong> {employeeProfile.mobile_number}
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name='loan_type'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select Loan Type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {loanTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='loan_amount'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Amount (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='disbursement_date'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel className='pb-[4.5px] pt-[5px]'>
                          Disbursement Date
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='reason'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button loading={mutation.isPending} type='submit'>
                    Save
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='font-semibold'>Employee ID</TableHead>
                  <TableHead className='font-semibold'>Loan Type</TableHead>
                  <TableHead className='font-semibold'>
                    Loan Amount (₹)
                  </TableHead>
                  <TableHead className='font-semibold'>
                    Disbursement Date
                  </TableHead>
                  <TableHead className='font-semibold'>Reason</TableHead>
                  <TableHead className='font-semibold'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLoans.map((loan: Loan) => (
                  <TableRow key={loan.loan_id}>
                    <TableCell>{loan.employee_id}</TableCell>
                    <TableCell>{loan.loan_type}</TableCell>
                    <TableCell>{loan.loan_amount}</TableCell>
                    <TableCell>{loan.disbursement_date}</TableCell>
                    <TableCell>{loan.reason}</TableCell>
                    <TableCell>
                      <Button
                        size='sm'
                        onClick={() =>
                          navigate(`/employee-profile/${loan.employee_id}`)
                        }
                      >
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className='flex items-center justify-between space-x-2 py-4'>
            <div className='text-sm text-muted-foreground'>
              Showing {indexOfFirstLoan + 1} to{' '}
              {Math.min(indexOfLastLoan, loans.length)} of {loans.length}{' '}
              entries
            </div>
            <div className='flex space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeftIcon className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className='h-4 w-4' />
              </Button>
              <div className='flex items-center gap-1'>
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index}
                    variant={currentPage === index + 1 ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => goToPage(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRightIcon className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
