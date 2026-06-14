import type { FieldPath, FieldValues } from 'react-hook-form';

import { FormControl } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { Field, type BaseFieldProps } from './field';

export interface TextareaFieldProps<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
> extends BaseFieldProps<TForm, TName> {
  placeholder?: string;
  rows?: number;
  displayValue?: React.ReactNode;
}

export function TextareaField<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
>({
  placeholder,
  rows = 4,
  displayValue,
  ...fieldProps
}: TextareaFieldProps<TForm, TName>) {
  return (
    <Field {...fieldProps}>
      {({ field, disabled, mode }) => {
        if (mode === 'display') {
          const raw = displayValue ?? field.value;
          const text =
            raw == null || raw === '' ? <span className="text-muted-foreground">—</span> : String(raw);
          return (
            <div
              className={cn(
                'min-h-[80px] whitespace-pre-wrap rounded-md border border-input bg-background px-3 py-2 text-sm',
              )}
            >
              {text}
            </div>
          );
        }
        return (
          <FormControl>
            <Textarea
              {...field}
              value={field.value ?? ''}
              placeholder={placeholder}
              rows={rows}
              disabled={disabled || fieldProps.disabled}
            />
          </FormControl>
        );
      }}
    </Field>
  );
}
