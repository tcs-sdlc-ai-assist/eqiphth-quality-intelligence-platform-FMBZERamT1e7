import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Root Dialog component wrapping Radix UI Dialog.Root.
 * Controls open/close state of the dialog.
 *
 * @param {object} props
 * @param {boolean} [props.open] - Controlled open state
 * @param {function(boolean): void} [props.onOpenChange] - Callback when open state changes
 * @param {boolean} [props.defaultOpen] - Default open state for uncontrolled usage
 * @param {boolean} [props.modal=true] - Whether the dialog is modal
 * @param {React.ReactNode} [props.children] - Dialog content
 * @returns {React.ReactElement}
 */
function Dialog({ children, ...props }) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}

Dialog.displayName = 'Dialog';

Dialog.propTypes = {
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  defaultOpen: PropTypes.bool,
  modal: PropTypes.bool,
  children: PropTypes.node,
};

/**
 * Dialog trigger component that opens the dialog when clicked.
 *
 * @param {object} props
 * @param {boolean} [props.asChild=false] - Whether to render as child element
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Trigger content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DialogTrigger = forwardRef(function DialogTrigger({ className, children, ...props }, ref) {
  return (
    <DialogPrimitive.Trigger ref={ref} className={className} {...props}>
      {children}
    </DialogPrimitive.Trigger>
  );
});

DialogTrigger.displayName = 'DialogTrigger';

DialogTrigger.propTypes = {
  asChild: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Dialog portal component that renders dialog content in a portal.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.children] - Portal content
 * @returns {React.ReactElement}
 */
function DialogPortal({ children, ...props }) {
  return <DialogPrimitive.Portal {...props}>{children}</DialogPrimitive.Portal>;
}

DialogPortal.displayName = 'DialogPortal';

DialogPortal.propTypes = {
  children: PropTypes.node,
};

/**
 * Dialog close component that closes the dialog when clicked.
 *
 * @param {object} props
 * @param {boolean} [props.asChild=false] - Whether to render as child element
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Close button content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DialogClose = forwardRef(function DialogClose({ className, children, ...props }, ref) {
  return (
    <DialogPrimitive.Close ref={ref} className={className} {...props}>
      {children}
    </DialogPrimitive.Close>
  );
});

DialogClose.displayName = 'DialogClose';

DialogClose.propTypes = {
  asChild: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Dialog overlay component providing the backdrop behind the dialog.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DialogOverlay = forwardRef(function DialogOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
        'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
        className
      )}
      {...props}
    />
  );
});

DialogOverlay.displayName = 'DialogOverlay';

DialogOverlay.propTypes = {
  className: PropTypes.string,
};

/**
 * Dialog content component containing the main dialog body.
 * Includes overlay, focus trap, and close button.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {boolean} [props.showCloseButton=true] - Whether to show the close button
 * @param {React.ReactNode} [props.children] - Content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DialogContent = forwardRef(function DialogContent(
  { className, showCloseButton = true, children, ...props },
  ref
) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]',
          'rounded-xl border border-slate-200 bg-white p-6 shadow-modal',
          'data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out',
          'focus:outline-none',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            className={cn(
              'absolute right-4 top-4 rounded-md p-1 text-slate-400 transition-colors duration-200',
              'hover:bg-slate-100 hover:text-slate-600',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
              'disabled:pointer-events-none'
            )}
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});

DialogContent.displayName = 'DialogContent';

DialogContent.propTypes = {
  className: PropTypes.string,
  showCloseButton: PropTypes.bool,
  children: PropTypes.node,
};

/**
 * Dialog header section with consistent spacing.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Header content
 * @returns {React.ReactElement}
 */
function DialogHeader({ className, children, ...props }) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
      {...props}
    >
      {children}
    </div>
  );
}

DialogHeader.displayName = 'DialogHeader';

DialogHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Dialog footer section with consistent spacing and alignment.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Footer content
 * @returns {React.ReactElement}
 */
function DialogFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0 pt-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

DialogFooter.displayName = 'DialogFooter';

DialogFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Dialog title element rendered as an h2.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Title content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DialogTitle = forwardRef(function DialogTitle({ className, children, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight text-slate-900', className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  );
});

DialogTitle.displayName = 'DialogTitle';

DialogTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Dialog description element rendered as a paragraph.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Description content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DialogDescription = forwardRef(function DialogDescription(
  { className, children, ...props },
  ref
) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-sm text-slate-500', className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Description>
  );
});

DialogDescription.displayName = 'DialogDescription';

DialogDescription.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

export default Dialog;