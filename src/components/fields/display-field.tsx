import * as React from 'react';

import { InputDisplay } from '@/components/ui/input-display';
import { cn } from '@/lib/utils';

import { fieldLabelVariants, type FieldLabelVariant } from './field-label-variants';

export interface DisplayFieldProps {
  /** Label text. Omit for a value-only row. */
  label?: React.ReactNode;
  /**
   * The read-only value. Strings/numbers render through `InputDisplay`
   * (with placeholder fallback); a ReactNode renders inside the same box.
   */
  value?: React.ReactNode;
  /** Shown (muted) when the value is empty. Defaults to an em dash. */
  placeholder?: string;
  description?: React.ReactNode;
  labelVariant?: FieldLabelVariant;
  labelIcon?: React.ComponentType<{ className?: string }>;
  /**
   * Reserve the same `min-h-5` message space editable fields use, so a
   * DisplayField lines up with sibling inputs in a grid. Default true.
   */
  reserveMessageSpace?: boolean;
  className?: string;
}

/**
 * Read-only field row for derived/calculated values that are NOT bound to
 * react-hook-form. Mirrors the layout and label styling of the editable
 * `Field` wrappers. For toggling a real form field between edit and read-only,
 * use a typed wrapper with `mode="display"` instead.
 */
export function DisplayField({
  label,
  value,
  placeholder,
  description,
  labelVariant = 'default',
  labelIcon: Icon,
  reserveMessageSpace = true,
  className,
}: DisplayFieldProps) {
  const isPrimitive =
    value == null || typeof value === 'string' || typeof value === 'number';

  return (
    <div className={cn('space-y-1', className)}>
      {label ? (
        <div className={cn(fieldLabelVariants({ variant: labelVariant }))}>
          {Icon ? <Icon className="mr-1.5 inline-block h-4 w-4 align-text-bottom" /> : null}
          {label}
        </div>
      ) : null}
      <div className="w-full">
        {isPrimitive ? (
          <InputDisplay value={value as string | number | null | undefined} placeholder={placeholder} className="px-0" />
        ) : (
          <div className="flex h-10 items-center py-2 text-sm">{value}</div>
        )}
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
        {reserveMessageSpace ? <div className="mt-1 min-h-5" /> : null}
      </div>
    </div>
  );
}
