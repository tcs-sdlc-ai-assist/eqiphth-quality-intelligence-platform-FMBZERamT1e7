import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Root Accordion component wrapping Radix UI Accordion.Root.
 * Supports single and multiple expansion modes.
 *
 * @param {object} props
 * @param {'single'|'multiple'} [props.type='single'] - Expansion mode
 * @param {string} [props.value] - Controlled value (single mode)
 * @param {string[]} [props.value] - Controlled value (multiple mode)
 * @param {string} [props.defaultValue] - Default value for uncontrolled usage (single mode)
 * @param {string[]} [props.defaultValue] - Default value for uncontrolled usage (multiple mode)
 * @param {function} [props.onValueChange] - Callback when value changes
 * @param {boolean} [props.collapsible=true] - Whether items can be collapsed in single mode
 * @param {boolean} [props.disabled=false] - Whether the accordion is disabled
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Accordion content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const Accordion = forwardRef(function Accordion(
  { className, type = 'single', collapsible = true, children, ...props },
  ref
) {
  return (
    <AccordionPrimitive.Root
      ref={ref}
      type={type}
      collapsible={type === 'single' ? collapsible : undefined}
      className={cn('w-full', className)}
      {...props}
    >
      {children}
    </AccordionPrimitive.Root>
  );
});

Accordion.displayName = 'Accordion';

Accordion.propTypes = {
  type: PropTypes.oneOf(['single', 'multiple']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  onValueChange: PropTypes.func,
  collapsible: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Accordion item component wrapping a single collapsible section.
 *
 * @param {object} props
 * @param {string} props.value - Unique value identifying this item
 * @param {boolean} [props.disabled=false] - Whether this item is disabled
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Item content (AccordionTrigger + AccordionContent)
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const AccordionItem = forwardRef(function AccordionItem(
  { className, children, ...props },
  ref
) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn('border-b border-slate-200', className)}
      {...props}
    >
      {children}
    </AccordionPrimitive.Item>
  );
});

AccordionItem.displayName = 'AccordionItem';

AccordionItem.propTypes = {
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Accordion trigger component that toggles the associated content panel.
 * Includes an animated chevron indicator.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Trigger content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const AccordionTrigger = forwardRef(function AccordionTrigger(
  { className, children, ...props },
  ref
) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'flex flex-1 items-center justify-between py-4 text-sm font-medium text-slate-900 transition-all duration-200',
          'hover:text-humana-green-600',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          '[&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200"
          aria-hidden="true"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

AccordionTrigger.displayName = 'AccordionTrigger';

AccordionTrigger.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Accordion content component containing the collapsible panel body.
 * Animates open and closed using CSS keyframes.
 *
 * @param {object} props
 * @param {boolean} [props.forceMount] - Force mount the content regardless of open state
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Panel content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const AccordionContent = forwardRef(function AccordionContent(
  { className, children, ...props },
  ref
) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        'overflow-hidden text-sm text-slate-700 transition-all',
        'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </AccordionPrimitive.Content>
  );
});

AccordionContent.displayName = 'AccordionContent';

AccordionContent.propTypes = {
  forceMount: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
export default Accordion;