import { useMemo, useState } from 'react';
import { Check, ChevronDown, Plus } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DROPDOWN_TRIGGER_CLASSNAME } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface ComboboxOption<T extends string = string> {
  value: T;
  label: string;
  secondaryLabel?: string;
  searchText?: string;
  disabled?: boolean;
}

export interface ComboboxCreateAction {
  label: string;
  onSelect: () => void;
}

interface ComboboxContentProps<T extends string> {
  options: ComboboxOption<T>[];
  value: T | null;
  onValueChange: (value: T) => void;
  searchPlaceholder?: string;
  emptyText?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  allValue?: T;
  createAction?: ComboboxCreateAction;
  renderOption?: (option: ComboboxOption<T>) => React.ReactNode;
}

export function ComboboxContent<T extends string = string>({
  options,
  value,
  onValueChange,
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  includeAllOption = false,
  allOptionLabel = 'All',
  allValue = 'all' as T,
  createAction,
  renderOption,
}: ComboboxContentProps<T>) {
  return (
    <Command>
      <CommandInput placeholder={searchPlaceholder} />
      <CommandList
        className="overscroll-contain"
        onWheelCapture={(event) => {
          event.stopPropagation();
        }}
        onTouchMoveCapture={(event) => {
          event.stopPropagation();
        }}
      >
        <CommandEmpty>{emptyText}</CommandEmpty>
        <CommandGroup>
          {includeAllOption ? (
            <CommandItem value={allOptionLabel} onSelect={() => onValueChange(allValue)}>
              <Check
                className={cn('mr-2 h-4 w-4', value === allValue ? 'opacity-100' : 'opacity-0')}
              />
              {allOptionLabel}
            </CommandItem>
          ) : null}
          {options.map((option) => {
            const selected = value === option.value;
            const hasSecondary = Boolean(option.secondaryLabel);
            return (
              <CommandItem
                key={option.value}
                value={option.searchText ?? `${option.label} ${option.secondaryLabel ?? ''}`.trim()}
                disabled={option.disabled}
                onSelect={() => onValueChange(option.value)}
                className={cn(hasSecondary && 'items-start')}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4 shrink-0',
                    hasSecondary && 'mt-0.5',
                    selected ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {renderOption ? (
                  renderOption(option)
                ) : (
                  <div className="min-w-0">
                    <div className="truncate">{option.label}</div>
                    {option.secondaryLabel ? (
                      <div className="truncate text-xs text-muted-foreground">{option.secondaryLabel}</div>
                    ) : null}
                  </div>
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>
        {createAction ? (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                value={`__create__ ${createAction.label}`}
                onSelect={() => createAction.onSelect()}
                className="text-muted-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                {createAction.label}
              </CommandItem>
            </CommandGroup>
          </>
        ) : null}
      </CommandList>
    </Command>
  );
}

interface ComboboxProps<T extends string> extends ComboboxContentProps<T> {
  placeholder?: string;
  ariaLabel: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  renderSelected?: (option: ComboboxOption<T>) => React.ReactNode;
}

export function Combobox<T extends string = string>({
  options,
  value,
  onValueChange,
  placeholder = 'Select...',
  searchPlaceholder,
  emptyText,
  ariaLabel,
  includeAllOption = false,
  allOptionLabel = 'All',
  allValue = 'all' as T,
  createAction,
  disabled,
  loading,
  className,
  renderOption,
  renderSelected,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  const selectedLabel = useMemo(() => {
    if (includeAllOption && value === allValue) return allOptionLabel;
    if (loading) return 'Loading...';
    if (selectedOption) return selectedOption.label;
    return placeholder;
  }, [allOptionLabel, allValue, includeAllOption, loading, placeholder, selectedOption, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded={open}
          disabled={disabled || loading}
          className={cn(DROPDOWN_TRIGGER_CLASSNAME, className)}
        >
          <span className="truncate text-left">
            {renderSelected && selectedOption ? renderSelected(selectedOption) : selectedLabel}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <ComboboxContent
          options={options}
          value={value}
          onValueChange={(nextValue) => {
            onValueChange(nextValue);
            setOpen(false);
          }}
          searchPlaceholder={searchPlaceholder}
          emptyText={emptyText}
          includeAllOption={includeAllOption}
          allOptionLabel={allOptionLabel}
          allValue={allValue}
          createAction={
            createAction
              ? {
                  label: createAction.label,
                  onSelect: () => {
                    setOpen(false);
                    createAction.onSelect();
                  },
                }
              : undefined
          }
          renderOption={renderOption}
        />
      </PopoverContent>
    </Popover>
  );
}
