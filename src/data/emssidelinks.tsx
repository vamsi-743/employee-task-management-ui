import { useAuth, useEmsAuth } from '@/hooks/use-auth'
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
  IconSubtask,
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
const { user } = useEmsAuth()
console.log('user in sidelinks', user)

export const emssidelinks: SideLink[] = [
  ...(user?.user_role === 'ems_admin'
    ? [
        {
          title: 'Dashboard',
          label: '',
          href: '/ems',
          icon: <IconLayoutDashboard size={18} />,
        },
        {
          title: 'Task Management',
          label: '',
          href: '/ems/task-management',
          icon: <IconSubtask size={18} />,
          sub: [
            {
              title: 'Create Task',
              label: '',
              href: '/ems/create-task',
              icon: <IconHexagonNumber1 size={18} />,
            },
            {
              title: 'All Tasks',
              label: '',
              href: '/ems/alltasks',
              icon: <IconHexagonNumber2 size={18} />,
            },
          ],
        },
        {
          title: 'Employee',
          label: '3',
          href: '/ems/employees',
          icon: <User size={18} />,
          sub: [
            {
              title: 'Add Employee',
              label: '',
              href: '/ems/create-employee',
              icon: <IconHexagonNumber1 size={18} />,
            },
            {
              title: 'Edit Employee',
              label: '',
              href: '/ems/employees',
              icon: <IconHexagonNumber2 size={18} />,
            },
            {
              title: 'Bulk Employee',
              label: '',
              href: '/ems/bulk-employee',
              icon: <IconHexagonNumber3 size={18} />,
            },
          ],
        },
        {
          title: 'Masters',
          label: '3',
          href: '/masters',
          icon: <User size={18} />,
          sub: [
            {
              title: 'Department',
              label: '',
              href: '/ems/department',
              icon: <IconHexagonNumber1 size={18} />,
            },
            {
              title: 'Designation',
              label: '',
              href: '/ems/designation',
              icon: <IconHexagonNumber1 size={18} />,
            },
            {
              title: 'Projects',
              label: '',
              href: '/ems/projects',
              icon: <IconHexagonNumber1 size={18} />,
            },
          ],
        },
      ]
    : [
        {
          title: 'My Tasks',
          label: '3',
          href: '/ems/mytasks',
          icon: <User size={18} />,
        },
      ]),
]
