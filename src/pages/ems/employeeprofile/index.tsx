import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'




import { useParams } from 'react-router-dom'
import { emsGetEmployeeById, getEmployeeById } from '@/http/api'
import { useQuery } from '@tanstack/react-query'
import EmployeeProfile from './components/employee-profile'
import EmployeeSearch from '../components/employee-search'
import { useEmsAuth } from '@/hooks/use-auth'
import { UserNav } from '../components/user-nav'

export default function EmployeeProfilePage() {
  const { employeeId } = useParams()
  const { user } = useEmsAuth()
  const payload = { organization_id: user.organization_id }

  const {
    data: employeeProfileResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['emsEmployeeProfile', employeeId],
    queryFn: () => emsGetEmployeeById(employeeId as string, payload),
  })
  const employeeProfile = employeeProfileResponse?.data || {}
  console.log('emsEmployeeProfile', employeeProfile)
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
