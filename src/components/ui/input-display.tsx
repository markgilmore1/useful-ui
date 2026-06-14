import { cn } from '@/lib/utils';

interface InputDisplayProps {
  value?: string | number | null;
  placeholder?: string;
  className?: string;
}

export function InputDisplay({ value, placeholder, className }: InputDisplayProps) {
  const hasValue = value != null && value !== '';
  return (
    <div className={cn('flex h-10 items-center px-3 py-2 text-sm', className)}>
      {hasValue ? (
        value
      ) : (
        <span className="text-muted-foreground">{placeholder ?? '—'}</span>
      )}
    </div>
  );
}
