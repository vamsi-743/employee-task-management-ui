'use client';

import { format } from 'date-fns';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

export function DatePicker({
  selected,
  onSelect,
  disabled
}: {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabled: boolean;
}) {
  const [date, setDate] = React.useState<Date | undefined>(selected);

  React.useEffect(() => {
    setDate(selected);
  }, [selected]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (!selectedDate) return;
          
            // Normalize to noon to avoid timezone shifting issues
            const normalizedDate = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              12, 0, 0 // Set time to 12:00 PM
            );
          
            console.log('Selected date (normalized):', normalizedDate);
            setDate(normalizedDate);
            onSelect(normalizedDate);
          }}          
          autoFocus
          startMonth={new Date(1950, 1)}
          endMonth={new Date(3000, 1)}
        />
      </PopoverContent>
    </Popover>
  );
}
