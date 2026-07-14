import { forwardRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { cva } from 'class-variance-authority';
import {
  X,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const bannerVariants = cva(
  'relative w-full rounded-xl border p-4 transition-all duration-200',
  {
    variants: {
      variant: {
        insight:
          'bg-humana-green-50 border-humana-green-200 text-humana-green-900',
        recommendation:
          'bg-info-50 border-info-200 text-info-900',
        warning:
          'bg-warning-50 border-warning-200 text-warning-900',
        critical:
          'bg-danger-50 border-danger-200 text-danger-900',
        success:
          'bg-success-50 border-success-200 text-success-900',
        neutral:
          'bg-slate-50 border-slate-200 text-slate-900',
      },
    },
    defaultVariants: {
      variant: 'insight',
    },
  }
);

const iconColorMap = {
  insight: 'text-humana-green-500',
  recommendation: 'text-info-500',
  warning: 'text-warning-500',
  critical: 'text-danger-500',
  success: 'text-success-500',
  neutral: 'text-slate-400',
};

/**
 * Resolves the icon component based on the variant.
 *
 * @param {string} variant - Banner variant
 * @returns {React.ElementType} The icon component
 */
function getVariantIcon(variant) {
  switch (variant) {
    case 'insight':
      return Sparkles;
    case 'recommendation':
      return Lightbulb;
    case 'warning':
      return AlertTriangle;
    case 'critical':
      return AlertCircle;
    case 'success':
      return CheckCircle;
    case 'neutral':
    default:
      return Info;
  }
}

/**
 * InsightBanner component for displaying AI-generated insights,
 * recommendations, or alerts at the top of screens. Supports dismiss,
 * expand/collapse for additional detail, and configurable action buttons.
 *
 * @param {object} props
 * @param {string} props.title - Display title for the insight banner
 * @param {string} [props.message] - Short message or summary text
 * @param {string} [props.detail] - Expandable detail content shown when expanded
 * @param {'insight'|'recommendation'|'warning'|'critical'|'success'|'neutral'} [props.variant='insight'] - Visual variant
 * @param {React.ReactNode} [props.icon] - Custom icon element (overrides variant icon)
 * @param {boolean} [props.dismissible=true] - Whether the banner can be dismissed
 * @param {boolean} [props.expandable=false] - Whether the banner has expandable detail content
 * @param {boolean} [props.defaultExpanded=false] - Whether the banner starts expanded (uncontrolled)
 * @param {boolean} [props.expanded] - Controlled expanded state
 * @param {function(boolean): void} [props.onExpandedChange] - Callback when expanded state changes
 * @param {function(): void} [props.onDismiss] - Callback when the banner is dismissed
 * @param {string} [props.actionLabel] - Label for the primary action button
 * @param {function(): void} [props.onAction] - Callback when the primary action button is clicked
 * @param {string} [props.secondaryActionLabel] - Label for the secondary action button
 * @param {function(): void} [props.onSecondaryAction] - Callback when the secondary action button is clicked
 * @param {number} [props.confidence] - AI confidence score (0-100) displayed as a badge
 * @param {string} [props.source] - Source label (e.g. 'AI Analysis', 'Quality Monitor Agent')
 * @param {string} [props.timestamp] - Timestamp string for when the insight was generated
 * @param {string} [props.className] - Additional class names for the banner container
 * @param {React.ReactNode} [props.children] - Additional content rendered below the message
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement|null}
 */
const InsightBanner = forwardRef(function InsightBanner(
  {
    title,
    message,
    detail,
    variant = 'insight',
    icon,
    dismissible = true,
    expandable = false,
    defaultExpanded = false,
    expanded: controlledExpanded,
    onExpandedChange,
    onDismiss,
    actionLabel,
    onAction,
    secondaryActionLabel,
    onSecondaryAction,
    confidence,
    source,
    timestamp,
    className,
    children,
    ...props
  },
  ref
) {
  const [dismissed, setDismissed] = useState(false);

  const isExpandedControlled = controlledExpanded !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = isExpandedControlled ? controlledExpanded : internalExpanded;

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    if (typeof onDismiss === 'function') {
      onDismiss();
    }
  }, [onDismiss]);

  const handleToggleExpand = useCallback(() => {
    if (!expandable) {
      return;
    }

    const nextExpanded = !isExpanded;

    if (!isExpandedControlled) {
      setInternalExpanded(nextExpanded);
    }

    if (typeof onExpandedChange === 'function') {
      onExpandedChange(nextExpanded);
    }
  }, [expandable, isExpanded, isExpandedControlled, onExpandedChange]);

  const handleAction = useCallback(() => {
    if (typeof onAction === 'function') {
      onAction();
    }
  }, [onAction]);

  const handleSecondaryAction = useCallback(() => {
    if (typeof onSecondaryAction === 'function') {
      onSecondaryAction();
    }
  }, [onSecondaryAction]);

  if (dismissed) {
    return null;
  }

  const resolvedVariant = variant || 'insight';
  const IconComponent = icon ? null : getVariantIcon(resolvedVariant);
  const iconColor = iconColorMap[resolvedVariant] || iconColorMap.neutral;

  const hasActions = (actionLabel && typeof onAction === 'function') ||
    (secondaryActionLabel && typeof onSecondaryAction === 'function');

  const hasMeta = source || timestamp || (confidence !== null && confidence !== undefined && Number.isFinite(confidence));

  return (
    <div
      ref={ref}
      className={cn(bannerVariants({ variant: resolvedVariant }), className)}
      role="status"
      aria-label={title || 'Insight banner'}
      {...props}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="shrink-0 mt-0.5">
          {icon ? (
            <span className={cn(iconColor)} aria-hidden="true">
              {icon}
            </span>
          ) : IconComponent ? (
            <IconComponent
              className={cn('h-5 w-5', iconColor)}
              aria-hidden="true"
            />
          ) : null}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {title ? (
                <h4 className="text-sm font-semibold leading-tight">
                  {title}
                </h4>
              ) : null}
              {message ? (
                <p className={cn('text-sm leading-relaxed', title ? 'mt-1' : '')}>
                  {message}
                </p>
              ) : null}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 shrink-0">
              {expandable && detail ? (
                <button
                  type="button"
                  onClick={handleToggleExpand}
                  className={cn(
                    'inline-flex items-center justify-center rounded-md p-1 transition-colors duration-200',
                    'hover:bg-black/5',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2'
                  )}
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              ) : null}
              {dismissible ? (
                <button
                  type="button"
                  onClick={handleDismiss}
                  className={cn(
                    'inline-flex items-center justify-center rounded-md p-1 transition-colors duration-200',
                    'hover:bg-black/5',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2'
                  )}
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>

          {/* Meta row */}
          {hasMeta ? (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              {source ? (
                <span className="inline-flex items-center gap-1 text-2xs font-medium opacity-75">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  {source}
                </span>
              ) : null}
              {confidence !== null && confidence !== undefined && Number.isFinite(confidence) ? (
                <span className="inline-flex items-center gap-1 text-2xs font-medium opacity-75">
                  Confidence: {Math.round(confidence)}%
                </span>
              ) : null}
              {timestamp ? (
                <span className="text-2xs opacity-60">
                  {timestamp}
                </span>
              ) : null}
            </div>
          ) : null}

          {/* Expandable detail */}
          {expandable && detail && isExpanded ? (
            <div className="mt-3 rounded-lg bg-white/50 p-3 text-sm leading-relaxed">
              {detail}
            </div>
          ) : null}

          {/* Children */}
          {children ? (
            <div className="mt-3">
              {children}
            </div>
          ) : null}

          {/* Action buttons */}
          {hasActions ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {actionLabel && typeof onAction === 'function' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAction}
                  iconRight={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  {actionLabel}
                </Button>
              ) : null}
              {secondaryActionLabel && typeof onSecondaryAction === 'function' ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSecondaryAction}
                >
                  {secondaryActionLabel}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

InsightBanner.displayName = 'InsightBanner';

InsightBanner.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  detail: PropTypes.string,
  variant: PropTypes.oneOf(['insight', 'recommendation', 'warning', 'critical', 'success', 'neutral']),
  icon: PropTypes.node,
  dismissible: PropTypes.bool,
  expandable: PropTypes.bool,
  defaultExpanded: PropTypes.bool,
  expanded: PropTypes.bool,
  onExpandedChange: PropTypes.func,
  onDismiss: PropTypes.func,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  secondaryActionLabel: PropTypes.string,
  onSecondaryAction: PropTypes.func,
  confidence: PropTypes.number,
  source: PropTypes.string,
  timestamp: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { InsightBanner, bannerVariants };
export default InsightBanner;