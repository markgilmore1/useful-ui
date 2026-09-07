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
        <FormItem className={cn('space-y-0', className)}>
          <div className="flex flex-row items-start gap-3">
            {/* h-5 is one label line; centring the 16px box inside it aligns the
                two deterministically, where a fixed margin drifts as soon as the
                type scale moves. */}
            <div className="flex h-5 shrink-0 items-center">
              <FormControl>
                <Checkbox
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </div>
            {/* leading-5 matches the label's own 14px/20px line box. Without it the
                div inherits the body's 24px strut and the label sits 2px lower than
                any control aligned to a 20px line. */}
            <div className="space-y-0.5 leading-5">
              {label ? <FieldLabel variant={labelVariant}>{label}</FieldLabel> : null}
              {description ? <FormDescription>{description}</FormDescription> : null}
            </div>
          </div>
          <div className="min-h-5">
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
