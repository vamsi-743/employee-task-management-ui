import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'

import { useQuery } from '@tanstack/react-query'
import { getAllDepartments, getAllEmployees } from '@/http/api'
import EmployeeSearch from '@/components/employee-search'
import DepartmentsTable from '@/components/departments-table'
import { useAuth } from '@/hooks/use-auth'

export default function Departments() {
  const {user} = useAuth()
  console.log('user', user)
  const payload = { organization_id: user.organization_id }

  const {
    data: departmentsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['departments'],
    queryFn: () => getAllDepartments(payload),
  })
  const departmentsList = departmentsResponse?.data || []
  console.log('departments', departmentsList)
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
            <h2 className='text-2xl font-bold tracking-tight'>Departments</h2>
            <p className='text-muted-foreground'>Manage departments</p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DepartmentsTable organization_id={user.organization_id} departmentsList={departmentsList} />
        </div>
      </Layout.Body>
    </Layout>
  )
}
