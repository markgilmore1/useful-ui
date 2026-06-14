import type { FieldPath, FieldValues } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

import { FieldLabel, type FieldLabelVariant } from './field-label';

export interface CheckboxFieldProps<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
> {
  control: import('react-hook-form').Control<TForm>;
  name: TName;
  label?: React.ReactNode;
  labelVariant?: FieldLabelVariant;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function CheckboxField<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
>({
  control,
  name,
  label,
  labelVariant = 'default',
  description,
  disabled,
  className,
}: CheckboxFieldProps<TForm, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-row items-start gap-3 space-y-0', className)}>
          <FormControl>
            <Checkbox
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-0.5 leading-none">
            {label ? <FieldLabel variant={labelVariant}>{label}</FieldLabel> : null}
            {description ? <FormDescription>{description}</FormDescription> : null}
            <div className="min-h-5">
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
}
