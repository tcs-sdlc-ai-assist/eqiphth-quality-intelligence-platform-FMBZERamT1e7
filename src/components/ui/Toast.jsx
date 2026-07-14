import { forwardRef, createContext, useContext, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/utils';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 shadow-dropdown transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-slide-in-right data-[state=closed]:animate-fade-out',
  {
    variants: {
      variant: {
        success:
          'bg-success-50 border-success-200 text-success-900',
        error:
          'bg-danger-50 border-danger-200 text-danger-900',
        warning:
          'bg-warning-50 border-warning-200 text-warning-900',
        info:
          'bg-info-50 border-info-200 text-info-900',
        default:
          'bg-white border-slate-200 text-slate-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  default: Info,
};

const iconColorMap = {
  success: 'text-success-500',
  error: 'text-danger-500',
  warning: 'text-warning-500',
  info: 'text-info-500',
  default: 'text-slate-400',
};

/**
 * Toast provider component wrapping Radix UI Toast.Provider.
 * Must wrap the application or section where toasts are used.
 *
 * @param {object} props
 * @param {number} [props.duration=5000] - Default auto-dismiss duration in milliseconds
 * @param {string} [props.swipeDirection='right'] - Swipe direction to dismiss
 * @param {React.ReactNode} [props.children] - Child components
 * @returns {React.ReactElement}
 */
function ToastProvider({ children, duration = 5000, swipeDirection = 'right', ...props }) {
  return (
    <ToastPrimitive.Provider
      duration={duration}
      swipeDirection={swipeDirection}
      {...props}
    >
      {children}
    </ToastPrimitive.Provider>
  );
}

ToastProvider.displayName = 'ToastProvider';

ToastProvider.propTypes = {
  children: PropTypes.node,
  duration: PropTypes.number,
  swipeDirection: PropTypes.oneOf(['right', 'left', 'up', 'down']),
};

/**
 * Toast viewport component that positions toasts on screen.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const ToastViewport = forwardRef(function ToastViewport({ className, ...props }, ref) {
  return (
    <ToastPrimitive.Viewport
      ref={ref}
      className={cn(
        'fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:flex-col sm:max-w-[420px]',
        className
      )}
      {...props}
    />
  );
});

ToastViewport.displayName = 'ToastViewport';

ToastViewport.propTypes = {
  className: PropTypes.string,
};

/**
 * Toast root component with variant support.
 * Renders a toast notification with icon, content, and close button.
 *
 * @param {object} props
 * @param {'success'|'error'|'warning'|'info'|'default'} [props.variant='default'] - Visual variant
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Toast content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const Toast = forwardRef(function Toast(
  { variant = 'default', className, children, ...props },
  ref
) {
  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {children}
    </ToastPrimitive.Root>
  );
});

Toast.displayName = 'Toast';

Toast.propTypes = {
  variant: PropTypes.oneOf(['success', 'error', 'warning', 'info', 'default']),
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Toast action component for rendering an action button within a toast.
 *
 * @param {object} props
 * @param {string} props.altText - Accessible alternative text describing the action
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Action button content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const ToastAction = forwardRef(function ToastAction(
  { className, children, ...props },
  ref
) {
  return (
    <ToastPrimitive.Action
      ref={ref}
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors duration-200',
        'hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'group-[.bg-success-50]:border-success-300 group-[.bg-success-50]:hover:border-success-400 group-[.bg-success-50]:hover:bg-success-100',
        'group-[.bg-danger-50]:border-danger-300 group-[.bg-danger-50]:hover:border-danger-400 group-[.bg-danger-50]:hover:bg-danger-100',
        'group-[.bg-warning-50]:border-warning-300 group-[.bg-warning-50]:hover:border-warning-400 group-[.bg-warning-50]:hover:bg-warning-100',
        'group-[.bg-info-50]:border-info-300 group-[.bg-info-50]:hover:border-info-400 group-[.bg-info-50]:hover:bg-info-100',
        className
      )}
      {...props}
    >
      {children}
    </ToastPrimitive.Action>
  );
});

ToastAction.displayName = 'ToastAction';

ToastAction.propTypes = {
  altText: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Toast close button component.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const ToastClose = forwardRef(function ToastClose({ className, ...props }, ref) {
  return (
    <ToastPrimitive.Close
      ref={ref}
      className={cn(
        'absolute right-2 top-2 rounded-md p-1 text-slate-400 opacity-0 transition-opacity duration-200',
        'hover:text-slate-600 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
        'group-hover:opacity-100',
        'group-[.bg-success-50]:text-success-500 group-[.bg-success-50]:hover:text-success-700',
        'group-[.bg-danger-50]:text-danger-500 group-[.bg-danger-50]:hover:text-danger-700',
        'group-[.bg-warning-50]:text-warning-500 group-[.bg-warning-50]:hover:text-warning-700',
        'group-[.bg-info-50]:text-info-500 group-[.bg-info-50]:hover:text-info-700',
        className
      )}
      aria-label="Close"
      {...props}
    >
      <X className="h-4 w-4" aria-hidden="true" />
    </ToastPrimitive.Close>
  );
});

ToastClose.displayName = 'ToastClose';

ToastClose.propTypes = {
  className: PropTypes.string,
};

/**
 * Toast title component.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Title content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const ToastTitle = forwardRef(function ToastTitle({ className, children, ...props }, ref) {
  return (
    <ToastPrimitive.Title
      ref={ref}
      className={cn('text-sm font-semibold', className)}
      {...props}
    >
      {children}
    </ToastPrimitive.Title>
  );
});

ToastTitle.displayName = 'ToastTitle';

ToastTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Toast description component.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Description content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const ToastDescription = forwardRef(function ToastDescription(
  { className, children, ...props },
  ref
) {
  return (
    <ToastPrimitive.Description
      ref={ref}
      className={cn('text-sm opacity-90', className)}
      {...props}
    >
      {children}
    </ToastPrimitive.Description>
  );
});

ToastDescription.displayName = 'ToastDescription';

ToastDescription.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * @typedef {Object} ToastData
 * @property {string} id - Unique toast identifier
 * @property {'success'|'error'|'warning'|'info'|'default'} [variant='default'] - Visual variant
 * @property {string} [title] - Toast title
 * @property {string} [description] - Toast description
 * @property {React.ReactNode} [action] - Action element (use ToastAction)
 * @property {number} [duration] - Auto-dismiss duration in milliseconds
 * @property {boolean} [open] - Controlled open state
 * @property {function} [onOpenChange] - Callback when open state changes
 */

/**
 * @typedef {Object} ToastContextValue
 * @property {ToastData[]} toasts - Array of active toasts
 * @property {function(Object): string} toast - Show a new toast notification
 * @property {function(string): void} dismiss - Dismiss a toast by ID
 * @property {function(): void} dismissAll - Dismiss all toasts
 */

const ToastContext = createContext(null);

/**
 * ToastContextProvider manages toast state and provides toast/dismiss functions.
 * Wraps children with ToastProvider and renders ToastViewport.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.children] - Child components
 * @param {number} [props.duration=5000] - Default auto-dismiss duration in milliseconds
 * @param {number} [props.maxToasts=5] - Maximum number of visible toasts
 * @returns {React.ReactElement}
 */
function ToastContextProvider({ children, duration = 5000, maxToasts = 5 }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(
    ({ variant = 'default', title, description, action, duration: toastDuration, ...rest } = {}) => {
      const id = generateId('toast');
      const newToast = {
        id,
        variant,
        title,
        description,
        action,
        duration: toastDuration,
        open: true,
        ...rest,
      };

      setToasts((prev) => {
        const next = [newToast, ...prev];
        if (next.length > maxToasts) {
          return next.slice(0, maxToasts);
        }
        return next;
      });

      return id;
    },
    [maxToasts]
  );

  const dismiss = useCallback((toastId) => {
    if (!toastId || typeof toastId !== 'string') {
      return;
    }
    setToasts((prev) =>
      prev.map((t) => (t.id === toastId ? { ...t, open: false } : t))
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 300);
  }, []);

  const dismissAll = useCallback(() => {
    setToasts((prev) => prev.map((t) => ({ ...t, open: false })));

    setTimeout(() => {
      setToasts([]);
    }, 300);
  }, []);

  const value = useMemo(
    () => ({
      toasts,
      toast,
      dismiss,
      dismissAll,
    }),
    [toasts, toast, dismiss, dismissAll]
  );

  return (
    <ToastContext.Provider value={value}>
      <ToastProvider duration={duration}>
        {children}
        {toasts.map((t) => {
          const IconComponent = iconMap[t.variant] || iconMap.default;
          const iconColor = iconColorMap[t.variant] || iconColorMap.default;

          return (
            <Toast
              key={t.id}
              variant={t.variant}
              open={t.open}
              onOpenChange={(open) => {
                if (!open) {
                  dismiss(t.id);
                }
              }}
              duration={t.duration}
            >
              <div className="flex items-start gap-3 flex-1">
                <IconComponent
                  className={cn('h-5 w-5 shrink-0 mt-0.5', iconColor)}
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-1 flex-1">
                  {t.title ? <ToastTitle>{t.title}</ToastTitle> : null}
                  {t.description ? (
                    <ToastDescription>{t.description}</ToastDescription>
                  ) : null}
                </div>
              </div>
              {t.action ? t.action : null}
              <ToastClose />
            </Toast>
          );
        })}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
}

ToastContextProvider.displayName = 'ToastContextProvider';

ToastContextProvider.propTypes = {
  children: PropTypes.node,
  duration: PropTypes.number,
  maxToasts: PropTypes.number,
};

/**
 * Custom hook to access the toast context.
 * Must be used within a ToastContextProvider.
 *
 * @returns {ToastContextValue} The toast context value
 * @throws {Error} If used outside of a ToastContextProvider
 */
function useToast() {
  const context = useContext(ToastContext);
  if (context === null) {
    throw new Error('useToast must be used within a ToastContextProvider');
  }
  return context;
}

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastAction,
  ToastClose,
  ToastTitle,
  ToastDescription,
  ToastContextProvider,
  useToast,
  toastVariants,
};

export default Toast;