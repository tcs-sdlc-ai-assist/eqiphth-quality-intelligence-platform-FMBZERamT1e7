import { forwardRef, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Bell,
  Check,
  CheckCheck,
  X,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { useNotifications } from '@/context/NotificationContext';
import { usePersona } from '@/context/PersonaContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/Tooltip';
import { DATE_FORMATS, NOTIFICATION_TYPES } from '@/lib/constants';

/**
 * Resolves the icon component based on the notification type.
 *
 * @param {string} type - Notification type
 * @returns {React.ElementType} The icon component
 */
function getNotificationIcon(type) {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      return CheckCircle;
    case NOTIFICATION_TYPES.WARNING:
      return AlertTriangle;
    case NOTIFICATION_TYPES.ERROR:
      return AlertCircle;
    case NOTIFICATION_TYPES.INFO:
    default:
      return Info;
  }
}

/**
 * Resolves the icon color class based on the notification type.
 *
 * @param {string} type - Notification type
 * @returns {string} Tailwind color class
 */
function getNotificationIconColor(type) {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      return 'text-success-500';
    case NOTIFICATION_TYPES.WARNING:
      return 'text-warning-500';
    case NOTIFICATION_TYPES.ERROR:
      return 'text-danger-500';
    case NOTIFICATION_TYPES.INFO:
    default:
      return 'text-info-500';
  }
}

/**
 * Resolves the priority badge variant based on the notification priority.
 *
 * @param {string} priority - Notification priority
 * @returns {'error'|'warning'|'info'|'neutral'} Badge variant
 */
function getPriorityBadgeVariant(priority) {
  switch (priority) {
    case 'critical':
      return 'error';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
    default:
      return 'neutral';
  }
}

/**
 * Formats a relative time string from an ISO timestamp.
 *
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Relative time string (e.g. '2h ago', '3d ago')
 */
function getRelativeTime(timestamp) {
  if (!timestamp) return '';

  try {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return formatDate(timestamp, DATE_FORMATS.DISPLAY);
  } catch {
    return '';
  }
}

/**
 * Individual notification item within the dropdown list.
 *
 * @param {object} props
 * @param {import('@/data/notifications').Notification} props.notification - The notification to display
 * @param {function(string): void} props.onMarkAsRead - Callback when marking as read
 * @param {function(string): void} props.onDismiss - Callback when dismissing
 * @returns {React.ReactElement}
 */
function NotificationItem({ notification, onMarkAsRead, onDismiss }) {
  const IconComponent = getNotificationIcon(notification.type);
  const iconColor = getNotificationIconColor(notification.type);
  const relativeTime = getRelativeTime(notification.timestamp);

  const handleMarkAsRead = useCallback(
    (e) => {
      e.stopPropagation();
      onMarkAsRead(notification.id);
    },
    [onMarkAsRead, notification.id]
  );

  const handleDismiss = useCallback(
    (e) => {
      e.stopPropagation();
      onDismiss(notification.id);
    },
    [onDismiss, notification.id]
  );

  return (
    <div
      className={cn(
        'group relative flex gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200',
        'hover:bg-slate-50',
        !notification.read && 'bg-humana-green-50/30'
      )}
      role="listitem"
    >
      {/* Unread indicator */}
      {!notification.read ? (
        <span
          className="absolute left-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-humana-green-500"
          aria-hidden="true"
        />
      ) : null}

      {/* Icon */}
      <div className="shrink-0 mt-0.5">
        <IconComponent
          className={cn('h-4 w-4', iconColor)}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-xs leading-relaxed line-clamp-2',
            notification.read ? 'text-slate-600' : 'text-slate-900 font-medium'
          )}
        >
          {notification.title}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-2xs text-slate-400">{relativeTime}</span>
          <Badge
            variant={getPriorityBadgeVariant(notification.priority)}
            size="sm"
          >
            {notification.priority}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-start gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {!notification.read ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleMarkAsRead}
                className={cn(
                  'inline-flex items-center justify-center rounded-md p-1 text-slate-400 transition-colors duration-200',
                  'hover:bg-slate-200 hover:text-slate-600',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                )}
                aria-label="Mark as read"
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4}>
              Mark as read
            </TooltipContent>
          </Tooltip>
        ) : null}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleDismiss}
              className={cn(
                'inline-flex items-center justify-center rounded-md p-1 text-slate-400 transition-colors duration-200',
                'hover:bg-slate-200 hover:text-slate-600',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
              )}
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4}>
            Dismiss
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

/**
 * NotificationBell component displaying a bell icon with unread count badge.
 * Opens a popover/dropdown with a list of recent notifications filtered by
 * the current persona. Supports mark as read, mark all as read, dismiss,
 * and view all actions.
 *
 * @param {object} props
 * @param {number} [props.maxVisible=8] - Maximum number of notifications to display in the dropdown
 * @param {string} [props.className] - Additional class names for the outer container
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const NotificationBell = forwardRef(function NotificationBell(
  { maxVisible = 8, className, ...props },
  ref
) {
  const { notifications, unreadCount, markAsRead, markAllRead, dismissNotification } =
    useNotifications();
  const { currentPersona } = usePersona();

  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const displayCount = unreadCount > 99 ? '99+' : String(unreadCount);

  const sortedNotifications = useMemo(() => {
    return [...notifications]
      .sort((a, b) => {
        // Unread first
        if (!a.read && b.read) return -1;
        if (a.read && !b.read) return 1;
        // Then by timestamp descending
        return new Date(b.timestamp) - new Date(a.timestamp);
      })
      .slice(0, maxVisible);
  }, [notifications, maxVisible]);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }, []);

  const handleMarkAsRead = useCallback(
    (notificationId) => {
      markAsRead(notificationId);
    },
    [markAsRead]
  );

  const handleDismiss = useCallback(
    (notificationId) => {
      dismissNotification(notificationId);
    },
    [dismissNotification]
  );

  const handleMarkAllRead = useCallback(() => {
    markAllRead();
  }, [markAllRead]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        handleClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleClose]);

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      {...props}
    >
      {/* Trigger button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={triggerRef}
            type="button"
            onClick={handleToggle}
            className={cn(
              'relative inline-flex items-center justify-center rounded-lg p-2 text-slate-500 transition-colors duration-200',
              'hover:bg-slate-100 hover:text-slate-700',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
              open && 'bg-slate-100 text-slate-700'
            )}
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : 'Notifications'
            }
            aria-haspopup="true"
            aria-expanded={open}
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            {unreadCount > 0 ? (
              <span
                className={cn(
                  'absolute -top-0.5 -right-0.5 inline-flex items-center justify-center rounded-full bg-danger-500 text-white font-medium',
                  unreadCount > 99
                    ? 'min-w-[1.375rem] h-[1.125rem] px-1 text-2xs'
                    : 'min-w-[1.125rem] h-[1.125rem] px-1 text-2xs'
                )}
                aria-hidden="true"
              >
                {displayCount}
              </span>
            ) : null}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {unreadCount > 0
            ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
            : 'No new notifications'}
        </TooltipContent>
      </Tooltip>

      {/* Dropdown panel */}
      {open ? (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-40 sm:hidden"
            onClick={handleClose}
            aria-hidden="true"
          />

          <div
            ref={dropdownRef}
            className={cn(
              'absolute right-0 z-50 mt-1 w-96 max-h-[32rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-dropdown',
              'animate-scale-in'
            )}
            role="dialog"
            aria-label="Notifications"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
                <span className="text-sm font-semibold text-slate-900">
                  Notifications
                </span>
                {unreadCount > 0 ? (
                  <Badge variant="primary" size="sm">
                    {unreadCount} new
                  </Badge>
                ) : null}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className={cn(
                          'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                          'hover:bg-slate-100 hover:text-slate-600',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                        )}
                        aria-label="Mark all as read"
                      >
                        <CheckCheck className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Mark all as read
                    </TooltipContent>
                  </Tooltip>
                ) : null}
                <button
                  type="button"
                  onClick={handleClose}
                  className={cn(
                    'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                    'hover:bg-slate-100 hover:text-slate-600',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                  )}
                  aria-label="Close notifications"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Notification list */}
            <div
              className="overflow-y-auto max-h-[24rem] p-1.5"
              role="list"
              aria-label="Recent notifications"
            >
              {sortedNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10">
                  <Bell className="h-8 w-8 text-slate-300" aria-hidden="true" />
                  <p className="text-sm text-slate-500">No notifications</p>
                  <p className="text-2xs text-slate-400">
                    You&rsquo;re all caught up!
                  </p>
                </div>
              ) : (
                sortedNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDismiss={handleDismiss}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 ? (
              <div className="border-t border-slate-100 px-4 py-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-2xs text-slate-400">
                    Showing {sortedNotifications.length} of {notifications.length}
                  </p>
                  <span className="text-2xs text-slate-400">
                    {currentPersona.name}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
});

NotificationBell.displayName = 'NotificationBell';

NotificationBell.propTypes = {
  maxVisible: PropTypes.number,
  className: PropTypes.string,
};

export { NotificationBell };
export default NotificationBell;