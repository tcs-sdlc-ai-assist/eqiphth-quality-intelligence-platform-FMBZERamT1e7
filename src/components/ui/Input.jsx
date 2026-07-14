import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-lg border bg-white text-slate-900 transition-colors duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-3 text-sm',
        lg: 'h-11 px-4 text-base',
      },
      variant: {
        default: 'border-slate-300 hover:border-slate-400 focus-visible:border-humana-green-500',
        error: 'border-danger-500 hover:border-danger-600 focus-visible:ring-danger-500 focus-visible:border-danger-500',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

/**
 * Reusable Input component with label, error message, helper text,
 * icon prefix/suffix, and disabled state. Accessible with proper
 * labeling and ARIA attributes.
 *
 * @param {object} props
 * @param {string} [props.id] - HTML id attribute. Auto-generated if not provided.
 * @param {string} [props.label] - Label text displayed above the input
 * @param {string} [props.error] - Error message displayed below the input
 * @param {string} [props.helperText] - Helper text displayed below the input (hidden when error is present)
 * @param {React.ReactNode} [props.iconLeft] - Icon element rendered inside the input on the left
 * @param {React.ReactNode} [props.iconRight] - Icon element rendered inside the input on the right
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Input size
 * @param {boolean} [props.required=false] - Whether the input is required
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {string} [props.className] - Additional class names for the input element
 * @param {string} [props.wrapperClassName] - Additional class names for the outer wrapper
 * @param {string} [props.type='text'] - HTML input type
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const Input = forwardRef(function Input(
  {
    id,
    label,
    error,
    helperText,
    iconLeft,
    iconRight,
    size,
    required = false,
    disabled = false,
    className,
    wrapperClassName,
    type = 'text',
    ...props
  },
  ref
) {
  const inputId = id || generateId('input');
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText && !error ? `${inputId}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;
  const variant = error ? 'error' : 'default';

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label ? (
        <label
          htmlFor={inputId}
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

      <div className="relative flex items-center">
        {iconLeft ? (
          <span
            className={cn(
              'pointer-events-none absolute left-3 flex items-center text-slate-400',
              {
                'text-danger-500': !!error,
              }
            )}
            aria-hidden="true"
          >
            {iconLeft}
          </span>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          aria-required={required ? 'true' : undefined}
          className={cn(
            inputVariants({ size, variant }),
            iconLeft && 'pl-9',
            iconRight && 'pr-9',
            className
          )}
          {...props}
        />

        {iconRight ? (
          <span
            className={cn(
              'pointer-events-none absolute right-3 flex items-center text-slate-400',
              {
                'text-danger-500': !!error,
              }
            )}
            aria-hidden="true"
          >
            {iconRight}
          </span>
        ) : null}
      </div>

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

Input.displayName = 'Input';

Input.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  type: PropTypes.string,
};

export { Input, inputVariants };
export default Input;