import { useState, useEffect } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { UserPlus, CheckCircle, Circle } from 'lucide-react'
import { Button } from '@/components/custom/button'

const steps = [
  { name: 'Validating employee data', time: 5 },
  { name: 'Creating employees', time: 4 },
]

export default function BulkEmployeeCreationModalBtn({
  isOpen,
  setIsOpen,
  progress,
  setProgress,
  currentStep,
  setCurrentStep,
  timeRemaining,
  setTimeRemaining,
  handleCreateSubmit,
  mutation,
}: any) {
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setProgress((prevProgress: any) => {
          if (prevProgress >= 99) {
            clearInterval(interval)
            setTimeout(() => {
              setIsOpen(false)
            }, 2000) // Close modal after 2 seconds
            return 99
          }
          const newProgress = prevProgress + 1
          setCurrentStep(Math.floor(newProgress / 25))
          setTimeRemaining(Math.max(20 - Math.floor(newProgress / 5), 0))
          return newProgress
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [isOpen])

  useEffect(() => {
    if (mutation.isPending) {
      setProgress(25)
    } else if (mutation.isSuccess) {
      setProgress(100)
    } else if (mutation.isError) {
      setProgress(0)
      setIsOpen(false) // Close modal if there's an error
    }
  }, [mutation.isPending, mutation.isSuccess, mutation.isError])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setProgress(0)
      setCurrentStep(0)
      setTimeRemaining(20)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            loading={mutation.isPending}
            className='bg-primary hover:bg-primary/90'
            onClick={handleCreateSubmit}
          >
            <UserPlus className='mr-2 h-4 w-4' />
            Bulk Create Employees
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle className='text-center text-2xl font-bold'>
              Creating Employees
            </DialogTitle>
          </DialogHeader>
          <div className='flex flex-col items-center justify-center p-4'>
            <div className='relative mb-6 h-48 w-48'>
              <svg className='h-full w-full' viewBox='0 0 100 100'>
                <circle
                  className='stroke-current text-gray-200'
                  strokeWidth='8'
                  cx='50'
                  cy='50'
                  r='40'
                  fill='transparent'
                ></circle>
                <circle
                  className='animate-pulse stroke-current text-primary'
                  strokeWidth='8'
                  strokeLinecap='round'
                  cx='50'
                  cy='50'
                  r='40'
                  fill='transparent'
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                ></circle>
              </svg>
              <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-3xl font-bold'>
                {`${Math.round(progress)}%`}
              </div>
            </div>
            <div className='w-full space-y-4'>
              {steps.map((step, index) => (
                <div key={index} className='space-y-1'>
                  <div className='flex items-center space-x-2'>
                    {index < currentStep ? (
                      <CheckCircle className='h-5 w-5 text-green-500' />
                    ) : index === currentStep ? (
                      <Circle className='h-5 w-5 animate-pulse text-primary' />
                    ) : (
                      <Circle className='h-5 w-5 text-gray-300' />
                    )}
                    <span
                      className={
                        index <= currentStep
                          ? 'font-medium text-primary'
                          : 'text-gray-500'
                      }
                    >
                      {step.name}
                    </span>
                  </div>
                  <Progress
                    value={
                      index < currentStep
                        ? 100
                        : index === currentStep
                          ? (progress % 25) * 4
                          : 0
                    }
                    className='h-2'
                  />
                </div>
              ))}
            </div>
            <p className='mt-6 text-center text-lg font-medium text-gray-700'>
              {`${steps[currentStep].name}... Estimated time remaining: ${timeRemaining} seconds`}
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => handleOpenChange(false)}
              className='bg-gray-500 hover:bg-gray-600'
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
