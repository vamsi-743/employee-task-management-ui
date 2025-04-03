import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Search,
  Plus,
  X,
  Grid,
  List,
  Users,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { createDesignation } from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from './ui/use-toast'
import DesignationEditBtn from '@/pages/designation/components/designation-edit-btn'

const designationSchema = z.object({
  designation_name: z
    .string()
    .min(1, { message: 'Designation Name is required' }),
  designation_description: z
    .string()
    .max(250, { message: 'Description must be 250 characters or less' })
    .optional(),
})

export default function DesignationTable({
  organization_id,
  designationsList,
}: {
  organization_id: string
  designationsList: any
}) {
  console.log('Designations ', designationsList)
  const queryClient = useQueryClient()
  const designations = designationsList
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [viewMode, setViewMode] = useState('table')
  const [isLoading, setIsLoading] = useState(false)
  const itemsPerPage = 6

  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(designationSchema),
    defaultValues: {
      designation_name: '',
      designation_description: '',
    },
  })

  const filteredDepartments = useMemo(() => {
    return designations.filter(
      (dept: any) =>
        dept.designation_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        dept.designation_description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
  }, [designations, searchTerm])

  const sortedDesignations = useMemo(() => {
    if (!sortColumn) return filteredDepartments
    return [...filteredDepartments].sort((a, b) => {
      const key = sortColumn as keyof typeof a
      if (a[key] < b[key]) return sortDirection === 'asc' ? -1 : 1
      if (a[key] > b[key]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredDepartments, sortColumn, sortDirection])

  const totalPages = Math.ceil(sortedDesignations.length / itemsPerPage)
  const currentItems = sortedDesignations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const mutation = useMutation({
    mutationFn: createDesignation,
    onSuccess: () => {
      toast({
        title: 'Designation created successfully',
        description: 'Designation has been successfully created.',
        variant: 'success',
      })

      form.reset()

      // Invalidate and refetch the designations query
      queryClient.invalidateQueries({ queryKey: ['designations'] })
    },
    onError: (error) => {
      toast({
        title: 'Designation creation failed ',
        description: `Failed to create designation.`,
        variant: 'destructive',
      })
      console.log('designation creation failed', error)
    },
  })

  const handleAddDesignation = (data: any) => {
    setIsLoading(true)
    console.log('data', data)
    const newDesignation = {
      ...data,
      organization_id,
    }
    mutation.mutate(newDesignation)
    console.log('newDesignation', newDesignation)

    setTimeout(() => {
      // setDesignations([...designations, newDesignation])
      setIsLoading(false)
      setIsDialogOpen(false)
    }, 1000)
  }

  const SkeletonLoader = () => (
    <div className='space-y-4'>
      {Array.from({ length: itemsPerPage }).map((_, index) => (
        <div
          key={index}
          className='h-20 animate-pulse rounded-md bg-gray-200'
        />
      ))}
    </div>
  )

  return (
    <div className='container mx-auto max-w-6xl space-y-6 p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex space-x-2'>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className='transition-all duration-200 hover:scale-105'>
                <Plus className='mr-2 h-4 w-4' />
                New Designation
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle className='text-2xl font-bold'>
                  New Designation
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAddDesignation)}
                  className='space-y-4'
                >
                  <FormField
                    control={form.control}
                    name='designation_name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='designation_description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='Max 250 characters'
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
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type='submit'
                      className='bg-primary text-primary-foreground hover:bg-primary/90'
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          {/* <Button
            variant='outline'
            className='transition-all duration-200 hover:scale-105'
          >
            <Download className='mr-2 h-4 w-4' />
            Export
          </Button> */}
        </div>
      </div>
      <div className='flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0'>
        <div className='relative w-full sm:w-64'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search designations'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-8'
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className='absolute right-2 top-2.5 text-muted-foreground hover:text-foreground'
            >
              <X className='h-4 w-4' />
            </button>
          )}
        </div>
        <div className='flex items-center space-x-4'>
          <p className='text-sm text-muted-foreground'>
            Showing {currentItems.length} of {sortedDesignations.length}{' '}
            designations
          </p>
          {/* <div className='flex items-center space-x-2'>
            <Label htmlFor='view-mode' className='text-sm'>
              View:
            </Label>
            <Switch
              id='view-mode'
              checked={viewMode === 'grid'}
              onCheckedChange={(checked) =>
                setViewMode(checked ? 'grid' : 'table')
              }
            />
            {viewMode === 'table' ? (
              <List className='h-4 w-4' />
            ) : (
              <Grid className='h-4 w-4' />
            )}
          </div> */}
        </div>
      </div>
      <Tabs defaultValue='all' className='w-full'>
        <TabsList>
          <TabsTrigger value='all'>All Designations</TabsTrigger>
        </TabsList>
        <TabsContent value='all' className='mt-4'>
          {isLoading ? (
            <SkeletonLoader />
          ) : viewMode === 'table' ? (
            <div className='overflow-hidden rounded-md border shadow-sm'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant='ghost'
                        onClick={() => handleSort('designation_id')}
                        className='font-bold'
                      >
                        DESIGNATION ID
                        <ArrowUpDown className='ml-2 h-4 w-4' />
                      </Button>
                    </TableHead>
                    <TableHead className='w-[200px]'>
                      <Button
                        variant='ghost'
                        onClick={() => handleSort('designation_name')}
                        className='font-bold'
                      >
                        DESIGNATION NAME
                        <ArrowUpDown className='ml-2 h-4 w-4' />
                      </Button>
                    </TableHead>

                    <TableHead className='max-w-[300px]'>
                      <span className='font-bold'>DESCRIPTION</span>
                    </TableHead>
                    <TableHead className='text-right'>
                      <Button
                        variant='ghost'
                        onClick={() =>
                          handleSort('designation_total_employees')
                        }
                        className='font-bold'
                      >
                        TOTAL EMPLOYEES
                        <ArrowUpDown className='ml-2 h-4 w-4' />
                      </Button>
                    </TableHead>
                    <TableHead className='text-right'>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {currentItems.map((designation: any) => (
                      <motion.tr
                        key={designation.designation_id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TableCell>{designation.designation_id}</TableCell>
                        <TableCell className='font-medium'>
                          {designation.designation_name}
                        </TableCell>

                        <TableCell className='max-w-[300px] truncate'>
                          {designation.designation_description}
                        </TableCell>
                        <TableCell className='text-right'>
                          {designation.designation_total_employees}
                        </TableCell>
                        <TableCell className='text-right'>
                          <DesignationEditBtn designation={designation} />
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <AnimatePresence>
                {currentItems.map((designation: any) => (
                  <motion.div
                    key={designation.designation_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>{designation.designation_name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className='mb-2 text-sm text-muted-foreground'>
                          ID: {designation.designation_id}
                        </p>
                        <p className='mb-4 text-sm'>
                          {designation.designation_description}
                        </p>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center'>
                            <Users className='mr-2 h-4 w-4' />
                            <span className='text-sm font-medium'>
                              {designation.designation_total_employees}
                            </span>
                          </div>
                          <Button variant='outline' size='sm'>
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>
      <div className='flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0'>
        <p className='text-sm text-muted-foreground'>
          Page {currentPage} of {totalPages}
        </p>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className='mr-1 h-4 w-4' />
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size='sm'
              onClick={() => handlePageChange(page)}
              className={
                currentPage === page ? 'bg-primary text-primary-foreground' : ''
              }
            >
              {page}
            </Button>
          ))}
          <Button
            variant='outline'
            size='sm'
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className='ml-1 h-4 w-4' />
          </Button>
        </div>
      </div>
      <Button
        className='fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg transition-all duration-200 hover:scale-110'
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className='h-6 w-6' />
      </Button>
    </div>
  )
}
