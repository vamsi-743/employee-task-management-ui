import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'

import { useQuery } from '@tanstack/react-query'
import { getAllEmployees, getAllLoans } from '@/http/api'
import EmployeeSearch from '@/components/employee-search'
import LoanCreate from '@/components/loan-create'
import { useAuth } from '@/hooks/use-auth'

export default function Loan() {
  const { user } = useAuth()
  const {
    data: loansResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['loans'],
    queryFn: () => getAllLoans({ organization_id: user.organization_id }),
  })

  const loans = loansResponse?.data || []

  const {data: employeesResponse, isLoading: isEmployeesLoading, error: employeesError} = useQuery({
    queryKey: ['employees'],
    queryFn: () => getAllEmployees({ organization_id: user.organization_id }),
  })

  const employees = employeesResponse?.data || []

  
  console.log('loans', loans)
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
              Loan Management
            </h2>
            <p className='text-muted-foreground'>Manage employee loans</p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <LoanCreate  loans={loans} employees={employees}/>
        </div>
      </Layout.Body>
    </Layout>
  )
}
