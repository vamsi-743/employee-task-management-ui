import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'

import EmployeeSearch from '@/components/employee-search'
import EmployeeProfile from '@/pages/employeeprofile/components/employee-profile'
import { useParams } from 'react-router-dom'
import { getEmployeeById } from '@/http/api'
import { useQuery } from '@tanstack/react-query'

export default function EmployeeProfilePage() {
  const { employeeId } = useParams()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const payload = { organization_id: user.organization_id }

  const {
    data: employeeProfileResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['employeeProfile', employeeId],
    queryFn: () => getEmployeeById(employeeId as string, payload),
  })
  const employeeProfile = employeeProfileResponse?.data || {}
  console.log('employeeProfile', employeeProfile)
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <div className='ml-auto flex items-center space-x-4'>
          <EmployeeSearch />
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Employee Profile
            </h2>
            <p className='text-muted-foreground'>View employee profile</p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <EmployeeProfile
            employeeId={employeeId as string}
            employeeProfile={employeeProfile}
          />
        </div>
      </Layout.Body>
    </Layout>
  )
}
