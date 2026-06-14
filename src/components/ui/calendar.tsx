import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayContent, DayPicker, useNavigation } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  getDayDisabledReason?: (date: Date) => string | null;
};

interface CustomCaptionProps {
  displayMonth: Date;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function CustomCaption({ displayMonth }: CustomCaptionProps) {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
  const currentYear = displayMonth.getFullYear();
  const currentMonth = displayMonth.getMonth();
  const [monthMenuOpen, setMonthMenuOpen] = React.useState(false);
  const [yearMenuOpen, setYearMenuOpen] = React.useState(false);
  const monthButtonRef = React.useRef<HTMLButtonElement>(null);
  const monthMenuRef = React.useRef<HTMLDivElement>(null);
  const yearButtonRef = React.useRef<HTMLButtonElement>(null);
  const yearMenuRef = React.useRef<HTMLDivElement>(null);

  // Generate a range of years (current year ± 100 years)
  const years = React.useMemo(() => {
    const startYear = currentYear - 100;
    const endYear = currentYear + 100;
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  }, [currentYear]);

  const months = React.useMemo(
    () => MONTH_NAMES.map((label, index) => ({ label, index })),
    []
  );

  const closeMenus = () => {
    setMonthMenuOpen(false);
    setYearMenuOpen(false);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(displayMonth);
    newDate.setFullYear(parseInt(year));
    goToMonth?.(newDate);
    closeMenus();
  };

  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(monthIndex);
    goToMonth?.(newDate);
    closeMenus();
  };

  const handlePreviousMonth = () => {
    if (previousMonth) {
      goToMonth?.(previousMonth);
    }
    closeMenus();
  };

  const handleNextMonth = () => {
    if (nextMonth) {
      goToMonth?.(nextMonth);
    }
    closeMenus();
  };

  const containScrollEvent = (event: React.WheelEvent | React.TouchEvent) => {
    event.stopPropagation();
  };

  React.useEffect(() => {
    if (!monthMenuOpen && !yearMenuOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (
        monthButtonRef.current?.contains(target) ||
        monthMenuRef.current?.contains(target) ||
        yearButtonRef.current?.contains(target) ||
        yearMenuRef.current?.contains(target)
      ) {
        return;
      }
      closeMenus();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [monthMenuOpen, yearMenuOpen]);

  React.useEffect(() => {
    if (!yearMenuOpen) return;
    const currentYearButton = yearMenuRef.current?.querySelector<HTMLElement>(
      `[data-year="${currentYear}"]`
    );
    currentYearButton?.scrollIntoView?.({ block: "nearest" });
  }, [yearMenuOpen, currentYear]);

  React.useEffect(() => {
    if (!monthMenuOpen) return;
    const currentMonthButton = monthMenuRef.current?.querySelector<HTMLElement>(
      `[data-month="${currentMonth}"]`
    );
    currentMonthButton?.scrollIntoView?.({ block: "nearest" });
  }, [monthMenuOpen, currentMonth]);

  return (
    <div className="flex justify-center pt-1 relative items-center">
      <button
        className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-input bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground absolute left-1"
        onClick={handlePreviousMonth}
        type="button"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className="flex justify-center items-center gap-2">
        <div className="relative">
          <button
            ref={monthButtonRef}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={monthMenuOpen}
            className="inline-flex h-7 min-w-[96px] items-center justify-center rounded-md border border-input bg-transparent px-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              setMonthMenuOpen((open) => !open);
              setYearMenuOpen(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                setMonthMenuOpen(false);
              }
            }}
          >
            {MONTH_NAMES[currentMonth]}
          </button>
          {monthMenuOpen ? (
            <div
              ref={monthMenuRef}
              role="listbox"
              className="absolute left-0 top-full z-50 mt-1 max-h-[300px] min-w-[140px] touch-pan-y overscroll-contain overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
              onWheelCapture={containScrollEvent}
              onTouchMoveCapture={containScrollEvent}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  setMonthMenuOpen(false);
                }
              }}
            >
              {months.map((month) => {
                const isCurrent = month.index === currentMonth;
                return (
                  <button
                    key={month.index}
                    type="button"
                    role="option"
                    aria-selected={isCurrent}
                    data-month={month.index}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-start px-3 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      isCurrent ? "bg-accent text-accent-foreground" : "text-foreground"
                    )}
                    onClick={() => handleMonthChange(month.index)}
                  >
                    {month.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
        <div className="relative">
          <button
            ref={yearButtonRef}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={yearMenuOpen}
            className="inline-flex h-7 w-[72px] items-center justify-center rounded-md border border-input bg-transparent px-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              setYearMenuOpen((open) => !open);
              setMonthMenuOpen(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                setYearMenuOpen(false);
              }
            }}
          >
            {currentYear}
          </button>
          {yearMenuOpen ? (
            <div
              ref={yearMenuRef}
              role="listbox"
              className="absolute left-0 top-full z-50 mt-1 max-h-[300px] w-[80px] touch-pan-y overscroll-contain overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
              onWheelCapture={containScrollEvent}
              onTouchMoveCapture={containScrollEvent}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  setYearMenuOpen(false);
                }
              }}
            >
              {years.map((year) => {
                const isCurrent = year === currentYear;
                return (
                  <button
                    key={year}
                    type="button"
                    role="option"
                    aria-selected={isCurrent}
                    data-year={year}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-center px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      isCurrent ? "bg-accent text-accent-foreground" : "text-foreground"
                    )}
                    onClick={() => handleYearChange(year.toString())}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
      <button
        className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-input bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground absolute right-1"
        onClick={handleNextMonth}
        type="button"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  getDayDisabledReason,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        Caption: CustomCaption,
        DayContent: (contentProps) => {
          const disabledReason = getDayDisabledReason?.(contentProps.date);
          const title = contentProps.activeModifiers.disabled ? disabledReason ?? undefined : undefined;

          return (
            <span title={title}>
              <DayContent {...contentProps} />
            </span>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
