import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

/**
 * Size map for the brand logo component.
 * @type {Object<string, { width: string, height: string, textSize: string }>}
 */
const sizeMap = {
  xs: { width: 'w-20', height: 'h-6', textSize: 'text-sm' },
  sm: { width: 'w-24', height: 'h-7', textSize: 'text-base' },
  md: { width: 'w-32', height: 'h-8', textSize: 'text-lg' },
  lg: { width: 'w-40', height: 'h-10', textSize: 'text-xl' },
  xl: { width: 'w-48', height: 'h-12', textSize: 'text-2xl' },
  '2xl': { width: 'w-56', height: 'h-14', textSize: 'text-3xl' },
};

/**
 * Resolves the logo image source path based on the variant.
 *
 * @param {'light'|'dark'} variant - The logo variant
 * @returns {string} The image source path
 */
function resolveLogoSrc(variant) {
  if (variant === 'dark') {
    return '/brand/eqip-logo-dark.svg';
  }
  return '/brand/eqip-logo-light.svg';
}

/**
 * Brand logo component that renders the EQIP/Humana brand logo from
 * /public/brand/ assets. Supports light/dark variants and configurable
 * size. Falls back to a styled text logo when the image asset fails
 * to load. Used in sidebar, header, and footer.
 *
 * @param {object} props
 * @param {'light'|'dark'} [props.variant='light'] - Logo color variant (light for dark backgrounds, dark for light backgrounds)
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'2xl'} [props.size='md'] - Logo size variant
 * @param {boolean} [props.showText=true] - Whether to show the text fallback when image is unavailable
 * @param {string} [props.className] - Additional class names for the container
 * @param {string} [props.imgClassName] - Additional class names for the image element
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const BrandLogo = forwardRef(function BrandLogo(
  {
    variant = 'light',
    size = 'md',
    showText = true,
    className,
    imgClassName,
    ...props
  },
  ref
) {
  const resolvedSize = sizeMap[size] || sizeMap.md;
  const resolvedVariant = variant === 'dark' ? 'dark' : 'light';
  const logoSrc = resolveLogoSrc(resolvedVariant);

  const textColor =
    resolvedVariant === 'dark'
      ? 'text-slate-900'
      : 'text-white';

  const accentColor =
    resolvedVariant === 'dark'
      ? 'text-humana-green-500'
      : 'text-humana-green-400';

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex shrink-0 items-center',
        className
      )}
      role="img"
      aria-label="EQIP Quality Platform"
      {...props}
    >
      <img
        src={logoSrc}
        alt="EQIP Quality Platform"
        className={cn(
          resolvedSize.width,
          resolvedSize.height,
          'object-contain',
          imgClassName
        )}
        draggable={false}
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = 'none';

          if (!showText) {
            return;
          }

          const parent = target.parentElement;
          if (parent && !parent.querySelector('[data-brand-fallback]')) {
            const fallback = document.createElement('span');
            fallback.setAttribute('data-brand-fallback', 'true');
            fallback.setAttribute('aria-hidden', 'true');
            fallback.className = cn(
              'inline-flex items-center gap-1 font-semibold tracking-tight select-none',
              resolvedSize.textSize,
              textColor
            );

            const eqipSpan = document.createElement('span');
            eqipSpan.className = cn(accentColor, 'font-bold');
            eqipSpan.textContent = 'EQIP';

            const qualitySpan = document.createElement('span');
            qualitySpan.textContent = 'Quality';

            fallback.appendChild(eqipSpan);
            fallback.appendChild(qualitySpan);
            parent.appendChild(fallback);
          }
        }}
      />
    </span>
  );
});

BrandLogo.displayName = 'BrandLogo';

BrandLogo.propTypes = {
  variant: PropTypes.oneOf(['light', 'dark']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  showText: PropTypes.bool,
  className: PropTypes.string,
  imgClassName: PropTypes.string,
};

export { BrandLogo };
export default BrandLogo;