// @ts-nocheck

import { useState, useEffect } from 'react'
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
import { DatePicker } from './date-picker'
import { useAuth } from '@/hooks/use-auth'
import { createLoan } from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from './ui/use-toast'
import { Button } from './custom/button'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'

type Loan = {
  loan_id: number
  employee_id: string
  disbursement_date: string
  loan_amount: number
  organization_id: number
  loan_type: string
  reason: string
  payment_type: string
  loan_interest: number
  no_of_months: number
  monthly_emi: number
}

const formSchema = z.object({
  employee_id: z.string().nonempty('Please select an employee.'),
  payment_type: z.string().nonempty('Please select a payment type.'),
  amount: z.number().positive('Loan amount must be positive.'),
  disbursement_date: z.string().nonempty('Please select a disbursement date.'),
  reason: z.string().min(10, 'Reason must be at least 10 characters.'),
})

const loanTypes = [
  { value: 'Personal loan', label: 'Personal Loan' },
  { value: 'Medical loan', label: 'Medical Loan' },
  { value: 'Education loan', label: 'Education Loan' },
]

export default function LoanCreate({
  loans,
  employees,
}: {
  loans: Loan[]
  employees: any
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
  const [loanType, setLoanType] = useState('')
  const [loanInterest, setLoanInterest] = useState(0)
  const [noOfMonths, setNoOfMonths] = useState(0)
  const [monthlyEmi, setMonthlyEmi] = useState(0)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee_id: '',
      loan_type: '',
      amount: 0,
      disbursement_date: '',
      reason: '',
      payment_type: 'partial_amount',
      loan_interest: 0,
      no_of_months: 0,
      monthly_emi: 0,
    },
  })

  const paymentType = form.watch('payment_type')

  const calculateEMI = (
    principal: number,
    interestRate: number,
    months: number
  ) => {
    const monthlyRate = interestRate / (12 * 100)
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    )
  }

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (
        name === 'amount' ||
        name === 'loan_interest' ||
        name === 'no_of_months'
      ) {
        const emi = calculateEMI(
          value.amount,
          value.loan_interest,
          value.no_of_months
        )
        setMonthlyEmi(emi)
        form.setValue('monthly_emi', emi)
      }
    })
    return () => subscription.unsubscribe()
  }, [form.watch, calculateEMI])

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
  console.log('loanInterest', loanInterest)
  function onSubmit(data: any) {
    console.log('Form Data:', data)
    const newData = {
      ...data,
      organization_id: user?.organization_id,
    }
    console.log('newData:', newData)

    if (data.payment_type === 'partial_amount') {
      delete newData.loan_type
      delete newData.loan_interest
      delete newData.no_of_months
      delete newData.monthly_emi
    } else if (data.payment_type === 'loan_amount') {
      let hasError = false

      if (!loanType) {
        form.setError('loan_type', {
          type: 'manual',
          message: 'Loan type is required.',
        })
        hasError = true
      }

      if (loanInterest <= 0 || loanInterest === null) {
        form.setError('loan_interest', {
          type: 'manual',
          message: 'Loan interest must be greater than 0.',
        })
        hasError = true
      }

      if (noOfMonths <= 0 || noOfMonths === null) {
        form.setError('no_of_months', {
          type: 'manual',
          message: 'Number of months must be greater than 0.',
        })
        hasError = true
      }

      if (monthlyEmi <= 0 || monthlyEmi === null) {
        form.setError('monthly_emi', {
          type: 'manual',
          message: 'Monthly EMI must be greater than 0.',
        })
        hasError = true
      }

      if (hasError) {
        toast({
          title: 'Please fill all required fields for loan payment type.',
          variant: 'destructive',
        })
        return
      }

      newData.loan_type = loanType
      newData.loan_interest = loanInterest
      newData.no_of_months = noOfMonths
      newData.monthly_emi = monthlyEmi
    }

    mutation.mutate(newData)
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const filteredEmployees = employees.filter(
    (employee: any) =>
      employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='employee_id'
                      render={({ field }) => (
                        <FormItem className='col-span-2 flex flex-col'>
                          <FormLabel>Employee</FormLabel>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  aria-expanded={open}
                                  className={cn(
                                    'w-full justify-between',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value
                                    ? (() => {
                                        const employee = employees.find(
                                          (e: any) =>
                                            e.employee_id === field.value
                                        )
                                        return employee
                                          ? `${employee.first_name} ${employee.last_name} (ID: ${employee.employee_id})`
                                          : 'Select employee'
                                      })()
                                    : 'Select employee'}
                                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-[300px] p-0'>
                              <Command>
                                <Input
                                  placeholder='Search employee...'
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                  <>
                                    <CommandEmpty>
                                      No employee found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {filteredEmployees.map(
                                        (employee: any) => (
                                          <CommandItem
                                            value={
                                              employee.first_name +
                                              ' ' +
                                              employee.last_name
                                            }
                                            key={employee.employee_id}
                                            onSelect={() => {
                                              form.setValue(
                                                'employee_id',
                                                employee.employee_id
                                              )
                                              setOpen(false)
                                            }}
                                            className={cn(
                                              'cursor-pointer px-4 py-2 transition-colors duration-150 ease-in-out',
                                              employee.employee_id ===
                                                field.value
                                                ? 'bg-blue-500 text-white'
                                                : 'hover:bg-gray-300 dark:hover:bg-gray-700'
                                            )}
                                          >
                                            <Check
                                              className={cn(
                                                'mr-2 h-4 w-4',
                                                employee.employee_id ===
                                                  field.value
                                                  ? 'opacity-100'
                                                  : 'opacity-0'
                                              )}
                                            />
                                            {employee.first_name}{' '}
                                            {employee.last_name} (ID:{' '}
                                            {employee.employee_id})
                                          </CommandItem>
                                        )
                                      )}
                                    </CommandGroup>
                                  </>
                                )}
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Select an employee from the list.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='payment_type'
                      render={({ field }) => (
                        <FormItem className='col-span-2'>
                          <FormLabel>Payment Type</FormLabel>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormItem>
                              <FormControl>
                                <RadioGroupItem
                                  value='partial_amount'
                                  id='partial_amount'
                                  className='mr-2'
                                />
                              </FormControl>
                              <FormLabel htmlFor='partial_amount'>
                                Partial Amount
                              </FormLabel>
                            </FormItem>
                            <FormItem>
                              <FormControl>
                                <RadioGroupItem
                                  value='loan_amount'
                                  id='loan_amount'
                                  className='mr-2'
                                />
                              </FormControl>
                              <FormLabel htmlFor='loan_amount'>
                                Loan Amount
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {paymentType === 'loan_amount' && (
                      <>
                        <FormField
                          control={form.control}
                          name='loan_type'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loan Type</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value)
                                  setLoanType(value)
                                }}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select Loan Type' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {loanTypes.map((type) => (
                                    <SelectItem
                                      key={type.value}
                                      value={type.value}
                                    >
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
                          name='loan_interest'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loan Interest (%)</FormLabel>
                              <FormControl>
                                <Input
                                  type='number'
                                  {...field}
                                  onChange={(e) => {
                                    const value = parseFloat(e.target.value)
                                    field.onChange(isNaN(value) ? 0 : value)
                                    setLoanInterest(isNaN(value) ? 0 : value)
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='no_of_months'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Months</FormLabel>
                              <FormControl>
                                <Input
                                  type='number'
                                  {...field}
                                  onChange={(e) => {
                                    const value = parseFloat(e.target.value)
                                    field.onChange(isNaN(value) ? 0 : value)
                                    setNoOfMonths(isNaN(value) ? 0 : value)
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='monthly_emi'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly EMI (₹)</FormLabel>
                              <FormControl>
                                <Input type='number' {...field} disabled />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    <FormField
                      control={form.control}
                      name='amount'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (₹)</FormLabel>
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
                              onSelect={(date) =>
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
                        <FormItem className='col-span-2'>
                          <FormLabel>Reason</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                  <TableHead className='font-semibold'>Loan Amount (₹)</TableHead>
                  <TableHead className='font-semibold'>Disbursement Date</TableHead>
                  <TableHead className='font-semibold'>Reason</TableHead>
                  <TableHead className='font-semibold'>Payment Type</TableHead>
                  <TableHead className='font-semibold'>Loan Interest</TableHead>
                  <TableHead className='font-semibold'>Number of Months</TableHead>
                  <TableHead className='font-semibold'>Monthly EMI</TableHead>
                  <TableHead className='font-semibold'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLoans.map((loan) => (
                  <TableRow key={loan.loan_id}>
                    <TableCell>{loan.employee_id}</TableCell>
                    <TableCell>{loan.loan_type || 'N/A'}</TableCell>
                    <TableCell>{loan.amount}</TableCell>
                    <TableCell>{loan.disbursement_date}</TableCell>
                    <TableCell>{loan.reason}</TableCell>
                    <TableCell>{loan.payment_type}</TableCell>
                    <TableCell>{loan.loan_interest}</TableCell>
                    <TableCell>{loan.no_of_months}</TableCell>
                    <TableCell>{loan.monthly_emi}</TableCell>
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
