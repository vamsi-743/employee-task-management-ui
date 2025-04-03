import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'


import { useQuery } from '@tanstack/react-query'
import { getAllEmployees } from '@/http/api'

import BulkEmployeeEntry from './components/bulk-employee-entry'
import EmployeeSearch from '../components/employee-search'
import { UserNav } from '../components/user-nav'

export default function BulkEmployee() {
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
            <h2 className='text-2xl font-bold tracking-tight'>Bulk Employee Creation</h2>
            <p className='text-muted-foreground'>Manage salary</p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <BulkEmployeeEntry />
        </div>
      </Layout.Body>
    </Layout>
  )
}
