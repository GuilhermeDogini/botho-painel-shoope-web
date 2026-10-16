import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { fieldControl } from './fieldStyles';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function Textarea({ invalid = false, className, rows = 4, ...rest }: TextareaProps) {
  return (
    <textarea
      {...rest}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(fieldControl, 'min-h-[110px] resize-y py-3 leading-normal', className)}
    />
  );
}
