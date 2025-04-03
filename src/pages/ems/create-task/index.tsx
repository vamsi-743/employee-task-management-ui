import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'

import { useQuery } from '@tanstack/react-query'
import {
  emsGetAllEmployees,
  emsGetAllProjects,
} from '@/http/api'

import DepartmentsTable from '@/components/departments-table'
import { useAuth, useEmsAuth } from '@/hooks/use-auth'
import TaskForm from './components/task-form'
import { UserNav } from '../components/user-nav'
import EmployeeSearch from '../components/employee-search'

export default function CreateTask() {
  const { user } = useEmsAuth()
  console.log('user', user)
  const payload = { organization_id: user.organization_id }

  const {
    data: projectsResponse,
    isLoading: projectsIsLoading,
    error: projectsError,
  } = useQuery({
    queryKey: ['ems_projects'],
    queryFn: () => emsGetAllProjects(payload),
  })
  const projectsList = projectsResponse?.data || []
  console.log('projects', projectsList)
  const {
    data: employeesResponse,
    isLoading: employeesIsLoading,
    error: employeesError,
  } = useQuery({
    queryKey: ['ems_employees'],
    queryFn: () => emsGetAllEmployees(payload),
  })
  const employees = employeesResponse?.data || []
  console.log(employees)
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
            <h2 className='text-2xl font-bold tracking-tight'>Create Task</h2>
            <p className='text-muted-foreground'>Create a new task</p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <TaskForm projectsList={projectsList} employees={employees} />
        </div>
      </Layout.Body>
    </Layout>
  )
}
