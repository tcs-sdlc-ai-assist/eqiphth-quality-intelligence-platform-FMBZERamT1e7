import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

/**
 * Size map for the brand logo. Controls the mark size and wordmark type scale.
 * @type {Object<string, { mark: number, eqip: string, tag: string, gap: string }>}
 */
const sizeMap = {
  xs: { mark: 22, eqip: 'text-base', humana: 'text-[10px]', tag: 'text-[9px]', gap: 'gap-2' },
  sm: { mark: 26, eqip: 'text-lg', humana: 'text-xs', tag: 'text-[10px]', gap: 'gap-2.5' },
  md: { mark: 32, eqip: 'text-2xl', humana: 'text-sm', tag: 'text-[11px]', gap: 'gap-3' },
  lg: { mark: 38, eqip: 'text-3xl', humana: 'text-base', tag: 'text-xs', gap: 'gap-3' },
  xl: { mark: 46, eqip: 'text-4xl', humana: 'text-lg', tag: 'text-sm', gap: 'gap-3.5' },
  '2xl': { mark: 56, eqip: 'text-5xl', humana: 'text-xl', tag: 'text-base', gap: 'gap-4' },
};

/**
 * The EQIP hexagonal cube mark — an isometric hexagon split into blue and
 * green facets. Rendered inline so it never depends on external assets.
 *
 * @param {object} props
 * @param {number} props.size - Pixel width/height of the mark
 * @returns {React.ReactElement}
 */
function EqipMark({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Top face (green) */}
      <path d="M24 3 L43 14 L24 25 L5 14 Z" fill="#16b364" />
      {/* Left face (mid blue) */}
      <path d="M5 14 L24 25 L24 45 L5 34 Z" fill="#2f6fed" />
      {/* Right face (deep blue) */}
      <path d="M43 14 L43 34 L24 45 L24 25 Z" fill="#1b4fc4" />
      {/* Inner highlight */}
      <path d="M24 25 L43 14 L24 3 Z" fill="#3acd7e" fillOpacity="0.55" />
    </svg>
  );
}

EqipMark.propTypes = {
  size: PropTypes.number.isRequired,
};

/**
 * Brand logo for the EQIP Quality Platform: an inline geometric hex mark plus
 * the "EQIP" wordmark and an optional tagline. Supports light (for dark
 * backgrounds like the sidebar) and dark (for light backgrounds) variants.
 *
 * @param {object} props
 * @param {'light'|'dark'} [props.variant='light'] - Color variant (light = white text for dark backgrounds)
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'2xl'} [props.size='md'] - Overall size
 * @param {string} [props.tagline] - Optional tagline shown under the wordmark
 * @param {boolean} [props.showText=true] - Whether to render the wordmark next to the mark
 * @param {boolean} [props.showHumana=true] - Whether to render the "Humana." sub-wordmark under "EQIP"
 * @param {string} [props.className] - Additional class names for the container
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const BrandLogo = forwardRef(function BrandLogo(
  { variant = 'light', size = 'md', tagline, showText = true, showHumana = true, className, ...props },
  ref
) {
  const s = sizeMap[size] || sizeMap.md;
  const isLight = variant !== 'dark';
  const eqipColor = isLight ? 'text-white' : 'text-navy-900';
  const humanaColor = isLight ? 'text-humana-green-400' : 'text-humana-green-600';
  const tagColor = isLight ? 'text-slate-400' : 'text-slate-500';

  return (
    <span
      ref={ref}
      className={cn('inline-flex items-center', s.gap, className)}
      role="img"
      aria-label="EQIP Humana Quality Platform"
      {...props}
    >
      <EqipMark size={s.mark} />
      {showText ? (
        <span className="flex max-w-[150px] flex-col leading-none">
          <span className={cn('font-bold tracking-tight', s.eqip, eqipColor)}>EQIP</span>
          {showHumana ? (
            <span className={cn('font-semibold leading-tight tracking-tight', s.humana, humanaColor)}>
              Humana.
            </span>
          ) : null}
          {tagline ? (
            <span className={cn('mt-1 font-medium leading-tight tracking-wide', s.tag, tagColor)}>
              {tagline}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
});

BrandLogo.displayName = 'BrandLogo';

BrandLogo.propTypes = {
  variant: PropTypes.oneOf(['light', 'dark']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  tagline: PropTypes.string,
  showText: PropTypes.bool,
  showHumana: PropTypes.bool,
  className: PropTypes.string,
};

export { BrandLogo };
export default BrandLogo;
