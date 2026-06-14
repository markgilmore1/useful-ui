import * as React from 'react';
import type {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

import {
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { InputDisplay } from '@/components/ui/input-display';
import { cn } from '@/lib/utils';

import { FieldLabel, type FieldLabelVariant } from './field-label';

export type FieldMode = 'edit' | 'display';
export type FieldLayout = 'stack' | 'horizontal';

export interface BaseFieldProps<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
> {
  control: Control<TForm>;
  name: TName;
  label?: React.ReactNode;
  labelSrOnly?: boolean;
  labelVariant?: FieldLabelVariant;
  labelIcon?: React.ComponentType<{ className?: string }>;
  description?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  mode?: FieldMode;
  layout?: FieldLayout;
  className?: string;
}

export interface FieldRenderContext<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
> {
  field: ControllerRenderProps<TForm, TName>;
  fieldState: ControllerFieldState;
  disabled: boolean;
  mode: FieldMode;
}

export interface FieldProps<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
> extends BaseFieldProps<TForm, TName> {
  /**
   * Renders the form control. In display mode the wrapper renders an InputDisplay
   * unless `displayValue` is supplied — see typed wrappers for usage.
   */
  children: (ctx: FieldRenderContext<TForm, TName>) => React.ReactNode;
  /**
   * Override for display mode. When set + mode === 'display', this is rendered
   * instead of calling `children`. Pass a string for the default boxed InputDisplay,
   * or a ReactNode for a fully custom display.
   */
  displayValue?: React.ReactNode;
}

/**
 * Base composition primitive. Most callers use the typed wrappers
 * (TextField, NumberField, CurrencyField, etc) rather than touching this directly.
 */
export function Field<
  TForm extends FieldValues,
  TName extends FieldPath<TForm>,
>({
  control,
  name,
  label,
  labelSrOnly = false,
  labelVariant = 'default',
  labelIcon,
  description,
  required = false,
  disabled = false,
  mode = 'edit',
  layout = 'stack',
  className,
  children,
  displayValue,
}: FieldProps<TForm, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const labelNode = label ? (
          <FieldLabel
            variant={labelVariant}
            required={required}
            srOnly={labelSrOnly}
            icon={labelIcon}
            className={layout === 'horizontal' ? 'sm:w-40 sm:shrink-0' : undefined}
          >
            {label}
          </FieldLabel>
        ) : null;

        const controlNode =
          mode === 'display' && displayValue !== undefined
            ? typeof displayValue === 'string' || typeof displayValue === 'number'
              ? <InputDisplay value={displayValue} />
              : displayValue
            : children({ field, fieldState, disabled, mode });

        return (
          <FormItem
            className={cn(
              'space-y-1',
              layout === 'horizontal' && 'sm:flex sm:flex-row sm:items-center sm:gap-4 sm:space-y-0',
              className,
            )}
          >
            {labelNode}
            <div className={cn('w-full', layout === 'horizontal' && 'sm:flex-1')}>
              {controlNode}
              {description ? <FormDescription className="mt-1">{description}</FormDescription> : null}
              <div className="mt-1 min-h-5">
                <FormMessage />
              </div>
            </div>
          </FormItem>
        );
      }}
    />
  );
}
