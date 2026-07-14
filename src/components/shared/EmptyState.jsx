import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cva } from 'class-variance-authority';
import {
  Search,
  FileX,
  Inbox,
  Database,
  BarChart2,
  FolderOpen,
  AlertCircle,
  PackageOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const emptyStateVariants = cva(
  'flex flex-col items-center justify-center text-center',
  {
    variants: {
      size: {
        sm: 'gap-2 py-6',
        md: 'gap-3 py-10',
        lg: 'gap-4 py-16',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const iconSizeMap = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

const titleSizeMap = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const messageSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
};

/**
 * Resolves the default icon component based on the type prop.
 *
 * @param {string} type - The empty state type
 * @returns {React.ElementType} The icon component
 */
function getDefaultIcon(type) {
  switch (type) {
    case 'search':
    case 'no_results':
      return Search;
    case 'no_data':
    case 'empty':
      return Inbox;
    case 'no_content':
      return FolderOpen;
    case 'no_file':
      return FileX;
    case 'no_records':
      return Database;
    case 'no_chart':
    case 'no_metrics':
      return BarChart2;
    case 'error':
      return AlertCircle;
    case 'no_items':
      return PackageOpen;
    default:
      return Inbox;
  }
}

/**
 * Empty state component displayed when no data matches filters or a section
 * has no content. Shows an icon, title, descriptive message, and an optional
 * action button. Supports multiple visual types and size variants.
 *
 * @param {object} props
 * @param {string} [props.title] - Title text displayed below the icon
 * @param {string} [props.message] - Descriptive message displayed below the title
 * @param {string} [props.type='empty'] - Empty state type for default icon selection (search, no_results, no_data, empty, no_content, no_file, no_records, no_chart, no_metrics, error, no_items)
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size variant controlling spacing and icon/text sizes
 * @param {React.ReactNode} [props.icon] - Custom icon element (overrides type-based icon)
 * @param {string} [props.actionLabel] - Label for the optional action button
 * @param {function} [props.onAction] - Callback when the action button is clicked
 * @param {'primary'|'secondary'|'outline'|'ghost'} [props.actionVariant='primary'] - Button variant for the action button
 * @param {React.ReactNode} [props.actionIcon] - Icon element for the action button
 * @param {boolean} [props.bordered=false] - Whether to display a dashed border around the empty state
 * @param {string} [props.className] - Additional class names for the container
 * @param {React.ReactNode} [props.children] - Additional content rendered below the message
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const EmptyState = forwardRef(function EmptyState(
  {
    title,
    message,
    type = 'empty',
    size = 'md',
    icon,
    actionLabel,
    onAction,
    actionVariant = 'primary',
    actionIcon,
    bordered = false,
    className,
    children,
    ...props
  },
  ref
) {
  const resolvedSize = size || 'md';
  const IconComponent = icon ? null : getDefaultIcon(type);
  const iconSize = iconSizeMap[resolvedSize] || iconSizeMap.md;
  const titleSize = titleSizeMap[resolvedSize] || titleSizeMap.md;
  const messageSize = messageSizeMap[resolvedSize] || messageSizeMap.md;

  const hasAction = actionLabel && typeof onAction === 'function';

  const defaultTitle = type === 'search' || type === 'no_results'
    ? 'No results found'
    : type === 'error'
      ? 'Something went wrong'
      : 'No data available';

  const defaultMessage = type === 'search' || type === 'no_results'
    ? 'Try adjusting your search or filter criteria.'
    : type === 'error'
      ? 'An error occurred while loading data. Please try again.'
      : 'There is no data to display at this time.';

  const resolvedTitle = title || defaultTitle;
  const resolvedMessage = message !== undefined ? message : defaultMessage;

  return (
    <div
      ref={ref}
      className={cn(
        emptyStateVariants({ size: resolvedSize }),
        bordered &&
          'rounded-xl border border-dashed border-slate-200 bg-slate-50/50',
        className
      )}
      role="status"
      aria-label={resolvedTitle}
      {...props}
    >
      {/* Icon */}
      <div className="flex items-center justify-center">
        {icon ? (
          <span className="text-slate-300" aria-hidden="true">
            {icon}
          </span>
        ) : IconComponent ? (
          <IconComponent
            className={cn(iconSize, 'text-slate-300')}
            aria-hidden="true"
          />
        ) : null}
      </div>

      {/* Text content */}
      <div className="flex flex-col items-center gap-1 max-w-sm">
        {resolvedTitle ? (
          <h3
            className={cn(
              'font-semibold text-slate-900',
              titleSize
            )}
          >
            {resolvedTitle}
          </h3>
        ) : null}
        {resolvedMessage ? (
          <p className={cn('text-slate-500', messageSize)}>
            {resolvedMessage}
          </p>
        ) : null}
      </div>

      {/* Children */}
      {children ? (
        <div className="mt-1">
          {children}
        </div>
      ) : null}

      {/* Action button */}
      {hasAction ? (
        <div className="mt-2">
          <Button
            variant={actionVariant}
            size={resolvedSize === 'lg' ? 'md' : 'sm'}
            onClick={onAction}
            iconLeft={actionIcon || undefined}
          >
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

EmptyState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.oneOf([
    'search',
    'no_results',
    'no_data',
    'empty',
    'no_content',
    'no_file',
    'no_records',
    'no_chart',
    'no_metrics',
    'error',
    'no_items',
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.node,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  actionVariant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
  actionIcon: PropTypes.node,
  bordered: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { EmptyState };
export default EmptyState;