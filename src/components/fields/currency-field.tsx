import type { FieldPath, FieldValues } from 'react-hook-form';

import { formatCurrency } from '@/lib/formatters';

import { NumberField, type NumberFieldProps } from './number-field';

export interface CurrencyFieldProps<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
> extends Omit<NumberFieldProps<TForm, TName>, 'leftAdornment' | 'rightAdornment' | 'formatDisplay'> {
  /** Override the leading symbol. Defaults to '$'. */
  currencySymbol?: string;
  /** Custom display formatter. Defaults to en-AU `formatCurrency`. */
  formatDisplay?: (value: number | null) => string;
}

export function CurrencyField<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
>({
  currencySymbol = '$',
  formatDisplay,
  ...rest
}: CurrencyFieldProps<TForm, TName>) {
  return (
    <NumberField
      {...rest}
      leftAdornment={currencySymbol}
      formatDisplay={formatDisplay ?? ((value) => formatCurrency(value))}
    />
  );
}
