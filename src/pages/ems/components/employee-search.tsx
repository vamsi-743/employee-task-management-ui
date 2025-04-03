import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { emsGetAllEmployees, getAllEmployees } from '@/http/api'
import { Employee } from '@/pages/tasks/data/schema'
import { useEmsAuth } from '@/hooks/use-auth'

export default function EmployeeSearch() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const componentRef = useRef<HTMLDivElement>(null)
  const { user } = useEmsAuth()
  const payload = { organization_id: user.organization_id }

  const {
    data: employeesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['ems_employees'],
    queryFn: () => emsGetAllEmployees(payload),
  })

  const employees = employeesResponse?.data || []

  const filteredEmployees = employees.filter(
    (employee: any) =>
      employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.EMS_employee_id.toLowerCase().includes(
        searchTerm.toLowerCase()
      ) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setSearchTerm('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleEmployeeClick = (employeeId: string) => {
    navigate(`/ems/employee-profile/${employeeId}`)
    setSearchTerm('')
  }

  return (
    <div className='relative mx-auto w-full max-w-sm' ref={componentRef}>
      <div className='relative'>
        <Search
          className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400 dark:text-gray-500'
          size={18}
        />
        <Input
          placeholder='Search employees'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='border-gray-300 bg-gray-100 pl-10 text-black focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white'
          aria-label='Search employees'
          aria-expanded={searchTerm.length > 0 && filteredEmployees.length > 0}
        />
      </div>
      {searchTerm.length > 0 && (
        <div className='absolute left-0 right-0 z-10 mt-1 overflow-y-auto rounded-md border border-gray-300 bg-gray-100 shadow-lg dark:border-gray-700 dark:bg-gray-800'>
          <ScrollArea className='max-h-60'>
            {isLoading ? (
              <div className='flex items-center justify-center p-4'>
                <Loader2 className='h-6 w-6 animate-spin text-primary' />
              </div>
            ) : error ? (
              <p className='p-4 text-center text-sm text-red-500'>
                Error loading employees. Please try again.
              </p>
            ) : filteredEmployees.length > 0 ? (
              <ul className='py-1'>
                {filteredEmployees.map((employee: any) => (
                  <li
                    key={employee.EMS_employee_id}
                    className='cursor-pointer px-4 py-2 transition-colors duration-150 ease-in-out hover:bg-gray-300 dark:hover:bg-gray-700'
                    onClick={() =>
                      handleEmployeeClick(employee.EMS_employee_id)
                    }
                  >
                    <div className='text-sm font-medium text-black dark:text-white'>
                      {employee.first_name + ' ' + employee.last_name}
                    </div>
                    <div className='text-xs text-gray-600 dark:text-gray-400'>
                      {employee.EMS_employee_id}
                    </div>
                    <div className='text-xs text-gray-700 dark:text-gray-500'>
                      {employee.email}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='p-4 text-center text-sm text-gray-600 dark:text-gray-400'>
                No employees found
              </p>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
