import type { FieldPath, FieldValues } from 'react-hook-form';

import { Combobox, type ComboboxCreateAction, type ComboboxOption } from '@/components/ui/combobox';
import { FormControl } from '@/components/ui/form';
import { InputDisplay } from '@/components/ui/input-display';

import { Field, type BaseFieldProps } from './field';

export interface ComboboxFieldProps<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
  TValue extends string = string,
> extends BaseFieldProps<TForm, TName> {
  options: ComboboxOption<TValue>[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  ariaLabel: string;
  createAction?: ComboboxCreateAction;
  loading?: boolean;
}

export function ComboboxField<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
  TValue extends string = string,
>({
  options,
  placeholder,
  searchPlaceholder,
  emptyText,
  ariaLabel,
  createAction,
  loading,
  ...fieldProps
}: ComboboxFieldProps<TForm, TName, TValue>) {
  return (
    <Field {...fieldProps}>
      {({ field, disabled, mode }) => {
        const currentValue = (field.value as TValue | null | undefined) ?? null;
        const selected = options.find((option) => option.value === currentValue);

        if (mode === 'display') {
          return <InputDisplay value={selected?.label ?? null} />;
        }

        return (
          <FormControl>
            <Combobox<TValue>
              options={options}
              value={currentValue}
              onValueChange={(next) => field.onChange(next)}
              placeholder={placeholder}
              searchPlaceholder={searchPlaceholder}
              emptyText={emptyText}
              ariaLabel={ariaLabel}
              createAction={createAction}
              loading={loading}
              disabled={disabled || fieldProps.disabled}
            />
          </FormControl>
        );
      }}
    </Field>
  );
}
