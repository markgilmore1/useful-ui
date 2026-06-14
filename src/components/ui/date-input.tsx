import * as React from "react";
import { format, parse, isValid, isDate } from "date-fns";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  placeholder?: string;
  showCalendar?: boolean;
  maxDate?: Date;
  minDate?: Date;
  getDisabledReason?: (date: Date) => string | null;
  className?: string;
  error?: boolean;
  popoverContentClassName?: string;
}

/**
 * Parses various date input formats and converts them to a Date object
 * Supports: DD/MM/YYYY, DDMMYYYY, DD.MM.YYYY, D/M/YYYY, D.M.YYYY
 */
function parseDateInput(input: string): Date | null {
  if (!input || input.trim() === "") return null;

  // Remove all whitespace
  const cleaned = input.replace(/\s/g, "");

  // Try DD/MM/YYYY or D/M/YYYY format
  const slashMatch = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    const date = parse(`${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`, "dd/MM/yyyy", new Date());
    return isValid(date) ? date : null;
  }

  // Try DD.MM.YYYY or D.M.YYYY format
  const dotMatch = cleaned.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dotMatch) {
    const [, day, month, year] = dotMatch;
    const date = parse(`${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`, "dd/MM/yyyy", new Date());
    return isValid(date) ? date : null;
  }

  // Try DDMMYYYY format (8 digits)
  const digitsOnly = cleaned.replace(/\D/g, "");
  if (digitsOnly.length === 8) {
    const day = digitsOnly.substring(0, 2);
    const month = digitsOnly.substring(2, 4);
    const year = digitsOnly.substring(4, 8);
    const date = parse(`${day}/${month}/${year}`, "dd/MM/yyyy", new Date());
    return isValid(date) ? date : null;
  }

  return null;
}

/**
 * Formats a date string as user types, preserving separators and adding them automatically
 */
function formatInputValue(value: string): string {
  // Allow empty input
  if (!value) return "";

  // Remove all characters except digits, slashes, and dots
  const cleaned = value.replace(/[^\d/.]/g, "");

  if (!cleaned) return "";

  // Extract digits only for counting
  const digits = cleaned.replace(/\D/g, "");

  // If no digits, return empty
  if (digits.length === 0) return "";

  // Detect which separator is being used (check what user typed)
  const hasSlash = cleaned.includes("/");
  const hasDot = cleaned.includes(".");
  const separator = hasDot ? "." : "/";

  // Split by separators to understand current structure
  const parts = cleaned.split(/[/.]/);

  // If user has typed separators manually, preserve their format
  if (parts.length > 1 || cleaned.match(/[/.]/)) {
    const day = parts[0].replace(/\D/g, "").substring(0, 2);
    const month = parts[1] ? parts[1].replace(/\D/g, "").substring(0, 2) : "";
    const year = parts.length > 2 ? parts.slice(2).join("").replace(/\D/g, "").substring(0, 4) : "";

    // Use the separator that was actually typed (preserve user's choice)
    const actualSeparator = hasDot ? "." : "/";

    // If user typed a separator, preserve it even if parts are incomplete
      if (cleaned.includes("/") || cleaned.includes(".")) {
      if (year) {
        return `${day}${actualSeparator}${month}${actualSeparator}${year}`;
      } else if (month) {
        return `${day}${actualSeparator}${month}`;
      } else if (cleaned.endsWith("/") || cleaned.endsWith(".")) {
        // User just typed separator, preserve it
        return `${day}${actualSeparator}`;
      } else {
        return day;
      }
    }
  }

  // Auto-format if no separators typed yet
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 4) {
    return `${digits.substring(0, 2)}${separator}${digits.substring(2)}`;
  } else {
    return `${digits.substring(0, 2)}${separator}${digits.substring(2, 4)}${separator}${digits.substring(4, 8)}`;
  }
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      value,
      onChange,
      disabled = false,
      placeholder = "DD/MM/YYYY",
      showCalendar = true,
      maxDate,
      minDate,
      getDisabledReason,
      className,
      error = false,
      popoverContentClassName,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const [isValidDate, setIsValidDate] = React.useState(true);
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [calendarMonth, setCalendarMonth] = React.useState<Date | undefined>(value || undefined);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const blurTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const isOpeningPopoverRef = React.useRef(false);

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Update input value when external value changes (but not while focused)
    React.useEffect(() => {
      if (!isFocused && value) {
        setInputValue(format(value, "d/M/yyyy"));
        setIsValidDate(true);
      } else if (!isFocused && !value) {
        setInputValue("");
        setIsValidDate(true);
      }
    }, [value, isFocused]);

    const handleFocus = () => {
      setIsFocused(true);
      if (value) {
        setInputValue(format(value, "d/M/yyyy"));
      }
    };

    const handleInputClick = () => {
      // Open the popover when clicking the input
      if (!popoverOpen) {
        isOpeningPopoverRef.current = true;
        setPopoverOpen(true);
      }
    };

    const validateAndFormatDate = React.useCallback(() => {
      // Validate and reformat only on blur
      if (inputValue.trim() === "") {
        onChange(null);
        setInputValue("");
        setIsValidDate(true);
        return;
      }

      // Try to parse the input
      const parsedDate = parseDateInput(inputValue);

      if (parsedDate && isValid(parsedDate)) {
        // Check min/max constraints
        if (maxDate && parsedDate > maxDate) {
          // Invalid: out of range
          setInputValue("");
          onChange(null);
          setIsValidDate(false);
          return;
        }
        if (minDate && parsedDate < minDate) {
          // Invalid: out of range
          setInputValue("");
          onChange(null);
          setIsValidDate(false);
          return;
        }
        // Valid date - format and update
        onChange(parsedDate);
        setInputValue(format(parsedDate, "d/M/yyyy"));
        setIsValidDate(true);
      } else {
        // Invalid format - clear field and show error
        setInputValue("");
        onChange(null);
        setIsValidDate(false);
      }
    }, [inputValue, maxDate, minDate, onChange]);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // If we're opening the popover, ignore blur
      if (isOpeningPopoverRef.current) {
        return;
      }

      // Delay blur handling to allow popover to open if calendar button was clicked
      blurTimeoutRef.current = setTimeout(() => {
        // Check if popover is open or opening - if so, don't process blur
        if (popoverOpen || isOpeningPopoverRef.current) {
          return;
        }

        setIsFocused(false);
        validateAndFormatDate();
      }, 200);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Allow empty input
      if (newValue === "") {
        setInputValue("");
        setIsValidDate(true);
        return;
      }

      // Only allow digits, slashes, and dots - preserve what user types without reformatting
      const cleaned = newValue.replace(/[^\d/.]/g, "");

      // Just store what user types - no formatting or validation while typing
      setInputValue(cleaned);
      setIsValidDate(true); // Reset validation error while typing
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Support CMD+A (Mac) or CTRL+A (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "a") {
        e.preventDefault();
        inputRef.current?.select();
      }
      // CMD+V and CTRL+V are handled by handleInputChange via paste event
    };

    const handleCalendarSelect = (date: Date | undefined) => {
      if (date) {
        onChange(date);
        setInputValue(format(date, "d/M/yyyy"));
        setIsValidDate(true);
        setIsFocused(false);
        setPopoverOpen(false);
        // Ensure display switches to the formatted (non-edit) view immediately
        inputRef.current?.blur();
      }
    };

    const handleTodayClick = () => {
      const today = new Date();
      onChange(today);
      setInputValue(format(today, "d/M/yyyy"));
      setIsValidDate(true);
      setCalendarMonth(today);
      // Keep popover open - don't call setPopoverOpen(false)
    };

    const displayValue = isFocused
      ? inputValue
      : value
      ? format(value, "d MMM yyyy")
      : "";

    if (showCalendar) {
      return (
        <Popover
          open={popoverOpen}
          onOpenChange={(open) => {
            setPopoverOpen(open);
            // Clear any pending blur timeout when popover state changes
            if (blurTimeoutRef.current) {
              clearTimeout(blurTimeoutRef.current);
              blurTimeoutRef.current = null;
            }
            if (open) {
              // Reset the opening flag since popover is now open
              isOpeningPopoverRef.current = false;
              // Keep input focused when popover opens
              setIsFocused(true);
              // Set calendar month to the current value or today
              setCalendarMonth(value || new Date());
              // When popover opens, focus input and select text
              setTimeout(() => {
                if (inputRef.current) {
                  inputRef.current.focus();
                  const length = inputRef.current.value.length;
                  inputRef.current.setSelectionRange(0, length);
                }
              }, 0);
            } else {
              // Reset the opening flag
              isOpeningPopoverRef.current = false;
              // When popover closes, validate and format if needed
              setIsFocused(false);
              validateAndFormatDate();
            }
          }}
        >
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              value={displayValue}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onClick={handleInputClick}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "pr-10",
                error || !isValidDate ? "border-destructive focus-visible:ring-destructive" : "",
                className
              )}
            />
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent pointer-events-auto"
                disabled={disabled}
                onMouseDown={() => {
                  // Mark that we're opening the popover to prevent blur from interfering
                  isOpeningPopoverRef.current = true;
                  // Clear any pending blur timeout
                  if (blurTimeoutRef.current) {
                    clearTimeout(blurTimeoutRef.current);
                    blurTimeoutRef.current = null;
                  }
                }}
                aria-label="Open calendar"
              >
                <Calendar className="h-4 w-4 text-primary" />
              </Button>
            </PopoverTrigger>
          </div>
          <PopoverContent
            className={cn("w-auto p-0", popoverContentClassName)}
            align="start"
            onOpenAutoFocus={(e) => {
              // Prevent popover from automatically focusing and causing blur
              e.preventDefault();
            }}
            onInteractOutside={(e) => {
              const target = e.target as HTMLElement | null;
              const thisInput = inputRef.current;

              // Keep popover open when interacting with this input
              if (thisInput && target && (target === thisInput || thisInput.contains(target))) {
                e.preventDefault();
              }
            }}
          >
            <div>
              <CalendarComponent
                mode="single"
                selected={value || undefined}
                onSelect={handleCalendarSelect}
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                disabled={(date) => {
                  if (maxDate && date > maxDate) return true;
                  if (minDate && date < minDate) return true;
                  if (getDisabledReason && getDisabledReason(date)) return true;
                  return false;
                }}
                getDayDisabledReason={getDisabledReason}
              />
              <div className="border-t p-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTodayClick}
                  className="w-auto"
                >
                  Today
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <Input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          error || !isValidDate ? "border-destructive focus-visible:ring-destructive" : "",
          className
        )}
      />
    );
  }
);

DateInput.displayName = "DateInput";
