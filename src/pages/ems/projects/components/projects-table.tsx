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
import { createDesignation, emsCreateProject } from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@/components/ui/use-toast'
import ProjectEditBtn from './project-edit-btn'
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

export default function ProjectsTable({
  organization_id,
  projectsList,
}: {
  organization_id: string
  projectsList: any
}) {
  console.log('Projects ', projectsList)
  const queryClient = useQueryClient()
  const projects = projectsList
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
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      start_date: '',
      end_date: '',
    },
  })

  const filteredDepartments = useMemo(() => {
    return projects.filter(
      (dept: any) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [projects, searchTerm])

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
    mutationFn: emsCreateProject,
    onSuccess: () => {
      toast({
        title: 'Project created successfully',
        description: 'Project has been successfully created.',
        variant: 'success',
      })

      form.reset()

      // Invalidate and refetch the designations query
      queryClient.invalidateQueries({ queryKey: ['ems_projects'] })
    },
    onError: (error) => {
      toast({
        title: 'Project creation failed ',
        description: `Failed to create project.`,
        variant: 'destructive',
      })
      console.log('project creation failed', error)
    },
  })

  const handleAddProject = (data: any) => {
    setIsLoading(true)
    console.log('data', data)
    const newProject = {
      ...data,
      organization_id,
    }
    mutation.mutate(newProject)
    console.log('newProject', newProject)

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
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle className='text-2xl font-bold'>
                  New Project
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAddProject)}
                  className='space-y-4'
                >
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
                          <Textarea
                            {...field}
                            placeholder='Max 250 characters'
                          />
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
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
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
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
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
          <TabsTrigger value='all'>All Projects</TabsTrigger>
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
                        onClick={() => handleSort('project_id')}
                        className='font-bold'
                      >
                        PROJECT ID
                        <ArrowUpDown className='ml-2 h-4 w-4' />
                      </Button>
                    </TableHead>
                    <TableHead className='w-[200px]'>
                      <Button
                        variant='ghost'
                        onClick={() => handleSort('project_name')}
                        className='font-bold'
                      >
                        PROJECT NAME
                        <ArrowUpDown className='ml-2 h-4 w-4' />
                      </Button>
                    </TableHead>

                    <TableHead className='max-w-[300px]'>
                      <span className='font-bold'>DESCRIPTION</span>
                    </TableHead>
                    <TableHead className='max-w-[300px]'>
                      <span className='font-bold'>START DATE</span>
                    </TableHead>
                    <TableHead className='max-w-[300px]'>
                      <span className='font-bold'>END DATE</span>
                    </TableHead>

                    <TableHead className='text-right'>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {currentItems.map((project: any) => (
                      <motion.tr
                        key={project.project_id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TableCell>{project.project_id}</TableCell>
                        <TableCell className='font-medium'>
                          {project.name}
                        </TableCell>

                        <TableCell className='max-w-[300px] truncate'>
                          {project.description}
                        </TableCell>
                        <TableCell className='max-w-[300px] truncate'>
                          {project.start_date}
                        </TableCell>
                        <TableCell className='max-w-[300px] truncate'>
                          {project.end_date}
                        </TableCell>
                        <TableCell className='text-right'>
                          <ProjectEditBtn project={project} />
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
                {currentItems.map((project: any) => (
                  <motion.div
                    key={project.project_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className='mb-2 text-sm text-muted-foreground'>
                          ID: {project.project_id}
                        </p>
                        <p className='mb-4 text-sm'>{project.description}</p>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center'>
                            <Users className='mr-2 h-4 w-4' />
                            <span className='text-sm font-medium'>
                              {/* {project.total_employees} */}
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
