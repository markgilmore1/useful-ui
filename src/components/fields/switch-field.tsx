import type { FieldPath, FieldValues } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

import { FieldLabel, type FieldLabelVariant } from './field-label';

export interface SwitchFieldProps<
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

export function SwitchField<
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
}: SwitchFieldProps<TForm, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-row items-center justify-between gap-4 space-y-0', className)}>
          <div className="space-y-0.5">
            {label ? <FieldLabel variant={labelVariant}>{label}</FieldLabel> : null}
            {description ? <FormDescription>{description}</FormDescription> : null}
            <div className="min-h-5">
              <FormMessage />
            </div>
          </div>
          <FormControl>
            <Switch
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
