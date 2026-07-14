import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn, formatNumber } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

const trendColorMap = {
  improving: {
    text: 'text-success-600',
    bg: 'bg-success-50',
    border: 'border-success-200',
  },
  declining: {
    text: 'text-danger-600',
    bg: 'bg-danger-50',
    border: 'border-danger-200',
  },
  stable: {
    text: 'text-slate-500',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
  },
};

const statusIndicatorMap = {
  on_track: 'bg-success-500',
  at_risk: 'bg-warning-500',
  critical: 'bg-danger-500',
  completed: 'bg-info-500',
  not_started: 'bg-slate-400',
};

/**
 * Resolves the trend icon component based on trend direction.
 *
 * @param {string} trend - Trend direction ('improving', 'declining', 'stable')
 * @returns {React.ElementType} The icon component
 */
function getTrendIcon(trend) {
  switch (trend) {
    case 'improving':
      return TrendingUp;
    case 'declining':
      return TrendingDown;
    case 'stable':
    default:
      return Minus;
  }
}

/**
 * Resolves the arrow icon component based on trend direction.
 *
 * @param {string} trend - Trend direction ('improving', 'declining', 'stable')
 * @returns {React.ElementType|null} The arrow icon component or null
 */
function getTrendArrow(trend) {
  switch (trend) {
    case 'improving':
      return ArrowUpRight;
    case 'declining':
      return ArrowDownRight;
    default:
      return null;
  }
}

/**
 * Formats the change percent value for display.
 *
 * @param {number} changePercent - The percentage change value
 * @returns {string} Formatted change string with sign
 */
function formatChangePercent(changePercent) {
  if (changePercent === null || changePercent === undefined || !Number.isFinite(changePercent)) {
    return '';
  }
  const sign = changePercent > 0 ? '+' : '';
  return `${sign}${formatNumber(changePercent, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

/**
 * Renders a simple inline sparkline SVG from data points.
 *
 * @param {object} props
 * @param {{ month: string, value: number }[]} props.data - Array of data points
 * @param {string} props.trend - Trend direction for color
 * @param {string} [props.className] - Additional class names
 * @returns {React.ReactElement|null}
 */
function Sparkline({ data, trend, className }) {
  if (!Array.isArray(data) || data.length < 2) {
    return null;
  }

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const width = 80;
  const height = 28;
  const padding = 2;

  const points = values.map((val, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const polylinePoints = points.join(' ');

  const strokeColor =
    trend === 'improving'
      ? '#10b981'
      : trend === 'declining'
        ? '#ef4444'
        : '#64748b';

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

Sparkline.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string,
      value: PropTypes.number.isRequired,
    })
  ),
  trend: PropTypes.string,
  className: PropTypes.string,
};

/**
 * KPI card component displaying a metric label, value, trend indicator,
 * percentage change, and optional sparkline. Uses design system tokens
 * for colors and spacing. Supports click-to-drill-down.
 *
 * @param {object} props
 * @param {string} props.label - Display label for the KPI metric
 * @param {number|string} props.value - Current KPI value
 * @param {string} [props.unit] - Unit of measurement (count, percent, ratio, score, minutes, hours, currency)
 * @param {string} [props.trend='stable'] - Trend direction ('improving', 'declining', 'stable')
 * @param {number} [props.changePercent] - Percentage change from previous period
 * @param {string} [props.status] - KPI status ('on_track', 'at_risk', 'critical', 'completed', 'not_started')
 * @param {string} [props.description] - Tooltip or descriptive text for the KPI
 * @param {{ month: string, value: number }[]} [props.sparklineData] - Data points for the sparkline
 * @param {boolean} [props.showSparkline=false] - Whether to display the sparkline
 * @param {function} [props.onClick] - Click handler for drill-down navigation
 * @param {string} [props.className] - Additional class names for the card container
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const KpiCard = forwardRef(function KpiCard(
  {
    label,
    value,
    unit,
    trend = 'stable',
    changePercent,
    status,
    description,
    sparklineData,
    showSparkline = false,
    onClick,
    className,
    ...props
  },
  ref
) {
  const resolvedTrend = trend || 'stable';
  const trendColors = trendColorMap[resolvedTrend] || trendColorMap.stable;
  const TrendIcon = getTrendIcon(resolvedTrend);
  const TrendArrow = getTrendArrow(resolvedTrend);
  const statusDotColor = status ? statusIndicatorMap[status] || statusIndicatorMap.not_started : null;
  const isClickable = typeof onClick === 'function';
  const changeDisplay = formatChangePercent(changePercent);

  /**
   * Formats the display value based on unit type.
   *
   * @returns {string} Formatted value string
   */
  function getFormattedValue() {
    if (value === null || value === undefined) {
      return '—';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (!Number.isFinite(value)) {
      return '—';
    }

    switch (unit) {
      case 'percent':
        return `${formatNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
      case 'ratio':
        return formatNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      case 'score':
        return formatNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      case 'currency':
        return `$${formatNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      case 'minutes':
        return `${formatNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}m`;
      case 'hours':
        return `${formatNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}h`;
      case 'count':
      default:
        return formatNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
  }

  const formattedValue = getFormattedValue();

  const cardContent = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {statusDotColor ? (
            <span
              className={cn('h-2 w-2 shrink-0 rounded-full', statusDotColor)}
              aria-hidden="true"
            />
          ) : null}
          <span className="text-sm font-medium text-slate-500 truncate">
            {label}
          </span>
        </div>
        {showSparkline && sparklineData && sparklineData.length >= 2 ? (
          <Sparkline data={sparklineData} trend={resolvedTrend} />
        ) : null}
      </div>

      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-2xl font-semibold text-slate-900 tracking-tight truncate">
            {formattedValue}
          </span>

          {changeDisplay ? (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-2xs font-medium',
                  trendColors.bg,
                  trendColors.text
                )}
              >
                {TrendArrow ? (
                  <TrendArrow className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <TrendIcon className="h-3 w-3" aria-hidden="true" />
                )}
                {changeDisplay}
              </span>
              <span className="text-2xs text-slate-400">vs prev</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <TrendIcon
                className={cn('h-3.5 w-3.5', trendColors.text)}
                aria-hidden="true"
              />
              <span className={cn('text-xs font-medium capitalize', trendColors.text)}>
                {resolvedTrend}
              </span>
            </div>
          )}
        </div>
      </div>

      {description ? (
        <p className="mt-2 text-2xs text-slate-400 line-clamp-2">
          {description}
        </p>
      ) : null}
    </>
  );

  if (isClickable) {
    return (
      <Card
        ref={ref}
        className={cn(
          'p-5 cursor-pointer transition-all duration-200',
          'hover:shadow-card-hover hover:border-humana-green-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
          'active:scale-[0.99]',
          className
        )}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e);
          }
        }}
        aria-label={`${label}: ${formattedValue}. ${description || ''}`}
        {...props}
      >
        {cardContent}
      </Card>
    );
  }

  return (
    <Card
      ref={ref}
      className={cn('p-5', className)}
      aria-label={`${label}: ${formattedValue}`}
      {...props}
    >
      {cardContent}
    </Card>
  );
});

KpiCard.displayName = 'KpiCard';

KpiCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  unit: PropTypes.oneOf(['count', 'percent', 'ratio', 'score', 'minutes', 'hours', 'currency']),
  trend: PropTypes.oneOf(['improving', 'declining', 'stable']),
  changePercent: PropTypes.number,
  status: PropTypes.oneOf(['on_track', 'at_risk', 'critical', 'completed', 'not_started']),
  description: PropTypes.string,
  sparklineData: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string,
      value: PropTypes.number.isRequired,
    })
  ),
  showSparkline: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export { KpiCard };
export default KpiCard;