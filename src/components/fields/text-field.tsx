import type { FieldPath, FieldValues } from 'react-hook-form';

import { FormControl } from '@/components/ui/form';
import { InputDisplay } from '@/components/ui/input-display';

import { AdornedInput, type AdornedInputProps } from './field-adornment';
import { Field, type BaseFieldProps } from './field';

type TextInputType = 'text' | 'email' | 'tel' | 'url' | 'password' | 'search';

export interface TextFieldProps<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
> extends BaseFieldProps<TForm, TName> {
  type?: TextInputType;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: AdornedInputProps['inputMode'];
  maxLength?: number;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  /** Override the value shown in `mode="display"`. Defaults to the form value. */
  displayValue?: React.ReactNode;
}

export function TextField<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
>({
  type = 'text',
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  leftAdornment,
  rightAdornment,
  displayValue,
  ...fieldProps
}: TextFieldProps<TForm, TName>) {
  return (
    <Field {...fieldProps}>
      {({ field, disabled, mode }) => {
        if (mode === 'display') {
          if (displayValue !== undefined) {
            return typeof displayValue === 'string' || typeof displayValue === 'number'
              ? <InputDisplay value={displayValue} />
              : <>{displayValue}</>;
          }
          const raw = field.value as unknown;
          const text = raw == null || raw === '' ? null : String(raw);
          return <InputDisplay value={text} />;
        }
        return (
          <FormControl>
            <AdornedInput
              {...field}
              value={field.value ?? ''}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              inputMode={inputMode}
              maxLength={maxLength}
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
