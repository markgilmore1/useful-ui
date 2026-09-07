import { cn } from '@/lib/utils';

interface InputDisplayProps {
  value?: string | number | null;
  placeholder?: string;
  className?: string;
}

/**
 * Read-only value. No horizontal padding by default so the value sits flush
 * with its label — an edit-mode input's px-3 is inset from a visible border,
 * and copying it here just indented every display field by 12px. Pass px-3
 * when the value is inside a bordered box.
 */
export function InputDisplay({ value, placeholder, className }: InputDisplayProps) {
  const hasValue = value != null && value !== '';
  return (
    <div className={cn('flex h-10 items-center py-2 text-sm', className)}>
      {hasValue ? (
        value
      ) : (
        <span className="text-muted-foreground">{placeholder ?? '—'}</span>
      )}
    </div>
  );
}
