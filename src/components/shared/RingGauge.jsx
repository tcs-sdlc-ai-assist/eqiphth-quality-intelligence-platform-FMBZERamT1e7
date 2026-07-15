import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

/**
 * Resolves the ring color variant from a percentage value, mirroring
 * Progress's auto-variant thresholds (90/70/50).
 *
 * @param {number} value - Percentage value (0-100)
 * @returns {'success'|'primary'|'warning'|'danger'} The resolved variant
 */
function resolveAutoVariant(value) {
  if (value >= 90) return 'success';
  if (value >= 70) return 'primary';
  if (value >= 50) return 'warning';
  return 'danger';
}

const RING_COLORS = {
  success: '#10b981',
  primary: '#16b364',
  warning: '#f59e0b',
  danger: '#ef4444',
  neutral: '#cbd5e1',
};

/**
 * Small SVG circular-progress "ring" gauge used to show a percentage metric
 * (e.g. QA testing completion, unit test coverage) inline in dense table
 * cells. Renders a dashed grey ring with no percentage text when there is
 * no data (value is null/undefined).
 *
 * @param {object} props
 * @param {number|null} [props.value] - Percentage value (0-100). Null/undefined renders an empty ring.
 * @param {number} [props.size=56] - Ring diameter in pixels
 * @param {number} [props.strokeWidth=5] - Ring stroke width in pixels
 * @param {'auto'|'success'|'primary'|'warning'|'danger'|'neutral'} [props.variant='auto'] - Ring color variant
 * @param {string} [props.emptyLabel='—'] - Text shown centered when value is null/undefined
 * @param {string} [props.className] - Additional class names for the outer wrapper
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const RingGauge = forwardRef(function RingGauge(
  { value, size = 56, strokeWidth = 5, variant = 'auto', emptyLabel = '—', className, ...props },
  ref
) {
  const hasValue = typeof value === 'number' && Number.isFinite(value);
  const clamped = hasValue ? Math.min(Math.max(value, 0), 100) : 0;
  const resolvedVariant = !hasValue ? 'neutral' : variant === 'auto' ? resolveAutoVariant(clamped) : variant;
  const color = RING_COLORS[resolvedVariant] || RING_COLORS.neutral;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      ref={ref}
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={hasValue ? `${clamped}%` : emptyLabel}
      {...props}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          strokeDasharray={!hasValue ? '3 4' : undefined}
        />
        {hasValue ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
          />
        ) : null}
      </svg>
      <span
        className={cn(
          'absolute text-2xs font-semibold',
          hasValue ? 'text-slate-800' : 'text-slate-400'
        )}
      >
        {hasValue ? `${Math.round(clamped)}%` : emptyLabel}
      </span>
    </div>
  );
});

RingGauge.displayName = 'RingGauge';

RingGauge.propTypes = {
  value: PropTypes.number,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  variant: PropTypes.oneOf(['auto', 'success', 'primary', 'warning', 'danger', 'neutral']),
  emptyLabel: PropTypes.string,
  className: PropTypes.string,
};

export { RingGauge };
export default RingGauge;
