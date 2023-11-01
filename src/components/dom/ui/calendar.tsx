'use client';

import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/helpers/cn';
import { buttonVariants } from '@/components/dom/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      style={{
        fontFamily: 'sans-serif',
      }}
      showOutsideDays={showOutsideDays}
      className={cn('pointer-events-auto select-none p-3 font-sans', className)}
      classNames={{
        months:
          'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 font-sans',
        month: 'space-y-4 font-sans',
        caption: 'flex justify-center pt-1 relative items-center font-sans',
        caption_label: 'text-sm font-medium font-sans',
        nav: 'space-x-1 flex items-center font-sans',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 font-sans'
        ),
        nav_button_previous: 'absolute left-1 font-sans',
        nav_button_next: 'absolute right-1 font-sans',
        table: 'w-full border-collapse space-y-1 font-sans',
        head_row: 'flex font-sans',
        head_cell:
          'text-muted-foreground rounded-md w-9 font-semibold  text-[0.8rem] font-sans',
        row: 'flex w-full mt-2 font-sans',
        cell: 'h-9 w-9 text-center text-sm p-0 relative select-none [&:has([aria-selected])]:bg-muted  first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20  font-sans',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0  aria-selected:opacity-100 font-sans'
        ),
        day_selected:
          'bg-muted text-primary-foreground hover:bg-subtle  hover:text-primary-foreground focus:outline-1 focus:outline focus:outline-white/50 focus:bg-subtle focus:text-primary-foreground font-sans ',
        day_today: 'bg-subtle text-accent-foreground font-sans',
        day_outside: 'text-muted-foreground opacity-50 font-sans',
        day_disabled: 'text-muted-foreground opacity-50 font-sans',
        day_range_middle:
          'aria-selected:bg-subtle aria-selected:text-accent-foreground font-sans',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <span className="icon-[mdi--chevron-left] h-4 w-4" />
        ),
        IconRight: ({ ...props }) => (
          <span className="icon-[mdi--chevron-right] h-4 w-4" />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
