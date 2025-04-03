import ProtectedRoute from '@/components/protected-route';
import BulkEmployee from '@/pages/bulk-employee';
import CreateEmployee from '@/pages/createemployee';
import Dashboard from '@/pages/dashboard';
import Departments from '@/pages/departments';
import Designation from '@/pages/designation';
import EmployeeProfilePage from '@/pages/employeeprofile';
import GeneralError from '@/pages/errors/general-error';
import Loan from '@/pages/loan';
import OnlinePayment from '@/pages/online-payment';
import Salary from '@/pages/salary';
import Settings from '@/pages/settings';
import Tasks from '@/pages/tasks';
import Users from '@/pages/users';
import { createBrowserRouter } from 'react-router-dom';


const payrollRouter = [
     // Auth routes
  {
    path: '/sign-in',
    lazy: async () => ({
      Component: (await import('../pages/auth/sign-in')).default,
    }),
  },
  {
    path: '/sign-in-2',
    lazy: async () => ({
      Component: (await import('../pages/auth/sign-in-2')).default,
    }),
  },
  {
    path: '/sign-up',
    lazy: async () => ({
      Component: (await import('../pages/auth/sign-up')).default,
    }),
  },
  {
    path: '/forgot-password',
    lazy: async () => ({
      Component: (await import('../pages/auth/forgot-password')).default,
    }),
  },
  {
    path: '/otp',
    lazy: async () => ({
      Component: (await import('../pages/auth/otp')).default,
    }),
  },
  {
    path: '/payroll',
    lazy: async () => {
      const AppShell = await import('../components/app-shell');
      return { Component: AppShell.default };
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: 'tasks',
        element: (
          <ProtectedRoute allowedRoles={['data entry', 'admin']}>
            <Tasks />
          </ProtectedRoute>
        ),
      },
      {
        path: 'create-employee',
        element: (
          <ProtectedRoute allowedRoles={['data entry', 'admin']}>
            <CreateEmployee />
          </ProtectedRoute>
        ),
      },
      {
        path: 'bulk-employee',
        element: (
          <ProtectedRoute allowedRoles={['data entry', 'admin']}>
            <BulkEmployee />
          </ProtectedRoute>
        ),
      },
      {
        path: 'employee-profile/:employeeId',
        element: (
          <ProtectedRoute allowedRoles={['data entry', 'admin'  ]}>
            <EmployeeProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'loan',
        element: (
          <ProtectedRoute allowedRoles={['data entry']}>
            <Loan />
          </ProtectedRoute>
        ),
      },
      {
        path: 'salary',
        element: (
          <ProtectedRoute allowedRoles={['data entry']}>
            <Salary />
          </ProtectedRoute>
        ),
      },
      {
        path: 'online-payment',
        element: (
          <>
            <OnlinePayment />
          </>
        ),
      },
      {
        path: 'department',
        element: (
          <ProtectedRoute allowedRoles={['data entry']}>
            <Departments />
          </ProtectedRoute>
        ),
      },
      {
        path: 'designation',
        element: (
          <ProtectedRoute allowedRoles={['data entry']}>
            <Designation />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute allowedRoles={['data entry']}>
            <Settings />
          </ProtectedRoute>
        ),
        errorElement: <GeneralError />,
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('../pages/settings/profile')).default,
            }),
          },
          {
            path: 'account',
            lazy: async () => ({
              Component: (await import('../pages/settings/account')).default,
            }),
          },
          {
            path: 'appearance',
            lazy: async () => ({
              Component: (await import('../pages/settings/appearance')).default,
            }),
          },
          {
            path: 'notifications',
            lazy: async () => ({
              Component: (await import('../pages/settings/notifications')).default,
            }),
          },
          {
            path: 'display',
            lazy: async () => ({
              Component: (await import('../pages/settings/display')).default,
            }),
          },
          {
            path: 'error-example',
            lazy: async () => ({
              Component: (await import('../pages/settings/error-example')).default,
            }),
            errorElement: <GeneralError className='h-[50svh]' minimal />,
          },
        ],
      },
    ],
  },
];

export default payrollRouter;
