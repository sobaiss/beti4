'use client';

import { forwardRef } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className={cn(
            'peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white',
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        <CheckIcon className="absolute h-3 w-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5" />
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };