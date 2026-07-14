import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/utils';

/**
 * Reusable Switch/Toggle component wrapping Radix UI Switch with label,
 * disabled state, and accessible labeling. Supports controlled and
 * uncontrolled usage.
 *
 * @param {object} props
 * @param {string} [props.id] - HTML id attribute. Auto-generated if not provided.
 * @param {string} [props.label] - Label text displayed next to the switch
 * @param {string} [props.description] - Helper description text displayed below the label
 * @param {boolean} [props.checked] - Controlled checked state
 * @param {boolean} [props.defaultChecked] - Default checked state for uncontrolled usage
 * @param {function(boolean): void} [props.onCheckedChange] - Callback when checked state changes
 * @param {boolean} [props.disabled=false] - Whether the switch is disabled
 * @param {boolean} [props.required=false] - Whether the switch is required
 * @param {string} [props.name] - Form field name
 * @param {string} [props.value] - Form field value
 * @param {'left'|'right'} [props.labelPosition='right'] - Position of the label relative to the switch
 * @param {string} [props.className] - Additional class names for the switch element
 * @param {string} [props.wrapperClassName] - Additional class names for the outer wrapper
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const Switch = forwardRef(function Switch(
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
    labelPosition = 'right',
    className,
    wrapperClassName,
    ...props
  },
  ref
) {
  const switchId = id || generateId('switch');
  const descriptionId = description ? `${switchId}-description` : undefined;
  const describedBy = descriptionId || undefined;

  const switchElement = (
    <SwitchPrimitive.Root
      ref={ref}
      id={switchId}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      required={required}
      name={name}
      value={value}
      aria-describedby={describedBy}
      aria-required={required ? 'true' : undefined}
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-humana-green-500',
        'data-[state=unchecked]:bg-slate-200',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200',
          'data-[state=checked]:translate-x-4',
          'data-[state=unchecked]:translate-x-0'
        )}
      />
    </SwitchPrimitive.Root>
  );

  if (!label && !description) {
    return switchElement;
  }

  const labelElement = (
    <div className="flex flex-col gap-0.5">
      {label ? (
        <label
          htmlFor={switchId}
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
  );

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row',
        wrapperClassName
      )}
    >
      {switchElement}
      {labelElement}
    </div>
  );
});

Switch.displayName = 'Switch';

Switch.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  onCheckedChange: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
  labelPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
};

export { Switch };
export default Switch;