import { useState, useRef } from 'react'

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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CalendarIcon,
  UploadIcon,
  DollarSign,
  Users,
  FileSpreadsheet,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { useMutation } from '@tanstack/react-query'

import { createBulkEmployee, createSalaryPayment } from '@/http/api'
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
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/custom/button'
import { DatePicker } from '@/components/date-picker'
import BulkEmployeeCreationModalBtn from './bulk-employee-btn'

const paymentSchema = z.object({
  payment_method: z.string().nonempty('Please select a payment method'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  month: z.string().nonempty('Please select a payment month'),
  year: z.string().nonempty('Please select a payment year'),
  payment_date: z.string().nonempty('Please select a payment date'),
})

export default function BulkEmployeeEntry() {
  const [excelData, setExcelData] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [uploadStatus, setUploadStatus] = useState('')

  const fileInputRef = useRef(null)
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(20)

  console.log('excelData', excelData)
  const mutation = useMutation({
    mutationFn: createBulkEmployee,
    onSuccess: () => {
      toast({
        title: 'Bulk Employee created successfully',
        description: 'Bulk Employee has been successfully created.',
        variant: 'success',
      })

      setExcelData([])
      setUploadStatus('')
      setIsOpen(false)
      setProgress(0)
      setCurrentStep(0)
      setTimeRemaining(20)
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || 'Failed to create Bulk Employee.'
      toast({
        title: `${errorMessage}`,
        variant: 'destructive',
      })
      console.log('bulk employee creation failed', errorMessage)
      setIsOpen(false)
      setProgress(0)
      setCurrentStep(0)
      setTimeRemaining(20)
    },
  })

  const handleFileUpload = (file: any) => {
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws)
        setExcelData(data as never[])
        setUploadStatus('success')
      } catch (error) {
        console.error('Error parsing Excel file:', error)
        setUploadStatus('error')
      }
    }
    reader.readAsBinaryString(file)
  }

  const handleDrop = (e: any) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    handleFileUpload(file)
  }

  const handleDragOver = (e: any) => {
    e.preventDefault()
  }

  const handleFileInputChange = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_method: '',
      amount: 0,
      month: '',
      year: '',
      payment_date: '',
    },
  })

  const handleCreateSubmit = () => {
    console.log('newData', excelData)
    mutation.mutate(excelData)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = excelData.slice(indexOfFirstItem, indexOfLastItem)

  const pageCount = Math.ceil(excelData.length / itemsPerPage)

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

  return (
    <div className='container mx-auto space-y-8 p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Bulk Employee Entry</h1>
        <div className='flex space-x-4'>
          <div className='flex items-center space-x-2'>
            <Users className='h-5 w-5 text-muted-foreground' />
            <span className='text-lg font-semibold'>
              {excelData.length} Employees
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue='upload' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='upload'>Upload Excel</TabsTrigger>
          <TabsTrigger value='data'>Employee Data</TabsTrigger>
        </TabsList>
        <TabsContent value='upload'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <FileSpreadsheet className='h-6 w-6' />
                <span>Upload Excel Sheet</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors duration-200 ease-in-out ${
                  uploadStatus === 'success'
                    ? 'border-green-500 bg-green-50'
                    : uploadStatus === 'error'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-primary'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadStatus === 'success' ? (
                  <CheckCircle className='mx-auto h-16 w-16 text-green-500' />
                ) : (
                  <UploadIcon className='mx-auto h-16 w-16 text-muted-foreground' />
                )}
                <p className='mt-4 text-lg'>
                  {uploadStatus === 'success'
                    ? 'File uploaded successfully!'
                    : uploadStatus === 'error'
                      ? 'Error uploading file. Please try again.'
                      : 'Drag and drop your Excel file here, or click to select file'}
                </p>
                <Input
                  type='file'
                  onChange={handleFileInputChange}
                  accept='.xlsx, .xls'
                  className='hidden'
                  ref={fileInputRef}
                />
                <Button className='mt-6' size='lg'>
                  {uploadStatus === 'success'
                    ? 'Upload Another File'
                    : 'Select File'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='data'>
          {excelData.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Users className='h-6 w-6' />
                  <span>Employee Data</span>
                </CardTitle>
                <BulkEmployeeCreationModalBtn
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  progress={progress}
                  setProgress={setProgress}
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                  timeRemaining={timeRemaining}
                  setTimeRemaining={setTimeRemaining}
                  handleCreateSubmit={handleCreateSubmit} // Pass handleCreateSubmit as a prop
                  mutation={mutation}
                />
              </CardHeader>
              <CardContent>
                <div className='overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(excelData[0]).map((key) => (
                          <TableHead key={key} className='font-bold'>
                            {key}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((row, index) => (
                        <TableRow key={index} className='hover:bg-muted/50'>
                          {Object.values(row).map((value: any, i: any) => (
                            <TableCell key={i}>{value}</TableCell>
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
          ) : (
            <Card>
              <CardContent className='flex h-[200px] items-center justify-center'>
                <p className='text-lg text-muted-foreground'>
                  No data available. Please upload an Excel file.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
