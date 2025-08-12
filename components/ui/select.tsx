'use client';

import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface SelectTriggerProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export interface SelectContentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SelectItemProps {
  value: string;
  className?: string;
  children?: React.ReactNode;
}

// Context for Select component
const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}>({});

// Main Select component
export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  placeholder,
  disabled = false,
  className,
  children
}) => {
  const [internalValue, setInternalValue] = React.useState(value || '');
  
  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <SelectContext.Provider value={{ value: internalValue, onValueChange: handleChange, placeholder }}>
      <Listbox value={internalValue} onChange={handleChange} disabled={disabled}>
        <div className={cn('relative', className)}>
          {children}
        </div>
      </Listbox>
    </SelectContext.Provider>
  );
};

// SelectTrigger component
export const SelectTrigger: React.FC<SelectTriggerProps> = ({ className, children }) => {
  return (
    <Listbox.Button
      className={cn(
        'relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
        className
      )}
    >
      {children}
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </span>
    </Listbox.Button>
  );
};

// SelectValue component
export const SelectValue: React.FC<SelectValueProps> = ({ placeholder, className }) => {
  const { value, placeholder: contextPlaceholder } = React.useContext(SelectContext);
  
  return (
    <span className={cn('block truncate', className)}>
      {value || placeholder || contextPlaceholder || 'Select an option'}
    </span>
  );
};

// SelectContent component
export const SelectContent: React.FC<SelectContentProps> = ({ className, children }) => {
  return (
    <Transition
      as={React.Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Listbox.Options
        className={cn(
          'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
          className
        )}
      >
        {children}
      </Listbox.Options>
    </Transition>
  );
};

// SelectItem component
export const SelectItem: React.FC<SelectItemProps> = ({ value, className, children }) => {
  return (
    <Listbox.Option
      value={value}
      className={({ active, selected }) =>
        cn(
          'relative cursor-default select-none py-2 pl-10 pr-4',
          active ? 'bg-blue-100 text-blue-900' : 'text-gray-900',
          selected ? 'bg-blue-50' : '',
          className
        )
      }
    >
      {({ selected }) => (
        <>
          <span className={cn('block truncate', selected ? 'font-medium' : 'font-normal')}>
            {children}
          </span>
          {selected && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
              <CheckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
        </>
      )}
    </Listbox.Option>
  );
};