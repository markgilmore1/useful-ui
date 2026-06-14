import type { FieldPath, FieldValues } from 'react-hook-form';

import { FormControl } from '@/components/ui/form';
import { InputDisplay } from '@/components/ui/input-display';

import { AdornedInput } from './field-adornment';
import { Field, type BaseFieldProps } from './field';

export interface NumberFieldProps<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
> extends BaseFieldProps<TForm, TName> {
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  /** When true, allow decimals (iOS shows decimal keypad). Default true. */
  decimals?: boolean;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  /** Override the value shown in `mode="display"`. Receives the raw form value. */
  formatDisplay?: (value: number | null) => string;
  /** Pass strings through from RHF (default) or coerce to number on change. */
  valueAs?: 'string' | 'number';
  /**
   * The numeric value that represents "empty" (only with `valueAs="number"`):
   * shown blank in the input and emitted when the field is cleared. Defaults to
   * `undefined`. Set to `0` for fields where zero is the natural empty state.
   */
  emptyValue?: number;
}

export function NumberField<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
>({
  placeholder,
  min,
  max,
  step,
  decimals = true,
  leftAdornment,
  rightAdornment,
  formatDisplay,
  valueAs = 'string',
  emptyValue,
  ...fieldProps
}: NumberFieldProps<TForm, TName>) {
  return (
    <Field {...fieldProps}>
      {({ field, disabled, mode }) => {
        if (mode === 'display') {
          const raw = field.value as unknown;
          const num = raw == null || raw === '' ? null : Number(raw);
          const text = formatDisplay
            ? formatDisplay(Number.isFinite(num as number) ? (num as number) : null)
            : num == null || !Number.isFinite(num) ? null : String(num);
          return <InputDisplay value={text} />;
        }
        return (
          <FormControl>
            <AdornedInput
              {...field}
              type="number"
              inputMode={decimals ? 'decimal' : 'numeric'}
              value={
                field.value == null ||
                field.value === '' ||
                (emptyValue !== undefined && field.value === emptyValue)
                  ? ''
                  : field.value
              }
              onChange={(event) => {
                const next = event.target.value;
                if (valueAs === 'number') {
                  field.onChange(next === '' ? emptyValue : Number(next));
                } else {
                  field.onChange(next);
                }
              }}
              // Prevent scroll-wheel from mutating the value while focused.
              onWheel={(event) => event.currentTarget.blur()}
              placeholder={placeholder}
              min={min}
              max={max}
              step={step}
              disabled={disabled || fieldProps.disabled}
              leftAdornment={leftAdornment}
              rightAdornment={rightAdornment}
            />
          </FormControl>
        );
      }}
    </Field>
  );
}
