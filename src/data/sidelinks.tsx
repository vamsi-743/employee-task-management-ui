import { useAuth } from '@/hooks/use-auth'
import {
  IconApps,
  IconBarrierBlock,
  IconBoxSeam,
  IconChartHistogram,
  IconChecklist,
  IconComponents,
  IconError404,
  IconExclamationCircle,
  IconHexagonNumber1,
  IconHexagonNumber2,
  IconHexagonNumber3,
  IconHexagonNumber4,
  IconHexagonNumber5,
  IconLayoutDashboard,
  IconMessages,
  IconRouteAltLeft,
  IconServerOff,
  IconSettings,
  IconTruck,
  IconUserShield,
  IconUsers,
  IconLock,
} from '@tabler/icons-react'
import { User } from 'lucide-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}
const { user } = useAuth()
console.log('user in sidelinks', user)

export const sidelinks: SideLink[] = [
  ...(user?.user_role === 'admin'
    ? [
        {
          title: 'Dashboard',
          label: '',
          href: '/',
          icon: <IconLayoutDashboard size={18} />,
        },
        {
          title: 'Users',
          label: '',
          href: '/users',
          icon: <IconUsers size={18} />,
        },
        {
          title: 'Employee',
          label: '3',
          href: '/tasks',
          icon: <User size={18} />,
          sub: [
            {
              title: 'Add Employee',
              label: '',
              href: '/create-employee',
              icon: <IconHexagonNumber1 size={18} />,
            },
            {
              title: 'Edit Employee',
              label: '',
              href: '/tasks',
              icon: <IconHexagonNumber2 size={18} />,
            },
            {
              title: 'Bulk Employee',
              label: '',
              href: '/bulk-employee',
              icon: <IconHexagonNumber3 size={18} />,
            },
          ],
        },
      ]
    : [
        {
          title: 'Employee',
          label: '3',
          href: '/tasks',
          icon: <User size={18} />,
          sub: [
            {
              title: 'Add Employee',
              label: '',
              href: '/create-employee',
              icon: <IconHexagonNumber1 size={18} />,
            },
            {
              title: 'Edit Employee',
              label: '',
              href: '/tasks',
              icon: <IconHexagonNumber2 size={18} />,
            },
            {
              title: 'Bulk Employee',
              label: '',
              href: '/bulk-employee',
              icon: <IconHexagonNumber3 size={18} />,
            },
          ],
        },
        {
          title: 'Financial Deparment',
          label: '3',
          href: '/tasks',
          icon: <User size={18} />,
          sub: [
            {
              title: 'Loan',
              label: '',
              href: '/loan',
              icon: <IconHexagonNumber1 size={18} />,
            },
            {
              title: 'Salary',
              label: '',
              href: '/salary',
              icon: <IconHexagonNumber2 size={18} />,
            },
            {
              title: 'Online Payment',
              label: '',
              href: '/online-payment',
              icon: <IconHexagonNumber3 size={18} />,
            },
          ],
        },
        // {
        //   title: 'Chats',
        //   label: '9',
        //   href: '/chats',
        //   icon: <IconMessages size={18} />,
        // },
        // {
        //   title: 'Apps',
        //   label: '',
        //   href: '/apps',
        //   icon: <IconApps size={18} />,
        // },
        // {
        //   title: 'Authentication',
        //   label: '',
        //   href: '',
        //   icon: <IconUserShield size={18} />,
        //   sub: [
        //     {
        //       title: 'Sign In (email + password)',
        //       label: '',
        //       href: '/sign-in',
        //       icon: <IconHexagonNumber1 size={18} />,
        //     },
        //     {
        //       title: 'Sign In (Box)',
        //       label: '',
        //       href: '/sign-in-2',
        //       icon: <IconHexagonNumber2 size={18} />,
        //     },
        //     {
        //       title: 'Sign Up',
        //       label: '',
        //       href: '/sign-up',
        //       icon: <IconHexagonNumber3 size={18} />,
        //     },
        //     {
        //       title: 'Forgot Password',
        //       label: '',
        //       href: '/forgot-password',
        //       icon: <IconHexagonNumber4 size={18} />,
        //     },
        //     {
        //       title: 'OTP',
        //       label: '',
        //       href: '/otp',
        //       icon: <IconHexagonNumber5 size={18} />,
        //     },
        //   ],
        // },

        // {
        //   title: 'Requests',
        //   label: '10',
        //   href: '/requests',
        //   icon: <IconRouteAltLeft size={18} />,
        //   sub: [
        //     {
        //       title: 'Trucks',
        //       label: '9',
        //       href: '/trucks',
        //       icon: <IconTruck size={18} />,
        //     },
        //     {
        //       title: 'Cargos',
        //       label: '',
        //       href: '/cargos',
        //       icon: <IconBoxSeam size={18} />,
        //     },
        //   ],
        // },
        // {
        //   title: 'Analysis',
        //   label: '',
        //   href: '/analysis',
        //   icon: <IconChartHistogram size={18} />,
        // },
        // {
        //   title: 'Extra Components',
        //   label: '',
        //   href: '/extra-components',
        //   icon: <IconComponents size={18} />,
        // },
        // {
        //   title: 'Error Pages',
        //   label: '',
        //   href: '',
        //   icon: <IconExclamationCircle size={18} />,
        //   sub: [
        //     {
        //       title: 'Not Found',
        //       label: '',
        //       href: '/404',
        //       icon: <IconError404 size={18} />,
        //     },
        //     {
        //       title: 'Internal Server Error',
        //       label: '',
        //       href: '/500',
        //       icon: <IconServerOff size={18} />,
        //     },
        //     {
        //       title: 'Maintenance Error',
        //       label: '',
        //       href: '/503',
        //       icon: <IconBarrierBlock size={18} />,
        //     },
        //     {
        //       title: 'Unauthorised Error',
        //       label: '',
        //       href: '/401',
        //       icon: <IconLock size={18} />,
        //     },
        //   ],
        // },
        {
          title: 'Masters',
          label: '3',
          href: '/masters',
          icon: <User size={18} />,
          sub: [
            {
              title: 'Department',
              label: '',
              href: '/department',
              icon: <IconHexagonNumber1 size={18} />,
            },
            {
              title: 'Designation',
              label: '',
              href: '/designation',
              icon: <IconHexagonNumber1 size={18} />,
            },
          ],
        },

        // {
        //   title: 'Settings',
        //   label: '',
        //   href: '/settings',
        //   icon: <IconSettings size={18} />,
        // },
      ]),
]
