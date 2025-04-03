'use client'

import React from 'react'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ThemeSwitch from '@/components/theme-switch'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '../components/user-nav'
import EmployeeSearch from '../components/employee-search'
import { useEmsAuth } from '@/hooks/use-auth'
import { useQuery } from '@tanstack/react-query'
import { getEmsDashboardDetails } from '@/http/api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Users, Briefcase, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Dashboard() {
  const { user } = useEmsAuth()
  const payload = { organization_id: user.organization_id }
  const {
    data: dashboardDetailsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['ems_dashboard'],
    queryFn: () => getEmsDashboardDetails(payload),
  })
  const dashboardDetails = dashboardDetailsResponse?.data

  const taskData = [
    { name: 'Completed', value: dashboardDetails?.completed_tasks },
    { name: 'In Progress', value: dashboardDetails?.in_progress_tasks },
    { name: 'Pending', value: dashboardDetails?.pending_tasks },
  ]

  const genderData = [
    {
      name: 'Male',
      value: dashboardDetails?.gender_wise_employee.male_employees,
    },
    {
      name: 'Female',
      value: dashboardDetails?.gender_wise_employee.female_employees,
    },
    {
      name: 'Other',
      value: dashboardDetails?.gender_wise_employee.other_employees,
    },
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

  return (
    <Layout>
      <Layout.Header className='border-b bg-background'>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <EmployeeSearch />
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body className='bg-background'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
        </div>

        <Tabs defaultValue='overview' className='space-y-6'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='projects'>Projects & Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Employees
                  </CardTitle>
                  <Users className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardDetails?.total_employees}
                  </div>
                  <Progress
                    value={
                      (dashboardDetails?.active_employees /
                        dashboardDetails?.total_employees) *
                      100
                    }
                    className='mt-2'
                  />
                  <div className='mt-2 flex justify-between text-xs text-muted-foreground'>
                    <span>Active: {dashboardDetails?.active_employees}</span>
                    <span>
                      Inactive: {dashboardDetails?.inactive_employees}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Projects
                  </CardTitle>
                  <Briefcase className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardDetails?.total_projects}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium'>Tasks</CardTitle>
                  <CheckCircle className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardDetails?.total_tasks}
                  </div>
                  <Progress
                    value={
                      (dashboardDetails?.completed_tasks /
                        dashboardDetails?.total_tasks) *
                      100
                    }
                    className='mt-2'
                  />
                  <div className='mt-2 flex justify-between text-xs text-muted-foreground'>
                    <span>Completed: {dashboardDetails?.completed_tasks}</span>
                    <span>Total: {dashboardDetails?.total_tasks}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-7'>
              <Card className='col-span-1 md:col-span-3'>
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={300}>
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        outerRadius={80}
                        fill='#8884d8'
                        dataKey='value'
                      >
                        {genderData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className='col-span-1 md:col-span-2 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Employees</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className='h-[300px]'>
                    {dashboardDetails?.recently_added
                      .slice(0, 5)
                      .map((employee, index) => (
                        <div
                          key={index}
                          className='mb-4 flex items-center space-x-4'
                        >
                          <Avatar>
                            <AvatarImage
                              src={`https://api.dicebear.com/6.x/initials/svg?seed=${employee.first_name} ${employee.last_name}`}
                            />
                            <AvatarFallback>
                              {employee.first_name[0]}
                              {employee.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className='flex-1 space-y-1'>
                            <p className='text-sm font-medium leading-none'>
                              {employee.first_name} {employee.last_name}
                            </p>
                            <p className='text-xs text-muted-foreground'>
                              {employee.email}
                            </p>
                          </div>
                        </div>
                      ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='projects'>
            <Card>
              <CardHeader>
                <CardTitle>Projects & Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div>
                    <h3 className='text-lg font-semibold'>
                      Total Projects: {dashboardDetails?.total_projects}
                    </h3>
                  </div>
                  <div>
                    <h3 className='mb-2 text-lg font-semibold'>Task Status:</h3>
                    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                      <Card>
                        <CardContent className='pt-6'>
                          <div className='flex items-center justify-between'>
                            <AlertCircle className='h-8 w-8 text-blue-500' />
                            <div className='text-right'>
                              <p className='text-2xl font-bold'>
                                {dashboardDetails?.total_tasks}
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                Total Tasks
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className='pt-6'>
                          <div className='flex items-center justify-between'>
                            <CheckCircle className='h-8 w-8 text-green-500' />
                            <div className='text-right'>
                              <p className='text-2xl font-bold'>
                                {dashboardDetails?.completed_tasks}
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                Completed
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className='pt-6'>
                          <div className='flex items-center justify-between'>
                            <Clock className='h-8 w-8 text-yellow-500' />
                            <div className='text-right'>
                              <p className='text-2xl font-bold'>
                                {dashboardDetails?.in_progress_tasks}
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                In Progress
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className='pt-6'>
                          <div className='flex items-center justify-between'>
                            <AlertCircle className='h-8 w-8 text-red-500' />
                            <div className='text-right'>
                              <p className='text-2xl font-bold'>
                                {dashboardDetails?.pending_tasks}
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                Pending
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  <div>
                    <h3 className='mb-2 text-lg font-semibold'>
                      Task Completion Progress:
                    </h3>
                    <Progress
                      value={
                        (dashboardDetails?.completed_tasks /
                          dashboardDetails?.total_tasks) *
                        100
                      }
                      className='h-4'
                    />
                    <p className='mt-2 text-sm text-muted-foreground'>
                      {Math.round(
                        (dashboardDetails?.completed_tasks /
                          dashboardDetails?.total_tasks) *
                          100
                      )}
                      % of tasks completed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Layout.Body>
    </Layout>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
  },
]
