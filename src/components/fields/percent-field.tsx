import type { FieldPath, FieldValues } from 'react-hook-form';

import { formatPercentageSimple } from '@/lib/formatters';

import { NumberField, type NumberFieldProps } from './number-field';

export interface PercentFieldProps<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
> extends Omit<NumberFieldProps<TForm, TName>, 'leftAdornment' | 'rightAdornment' | 'formatDisplay'> {
  /** Decimal places for the display formatter. Defaults to 2. */
  displayDecimals?: number;
  formatDisplay?: (value: number | null) => string;
}

export function PercentField<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
>({
  displayDecimals = 2,
  formatDisplay,
  ...rest
}: PercentFieldProps<TForm, TName>) {
  return (
    <NumberField
      {...rest}
      rightAdornment="%"
      formatDisplay={formatDisplay ?? ((value) => formatPercentageSimple(value, displayDecimals))}
    />
  );
}
