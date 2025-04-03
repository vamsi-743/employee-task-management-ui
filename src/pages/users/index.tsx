import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'

import { useQuery } from '@tanstack/react-query'
import { getAllEmployees, getAllUsers } from '@/http/api'
import EmployeeSearch from '@/components/employee-search'
import UserManagement from '@/pages/users/components/user-management'



export default function Users() {

  const user = JSON.parse(localStorage.getItem('user') || '{}') 
  console.log("user",user)
  const payload = { organization_id: user.organization_id }; 

  const {
    data: usersResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userslist', payload],
    queryFn: () => getAllUsers(payload),
  })
  const users = usersResponse?.data || []
  console.log(users)
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
            <h2 className='text-2xl font-bold tracking-tight'>Users</h2>
            <p className='text-muted-foreground'>Manage users</p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
            <UserManagement usersList={users} />
        </div>
      </Layout.Body>
    </Layout>
  )
}
