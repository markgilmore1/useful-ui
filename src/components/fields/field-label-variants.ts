import { cva, type VariantProps } from 'class-variance-authority';

export const fieldLabelVariants = cva('leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', {
  variants: {
    variant: {
      default: 'text-sm font-medium',
      muted: 'text-sm font-normal text-muted-foreground',
      compact: 'text-xs font-normal text-muted-foreground',
    },
  },
  defaultVariants: { variant: 'default' },
});

export type FieldLabelVariant = NonNullable<VariantProps<typeof fieldLabelVariants>['variant']>;
