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
        // The reserved message row sits BELOW the switch row rather than inside
        // it. While it was a sibling of the label, items-center centred the
        // switch against label + message and it read as sitting too low.
        <FormItem className={cn('space-y-0', className)}>
          <div className="flex flex-row items-start justify-between gap-4">
            {/* leading-5 matches the label's own 14px/20px line box. Without it the
                div inherits the body's 24px strut and the label sits 2px lower than
                any control aligned to a 20px line. */}
            <div className="space-y-0.5 leading-5">
              {label ? <FieldLabel variant={labelVariant}>{label}</FieldLabel> : null}
              {description ? <FormDescription>{description}</FormDescription> : null}
            </div>
            <div className="flex h-5 shrink-0 items-center">
              <FormControl>
                <Switch
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
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
