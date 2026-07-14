import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

const avatarVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-600 font-medium select-none',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-2xs',
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
        '2xl': 'h-20 w-20 text-xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const statusIndicatorVariants = cva(
  'absolute bottom-0 right-0 block rounded-full border-2 border-white',
  {
    variants: {
      size: {
        xs: 'h-1.5 w-1.5',
        sm: 'h-2 w-2',
        md: 'h-2.5 w-2.5',
        lg: 'h-3 w-3',
        xl: 'h-3.5 w-3.5',
        '2xl': 'h-4 w-4',
      },
      status: {
        online: 'bg-success-500',
        offline: 'bg-slate-400',
        busy: 'bg-danger-500',
        away: 'bg-warning-500',
      },
    },
    defaultVariants: {
      size: 'md',
      status: 'online',
    },
  }
);

/**
 * Reusable Avatar component with image support, fallback initials,
 * size variants, and optional status indicator. Used for persona
 * display in header and profile sections.
 *
 * @param {object} props
 * @param {string} [props.src] - Image source URL
 * @param {string} [props.alt] - Alt text for the image
 * @param {string} [props.name] - Full name used to generate fallback initials
 * @param {string} [props.initials] - Explicit initials to display (overrides name-derived initials)
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'2xl'} [props.size='md'] - Avatar size variant
 * @param {'online'|'offline'|'busy'|'away'} [props.status] - Optional status indicator
 * @param {string} [props.className] - Additional class names for the avatar container
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const Avatar = forwardRef(function Avatar(
  {
    src,
    alt,
    name,
    initials,
    size,
    status,
    className,
    ...props
  },
  ref
) {
  const [imageError, setImageError] = useState(false);

  const showImage = src && !imageError;
  const resolvedInitials = initials || (name ? getInitials(name, 2) : '');
  const resolvedAlt = alt || name || 'Avatar';

  return (
    <span
      ref={ref}
      className={cn(avatarVariants({ size }), className)}
      role="img"
      aria-label={resolvedAlt}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={resolvedAlt}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
          draggable={false}
        />
      ) : resolvedInitials ? (
        <span aria-hidden="true">{resolvedInitials}</span>
      ) : (
        <svg
          className={cn('text-slate-400', {
            'h-3 w-3': size === 'xs',
            'h-4 w-4': size === 'sm',
            'h-5 w-5': size === 'md' || !size,
            'h-6 w-6': size === 'lg',
            'h-8 w-8': size === 'xl',
            'h-10 w-10': size === '2xl',
          })}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .7.5 1.2 1.2 1.2h16.8c.7 0 1.2-.5 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      )}
      {status ? (
        <span
          className={cn(statusIndicatorVariants({ size, status }))}
          aria-label={`Status: ${status}`}
        />
      ) : null}
    </span>
  );
});

Avatar.displayName = 'Avatar';

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  initials: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  status: PropTypes.oneOf(['online', 'offline', 'busy', 'away']),
  className: PropTypes.string,
};

export { Avatar, avatarVariants };
export default Avatar;