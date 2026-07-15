import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

/**
 * Size map for the brand logo — pixel height of the rendered artwork per size
 * key, with an optional explicit `width` override (used by `md` to pin the
 * exact 35x100 dimensions requested for the sidebar logo instead of scaling
 * by the source artwork's natural aspect ratio).
 * @type {Object<string, { height: number, width?: number }>}
 */
const sizeMap = {
  xs: { height: 36 },
  sm: { height: 44 },
  md: { height: 35, width: 100 },
  lg: { height: 72 },
  xl: { height: 88 },
  '2xl': { height: 104 },
};

/** Natural pixel aspect ratio (width / height) of the source logo crops. */
const WORDMARK_ASPECT = 559 / 211;
const MONOGRAM_ASPECT = 208 / 217;

/**
 * Brand logo for the EQIP Quality Platform. Renders the official EQIP mark
 * artwork (or just the Q monogram when space is tight) centered, with the
 * "Enterprise Quality Intelligence Platform" name and an optional "Humana."
 * sub-line rendered as live white text underneath — the source PNG is
 * cropped to the mark only (no baked-in caption) so this text stays legible
 * on dark surfaces like the sidebar.
 *
 * @param {object} props
 * @param {'light'|'dark'} [props.variant='light'] - Color variant (light = white sub-text for dark backgrounds)
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'2xl'} [props.size='md'] - Overall size
 * @param {boolean} [props.showText=true] - Whether to render the full EQIP mark + caption (false = compact Q monogram only)
 * @param {boolean} [props.showHumana=true] - Whether to render the "Humana." sub-wordmark under the caption
 * @param {boolean} [props.showCaption=true] - Whether to render the "Enterprise Quality Intelligence Platform" caption
 * @param {string} [props.className] - Additional class names for the container
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const BrandLogo = forwardRef(function BrandLogo(
  { variant = 'light', size = 'md', showText = true, showHumana = true, showCaption = true, className, ...props },
  ref
) {
  const { height: markHeight, width: markWidth } = sizeMap[size] || sizeMap.md;
  const isLight = variant !== 'dark';
  const humanaColor = isLight ? 'text-humana-green-400' : 'text-humana-green-600';
  const captionColor = isLight ? 'text-white' : 'text-navy-900';

  if (!showText) {
    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center', className)}
        role="img"
        aria-label="EQIP Enterprise Quality Intelligence Platform"
        {...props}
      >
        <img
          src="/assets/eqip-monogram.png"
          alt=""
          aria-hidden="true"
          className="shrink-0"
          style={{ height: markHeight, width: markHeight * MONOGRAM_ASPECT }}
        />
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={cn('inline-flex flex-col items-start pl-4 text-left leading-none', className)}
      role="img"
      aria-label="EQIP Enterprise Quality Intelligence Platform"
      {...props}
    >
      <img
        src="/assets/eqip-wordmark.png"
        alt="EQIP"
        className="shrink-0"
        style={{ height: markHeight, width: markWidth ?? markHeight * WORDMARK_ASPECT }}
      />
      {showCaption ? (
        <span className={cn('mt-1.5 whitespace-nowrap text-[10px] font-medium leading-tight tracking-wide', captionColor)}>
          Enterprise Quality Intelligence Platform
        </span>
      ) : null}
      {showCaption ? (
        <span className={cn('mt-0.5 whitespace-nowrap text-[8px] font-medium leading-tight tracking-wide', captionColor)}>
          AI-Powered Insights. | Intelligent Decisions. | Better Quality Outcomes.
        </span>
      ) : null}
      {showHumana ? (
        <span className={cn('mt-1.5 text-sm font-semibold leading-tight tracking-tight', humanaColor)}>
          Humana.
        </span>
      ) : null}
    </span>
  );
});

BrandLogo.displayName = 'BrandLogo';

BrandLogo.propTypes = {
  variant: PropTypes.oneOf(['light', 'dark']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  showText: PropTypes.bool,
  showHumana: PropTypes.bool,
  showCaption: PropTypes.bool,
  className: PropTypes.string,
};

export { BrandLogo };
export default BrandLogo;
