import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { fieldControl } from './fieldStyles';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Marca o campo com erro (borda vermelha + aria-invalid). A mensagem fica no FormField. */
  invalid?: boolean;
}

export function Input({ invalid = false, className, type = 'text', ...rest }: InputProps) {
  return <input {...rest} type={type} aria-invalid={invalid || undefined} className={cn(fieldControl, 'min-h-[46px]', className)} />;
}
