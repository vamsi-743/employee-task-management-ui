// EMS Routes

import EmsProtectedRoute from '@/components/ems-protected-route'
import AllTasks from '@/pages/ems/alltasks'
import BulkEmployee from '@/pages/ems/bulk-employee'
import CreateTask from '@/pages/ems/create-task'
import CreateEmployee from '@/pages/ems/createemployee'
import Dashboard from '@/pages/ems/dashboard'
import Departments from '@/pages/ems/departments'
import Designation from '@/pages/ems/designation'
import Employees from '@/pages/ems/employee'
import EmployeeProfilePage from '@/pages/ems/employeeprofile'
import MyTasks from '@/pages/ems/my-tasks'
import Projects from '@/pages/ems/projects'
import TaskDetails from '@/pages/ems/task-details'

const emsRouter = [
  {
    path: '/ems/sign-in',
    lazy: async () => ({
      Component: (await import('../pages/ems/auth/sign-in')).default,
    }),
  },
  {
    path: '/ems/sign-in-2',
    lazy: async () => ({
      Component: (await import('../pages/ems/auth/sign-in-2')).default,
    }),
  },
  {
    path: '/ems/sign-up',
    lazy: async () => ({
      Component: (await import('../pages/ems/auth/sign-up')).default,
    }),
  },
  {
    path: '/ems/forgot-password',
    lazy: async () => ({
      Component: (await import('../pages/ems/auth/forgot-password')).default,
    }),
  },
  {
    path: '/ems/otp',
    lazy: async () => ({
      Component: (await import('../pages/ems/auth/otp')).default,
    }),
  },
  {
    path: '/ems',
    lazy: async () => {
      const AppShell = await import('../pages/ems/app-shell')
      return { Component: AppShell.default }
    },
    // errorElement: <GeneralError />,
    children: [
      {
        index: true,
        element: (
          <EmsProtectedRoute allowedRoles={['ems_admin']}>
            <Dashboard />
          </EmsProtectedRoute>
        ),
      },
      {
        path: '/ems/create-task',
        element: (
          <EmsProtectedRoute allowedRoles={['ems_admin']}>
            <CreateTask />
          </EmsProtectedRoute>
        ),
      },
      {
        path: '/ems/alltasks',
        element: (
          <EmsProtectedRoute allowedRoles={['ems_admin']}>
            <AllTasks />
          </EmsProtectedRoute>
        ),
      },
      {
        path: '/ems/task-details/:taskId',
        element: (
          <EmsProtectedRoute allowedRoles={['ems_admin']}>
            <TaskDetails />
          </EmsProtectedRoute>
        ),
      },
      {
        path: '/ems/employees',
        element: (
          <EmsProtectedRoute allowedRoles={['ems_admin']}>
            <Employees />
          </EmsProtectedRoute>
        ),
      },
      {
        path: '/ems/create-employee',
        element: (
          <EmsProtectedRoute allowedRoles={['ems_admin']}>
            <CreateEmployee />
          </EmsProtectedRoute>
        ),
      },
      {
        path: '/ems/bulk-employee',
        element: (
          <EmsProtectedRoute allowedRoles={['ems_admin']}>
            <BulkEmployee />
          </EmsProtectedRoute>
        ),
      },
      {
        path: '/ems/employee-profile/:employeeId',
        element: (
          <EmsProtectedRoute allowedRoles={['ems_admin']}>
            <EmployeeProfilePage />
          </EmsProtectedRoute>
        ),
      },
      {
        path: '/ems/department',
        element: (
          <EmsProtectedRoute allowedRoles={['ems_admin']}>
            <Departments />
          </EmsProtectedRoute>
        ),
      },
      {
        path: '/ems/designation',
        element: (
          <EmsProtectedRoute allowedRoles={['ems_admin']}>
            <Designation />
          </EmsProtectedRoute>
        ),
      },
      {
        path: '/ems/mytasks',
        element: (
          <EmsProtectedRoute allowedRoles={['ems_employee']}>
            <MyTasks />
          </EmsProtectedRoute>
        ),
      },
      {
        path: '/ems/projects',
        element: (
          <EmsProtectedRoute allowedRoles={['ems_admin']}>
            <Projects />
          </EmsProtectedRoute>
        ),
      },
    ],
  },
]

export default emsRouter
