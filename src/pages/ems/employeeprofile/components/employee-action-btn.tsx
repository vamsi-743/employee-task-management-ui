import { useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MoreHorizontal, UserMinus, UserX } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteEmsEmployee, employeeExit } from '@/http/api'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/custom/button'
import { useNavigate } from 'react-router-dom'

export default function EmployeeActionBtn({
  employeeId,
}: {
  employeeId: string
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isExitModalOpen, setIsExitModalOpen] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const exitMutation = useMutation({
    mutationFn: ({ data }: { data: any }) => employeeExit(employeeId, data),
    onSuccess: () => {
      toast({
        title: 'Employee exit successfully',
        description: 'Employee has been successfully exited.',
        variant: 'success',
      })
      setIsExitModalOpen(false)
      queryClient.invalidateQueries({
        queryKey: ['employeeProfile', employeeId],
      })
      queryClient.invalidateQueries({
        queryKey: ['employees'],
      })
      navigate('/tasks')
    },
    onError: (error) => {
      toast({
        title: 'Employee exit failed',
        description: 'Failed to exit employee.',
        variant: 'destructive',
      })
      console.log('employee exit failed', error)
    },
  })
  const deleteMutation = useMutation({
    mutationFn: () => deleteEmsEmployee(employeeId),
    onSuccess: () => {
      toast({
        title: 'Employee deleted successfully',
        description: 'Employee has been successfully deleted.',
        variant: 'success',
      })
      setIsDeleteModalOpen(false)

      queryClient.invalidateQueries({
        queryKey: ['employees'],
      })
      navigate('/tasks')
    },
    onError: (error) => {
      toast({
        title: 'Employee deletion failed',
        description: 'Failed to delete employee.',
        variant: 'destructive',
      })
      console.log('employee deletion failed', error)
    },
  })
  const handleDeleteConfirm = () => {
    // Implement delete logic here
    console.log('Employee deleted')
    deleteMutation.mutate()
  }

  const handleExitConfirm = () => {
    // Implement exit logic here
    console.log('Employee exited')
    exitMutation.mutate({ data: { status: 0 } })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <MoreHorizontal className='h-5 w-5' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56'>
          <DropdownMenuItem onSelect={() => setIsExitModalOpen(true)}>
            <UserMinus className='mr-2 h-4 w-4' />
            <span>Exit Employee</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsDeleteModalOpen(true)}>
            <UserX className='mr-2 h-4 w-4' />
            <span>Delete Employee</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isExitModalOpen} onOpenChange={setIsExitModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Exit Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to exit this employee? This will mark them
              as no longer employed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsExitModalOpen(false)}>
              Cancel
            </Button>
            <Button
              loading={exitMutation.isPending}
              variant='default'
              onClick={handleExitConfirm}
            >
              Confirm Exit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
