import {
  addDays,
  addMonths,
  format,
  isSameMonth,
  isToday,
  type Locale,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Dot } from 'lucide-react'
import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from 'motion/react'
import { useMemo, useState } from 'react'

import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const useCalendar = (selectedMonth: Date, locale: Locale) => {
  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { locale })
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i))
  }, [locale])

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(selectedMonth), { locale })
    return Array.from({ length: 42 }).map((_, i) => addDays(start, i))
  }, [selectedMonth, locale])

  return { weekDays, days }
}

const useCalendarMotion = () => {
  const variants: Variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
    }),
  }

  const transition: Transition = {
    x: { type: 'spring', stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
  }

  return { variants, transition }
}

type CalendarProps = {
  month: Date
  locale: Locale
  onClick: (options: {
    date: Date
    event: React.MouseEvent<HTMLButtonElement>
  }) => void
  animateDirection?: number
}
const Calendar:React.FC<CalendarProps> = ({
  month,
  locale,
  onClick,
  animateDirection = 1,
}) => {
  const { weekDays, days } = useCalendar(month, locale)
  const { variants, transition } = useCalendarMotion()

  return (
    <div className="relative px-2">
      <AnimatePresence
        initial={false}
        mode="popLayout"
        custom={animateDirection}
      >
        <motion.div
          key={month.toString()}
          custom={animateDirection}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
        >
          <div className="mb-4 text-center font-medium">
            {new Intl.DateTimeFormat(locale.code, {
              year: 'numeric',
              month: 'long',
            }).format(month)}
          </div>
          <div className="mb-2 grid grid-cols-7">
            {weekDays.map((date) => (
              <div
                key={date.toString()}
                className="text-center text-sm font-medium text-muted-foreground"
              >
                {format(date, 'EEEEE', { locale })}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((date) => (
              <div key={date.toISOString()} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    onClick({ date, event: e })}
                  className={cn(
                    !isSameMonth(date, month) && 'text-muted-foreground/25',
                  )}
                >
                  {format(date, 'd')}
                </Button>
                {isToday(date) && (
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none">
                    <Dot />
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

type ComponentProps = {
  locale: Locale
  onClick?: (options: {
    date: Date
    event: React.MouseEvent<HTMLButtonElement>
  }) => void
  numberOfMonths?: number
}
export const Component:React.FC<ComponentProps> = ({
  locale,
  onClick = () => {},
  numberOfMonths = 1,
}) => {
  const [month, setMonth] = useState(new Date())
  const [animateDirection, setAnimateDirection] = useState(0)

  const handleNextMonth = () => {
    setAnimateDirection(1)
    setMonth((prev) => addMonths(prev, 1))
  }
  const handlePrevMonth = () => {
    setAnimateDirection(-1)
    setMonth((prev) => subMonths(prev, 1))
  }

  const calendarSlotKeys = [...Array(numberOfMonths)].map(
    (_, index) => `calendar-slot-${index}`,
  )

  return (
    <Card size="sm" className="pt-2! pb-0! overflow-hidden">
      <CardContent className="relative py-2! px-0!">
        <div className="z-10 absolute top-0 left-0 py-0 px-2 w-full flex justify-between">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
            <span className="sr-only">Previous Month</span>
            <ChevronLeft />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNextMonth}>
            <span className="sr-only">Next Month</span>
            <ChevronRight />
          </Button>
        </div>
        <div className="flex divide-x divide-border">
          {[...Array(numberOfMonths)].map((_, index) => {
            const displayMonth = addMonths(month, index)
            return (
              <Calendar
                key={calendarSlotKeys[index]}
                month={displayMonth}
                locale={locale}
                onClick={onClick}
                animateDirection={animateDirection}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
};
