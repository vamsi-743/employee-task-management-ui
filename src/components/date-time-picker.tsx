import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { useState } from 'react'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from './ui/select'
// import { ScrollArea } from './ui/scroll-area'

const FormSchema = z.object({
  datetime: z.date({
    required_error: 'Date & time is required!.',
  }),
})

export function DatetimePicker({}) {
    const [isOpen, setIsOpen] = useState(false)
    const [date, setDate] = useState<Date | null>(null)
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
    })
  
    async function onSubmit(data: z.infer<typeof FormSchema>) {}
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='datetime'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Datetime</FormLabel>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          `${format(field.value, 'PPP')}`
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className='flex w-auto items-start p-0'
                    align='start'
                  >
                    <Calendar
                      mode='single'
                      captionLayout='dropdown'
                      selected={date || field.value}
                      onSelect={(selectedDate) => {
                        setDate(selectedDate!)
                        field.onChange(selectedDate)
                      }}
                      onDayClick={() => setIsOpen(false)}
                      fromYear={2000}
                      toYear={new Date().getFullYear()}
                      disabled={(date) =>
                        Number(date) < Date.now() - 1000 * 60 * 60 * 24 ||
                        Number(date) > Date.now() + 1000 * 60 * 60 * 24 * 30
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Set your date.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Submit</Button>
        </form>
      </Form>
    )
  }
