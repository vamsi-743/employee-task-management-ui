import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function RecentSales({ employees }: { employees: any }) {
  return (
    <div className='space-y-4'>
      {employees &&
        employees.map((employee: any) => (
          <div className='flex items-center' key={employee.id}>
            <Avatar className='flex h-9 w-9 items-center justify-center space-y-0 border'>
              <AvatarImage src='/avatars/02.png' alt='Avatar' />
              <AvatarFallback>
                {employee?.first_name?.[0] + employee?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className='ml-4 space-y-1'>
              <p className='text-sm font-medium leading-none'>
                {employee.first_name} {employee.last_name}
              </p>
              <p className='text-sm text-muted-foreground'>{employee.email}</p>
            </div>
            <div className='ml-auto font-medium'>₹{employee.annual_ctc}</div>
          </div>
        ))}
    </div>
  )
}
