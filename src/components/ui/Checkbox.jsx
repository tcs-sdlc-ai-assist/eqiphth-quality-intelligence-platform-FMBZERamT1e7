import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/utils';

/**
 * Reusable Checkbox component wrapping Radix UI Checkbox with label,
 * indeterminate state, and accessible labeling. Supports controlled
 * and uncontrolled usage.
 *
 * @param {object} props
 * @param {string} [props.id] - HTML id attribute. Auto-generated if not provided.
 * @param {string} [props.label] - Label text displayed next to the checkbox
 * @param {string} [props.description] - Helper description text displayed below the label
 * @param {boolean|'indeterminate'} [props.checked] - Controlled checked state (true, false, or 'indeterminate')
 * @param {boolean|'indeterminate'} [props.defaultChecked] - Default checked state for uncontrolled usage
 * @param {function(boolean|'indeterminate'): void} [props.onCheckedChange] - Callback when checked state changes
 * @param {boolean} [props.disabled=false] - Whether the checkbox is disabled
 * @param {boolean} [props.required=false] - Whether the checkbox is required
 * @param {string} [props.name] - Form field name
 * @param {string} [props.value] - Form field value
 * @param {string} [props.error] - Error message displayed below the checkbox
 * @param {string} [props.className] - Additional class names for the checkbox element
 * @param {string} [props.wrapperClassName] - Additional class names for the outer wrapper
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const Checkbox = forwardRef(function Checkbox(
  {
    id,
    label,
    description,
    checked,
    defaultChecked,
    onCheckedChange,
    disabled = false,
    required = false,
    name,
    value,
    error,
    className,
    wrapperClassName,
    ...props
  },
  ref
) {
  const checkboxId = id || generateId('checkbox');
  const descriptionId = description ? `${checkboxId}-description` : undefined;
  const errorId = error ? `${checkboxId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const checkboxElement = (
    <CheckboxPrimitive.Root
      ref={ref}
      id={checkboxId}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      required={required}
      name={name}
      value={value}
      aria-describedby={describedBy}
      aria-required={required ? 'true' : undefined}
      aria-invalid={error ? 'true' : undefined}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded border shadow-sm transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-humana-green-500 data-[state=checked]:border-humana-green-500 data-[state=checked]:text-white',
        'data-[state=indeterminate]:bg-humana-green-500 data-[state=indeterminate]:border-humana-green-500 data-[state=indeterminate]:text-white',
        'data-[state=unchecked]:border-slate-300 data-[state=unchecked]:bg-white',
        'data-[state=unchecked]:hover:border-slate-400',
        error
          ? 'border-danger-500 data-[state=unchecked]:border-danger-500 focus-visible:ring-danger-500'
          : '',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn('flex items-center justify-center text-current')}
      >
        {checked === 'indeterminate' ? (
          <Minus className="h-3 w-3" aria-hidden="true" />
        ) : (
          <Check className="h-3 w-3" aria-hidden="true" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!label && !description && !error) {
    return checkboxElement;
  }

  return (
    <div className={cn('flex flex-col gap-1', wrapperClassName)}>
      <div className="flex items-start gap-2">
        {checkboxElement}
        <div className="flex flex-col gap-0.5">
          {label ? (
            <label
              htmlFor={checkboxId}
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
          {description ? (
            <p
              id={descriptionId}
              className={cn(
                'text-xs text-slate-500',
                disabled && 'opacity-50'
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {error ? (
        <p id={errorId} className="text-xs text-danger-500 ml-6" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
  checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['indeterminate'])]),
  defaultChecked: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['indeterminate'])]),
  onCheckedChange: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
};

export { Checkbox };
export default Checkbox;