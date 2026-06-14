import type { FieldPath, FieldValues } from 'react-hook-form';

import { FormControl } from '@/components/ui/form';
import { InputDisplay } from '@/components/ui/input-display';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Field, type BaseFieldProps } from './field';

export interface SelectFieldOption<TValue extends string = string> {
  value: TValue;
  label: string;
  /** Optional second line rendered muted beneath the label inside the dropdown. */
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectFieldProps<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
  TValue extends string = string,
> extends BaseFieldProps<TForm, TName> {
  options: SelectFieldOption<TValue>[];
  placeholder?: string;
}

export function SelectField<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
  TValue extends string = string,
>({
  options,
  placeholder,
  ...fieldProps
}: SelectFieldProps<TForm, TName, TValue>) {
  return (
    <Field {...fieldProps}>
      {({ field, disabled, mode }) => {
        const currentValue = field.value as TValue | null | undefined;
        const selected = options.find((option) => option.value === currentValue);

        if (mode === 'display') {
          return <InputDisplay value={selected?.label ?? null} />;
        }

        return (
          <Select
            value={currentValue ?? undefined}
            onValueChange={(next) => field.onChange(next as TValue)}
            disabled={disabled || fieldProps.disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.description ? (
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  ) : (
                    option.label
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }}
    </Field>
  );
}
