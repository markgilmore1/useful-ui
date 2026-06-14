import * as React from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface AdornedInputProps extends React.ComponentProps<'input'> {
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
}

export const AdornedInput = React.forwardRef<HTMLInputElement, AdornedInputProps>(
  ({ leftAdornment, rightAdornment, className, ...inputProps }, ref) => {
    if (!leftAdornment && !rightAdornment) {
      return <Input ref={ref} className={className} {...inputProps} />;
    }

    return (
      <div className="relative w-full">
        {leftAdornment ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {leftAdornment}
          </span>
        ) : null}
        <Input
          ref={ref}
          className={cn(leftAdornment && 'pl-7', rightAdornment && 'pr-7', className)}
          {...inputProps}
        />
        {rightAdornment ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {rightAdornment}
          </span>
        ) : null}
      </div>
    );
  },
);
AdornedInput.displayName = 'AdornedInput';
