import * as React from 'react';

import { FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';

import { fieldLabelVariants, type FieldLabelVariant } from './field-label-variants';

export type { FieldLabelVariant };

interface FieldLabelProps {
  children: React.ReactNode;
  variant?: FieldLabelVariant;
  required?: boolean;
  srOnly?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function FieldLabel({
  children,
  variant = 'default',
  required = false,
  srOnly = false,
  icon: Icon,
  className,
}: FieldLabelProps) {
  return (
    <FormLabel className={cn(fieldLabelVariants({ variant }), srOnly && 'sr-only', className)}>
      {Icon ? <Icon className="mr-1.5 inline-block h-4 w-4 align-text-bottom" /> : null}
      {children}
      {required ? <> <span className="text-destructive">*</span></> : null}
    </FormLabel>
  );
}
