import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'


import { useQuery } from '@tanstack/react-query'
import { emsGetAllProjects, getAllDesignations } from '@/http/api'

import DepartmentsTable from '@/components/departments-table'
import DesignationTable from '@/components/designation-table'
import { useAuth, useEmsAuth } from '@/hooks/use-auth'
import ProjectsTable from './components/projects-table'
import { UserNav } from '../components/user-nav'
import EmployeeSearch from '../components/employee-search'

export default function Projects() {
  const {user} = useEmsAuth()
  console.log('user', user)
  const payload = { organization_id: user.organization_id }

  const {
    data: projectsResponse,
    isLoading,
    error,
    
  } = useQuery({
    queryKey: ['ems_projects'],
    queryFn: () => emsGetAllProjects(payload),
  })
  const projectsList = projectsResponse?.data || []
  console.log('projects', projectsList) 
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
            <h2 className='text-2xl font-bold tracking-tight'>Projects</h2>
            <p className='text-muted-foreground'>Manage projects</p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <ProjectsTable
            organization_id={user.organization_id}
            projectsList={projectsList}
          />
        </div>
      </Layout.Body>
    </Layout>
  )
}
