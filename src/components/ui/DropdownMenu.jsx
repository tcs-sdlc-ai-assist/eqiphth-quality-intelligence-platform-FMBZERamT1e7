import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Root DropdownMenu component wrapping Radix UI DropdownMenu.Root.
 * Controls open/close state of the dropdown menu.
 *
 * @param {object} props
 * @param {boolean} [props.open] - Controlled open state
 * @param {function(boolean): void} [props.onOpenChange] - Callback when open state changes
 * @param {boolean} [props.defaultOpen] - Default open state for uncontrolled usage
 * @param {boolean} [props.modal=true] - Whether the dropdown is modal
 * @param {string} [props.dir] - Reading direction
 * @param {React.ReactNode} [props.children] - Dropdown content
 * @returns {React.ReactElement}
 */
function DropdownMenu({ children, ...props }) {
  return <DropdownMenuPrimitive.Root {...props}>{children}</DropdownMenuPrimitive.Root>;
}

DropdownMenu.displayName = 'DropdownMenu';

DropdownMenu.propTypes = {
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  defaultOpen: PropTypes.bool,
  modal: PropTypes.bool,
  dir: PropTypes.string,
  children: PropTypes.node,
};

/**
 * DropdownMenu trigger component that opens the menu when clicked.
 *
 * @param {object} props
 * @param {boolean} [props.asChild=false] - Whether to render as child element
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Trigger content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DropdownMenuTrigger = forwardRef(function DropdownMenuTrigger(
  { className, children, ...props },
  ref
) {
  return (
    <DropdownMenuPrimitive.Trigger ref={ref} className={className} {...props}>
      {children}
    </DropdownMenuPrimitive.Trigger>
  );
});

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

DropdownMenuTrigger.propTypes = {
  asChild: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * DropdownMenu group component for grouping related items.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Group content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DropdownMenuGroup = forwardRef(function DropdownMenuGroup(
  { className, children, ...props },
  ref
) {
  return (
    <DropdownMenuPrimitive.Group ref={ref} className={className} {...props}>
      {children}
    </DropdownMenuPrimitive.Group>
  );
});

DropdownMenuGroup.displayName = 'DropdownMenuGroup';

DropdownMenuGroup.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * DropdownMenu portal component that renders content in a portal.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.children] - Portal content
 * @returns {React.ReactElement}
 */
function DropdownMenuPortal({ children, ...props }) {
  return (
    <DropdownMenuPrimitive.Portal {...props}>{children}</DropdownMenuPrimitive.Portal>
  );
}

DropdownMenuPortal.displayName = 'DropdownMenuPortal';

DropdownMenuPortal.propTypes = {
  children: PropTypes.node,
};

/**
 * DropdownMenu sub component for creating sub-menus.
 *
 * @param {object} props
 * @param {boolean} [props.open] - Controlled open state
 * @param {function(boolean): void} [props.onOpenChange] - Callback when open state changes
 * @param {boolean} [props.defaultOpen] - Default open state
 * @param {React.ReactNode} [props.children] - Sub-menu content
 * @returns {React.ReactElement}
 */
function DropdownMenuSub({ children, ...props }) {
  return (
    <DropdownMenuPrimitive.Sub {...props}>{children}</DropdownMenuPrimitive.Sub>
  );
}

DropdownMenuSub.displayName = 'DropdownMenuSub';

DropdownMenuSub.propTypes = {
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  defaultOpen: PropTypes.bool,
  children: PropTypes.node,
};

/**
 * DropdownMenu radio group component for radio-style selection.
 *
 * @param {object} props
 * @param {string} [props.value] - Controlled value
 * @param {function(string): void} [props.onValueChange] - Callback when value changes
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Radio group content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DropdownMenuRadioGroup = forwardRef(function DropdownMenuRadioGroup(
  { className, children, ...props },
  ref
) {
  return (
    <DropdownMenuPrimitive.RadioGroup ref={ref} className={className} {...props}>
      {children}
    </DropdownMenuPrimitive.RadioGroup>
  );
});

DropdownMenuRadioGroup.displayName = 'DropdownMenuRadioGroup';

DropdownMenuRadioGroup.propTypes = {
  value: PropTypes.string,
  onValueChange: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * DropdownMenu sub-trigger component for opening sub-menus.
 *
 * @param {object} props
 * @param {boolean} [props.inset=false] - Whether to add left padding for alignment with items that have icons
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Sub-trigger content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DropdownMenuSubTrigger = forwardRef(function DropdownMenuSubTrigger(
  { className, inset = false, children, ...props },
  ref
) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        'flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none',
        'focus:bg-humana-green-50 focus:text-humana-green-900',
        'data-[state=open]:bg-humana-green-50 data-[state=open]:text-humana-green-900',
        inset && 'pl-8',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" aria-hidden="true" />
    </DropdownMenuPrimitive.SubTrigger>
  );
});

DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

DropdownMenuSubTrigger.propTypes = {
  inset: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * DropdownMenu sub-content component containing sub-menu items.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Sub-content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DropdownMenuSubContent = forwardRef(function DropdownMenuSubContent(
  { className, children, ...props },
  ref
) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        ref={ref}
        className={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-dropdown',
          'data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out',
          className
        )}
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.SubContent>
    </DropdownMenuPrimitive.Portal>
  );
});

DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

DropdownMenuSubContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * DropdownMenu content component containing the main menu body.
 * Renders inside a portal with configurable position and styling.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {number} [props.sideOffset=4] - Distance in pixels from the trigger
 * @param {'top'|'right'|'bottom'|'left'} [props.side] - Preferred side of the trigger to render
 * @param {'start'|'center'|'end'} [props.align='end'] - Alignment relative to the trigger
 * @param {React.ReactNode} [props.children] - Content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DropdownMenuContent = forwardRef(function DropdownMenuContent(
  { className, sideOffset = 4, align = 'end', children, ...props },
  ref
) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        align={align}
        className={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-dropdown',
          'data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out',
          className
        )}
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
});

DropdownMenuContent.displayName = 'DropdownMenuContent';

DropdownMenuContent.propTypes = {
  className: PropTypes.string,
  sideOffset: PropTypes.number,
  side: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  align: PropTypes.oneOf(['start', 'center', 'end']),
  children: PropTypes.node,
};

/**
 * DropdownMenu item component for individual menu items.
 * Accessible with keyboard navigation and proper ARIA attributes.
 *
 * @param {object} props
 * @param {boolean} [props.inset=false] - Whether to add left padding for alignment with items that have icons
 * @param {boolean} [props.disabled=false] - Whether the item is disabled
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Item content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DropdownMenuItem = forwardRef(function DropdownMenuItem(
  { className, inset = false, children, ...props },
  ref
) {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm text-slate-900 outline-none transition-colors duration-200',
        'focus:bg-humana-green-50 focus:text-humana-green-900',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        inset && 'pl-8',
        className
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
});

DropdownMenuItem.displayName = 'DropdownMenuItem';

DropdownMenuItem.propTypes = {
  inset: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * DropdownMenu checkbox item component for toggling boolean options.
 *
 * @param {object} props
 * @param {boolean} [props.checked] - Whether the item is checked
 * @param {function(boolean): void} [props.onCheckedChange] - Callback when checked state changes
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Item content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DropdownMenuCheckboxItem = forwardRef(function DropdownMenuCheckboxItem(
  { className, checked, children, ...props },
  ref
) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm text-slate-900 outline-none transition-colors duration-200',
        'focus:bg-humana-green-50 focus:text-humana-green-900',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4 text-humana-green-500" aria-hidden="true" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
});

DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

DropdownMenuCheckboxItem.propTypes = {
  checked: PropTypes.bool,
  onCheckedChange: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * DropdownMenu radio item component for radio-style selection within a group.
 *
 * @param {object} props
 * @param {string} props.value - The value of the radio item
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Item content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DropdownMenuRadioItem = forwardRef(function DropdownMenuRadioItem(
  { className, children, ...props },
  ref
) {
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm text-slate-900 outline-none transition-colors duration-200',
        'focus:bg-humana-green-50 focus:text-humana-green-900',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="h-2 w-2 fill-humana-green-500 text-humana-green-500" aria-hidden="true" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
});

DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

DropdownMenuRadioItem.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * DropdownMenu label component for labeling groups of items.
 *
 * @param {object} props
 * @param {boolean} [props.inset=false] - Whether to add left padding for alignment
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Label content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DropdownMenuLabel = forwardRef(function DropdownMenuLabel(
  { className, inset = false, children, ...props },
  ref
) {
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(
        'px-2 py-1.5 text-sm font-semibold text-slate-900',
        inset && 'pl-8',
        className
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Label>
  );
});

DropdownMenuLabel.displayName = 'DropdownMenuLabel';

DropdownMenuLabel.propTypes = {
  inset: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * DropdownMenu separator component for visually separating groups of items.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DropdownMenuSeparator = forwardRef(function DropdownMenuSeparator(
  { className, ...props },
  ref
) {
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-slate-200', className)}
      {...props}
    />
  );
});

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

DropdownMenuSeparator.propTypes = {
  className: PropTypes.string,
};

/**
 * DropdownMenu shortcut component for displaying keyboard shortcuts.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Shortcut text
 * @returns {React.ReactElement}
 */
function DropdownMenuShortcut({ className, children, ...props }) {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest text-slate-400', className)}
      {...props}
    >
      {children}
    </span>
  );
}

DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

DropdownMenuShortcut.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};

export default DropdownMenu;