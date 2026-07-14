import { forwardRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, Trash2, XCircle, ShieldAlert, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';

/**
 * Resolves the icon component based on the variant.
 *
 * @param {string} variant - Dialog variant
 * @returns {React.ElementType} The icon component
 */
function getVariantIcon(variant) {
  switch (variant) {
    case 'delete':
      return Trash2;
    case 'destructive':
      return XCircle;
    case 'warning':
      return AlertTriangle;
    case 'critical':
      return ShieldAlert;
    case 'info':
    default:
      return Info;
  }
}

/**
 * Resolves the icon color class based on the variant.
 *
 * @param {string} variant - Dialog variant
 * @returns {string} Tailwind color class
 */
function getIconColorClass(variant) {
  switch (variant) {
    case 'delete':
    case 'destructive':
    case 'critical':
      return 'text-danger-500';
    case 'warning':
      return 'text-warning-500';
    case 'info':
    default:
      return 'text-info-500';
  }
}

/**
 * Resolves the icon background class based on the variant.
 *
 * @param {string} variant - Dialog variant
 * @returns {string} Tailwind background class
 */
function getIconBgClass(variant) {
  switch (variant) {
    case 'delete':
    case 'destructive':
    case 'critical':
      return 'bg-danger-50';
    case 'warning':
      return 'bg-warning-50';
    case 'info':
    default:
      return 'bg-info-50';
  }
}

/**
 * Resolves the confirm button variant based on the dialog variant.
 *
 * @param {string} variant - Dialog variant
 * @returns {'primary'|'destructive'} Button variant
 */
function getConfirmButtonVariant(variant) {
  switch (variant) {
    case 'delete':
    case 'destructive':
    case 'critical':
      return 'destructive';
    case 'warning':
      return 'primary';
    case 'info':
    default:
      return 'primary';
  }
}

/**
 * Confirmation dialog component for destructive or sensitive actions
 * such as delete, retire, or disable operations. Displays a title,
 * descriptive message, and confirm/cancel buttons with variant-appropriate
 * styling and iconography.
 *
 * @param {object} props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {function(boolean): void} props.onOpenChange - Callback when open state changes
 * @param {string} [props.title='Are you sure?'] - Dialog title
 * @param {string} [props.message] - Descriptive message explaining the action
 * @param {'delete'|'destructive'|'warning'|'critical'|'info'} [props.variant='destructive'] - Visual variant controlling icon and button styling
 * @param {string} [props.confirmLabel='Confirm'] - Label for the confirm button
 * @param {string} [props.cancelLabel='Cancel'] - Label for the cancel button
 * @param {function(): void|Promise<void>} props.onConfirm - Callback when the confirm button is clicked
 * @param {function(): void} [props.onCancel] - Callback when the cancel button is clicked (defaults to closing the dialog)
 * @param {React.ReactNode} [props.icon] - Custom icon element (overrides variant-based icon)
 * @param {boolean} [props.loading=false] - Whether the confirm action is in a loading state
 * @param {boolean} [props.disabled=false] - Whether the confirm button is disabled
 * @param {React.ReactNode} [props.children] - Additional content rendered between the message and the footer buttons
 * @param {string} [props.className] - Additional class names for the dialog content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const ConfirmDialog = forwardRef(function ConfirmDialog(
  {
    open,
    onOpenChange,
    title = 'Are you sure?',
    message,
    variant = 'destructive',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    icon,
    loading = false,
    disabled = false,
    children,
    className,
    ...props
  },
  ref
) {
  const [internalLoading, setInternalLoading] = useState(false);

  const resolvedVariant = variant || 'destructive';
  const IconComponent = icon ? null : getVariantIcon(resolvedVariant);
  const iconColor = getIconColorClass(resolvedVariant);
  const iconBg = getIconBgClass(resolvedVariant);
  const confirmButtonVariant = getConfirmButtonVariant(resolvedVariant);

  const isLoading = loading || internalLoading;

  const handleCancel = useCallback(() => {
    if (isLoading) {
      return;
    }

    if (typeof onCancel === 'function') {
      onCancel();
    } else if (typeof onOpenChange === 'function') {
      onOpenChange(false);
    }
  }, [isLoading, onCancel, onOpenChange]);

  const handleConfirm = useCallback(async () => {
    if (isLoading || disabled) {
      return;
    }

    if (typeof onConfirm !== 'function') {
      return;
    }

    try {
      const result = onConfirm();
      if (result && typeof result.then === 'function') {
        setInternalLoading(true);
        await result;
        setInternalLoading(false);
      }

      if (typeof onOpenChange === 'function') {
        onOpenChange(false);
      }
    } catch (error) {
      setInternalLoading(false);
    }
  }, [isLoading, disabled, onConfirm, onOpenChange]);

  const handleOpenChange = useCallback(
    (nextOpen) => {
      if (isLoading && !nextOpen) {
        return;
      }

      if (typeof onOpenChange === 'function') {
        onOpenChange(nextOpen);
      }
    },
    [isLoading, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        ref={ref}
        className={cn('max-w-md', className)}
        showCloseButton={!isLoading}
        {...props}
      >
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
          {/* Icon */}
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
              iconBg
            )}
            aria-hidden="true"
          >
            {icon ? (
              <span className={cn(iconColor)}>{icon}</span>
            ) : IconComponent ? (
              <IconComponent className={cn('h-5 w-5', iconColor)} />
            ) : null}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <DialogHeader className="p-0 space-y-1.5 text-center sm:text-left">
              {title ? (
                <DialogTitle>{title}</DialogTitle>
              ) : null}
              {message ? (
                <DialogDescription>{message}</DialogDescription>
              ) : null}
            </DialogHeader>

            {children ? (
              <div className="mt-3">{children}</div>
            ) : null}
          </div>
        </div>

        <DialogFooter className="pt-4 sm:justify-end">
          <Button
            variant="outline"
            size="md"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmButtonVariant}
            size="md"
            onClick={handleConfirm}
            loading={isLoading}
            disabled={disabled || isLoading}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ConfirmDialog.displayName = 'ConfirmDialog';

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  variant: PropTypes.oneOf(['delete', 'destructive', 'warning', 'critical', 'info']),
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  icon: PropTypes.node,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
};

export { ConfirmDialog };
export default ConfirmDialog;