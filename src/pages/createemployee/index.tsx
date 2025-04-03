import { DatePicker } from '@/components/date-picker'
import EmployeeAdded from '@/components/employeeadded'
import Loader from '@/components/loader'
import PageContainer from '@/components/page-container'
import PaymentOptions from '@/components/paymentoptions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/hooks/use-auth'
import {
  addEmployee,
  getAllDepartments,
  getAllDesignations,
  getEmployeeIds,
} from '@/http/api'

import { type EmployeeFormValues, employeeSchema } from '@/lib/form-schema'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { differenceInYears } from 'date-fns'
import { AlertTriangleIcon, Info, Trash, Trash2Icon } from 'lucide-react'

import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

interface ProfileFormType {
  initialData: any | null
  categories: any
}

const CreateEmployee = () => {
  const { user } = useAuth()

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
  console.log('departmentsin create employee', departmentsList)

  const {
    data: designationResponse,
    isLoading: designationLoading,
    error: designationError,
  } = useQuery({
    queryKey: ['designations'],
    queryFn: () => getAllDesignations(payload),
  })
  const designationsList = designationResponse?.data || []
  console.log('designationsin create employee', designationsList)

  const {
    data: employeeIdsResponse,
    isLoading: employeeIdsLoading,
    error: employeeIdsError,
  } = useQuery({
    queryKey: ['employeeIds'],
    queryFn: getEmployeeIds,
  })
  const employeeIdsList = employeeIdsResponse?.data || []
  console.log('employeeIdsin create employee', employeeIdsList)

  // const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const [basic, setBasic] = useState({ percent: 0, monthly: 0, annual: 0 })
  const [hra, setHRA] = useState({ percent: 0, monthly: 0, annual: 0 })
  const [conveyance, setConveyance] = useState({ monthly: 0, annual: 0 })
  const [fixedAllowance, setFixedAllowance] = useState({
    monthly: 0,
    annual: 0,
  })
  const [employeeIdError, setEmployeeIdError] = useState<string | null>(null)
  const { toast } = useToast()
  const title = 'Create New Employee'
  const description =
    'To create new employee, we first need some basic information about employee.'
  const toastMessage = 'Employee created.'
  const action = 'Create'
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [employeeData, setEmployeeData] = useState({})
  const queryClient = useQueryClient()
  const delta = currentStep - previousStep

  const defaultValues = {
    first_name: '',
    last_name: '',
    employee_id: '',
    date_of_joining: '',
    email: '',
    gender: 'male',
    work_location: '',
    designation_name: '',
    department_name: '',
    annual_ctc: 0,
    personal_email: '',
    mobile_number: '',
    date_of_birth: '',
    age: 0,
    fathers_name: '',
    pan: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
  }

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
    mode: 'onChange',
  })

  const {
    control,
    watch,
    formState: { errors },
  } = form
  const annualCTC = watch('annual_ctc')
  const mutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      toast({
        title: toastMessage,
        variant: 'default',
      })

      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
    onError: (error: any) => {
      const errorMessage = error.response.data.error || 'Something went wrong'
      console.log('errorResponse', error.response)
      toast({
        title: 'Error',
        description: `${errorMessage}`,
        variant: 'destructive',
      })
    },
  })
  const processForm: SubmitHandler<EmployeeFormValues> = (data) => {
    console.log('data ==create employee>', { ...employeeData, ...data })
    const newData = {
      ...employeeData,
      ...data,
      organization_id: user?.organization_id,
      designation_id: parseInt(data.designation_id),
      department_id: parseInt(data.department_id),
    }
    mutation.mutate(newData)
    // TODO: add error handling

    setEmployeeData(newData)
    // api call and reset
    form.reset()
  }

  type FieldName = keyof EmployeeFormValues

  const steps = [
    {
      id: 'Step 1',
      name: 'Basic Information',
      fields: [
        'first_name',
        'last_name',
        'employee_id',
        'date_of_joining',
        'email',
        'gender',
        'work_location',
        'designation_id',
        'department_id',
      ],
    },
    { id: 'Step 2', name: 'Salary Information', fields: ['annual_ctc'] },
    {
      id: 'Step 3',
      name: 'Personal Information',
      fields: [
        'personal_email',
        'mobile_number',
        'date_of_birth',
        'age',
        'fathers_name',
        'pan',
        'address_line1',
        'address_line2',
        'city',
        'state',
        'pincode',
      ],
    },
    // { id: 'Step 4', name: 'Payment Options' },
    { id: 'Step 3', name: 'Completed' },
  ]

  const next = async () => {
    const fields = steps[currentStep].fields

    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true,
    })

    if (!output) return

    // Check if employee_id already exists
    const employeeId = form.getValues('employee_id')
    const employeeExists = employeeIdsList.some(
      (employee: any) => employee.employee_id === employeeId
    )
    if (employeeExists) {
      setEmployeeIdError('This employee_id already exists')
      return
    } else {
      setEmployeeIdError(null)
    }

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await form.handleSubmit(processForm)()
      }
      setPreviousStep(currentStep)
      setCurrentStep((step) => step + 1)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep((step) => step - 1)
    }
  }

  console.log('currentStep', currentStep)
  useEffect(() => {
    calculateSalary()
  }, [annualCTC, basic.percent, hra.percent, conveyance.monthly])

  const calculateSalary = () => {
    const basicAnnual = annualCTC * (basic.percent / 100)
    const basicMonthly = basicAnnual / 12
    setBasic({ ...basic, monthly: basicMonthly, annual: basicAnnual })

    const hraAnnual = basicAnnual * (hra.percent / 100)
    const hraMonthly = hraAnnual / 12
    setHRA({ ...hra, monthly: hraMonthly, annual: hraAnnual })

    const conveyanceAnnual = conveyance.monthly * 12
    setConveyance({ ...conveyance, annual: conveyanceAnnual })

    const fixedAllowanceAnnual =
      annualCTC - basicAnnual - hraAnnual - conveyanceAnnual
    const fixedAllowanceMonthly = fixedAllowanceAnnual / 12
    setFixedAllowance({
      monthly: fixedAllowanceMonthly,
      annual: fixedAllowanceAnnual,
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
      amount
    )
  }
  const onDataChange = (data: any) => {
    setEmployeeData((prevData) => ({
      ...prevData,
      payment_options: {
        ...prevData,
        ...data,
        payment_method: data.paymentMethod,
      },
    }))
  }
  const dateOfBirth = watch('date_of_birth')

  useEffect(() => {
    if (dateOfBirth) {
      const age = differenceInYears(new Date(), new Date(dateOfBirth))
      form.setValue('age', age)
    }
  }, [dateOfBirth, form])

  return (
    <PageContainer scrollable={true}>
      <div className='space-y-4'>
        <>
          <div className='flex items-center justify-between'>
            <Heading title={title} description={description} />
          </div>
          <Separator />
          <div>
            <ul className='flex gap-4'>
              {steps.map((step, index) => (
                <li key={step.name} className='md:flex-1'>
                  {currentStep > index ? (
                    <div className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                      <span className='text-sm font-medium text-sky-600 transition-colors '>
                        {step.id}
                      </span>
                      <span className='text-sm font-medium'>{step.name}</span>
                    </div>
                  ) : currentStep === index ? (
                    <div
                      className='flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                      aria-current='step'
                    >
                      <span className='text-sm font-medium text-sky-600'>
                        {step.id}
                      </span>
                      <span className='text-sm font-medium'>{step.name}</span>
                    </div>
                  ) : (
                    <div className='group flex h-full w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                      <span className='text-sm font-medium text-gray-500 transition-colors'>
                        {step.id}
                      </span>
                      <span className='text-sm font-medium'>{step.name}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <Separator />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(processForm)}
              className='w-full space-y-8'
            >
              <div
                className={cn(
                  currentStep === 0 || currentStep === 2
                    ? 'gap-8 md:grid md:grid-cols-3'
                    : 'w-full md:inline-block'
                )}
              >
                {currentStep === 0 && (
                  <>
                    <FormField
                      control={form.control}
                      name='first_name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder='John'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
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
                            <Input
                              disabled={loading}
                              placeholder='Doe'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='employee_id'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee ID</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder='E12345'
                              {...field}
                            />
                          </FormControl>
                          {employeeIdError && (
                            <FormMessage>{employeeIdError}</FormMessage>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='date_of_joining'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel className='pb-[4.5px] pt-[5px]'>
                            Date of Joining
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
                              disabled={loading}
                            />
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
                          <FormLabel>Work Email</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder='johndoe@gmail.com'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='gender'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            disabled={loading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder='Select a gender'
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='male'>Male</SelectItem>
                              <SelectItem value='female'>Female</SelectItem>
                              <SelectItem value='other'>Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='work_location'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Location</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder='Office Location'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='designation_id'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation</FormLabel>
                          <Select
                            disabled={loading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder='Select a designation'
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {designationsList.map((designation: any) => (
                                <SelectItem
                                  key={designation.designation_id}
                                  value={`${designation.designation_id}`}
                                >
                                  {designation.designation_name}
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
                      name='department_id'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select
                            disabled={loading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder='Select a department'
                                />
                              </SelectTrigger>
                            </FormControl>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {currentStep === 1 && (
                  <>
                    <Card className='mx-auto w-full max-w-4xl'>
                      <CardContent className='p-6'>
                        <div className='grid gap-6'>
                          <div className='flex flex-col items-center gap-2 md:flex-row'>
                            <FormField
                              control={form.control}
                              name='annual_ctc'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor='annualCTC'
                                    className='text-sm font-medium text-red-500 dark:text-red-400'
                                  >
                                    Annual CTC *
                                  </FormLabel>
                                  <div className='flex items-center rounded border dark:border-gray-700'>
                                    <span className='border-r bg-gray-100 px-2 py-1 dark:bg-gray-800'>
                                      ₹
                                    </span>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type='number'
                                        placeholder='Annual CTC'
                                      />
                                    </FormControl>
                                    <span className='text-sm text-gray-500 dark:text-gray-400'>
                                      per year
                                    </span>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          {/* <>
                            {' '}
                            <div className='grid grid-cols-1 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:grid-cols-4'>
                              <div>SALARY COMPONENTS</div>
                              <div>CALCULATION TYPE</div>
                              <div>MONTHLY AMOUNT</div>
                              <div>ANNUAL AMOUNT</div>
                            </div>
                            <div>
                              <div className='mb-2 font-medium dark:text-gray-300'>
                                Earnings
                              </div>
                              <div className='grid gap-4'>
                                <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-4'>
                                  <Label
                                    htmlFor='basic'
                                    className='text-sm dark:text-gray-300'
                                  >
                                    Basic
                                  </Label>
                                  <div className='flex items-center gap-2'>
                                    <Input
                                      id='basic'
                                      type='number'
                                      value={basic.percent}
                                      onChange={(e) =>
                                        setBasic({
                                          ...basic,
                                          percent: Number(e.target.value),
                                        })
                                      }
                                      className='w-20 dark:bg-gray-900'
                                    />
                                    <span className='text-sm dark:text-gray-400'>
                                      % of CTC
                                    </span>
                                  </div>
                                  <Input
                                    value={formatCurrency(basic.monthly)}
                                    readOnly
                                    className='bg-gray-50 dark:bg-gray-800'
                                  />
                                  <Input
                                    value={formatCurrency(basic.annual)}
                                    readOnly
                                    className='bg-gray-50 dark:bg-gray-800'
                                  />
                                </div>

                                <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-4'>
                                  <Label
                                    htmlFor='hra'
                                    className='text-sm dark:text-gray-300'
                                  >
                                    House Rent Allowance
                                  </Label>
                                  <div className='flex items-center gap-2'>
                                    <Input
                                      id='hra'
                                      type='number'
                                      value={hra.percent}
                                      onChange={(e) =>
                                        setHRA({
                                          ...hra,
                                          percent: Number(e.target.value),
                                        })
                                      }
                                      className='w-20 dark:bg-gray-900'
                                    />
                                    <span className='text-sm dark:text-gray-400'>
                                      % of Basic
                                    </span>
                                  </div>
                                  <Input
                                    value={formatCurrency(hra.monthly)}
                                    readOnly
                                    className='bg-gray-50 dark:bg-gray-800'
                                  />
                                  <Input
                                    value={formatCurrency(hra.annual)}
                                    readOnly
                                    className='bg-gray-50 dark:bg-gray-800'
                                  />
                                </div>

                                <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-4'>
                                  <Label
                                    htmlFor='conveyance'
                                    className='text-sm dark:text-gray-300'
                                  >
                                    Conveyance Allowance
                                  </Label>
                                  <div className='text-sm dark:text-gray-400'>
                                    Fixed amount
                                  </div>
                                  <Input
                                    id='conveyance'
                                    type='number'
                                    value={conveyance.monthly}
                                    onChange={(e) =>
                                      setConveyance({
                                        monthly: Number(e.target.value),
                                        annual: Number(e.target.value) * 12,
                                      })
                                    }
                                    className='dark:bg-gray-900'
                                  />
                                  <Input
                                    value={formatCurrency(conveyance.annual)}
                                    readOnly
                                    className='bg-gray-50 dark:bg-gray-800'
                                  />
                                </div>

                                <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-4'>
                                  <div className='flex items-center gap-2'>
                                    <Label
                                      htmlFor='fixedAllowance'
                                      className='text-sm dark:text-gray-300'
                                    >
                                      Fixed Allowance
                                    </Label>
                                    <Info className='h-4 w-4 text-gray-400 dark:text-gray-500' />
                                  </div>
                                  <div className='text-xs text-gray-500 dark:text-gray-400'>
                                    Monthly CTC - Sum of all other components
                                  </div>
                                  <Input
                                    value={formatCurrency(
                                      fixedAllowance.monthly
                                    )}
                                    readOnly
                                    className='bg-gray-50 dark:bg-gray-800'
                                  />
                                  <Input
                                    value={formatCurrency(
                                      fixedAllowance.annual
                                    )}
                                    readOnly
                                    className='bg-gray-50 dark:bg-gray-800'
                                  />
                                </div>
                              </div>
                            </div>
                            <div className='grid grid-cols-1 items-center gap-4 rounded bg-blue-50 p-2 dark:bg-blue-900 md:grid-cols-4'>
                              <div className='font-medium dark:text-gray-300'>
                                Cost to Company
                              </div>
                              <div></div>
                              <div className='font-medium dark:text-gray-300'>
                                ₹ {formatCurrency(annualCTC / 12)}
                              </div>
                              <div className='font-medium dark:text-gray-300'>
                                ₹ {formatCurrency(annualCTC)}
                              </div>
                            </div>
                          </> */}
                          <>
                            {' '}
                            <Card>
                              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-xl font-semibold'>
                                  Salary Details
                                </CardTitle>
                              </CardHeader>
                              <CardContent className='pt-2'>
                                <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
                                  <div className='rounded-lg bg-secondary p-4'>
                                    <p className='mb-1 text-sm text-muted-foreground'>
                                      ANNUAL CTC
                                    </p>
                                    <p className='text-3xl font-bold'>
                                      ₹{form.watch('annual_ctc')}
                                    </p>
                                    <p className='text-sm text-muted-foreground'>
                                      per year
                                    </p>
                                  </div>
                                  <div className='rounded-lg bg-secondary p-4'>
                                    <p className='mb-1 text-sm text-muted-foreground'>
                                      MONTHLY CTC
                                    </p>
                                    <p className='text-3xl font-bold'>{`₹${(form.watch('annual_ctc') / 12).toFixed(0)}`}</p>
                                    <p className='text-sm text-muted-foreground'>
                                      per month
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name='personal_email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Personal Email Address</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder='personal@example.com'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
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
                              onSelect={(date) =>
                                field.onChange(
                                  date ? date.toISOString().split('T')[0] : ''
                                )
                              }
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* age */}
                    <FormField
                      control={form.control}
                      name='age'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input
                              disabled={true}
                              placeholder='Age'
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='fathers_name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fathers Name*</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="Father's Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
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
                              disabled={loading}
                              placeholder='ABCDE1234F'
                              maxLength={10}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='address_line1'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 1</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder='123 Main St'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='address_line2'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 2</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder='Apt 4B'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='city'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder='City'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
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
                            <Input
                              disabled={loading}
                              placeholder='State'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='pincode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pin Code</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder='123456'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    {mutation.isError ? (
                      <div className='flex h-svh w-full items-center justify-center text-red-500'>
                        {JSON.stringify(mutation.error.message)}
                      </div>
                    ) : (
                      <EmployeeAdded
                        employeeData={employeeData}
                        setCurrentStep={setCurrentStep}
                      />
                    )}
                  </>
                )}
              </div>

              {/* <Button disabled={loading} className='ml-auto' type='submit'>
                {action}
              </Button> */}
            </form>
          </Form>
          {/* Navigation */}
          {currentStep !== 3 && (
            <div className='mt-8 pt-5'>
              <div className='flex justify-between'>
                <button
                  type='button'
                  onClick={prev}
                  disabled={currentStep === 0}
                  className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='h-6 w-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15.75 19.5L8.25 12l7.5-7.5'
                    />
                  </svg>
                </button>
                <button
                  type='button'
                  onClick={next}
                  disabled={currentStep === steps.length - 1}
                  className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='h-6 w-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M8.25 4.5l7.5 7.5-7.5 7.5'
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      </div>
    </PageContainer>
  )
}

export default CreateEmployee
