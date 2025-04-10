import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import {
  ArrowLeft,
  MoreHorizontal,
  Pencil,
  Download,
  Calendar,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'

import PersonalInfoBtn from '@/components/personal-info-btn'
import LoanTable from './loan-table'
import SalaryInfoBtn from './salary-info-btn'
import EmployeeActionBtn from './employee-action-btn'
import TaskTable from './task-table'
import BasicInfoBtn from './basic-info-btn'

export default function EmployeeProfile({
  employeeId,
  employeeProfile,
}: {
  employeeId: string
  employeeProfile: any
}) {
  const [activeTab, setActiveTab] = useState('overview')
  console.log(employeeProfile)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB') // en-GB locale formats date as dd/mm/yyyy
  }

  return (
    <div className='mx-auto w-full max-w-7xl space-y-8 p-6'>
      <header className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div>
            <h1 className='text-2xl font-bold'>
              {employeeProfile?.first_name} {employeeProfile?.last_name}
            </h1>
            <p className='text-sm text-muted-foreground'>
              EMP. ID: {employeeId}
            </p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          {/* <Button variant='outline'>Add</Button> */}
          <EmployeeActionBtn employeeId={employeeId} />
        </div>
      </header>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='space-y-4'
      >
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='salary'>Salary Details</TabsTrigger>
          
          {/* <TabsTrigger value='loans'>Loans</TabsTrigger> */}
          <TabsTrigger value='tasks'>Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Card>
              <CardContent className='p-6'>
                <div className='mb-6 flex items-start justify-between'>
                  <Avatar className='h-20 w-20'>
                    <AvatarImage
                      src='/placeholder.svg'
                      alt={`${employeeProfile?.first_name ?? ''} ${employeeProfile?.last_name ?? ''}`}
                    />
                    <AvatarFallback>
                      {employeeProfile?.first_name?.charAt(0) ?? ''}
                      {employeeProfile?.last_name?.charAt(0) ?? ''}
                    </AvatarFallback>
                  </Avatar>
                  {Object.keys(employeeProfile || {}).length > 0 && (
                    <BasicInfoBtn employeeProfile={employeeProfile} />
                  )}
                </div>
                <h2 className='mb-1 text-2xl font-bold'>
                  {employeeProfile?.first_name} {employeeProfile?.last_name} 
                </h2>
                <p className='mb-4 text-sm text-muted-foreground'>
                  {employeeProfile?.designation_name}
                </p>
                <div className='space-y-3 text-sm'>
                  <div className='flex items-center space-x-2'>
                    <Mail className='h-4 w-4 text-muted-foreground' />
                    <span>{employeeProfile?.email}</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Badge variant='secondary'>{employeeProfile?.gender}</Badge>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Calendar className='h-4 w-4 text-muted-foreground' />
                    <span>
                      Joined on {formatDate(employeeProfile?.date_of_joining)}
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Badge variant='outline'>
                      {employeeProfile?.department_name}
                    </Badge>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <MapPin className='h-4 w-4 text-muted-foreground' />
                    <span>{employeeProfile?.work_location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-lg font-semibold'>
                  Personal Information
                </CardTitle>
                {Object.keys(employeeProfile || {}).length > 0 && (
                  <PersonalInfoBtn employeeProfile={employeeProfile} />
                )}
              </CardHeader>
              <CardContent className='pt-2'>
                <div className='space-y-3 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Date of Birth</span>
                    <span>{formatDate(employeeProfile?.date_of_birth)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Father's Name</span>
                    <span>{employeeProfile?.fathers_name}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>PAN</span>
                    <span>{employeeProfile?.pan}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Personal Email
                    </span>
                    <span>{employeeProfile?.personal_email}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Mobile Number</span>
                    <span>{employeeProfile?.mobile_number}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Residential Address
                    </span>
                    <span className='text-right'>
                      {employeeProfile?.address_line1}
                      <br />
                      {employeeProfile?.address_line2}
                      <br />
                      {employeeProfile?.city} {employeeProfile?.state} -{' '}
                      {employeeProfile?.pincode}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='salary'>
          <SalaryDetails employeeProfile={employeeProfile} />
        </TabsContent>

        {/* <TabsContent value='loans'>
          <LoanTable
            employeeId={employeeId}
            loans={employeeProfile?.loanHistory || []}
            employees={[]}
            employeeProfile={employeeProfile}
          />
        </TabsContent> */}
        <TabsContent value='tasks'>
          <TaskTable tasks={employeeProfile?.tasks || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SalaryDetails({ employeeProfile }: { employeeProfile: any }) {
  const monthlyCtc = employeeProfile?.annual_ctc
    ? (employeeProfile.annual_ctc / 12).toFixed(0)
    : '0'
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-xl font-semibold'>Salary Details</CardTitle>
        <SalaryInfoBtn employeeProfile={employeeProfile} />
      </CardHeader>
      <CardContent className='pt-2'>
        <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='rounded-lg bg-secondary p-4'>
            <p className='mb-1 text-sm text-muted-foreground'>ANNUAL CTC</p>
            <p className='text-3xl font-bold'>₹{employeeProfile?.annual_ctc}</p>
            <p className='text-sm text-muted-foreground'>per year</p>
          </div>
          <div className='rounded-lg bg-secondary p-4'>
            <p className='mb-1 text-sm text-muted-foreground'>MONTHLY CTC</p>
            <p className='text-3xl font-bold'>{`₹${monthlyCtc}`}</p>
            <p className='text-sm text-muted-foreground'>per month</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
