import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusPillVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium rounded-full transition-colors duration-200',
  {
    variants: {
      size: {
        sm: 'px-2 py-0.5 text-2xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Maps a status string to its corresponding color tokens.
 *
 * @param {string} status - The status value
 * @returns {{ bg: string, text: string, dot: string }} Color class tokens
 */
function resolveStatusColors(status) {
  switch (status) {
    case 'active':
    case 'on_track':
    case 'passed':
    case 'compliant':
    case 'approved':
    case 'completed':
    case 'success':
    case 'healthy':
    case 'achieved':
    case 'deployed':
    case 'resolved':
    case 'closed':
    case 'met':
    case 'stable':
    case 'available':
    case 'provisioned':
    case 'implemented':
    case 'fixed':
      return {
        bg: 'bg-success-50 border border-success-200',
        text: 'text-success-700',
        dot: 'bg-success-500',
      };

    case 'at_risk':
    case 'warning':
    case 'pending':
    case 'pending_review':
    case 'in_progress':
    case 'investigating':
    case 'partially_compliant':
    case 'monitoring':
    case 'degraded':
    case 'paused':
    case 'waived':
    case 'analysis':
    case 'intake':
    case 'acknowledged':
    case 'reserved':
    case 'stale':
    case 'mitigated':
      return {
        bg: 'bg-warning-50 border border-warning-200',
        text: 'text-warning-700',
        dot: 'bg-warning-500',
      };

    case 'critical':
    case 'error':
    case 'failed':
    case 'non_compliant':
    case 'rejected':
    case 'blocked':
    case 'down':
    case 'unhealthy':
    case 'not_met':
    case 'unstable':
    case 'rolled_back':
    case 'missed':
    case 'suspended':
    case 'locked':
      return {
        bg: 'bg-danger-50 border border-danger-200',
        text: 'text-danger-700',
        dot: 'bg-danger-500',
      };

    case 'info':
    case 'new':
    case 'open':
    case 'in-progress':
    case 'training':
    case 'upcoming':
    case 'provisioning':
    case 'maintenance':
      return {
        bg: 'bg-info-50 border border-info-200',
        text: 'text-info-700',
        dot: 'bg-info-500',
      };

    case 'inactive':
    case 'not_started':
    case 'disabled':
    case 'archived':
    case 'deferred':
    case 'dismissed':
    case 'not_run':
    case 'skipped':
    case 'idle':
    case 'draft':
    case 'deprecated':
    case 'not_applicable':
    case 'not_provisioned':
    case 'accepted_risk':
    case 'muted':
    case 'accepted':
      return {
        bg: 'bg-neutral-100 border border-neutral-200',
        text: 'text-neutral-700',
        dot: 'bg-neutral-400',
      };

    default:
      return {
        bg: 'bg-neutral-100 border border-neutral-200',
        text: 'text-neutral-700',
        dot: 'bg-neutral-400',
      };
  }
}

/**
 * Formats a status string into a human-readable label.
 *
 * @param {string} status - The raw status string
 * @returns {string} Formatted display label
 */
function formatStatusLabel(status) {
  if (!status || typeof status !== 'string') {
    return '';
  }

  return status
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * StatusPill component for displaying entity statuses with color-coded
 * backgrounds matching design system tokens. Supports a leading dot
 * indicator, custom labels, and multiple size variants.
 *
 * @param {object} props
 * @param {string} props.status - The status value used to determine color and default label
 * @param {string} [props.label] - Custom label to display instead of the formatted status
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Pill size variant
 * @param {boolean} [props.dot=false] - Whether to show a leading status dot indicator
 * @param {React.ReactNode} [props.iconLeft] - Icon element to render before the label
 * @param {React.ReactNode} [props.iconRight] - Icon element to render after the label
 * @param {string} [props.className] - Additional class names
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const StatusPill = forwardRef(function StatusPill(
  {
    status,
    label,
    size,
    dot = false,
    iconLeft,
    iconRight,
    className,
    ...props
  },
  ref
) {
  const resolvedStatus = status || '';
  const colors = resolveStatusColors(resolvedStatus);
  const displayLabel = label || formatStatusLabel(resolvedStatus);

  return (
    <span
      ref={ref}
      className={cn(
        statusPillVariants({ size }),
        colors.bg,
        colors.text,
        className
      )}
      {...props}
    >
      {dot ? (
        <span
          className={cn('shrink-0 rounded-full', colors.dot, {
            'h-1.5 w-1.5 mr-1': size === 'sm',
            'h-1.5 w-1.5 mr-1.5': size === 'md' || !size,
            'h-2 w-2 mr-1.5': size === 'lg',
          })}
          aria-hidden="true"
        />
      ) : iconLeft ? (
        <span className="shrink-0 mr-1" aria-hidden="true">
          {iconLeft}
        </span>
      ) : null}
      {displayLabel}
      {iconRight ? (
        <span className="shrink-0 ml-1" aria-hidden="true">
          {iconRight}
        </span>
      ) : null}
    </span>
  );
});

StatusPill.displayName = 'StatusPill';

StatusPill.propTypes = {
  status: PropTypes.string.isRequired,
  label: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  dot: PropTypes.bool,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  className: PropTypes.string,
};

export { StatusPill, statusPillVariants, resolveStatusColors, formatStatusLabel };
export default StatusPill;