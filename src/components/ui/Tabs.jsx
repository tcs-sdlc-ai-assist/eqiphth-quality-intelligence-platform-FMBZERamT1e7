import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

/**
 * Root Tabs component wrapping Radix UI Tabs.Root.
 * Controls the active tab state.
 *
 * @param {object} props
 * @param {string} [props.value] - Controlled active tab value
 * @param {string} [props.defaultValue] - Default active tab value for uncontrolled usage
 * @param {function(string): void} [props.onValueChange] - Callback when active tab changes
 * @param {string} [props.orientation='horizontal'] - Orientation of the tabs
 * @param {string} [props.activationMode='automatic'] - Activation mode (automatic or manual)
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Tabs content
 * @returns {React.ReactElement}
 */
const Tabs = forwardRef(function Tabs({ className, children, ...props }, ref) {
  return (
    <TabsPrimitive.Root
      ref={ref}
      className={cn('w-full', className)}
      {...props}
    >
      {children}
    </TabsPrimitive.Root>
  );
});

Tabs.displayName = 'Tabs';

Tabs.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onValueChange: PropTypes.func,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  activationMode: PropTypes.oneOf(['automatic', 'manual']),
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * TabsList component containing tab triggers.
 * Provides keyboard navigation between tab triggers.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - TabsTrigger elements
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const TabsList = forwardRef(function TabsList({ className, children, ...props }, ref) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500',
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  );
});

TabsList.displayName = 'TabsList';

TabsList.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * TabsTrigger component for individual tab buttons.
 * Accessible with keyboard navigation and proper ARIA attributes.
 *
 * @param {object} props
 * @param {string} props.value - The value that associates the trigger with a content panel
 * @param {boolean} [props.disabled=false] - Whether the trigger is disabled
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Trigger content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const TabsTrigger = forwardRef(function TabsTrigger({ className, children, ...props }, ref) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm',
        'data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-700',
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
});

TabsTrigger.displayName = 'TabsTrigger';

TabsTrigger.propTypes = {
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * TabsContent component for tab panel content.
 * Only renders when the associated trigger is active.
 *
 * @param {object} props
 * @param {string} props.value - The value that associates the content with a trigger
 * @param {boolean} [props.forceMount] - Force mount the content regardless of active state
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Panel content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const TabsContent = forwardRef(function TabsContent({ className, children, ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'mt-2 ring-offset-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
        'data-[state=active]:animate-fade-in',
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Content>
  );
});

TabsContent.displayName = 'TabsContent';

TabsContent.propTypes = {
  value: PropTypes.string.isRequired,
  forceMount: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
export default Tabs;