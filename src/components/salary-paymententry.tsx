import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useToast } from './ui/use-toast'
import { createSalaryPayment } from '@/http/api'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { DatePicker } from './date-picker'
import { Button } from './custom/button'
import Loader from './loader'

const paymentSchema = z.object({
  payment_method: z.string().nonempty('Please select a payment method'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  month: z.string().nonempty('Please select a payment month'),
  year: z.string().nonempty('Please select a payment year'),
  payment_date: z.string().nonempty('Please select a payment date'),
  office_working_days: z
    .number()
    .min(1, 'Office working days must be greater than 0'),
  no_of_working_days: z
    .number()
    .min(1, 'Number of working days must be greater than 0'),
})

export default function SalaryPaymentEntry({ employees }: { employees: any }) {
  const [selectedEmployee, setSelectedEmployee] = useState<any>({})
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [paymentMonth, setPaymentMonth] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  console.log('selectedEmployee', selectedEmployee)
  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_method: '',
      amount: 0,
      month: '',
      year: '',
      payment_date: '',
      office_working_days: 0,
      no_of_working_days: 0,
    },
  })

  const mutation = useMutation({
    mutationFn: createSalaryPayment,
    onSuccess: () => {
      toast({
        title: 'Salary Payment created successfully',
        description: 'Salary Payment has been successfully created.',
        variant: 'success',
      })

      form.reset()
      setIsDialogOpen(false)
      setSelectedEmployee({})
      setPaymentMethod('')
      setPaymentAmount(0)
      setPaymentMonth('')
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || 'Failed to create Salary Payment.'
      toast({
        title: `${errorMessage}`,
        variant: 'destructive',
      })
      console.log('salary payment creation failed', errorMessage)
    },
  })

  const handlePaymentSubmit = (data: any) => {
    console.log('Payment submitted', data)
    console.log('selectedEmployee', selectedEmployee)
    const newData = { ...data, ...selectedEmployee }
    console.log('newData', newData)
    mutation.mutate(newData)
  }

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'office_working_days' || name === 'no_of_working_days') {
        const monthlySalary = selectedEmployee.annual_ctc / 12
        const calculatedAmount =
          (monthlySalary / value.office_working_days) * value.no_of_working_days
        form.setValue('amount', calculatedAmount)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, selectedEmployee])

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'month' || name === 'year') {
        const isPaid = selectedEmployee.salaryHistory?.some(
          (history) =>
            history.month === value.month && history.year === value.year
        )
        if (isPaid) {
          toast({
            title: 'Salary already paid for this month and year',
            variant: 'destructive',
          })
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, selectedEmployee])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem)

  const pageCount = Math.ceil(employees.length / itemsPerPage)

  const paginate = (pageNumber: any) => {
    setCurrentPage(pageNumber)
  }

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pageCount))
  }

  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisibleButtons = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2))
    let endPage = Math.min(pageCount, startPage + maxVisibleButtons - 1)

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          onClick={() => paginate(i)}
          variant={currentPage === i ? 'default' : 'outline'}
          size='sm'
          className='w-9'
        >
          {i}
        </Button>
      )
    }

    return buttons
  }

  if (employees.length === 0) {
    return <Loader />
  }

  return (
    <div className='container mx-auto space-y-8 p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Salary Payment Entry</h1>
        <div className='flex space-x-4'>
          <div className='flex items-center space-x-2'>
            <Users className='h-5 w-5 text-muted-foreground' />
            <span className='text-lg font-semibold'>
              {employees.length} Employees
            </span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <Users className='h-6 w-6' />
            <span>Employee Salary Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='font-bold'>Action</TableHead>
                  {[
                    'employee_id',
                    'first_name',
                    'last_name',
                    'email',
                    'mobile_number',
                    'annual_ctc',
                    'designation_name',
                    'department_name',
                  ].map((key) => (
                    <TableHead key={key} className='font-bold'>
                      {key.replace('_', ' ').toUpperCase()}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((row: any, index: any) => (
                  <TableRow key={index} className='hover:bg-muted/50'>
                    {' '}
                    <TableCell>
                      <Dialog
                        open={isDialogOpen}
                        onOpenChange={(open) => {
                          setIsDialogOpen(open)
                          if (!open) {
                            form.reset()
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedEmployee(row)}
                            variant='outline'
                            size='sm'
                          >
                            Process Payment
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='sm:max-w-[425px]'>
                          <DialogHeader>
                            <DialogTitle>
                              Process Payment for {row.first_name}{' '}
                              {row.last_name}
                            </DialogTitle>
                            <DialogDescription>
                              <div>
                                <strong>
                                  {' '}
                                  Annual Salary : {row.annual_ctc}
                                </strong>
                                <br />
                                <strong>
                                  {' '}
                                  Monthly Salary :{' '}
                                  {(row.annual_ctc / 12).toFixed(0)}
                                </strong>
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...form}>
                            <form
                              onSubmit={form.handleSubmit(handlePaymentSubmit)}
                              className='space-y-4'
                            >
                              <FormField
                                control={form.control}
                                name='payment_date'
                                render={({ field }) => (
                                  <FormItem className='space-y-2'>
                                    <FormLabel htmlFor='payment_date'>
                                      Payment Date
                                    </FormLabel>
                                    <FormControl>
                                      <DatePicker
                                        selected={
                                          field.value
                                            ? new Date(field.value)
                                            : undefined
                                        }
                                        onSelect={(date) =>
                                          field.onChange(
                                            date
                                              ? date.toISOString().split('T')[0]
                                              : ''
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
                                name='month'
                                render={({ field }) => (
                                  <FormItem className='space-y-2'>
                                    <FormLabel htmlFor='month'>
                                      Paymented Month
                                    </FormLabel>
                                    <FormControl>
                                      <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                      >
                                        <SelectTrigger id='paymentMonth'>
                                          <SelectValue placeholder='Select month' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {[
                                            'January',
                                            'February',
                                            'March',
                                            'April',
                                            'May',
                                            'June',
                                            'July',
                                            'August',
                                            'September',
                                            'October',
                                            'November',
                                            'December',
                                          ].map((month) => {
                                            const isPaid =
                                              selectedEmployee.salaryHistory?.some(
                                                (history) =>
                                                  history.month ===
                                                    month.toLowerCase() &&
                                                  history.year ===
                                                    form.getValues('year')
                                              )
                                            return (
                                              <SelectItem
                                                key={month}
                                                value={month.toLowerCase()}
                                                disabled={isPaid}
                                              >
                                                {month} -{' '}
                                                {isPaid ? 'Paid' : 'Not Paid'}
                                              </SelectItem>
                                            )
                                          })}
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name='year'
                                render={({ field }) => (
                                  <FormItem className='space-y-2'>
                                    <FormLabel htmlFor='year'>
                                      Paymented Year
                                    </FormLabel>
                                    <FormControl>
                                      <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                      >
                                        <SelectTrigger id='paymentYear'>
                                          <SelectValue placeholder='Select year' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Array.from(
                                            { length: 20 },
                                            (_, i) =>
                                              new Date().getFullYear() - i
                                          ).map((year) => (
                                            <SelectItem
                                              key={year}
                                              value={year.toString()}
                                            >
                                              {year}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name='payment_method'
                                render={({ field }) => (
                                  <FormItem className='space-y-2'>
                                    <FormLabel htmlFor='payment_method'>
                                      Paymented Method
                                    </FormLabel>
                                    <FormControl>
                                      <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                      >
                                        <SelectTrigger id='paymentMethod'>
                                          <SelectValue placeholder='Select payment method' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value='bank_transfer'>
                                            Bank Transfer
                                          </SelectItem>
                                          <SelectItem value='check'>
                                            Check
                                          </SelectItem>
                                          <SelectItem value='cash'>
                                            Cash
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name='amount'
                                render={({ field }) => (
                                  <FormItem className='space-y-2'>
                                    <FormLabel htmlFor='amount'>
                                      Paymented Amount
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        id='paymentAmount'
                                        type='number'
                                        {...field}
                                        value={field.value || ''}
                                        onChange={(e) =>
                                          field.onChange(e.target.valueAsNumber)
                                        }
                                        readOnly
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name='office_working_days'
                                render={({ field }) => (
                                  <FormItem className='space-y-2'>
                                    <FormLabel htmlFor='office_working_days'>
                                      Office Working Days
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        id='office_working_days'
                                        type='number'
                                        {...field}
                                        value={field.value || ''}
                                        onChange={(e) =>
                                          field.onChange(e.target.valueAsNumber)
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name='no_of_working_days'
                                render={({ field }) => (
                                  <FormItem className='space-y-2'>
                                    <FormLabel htmlFor='no_of_working_days'>
                                      Number of Working Days
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        id='no_of_working_days'
                                        type='number'
                                        {...field}
                                        value={field.value || ''}
                                        onChange={(e) =>
                                          field.onChange(e.target.valueAsNumber)
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button
                                type='submit'
                                loading={mutation.isPending}
                              >
                                Submit Payment
                              </Button>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    {[
                      'employee_id',
                      'first_name',
                      'last_name',
                      'email',
                      'mobile_number',
                      'annual_ctc',
                      'designation_name',
                      'department_name',
                    ].map((key, i) => (
                      <TableCell key={i}>{row[key]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className='mt-6 flex items-center justify-center space-x-2'>
            <Button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              variant='outline'
              size='sm'
              className='w-24'
            >
              <ChevronLeft className='mr-2 h-4 w-4' />
              Previous
            </Button>
            {renderPaginationButtons()}
            <Button
              onClick={goToNextPage}
              disabled={currentPage === pageCount}
              variant='outline'
              size='sm'
              className='w-24'
            >
              Next
              <ChevronRight className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
