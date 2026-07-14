import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

/**
 * Reusable Skeleton loading placeholder component with configurable
 * width, height, shape, and animation for loading states.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {'pulse'|'shimmer'|'none'} [props.animation='pulse'] - Animation style
 * @param {'rounded'|'circle'|'square'|'text'} [props.variant='rounded'] - Shape variant
 * @param {string|number} [props.width] - Width (CSS value or number in px)
 * @param {string|number} [props.height] - Height (CSS value or number in px)
 * @param {number} [props.lines] - Number of text lines to render (only used when variant is 'text')
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const Skeleton = forwardRef(function Skeleton(
  {
    className,
    animation = 'pulse',
    variant = 'rounded',
    width,
    height,
    lines,
    ...props
  },
  ref
) {
  const animationClass = {
    pulse: 'animate-pulse',
    shimmer: 'shimmer',
    none: '',
  }[animation] || 'animate-pulse';

  const variantClass = {
    rounded: 'rounded-lg',
    circle: 'rounded-full',
    square: 'rounded-none',
    text: 'rounded',
  }[variant] || 'rounded-lg';

  const style = {};
  if (width !== undefined) {
    style.width = typeof width === 'number' ? `${width}px` : width;
  }
  if (height !== undefined) {
    style.height = typeof height === 'number' ? `${height}px` : height;
  }

  if (variant === 'text' && typeof lines === 'number' && lines > 1) {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-2', className)}
        role="status"
        aria-label="Loading"
        aria-busy="true"
        {...props}
      >
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'bg-slate-200',
              animationClass,
              variantClass,
              index === lines - 1 ? 'w-3/4' : 'w-full',
              'h-4'
            )}
            style={index === 0 ? style : undefined}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        'bg-slate-200',
        animationClass,
        variantClass,
        className
      )}
      style={style}
      role="status"
      aria-label="Loading"
      aria-busy="true"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
});

Skeleton.displayName = 'Skeleton';

Skeleton.propTypes = {
  className: PropTypes.string,
  animation: PropTypes.oneOf(['pulse', 'shimmer', 'none']),
  variant: PropTypes.oneOf(['rounded', 'circle', 'square', 'text']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lines: PropTypes.number,
};

export { Skeleton };
export default Skeleton;