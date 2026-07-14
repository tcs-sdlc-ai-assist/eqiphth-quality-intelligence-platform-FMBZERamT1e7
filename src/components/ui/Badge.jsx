import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        success:
          'bg-success-50 text-success-700 border border-success-200',
        warning:
          'bg-warning-50 text-warning-700 border border-warning-200',
        error:
          'bg-danger-50 text-danger-700 border border-danger-200',
        info:
          'bg-info-50 text-info-700 border border-info-200',
        neutral:
          'bg-neutral-100 text-neutral-700 border border-neutral-200',
        primary:
          'bg-humana-green-50 text-humana-green-700 border border-humana-green-200',
        outline:
          'bg-transparent text-slate-700 border border-slate-300',
      },
      size: {
        sm: 'rounded-full px-2 py-0.5 text-2xs',
        md: 'rounded-full px-2.5 py-0.5 text-xs',
        lg: 'rounded-full px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  }
);

/**
 * Reusable Badge/StatusPill component with variant and size support.
 *
 * @param {object} props
 * @param {'success'|'warning'|'error'|'info'|'neutral'|'primary'|'outline'} [props.variant='neutral'] - Visual variant
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Badge size
 * @param {boolean} [props.dot=false] - Whether to show a leading status dot indicator
 * @param {React.ReactNode} [props.iconLeft] - Icon element to render before children
 * @param {React.ReactNode} [props.iconRight] - Icon element to render after children
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Badge content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const Badge = forwardRef(function Badge(
  {
    variant,
    size,
    dot = false,
    iconLeft,
    iconRight,
    className,
    children,
    ...props
  },
  ref
) {
  const dotColorMap = {
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-danger-500',
    info: 'bg-info-500',
    neutral: 'bg-neutral-400',
    primary: 'bg-humana-green-500',
    outline: 'bg-slate-400',
  };

  const resolvedVariant = variant || 'neutral';
  const dotColor = dotColorMap[resolvedVariant] || dotColorMap.neutral;

  return (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot ? (
        <span
          className={cn('shrink-0 rounded-full', dotColor, {
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
      {children}
      {iconRight ? (
        <span className="shrink-0 ml-1" aria-hidden="true">
          {iconRight}
        </span>
      ) : null}
    </span>
  );
});

Badge.displayName = 'Badge';

Badge.propTypes = {
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info', 'neutral', 'primary', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  dot: PropTypes.bool,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Badge, badgeVariants };
export default Badge;