import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

/**
 * TooltipProvider wraps the application and provides shared tooltip configuration.
 *
 * @param {object} props
 * @param {number} [props.delayDuration=300] - Default delay in milliseconds before tooltip opens
 * @param {number} [props.skipDelayDuration=300] - Duration to skip delay when moving between tooltips
 * @param {boolean} [props.disableHoverableContent=false] - Whether hoverable content is disabled
 * @param {React.ReactNode} [props.children] - Child components
 * @returns {React.ReactElement}
 */
function TooltipProvider({ children, delayDuration = 300, skipDelayDuration = 300, ...props }) {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    >
      {children}
    </TooltipPrimitive.Provider>
  );
}

TooltipProvider.displayName = 'TooltipProvider';

TooltipProvider.propTypes = {
  children: PropTypes.node,
  delayDuration: PropTypes.number,
  skipDelayDuration: PropTypes.number,
  disableHoverableContent: PropTypes.bool,
};

/**
 * Root Tooltip component wrapping Radix UI Tooltip.Root.
 * Controls open/close state of the tooltip.
 *
 * @param {object} props
 * @param {boolean} [props.open] - Controlled open state
 * @param {boolean} [props.defaultOpen] - Default open state for uncontrolled usage
 * @param {function(boolean): void} [props.onOpenChange] - Callback when open state changes
 * @param {number} [props.delayDuration] - Delay in milliseconds before tooltip opens
 * @param {boolean} [props.disableHoverableContent] - Whether hoverable content is disabled
 * @param {React.ReactNode} [props.children] - Tooltip content
 * @returns {React.ReactElement}
 */
function Tooltip({ children, ...props }) {
  return <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>;
}

Tooltip.displayName = 'Tooltip';

Tooltip.propTypes = {
  open: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  delayDuration: PropTypes.number,
  disableHoverableContent: PropTypes.bool,
  children: PropTypes.node,
};

/**
 * Tooltip trigger component that activates the tooltip on hover/focus.
 *
 * @param {object} props
 * @param {boolean} [props.asChild=false] - Whether to render as child element
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Trigger content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const TooltipTrigger = forwardRef(function TooltipTrigger({ className, children, ...props }, ref) {
  return (
    <TooltipPrimitive.Trigger ref={ref} className={className} {...props}>
      {children}
    </TooltipPrimitive.Trigger>
  );
});

TooltipTrigger.displayName = 'TooltipTrigger';

TooltipTrigger.propTypes = {
  asChild: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Tooltip portal component that renders tooltip content in a portal.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.children] - Portal content
 * @returns {React.ReactElement}
 */
function TooltipPortal({ children, ...props }) {
  return <TooltipPrimitive.Portal {...props}>{children}</TooltipPrimitive.Portal>;
}

TooltipPortal.displayName = 'TooltipPortal';

TooltipPortal.propTypes = {
  children: PropTypes.node,
};

/**
 * Tooltip content component containing the tooltip body.
 * Renders inside a portal with configurable position and styling.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {'top'|'right'|'bottom'|'left'} [props.side='top'] - Preferred side of the trigger to render
 * @param {number} [props.sideOffset=4] - Distance in pixels from the trigger
 * @param {'start'|'center'|'end'} [props.align='center'] - Alignment relative to the trigger
 * @param {number} [props.alignOffset=0] - Offset in pixels from the alignment
 * @param {boolean} [props.avoidCollisions=true] - Whether to avoid collisions with boundary edges
 * @param {React.ReactNode} [props.children] - Tooltip content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const TooltipContent = forwardRef(function TooltipContent(
  { className, side = 'top', sideOffset = 4, align = 'center', children, ...props },
  ref
) {
  return (
    <TooltipPortal>
      <TooltipPrimitive.Content
        ref={ref}
        side={side}
        sideOffset={sideOffset}
        align={align}
        className={cn(
          'z-50 overflow-hidden rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-dropdown',
          'data-[state=delayed-open]:animate-fade-in data-[state=closed]:animate-fade-out',
          'data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:slide-in-from-top-2',
          'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
          className
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPortal>
  );
});

TooltipContent.displayName = 'TooltipContent';

TooltipContent.propTypes = {
  className: PropTypes.string,
  side: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  sideOffset: PropTypes.number,
  align: PropTypes.oneOf(['start', 'center', 'end']),
  alignOffset: PropTypes.number,
  avoidCollisions: PropTypes.bool,
  children: PropTypes.node,
};

/**
 * Tooltip arrow component for rendering a visual arrow pointing to the trigger.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {number} [props.width=10] - Arrow width in pixels
 * @param {number} [props.height=5] - Arrow height in pixels
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const TooltipArrow = forwardRef(function TooltipArrow(
  { className, width = 10, height = 5, ...props },
  ref
) {
  return (
    <TooltipPrimitive.Arrow
      ref={ref}
      width={width}
      height={height}
      className={cn('fill-white', className)}
      {...props}
    />
  );
});

TooltipArrow.displayName = 'TooltipArrow';

TooltipArrow.propTypes = {
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
  TooltipArrow,
};

export default Tooltip;