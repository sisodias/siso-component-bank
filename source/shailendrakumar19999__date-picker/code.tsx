"use client"
import { DatePicker } from "@ark-ui/react/date-picker"
import { Portal } from "@ark-ui/react/portal"
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react"

export const Basic = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <DatePicker.Root>
        <DatePicker.Label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Date
        </DatePicker.Label>

        {/* Input + Controls */}
        <DatePicker.Control className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
          <DatePicker.Input
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100"
            placeholder="Pick a date"
          />
          <DatePicker.Trigger className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Calendar size={18} />
          </DatePicker.Trigger>
          <DatePicker.ClearTrigger className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40">
            <X size={16} />
          </DatePicker.ClearTrigger>
        </DatePicker.Control>

        {/* Calendar Popup */}
        <Portal>
          <DatePicker.Positioner>
            <DatePicker.Content className="mt-2 w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl p-3">
              
              {/* Year + Month Select */}
              <div className="flex gap-2 mb-3">
                <DatePicker.YearSelect className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm text-gray-800 dark:text-gray-100" />
                <DatePicker.MonthSelect className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm text-gray-800 dark:text-gray-100" />
              </div>

              {/* Day View */}
              <DatePicker.View view="day">
                <DatePicker.Context>
                  {(datePicker) => (
                    <>
                      <DatePicker.ViewControl className="flex justify-between items-center mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <DatePicker.PrevTrigger className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                          <ChevronLeft size={18} />
                        </DatePicker.PrevTrigger>
                        <DatePicker.ViewTrigger className="cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                          <DatePicker.RangeText />
                        </DatePicker.ViewTrigger>
                        <DatePicker.NextTrigger className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                          <ChevronRight size={18} />
                        </DatePicker.NextTrigger>
                      </DatePicker.ViewControl>

                      <DatePicker.Table className="w-full text-center text-sm">
                        <DatePicker.TableHead>
                          <DatePicker.TableRow>
                            {datePicker.weekDays.map((weekDay, id) => (
                              <DatePicker.TableHeader
                                key={id}
                                className="py-1 text-gray-500 dark:text-gray-400"
                              >
                                {weekDay.short}
                              </DatePicker.TableHeader>
                            ))}
                          </DatePicker.TableRow>
                        </DatePicker.TableHead>
                        <DatePicker.TableBody>
                          {datePicker.weeks.map((week, id) => (
                            <DatePicker.TableRow key={id}>
                              {week.map((day, id) => (
                                <DatePicker.TableCell key={id} value={day}>
                                  <DatePicker.TableCellTrigger
                                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 focus:ring-2 focus:ring-blue-500"
                                  >
                                    {day.day}
                                  </DatePicker.TableCellTrigger>
                                </DatePicker.TableCell>
                              ))}
                            </DatePicker.TableRow>
                          ))}
                        </DatePicker.TableBody>
                      </DatePicker.Table>
                    </>
                  )}
                </DatePicker.Context>
              </DatePicker.View>

              {/* Month View */}
              <DatePicker.View view="month">
                <DatePicker.Context>
                  {(datePicker) => (
                    <>
                      <DatePicker.ViewControl className="flex justify-between items-center mb-2">
                        <DatePicker.PrevTrigger className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                          <ChevronLeft size={18} />
                        </DatePicker.PrevTrigger>
                        <DatePicker.ViewTrigger className="cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                          <DatePicker.RangeText />
                        </DatePicker.ViewTrigger>
                        <DatePicker.NextTrigger className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                          <ChevronRight size={18} />
                        </DatePicker.NextTrigger>
                      </DatePicker.ViewControl>
                      <DatePicker.Table className="w-full text-sm">
                        <DatePicker.TableBody>
                          {datePicker.getMonthsGrid({ columns: 4, format: "short" }).map((months, id) => (
                            <DatePicker.TableRow key={id}>
                              {months.map((month, id) => (
                                <DatePicker.TableCell key={id} value={month.value}>
                                  <DatePicker.TableCellTrigger className="px-2 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800">
                                    {month.label}
                                  </DatePicker.TableCellTrigger>
                                </DatePicker.TableCell>
                              ))}
                            </DatePicker.TableRow>
                          ))}
                        </DatePicker.TableBody>
                      </DatePicker.Table>
                    </>
                  )}
                </DatePicker.Context>
              </DatePicker.View>

              {/* Year View */}
              <DatePicker.View view="year">
                <DatePicker.Context>
                  {(datePicker) => (
                    <>
                      <DatePicker.ViewControl className="flex justify-between items-center mb-2">
                        <DatePicker.PrevTrigger className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                          <ChevronLeft size={18} />
                        </DatePicker.PrevTrigger>
                        <DatePicker.ViewTrigger className="cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                          <DatePicker.RangeText />
                        </DatePicker.ViewTrigger>
                        <DatePicker.NextTrigger className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                          <ChevronRight size={18} />
                        </DatePicker.NextTrigger>
                      </DatePicker.ViewControl>
                      <DatePicker.Table className="w-full text-sm">
                        <DatePicker.TableBody>
                          {datePicker.getYearsGrid({ columns: 4 }).map((years, id) => (
                            <DatePicker.TableRow key={id}>
                              {years.map((year, id) => (
                                <DatePicker.TableCell key={id} value={year.value}>
                                  <DatePicker.TableCellTrigger className="px-2 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800">
                                    {year.label}
                                  </DatePicker.TableCellTrigger>
                                </DatePicker.TableCell>
                              ))}
                            </DatePicker.TableRow>
                          ))}
                        </DatePicker.TableBody>
                      </DatePicker.Table>
                    </>
                  )}
                </DatePicker.Context>
              </DatePicker.View>
            </DatePicker.Content>
          </DatePicker.Positioner>
        </Portal>
      </DatePicker.Root>
    </div>
  )
}
