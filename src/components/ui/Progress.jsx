import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const progressContainerVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-slate-200',
  {
    variants: {
      size: {
        xs: 'h-1',
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
        xl: 'h-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const progressBarVariants = cva(
  'h-full rounded-full transition-all duration-500 ease-out',
  {
    variants: {
      variant: {
        success: 'bg-success-500',
        warning: 'bg-warning-500',
        error: 'bg-danger-500',
        info: 'bg-info-500',
        primary: 'bg-humana-green-500',
        neutral: 'bg-slate-500',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

/**
 * Resolves the variant automatically based on the percentage value
 * when no explicit variant is provided.
 *
 * @param {number} percentage - The current percentage (0-100)
 * @returns {'success'|'warning'|'error'|'primary'} The resolved variant
 */
function resolveAutoVariant(percentage) {
  if (percentage >= 90) return 'success';
  if (percentage >= 70) return 'primary';
  if (percentage >= 50) return 'warning';
  return 'error';
}

/**
 * Reusable Progress bar component with value, max, label, color variants,
 * and optional value display. Used for quality scores, completion percentages,
 * and other metric visualizations.
 *
 * @param {object} props
 * @param {number} [props.value=0] - Current progress value
 * @param {number} [props.max=100] - Maximum progress value
 * @param {'success'|'warning'|'error'|'info'|'primary'|'neutral'|'auto'} [props.variant='primary'] - Color variant. 'auto' resolves based on percentage.
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Progress bar height
 * @param {string} [props.label] - Label text displayed above the progress bar
 * @param {boolean} [props.showValue=false] - Whether to display the current percentage value
 * @param {string} [props.valueFormat='percent'] - Format for the displayed value ('percent' or 'fraction')
 * @param {boolean} [props.animate=true] - Whether to animate the progress bar width transition
 * @param {string} [props.className] - Additional class names for the container wrapper
 * @param {string} [props.barClassName] - Additional class names for the progress bar track
 * @param {string} [props.indicatorClassName] - Additional class names for the progress bar indicator
 * @param {React.Ref} ref - Forwarded ref applied to the outer wrapper div
 * @returns {React.ReactElement}
 */
const Progress = forwardRef(function Progress(
  {
    value = 0,
    max = 100,
    variant = 'primary',
    size,
    label,
    showValue = false,
    valueFormat = 'percent',
    animate = true,
    className,
    barClassName,
    indicatorClassName,
    ...props
  },
  ref
) {
  const safeMax = max > 0 ? max : 100;
  const clampedValue = Math.min(Math.max(value, 0), safeMax);
  const percentage = Math.round((clampedValue / safeMax) * 100);

  const resolvedVariant = variant === 'auto' ? resolveAutoVariant(percentage) : variant;

  const displayValue =
    valueFormat === 'fraction'
      ? `${clampedValue}/${safeMax}`
      : `${percentage}%`;

  return (
    <div
      ref={ref}
      className={cn('flex flex-col gap-1.5', className)}
      {...props}
    >
      {(label || showValue) ? (
        <div className="flex items-center justify-between">
          {label ? (
            <span className="text-sm font-medium text-slate-700">
              {label}
            </span>
          ) : null}
          {showValue ? (
            <span className="text-sm font-medium text-slate-600">
              {displayValue}
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        className={cn(progressContainerVariants({ size }), barClassName)}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-label={label || `Progress: ${percentage}%`}
      >
        <div
          className={cn(
            progressBarVariants({ variant: resolvedVariant }),
            !animate && 'transition-none',
            indicatorClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

Progress.displayName = 'Progress';

Progress.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info', 'primary', 'neutral', 'auto']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  label: PropTypes.string,
  showValue: PropTypes.bool,
  valueFormat: PropTypes.oneOf(['percent', 'fraction']),
  animate: PropTypes.bool,
  className: PropTypes.string,
  barClassName: PropTypes.string,
  indicatorClassName: PropTypes.string,
};

export { Progress, progressContainerVariants, progressBarVariants };
export default Progress;