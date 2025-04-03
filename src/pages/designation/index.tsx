import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'

import { useQuery } from '@tanstack/react-query'
import { getAllDesignations } from '@/http/api'
import EmployeeSearch from '@/components/employee-search'
import DepartmentsTable from '@/components/departments-table'
import DesignationTable from '@/components/designation-table'
import { useAuth } from '@/hooks/use-auth'

export default function Designation() {
  const {user} = useAuth()
  console.log('user', user)
  const payload = { organization_id: user.organization_id }

  const {
    data: designationResponse,
    isLoading,
    error,
    
  } = useQuery({
    queryKey: ['designations'],
    queryFn: () => getAllDesignations(payload),
  })
  const designationsList = designationResponse?.data || []
  console.log('designations', designationsList)
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
            <h2 className='text-2xl font-bold tracking-tight'>Designations</h2>
            <p className='text-muted-foreground'>Manage designations</p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <DesignationTable
            organization_id={user.organization_id}
            designationsList={designationsList}
          />
        </div>
      </Layout.Body>
    </Layout>
  )
}
