import { format } from 'date-fns';
import type { FieldPath, FieldValues } from 'react-hook-form';

import { DateInput } from '@/components/ui/date-input';
import { FormControl } from '@/components/ui/form';
import { InputDisplay } from '@/components/ui/input-display';

import { Field, type BaseFieldProps } from './field';

export interface DateFieldProps<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
> extends BaseFieldProps<TForm, TName> {
  placeholder?: string;
  showCalendar?: boolean;
  minDate?: Date;
  maxDate?: Date;
  /** Disable specific dates with a reason (shown as a tooltip). */
  getDisabledReason?: (date: Date) => string | null;
  /**
   * How the form value is stored: full ISO string (default), a local
   * `yyyy-MM-dd` date string, or a Date object.
   */
  valueAs?: 'iso' | 'date-string' | 'date';
}

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isFinite(value.valueOf()) ? value : null;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isFinite(parsed.valueOf()) ? parsed : null;
  }
  return null;
}

export function DateField<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
>({
  placeholder,
  showCalendar = true,
  minDate,
  maxDate,
  getDisabledReason,
  valueAs = 'iso',
  ...fieldProps
}: DateFieldProps<TForm, TName>) {
  return (
    <Field {...fieldProps}>
      {({ field, fieldState, disabled, mode }) => {
        const dateValue = toDate(field.value);

        if (mode === 'display') {
          return <InputDisplay value={dateValue ? format(dateValue, 'd MMM yyyy') : null} />;
        }

        return (
          <FormControl>
            <DateInput
              value={dateValue}
              onChange={(next) => {
                if (!next) {
                  field.onChange(valueAs === 'date' ? null : '');
                  return;
                }
                if (valueAs === 'iso') {
                  field.onChange(next.toISOString());
                } else if (valueAs === 'date-string') {
                  field.onChange(format(next, 'yyyy-MM-dd'));
                } else {
                  field.onChange(next);
                }
              }}
              placeholder={placeholder}
              showCalendar={showCalendar}
              minDate={minDate}
              maxDate={maxDate}
              getDisabledReason={getDisabledReason}
              error={!!fieldState.error}
              disabled={disabled || fieldProps.disabled}
            />
          </FormControl>
        );
      }}
    </Field>
  );
}
