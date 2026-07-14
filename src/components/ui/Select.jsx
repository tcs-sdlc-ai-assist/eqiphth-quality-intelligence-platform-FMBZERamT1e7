import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/utils';

/**
 * Reusable Select component wrapping Radix UI Select with label,
 * placeholder, options, error state. Accessible and keyboard navigable.
 *
 * @param {object} props
 * @param {string} [props.id] - HTML id attribute. Auto-generated if not provided.
 * @param {string} [props.label] - Label text displayed above the select
 * @param {string} [props.placeholder] - Placeholder text when no value is selected
 * @param {string} [props.error] - Error message displayed below the select
 * @param {string} [props.helperText] - Helper text displayed below the select (hidden when error is present)
 * @param {{ value: string, label: string, disabled?: boolean }[]} [props.options] - Array of option objects
 * @param {string} [props.value] - Controlled value
 * @param {string} [props.defaultValue] - Default value for uncontrolled usage
 * @param {function(string): void} [props.onValueChange] - Callback when value changes
 * @param {boolean} [props.required=false] - Whether the select is required
 * @param {boolean} [props.disabled=false] - Whether the select is disabled
 * @param {string} [props.className] - Additional class names for the trigger element
 * @param {string} [props.wrapperClassName] - Additional class names for the outer wrapper
 * @param {string} [props.name] - Form field name
 * @returns {React.ReactElement}
 */
const Select = forwardRef(function Select(
  {
    id,
    label,
    placeholder = 'Select an option',
    error,
    helperText,
    options = [],
    value,
    defaultValue,
    onValueChange,
    required = false,
    disabled = false,
    className,
    wrapperClassName,
    name,
    ...props
  },
  ref
) {
  const selectId = id || generateId('select');
  const errorId = error ? `${selectId}-error` : undefined;
  const helperId = helperText && !error ? `${selectId}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label ? (
        <label
          htmlFor={selectId}
          className={cn(
            'text-sm font-medium leading-none text-slate-700',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {label}
          {required ? (
            <span className="ml-0.5 text-danger-500" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
        required={required}
        {...props}
      >
        <SelectPrimitive.Trigger
          ref={ref}
          id={selectId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          aria-required={required ? 'true' : undefined}
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-lg border bg-white px-3 text-sm transition-colors duration-200',
            'placeholder:text-slate-400',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
            error
              ? 'border-danger-500 hover:border-danger-600 focus-visible:ring-danger-500 focus-visible:border-danger-500'
              : 'border-slate-300 hover:border-slate-400 focus-visible:border-humana-green-500',
            className
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              'relative z-50 max-h-72 min-w-[8rem] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-dropdown',
              'data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out'
            )}
            position="popper"
            sideOffset={4}
            align="start"
          >
            <SelectPrimitive.ScrollUpButton className="flex h-6 cursor-default items-center justify-center bg-white">
              <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </SelectPrimitive.ScrollUpButton>

            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm text-slate-900 outline-none',
                    'focus:bg-humana-green-50 focus:text-humana-green-900',
                    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                  )}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <Check className="h-4 w-4 text-humana-green-500" aria-hidden="true" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>

            <SelectPrimitive.ScrollDownButton className="flex h-6 cursor-default items-center justify-center bg-white">
              <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {error ? (
        <p id={errorId} className="text-xs text-danger-500" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';

Select.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ),
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onValueChange: PropTypes.func,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  name: PropTypes.string,
};

export { Select };
export default Select;