import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Root Popover component wrapping Radix UI Popover.Root.
 * Controls open/close state of the popover.
 *
 * @param {object} props
 * @param {boolean} [props.open] - Controlled open state
 * @param {function(boolean): void} [props.onOpenChange] - Callback when open state changes
 * @param {boolean} [props.defaultOpen] - Default open state for uncontrolled usage
 * @param {boolean} [props.modal=false] - Whether the popover is modal
 * @param {React.ReactNode} [props.children] - Popover content
 * @returns {React.ReactElement}
 */
function Popover({ children, ...props }) {
  return <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>;
}

Popover.displayName = 'Popover';

Popover.propTypes = {
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  defaultOpen: PropTypes.bool,
  modal: PropTypes.bool,
  children: PropTypes.node,
};

/**
 * Popover trigger component that opens the popover when clicked.
 *
 * @param {object} props
 * @param {boolean} [props.asChild=false] - Whether to render as child element
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Trigger content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const PopoverTrigger = forwardRef(function PopoverTrigger({ className, children, ...props }, ref) {
  return (
    <PopoverPrimitive.Trigger ref={ref} className={className} {...props}>
      {children}
    </PopoverPrimitive.Trigger>
  );
});

PopoverTrigger.displayName = 'PopoverTrigger';

PopoverTrigger.propTypes = {
  asChild: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Popover anchor component for custom anchor positioning.
 *
 * @param {object} props
 * @param {boolean} [props.asChild=false] - Whether to render as child element
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Anchor content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const PopoverAnchor = forwardRef(function PopoverAnchor({ className, children, ...props }, ref) {
  return (
    <PopoverPrimitive.Anchor ref={ref} className={className} {...props}>
      {children}
    </PopoverPrimitive.Anchor>
  );
});

PopoverAnchor.displayName = 'PopoverAnchor';

PopoverAnchor.propTypes = {
  asChild: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Popover portal component that renders popover content in a portal.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.children] - Portal content
 * @returns {React.ReactElement}
 */
function PopoverPortal({ children, ...props }) {
  return <PopoverPrimitive.Portal {...props}>{children}</PopoverPrimitive.Portal>;
}

PopoverPortal.displayName = 'PopoverPortal';

PopoverPortal.propTypes = {
  children: PropTypes.node,
};

/**
 * Popover close component that closes the popover when clicked.
 *
 * @param {object} props
 * @param {boolean} [props.asChild=false] - Whether to render as child element
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Close button content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const PopoverClose = forwardRef(function PopoverClose({ className, children, ...props }, ref) {
  return (
    <PopoverPrimitive.Close ref={ref} className={className} {...props}>
      {children}
    </PopoverPrimitive.Close>
  );
});

PopoverClose.displayName = 'PopoverClose';

PopoverClose.propTypes = {
  asChild: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Popover content component containing the popover body.
 * Renders inside a portal with configurable position and styling.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {'top'|'right'|'bottom'|'left'} [props.side='bottom'] - Preferred side of the trigger to render
 * @param {number} [props.sideOffset=4] - Distance in pixels from the trigger
 * @param {'start'|'center'|'end'} [props.align='center'] - Alignment relative to the trigger
 * @param {number} [props.alignOffset=0] - Offset in pixels from the alignment
 * @param {boolean} [props.avoidCollisions=true] - Whether to avoid collisions with boundary edges
 * @param {boolean} [props.showCloseButton=false] - Whether to show a close button
 * @param {React.ReactNode} [props.children] - Popover content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const PopoverContent = forwardRef(function PopoverContent(
  {
    className,
    side = 'bottom',
    sideOffset = 4,
    align = 'center',
    alignOffset = 0,
    avoidCollisions = true,
    showCloseButton = false,
    children,
    ...props
  },
  ref
) {
  return (
    <PopoverPortal>
      <PopoverPrimitive.Content
        ref={ref}
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        avoidCollisions={avoidCollisions}
        className={cn(
          'z-50 w-72 rounded-lg border border-slate-200 bg-white p-4 shadow-dropdown outline-none',
          'data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out',
          'data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:slide-in-from-top-2',
          'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <PopoverPrimitive.Close
            className={cn(
              'absolute right-2 top-2 rounded-md p-1 text-slate-400 transition-colors duration-200',
              'hover:bg-slate-100 hover:text-slate-600',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
              'disabled:pointer-events-none'
            )}
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </PopoverPrimitive.Close>
        ) : null}
      </PopoverPrimitive.Content>
    </PopoverPortal>
  );
});

PopoverContent.displayName = 'PopoverContent';

PopoverContent.propTypes = {
  className: PropTypes.string,
  side: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  sideOffset: PropTypes.number,
  align: PropTypes.oneOf(['start', 'center', 'end']),
  alignOffset: PropTypes.number,
  avoidCollisions: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  children: PropTypes.node,
};

/**
 * Popover arrow component for rendering a visual arrow pointing to the trigger.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {number} [props.width=10] - Arrow width in pixels
 * @param {number} [props.height=5] - Arrow height in pixels
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const PopoverArrow = forwardRef(function PopoverArrow(
  { className, width = 10, height = 5, ...props },
  ref
) {
  return (
    <PopoverPrimitive.Arrow
      ref={ref}
      width={width}
      height={height}
      className={cn('fill-white', className)}
      {...props}
    />
  );
});

PopoverArrow.displayName = 'PopoverArrow';

PopoverArrow.propTypes = {
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverPortal,
  PopoverClose,
  PopoverContent,
  PopoverArrow,
};

export default Popover;