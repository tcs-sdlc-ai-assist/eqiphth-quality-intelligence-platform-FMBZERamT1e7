import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
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
 * Soft-tinted circle tones for the KPI icon, matching the Vital Integrity mocks.
 * @type {Object<string, { bg: string, text: string }>}
 */
const toneMap = {
  blue: { bg: 'bg-info-50', text: 'text-info-600' },
  green: { bg: 'bg-humana-green-50', text: 'text-humana-green-600' },
  orange: { bg: 'bg-warning-50', text: 'text-warning-600' },
  purple: { bg: 'bg-violet-50', text: 'text-violet-600' },
  red: { bg: 'bg-danger-50', text: 'text-danger-600' },
  cyan: { bg: 'bg-info-50', text: 'text-info-500' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-500' },
};

/**
 * Solid-fill icon tones (colored circle + white glyph) for cards that pass
 * iconVariant="solid" — matches the Demand Management mock.
 * @type {Object<string, string>}
 */
const toneSolidMap = {
  blue: 'bg-info-500 text-white',
  green: 'bg-humana-green-500 text-white',
  orange: 'bg-warning-500 text-white',
  purple: 'bg-violet-500 text-white',
  red: 'bg-danger-500 text-white',
  cyan: 'bg-cyan-500 text-white',
  slate: 'bg-slate-500 text-white',
};

/**
 * Derives a KPI icon tone from status (preferred) or trend, so every card gets
 * a themed circle even when the page doesn't pass an explicit tone.
 *
 * @param {string} [status] - KPI status
 * @param {string} [trend] - Trend direction
 * @returns {string} A toneMap key
 */
function deriveTone(status, trend) {
  switch (status) {
    case 'on_track':
      return 'green';
    case 'at_risk':
      return 'orange';
    case 'critical':
      return 'red';
    case 'completed':
      return 'blue';
    case 'not_started':
      return 'slate';
    default:
      break;
  }
  if (trend === 'improving') return 'green';
  if (trend === 'declining') return 'red';
  return 'blue';
}

/**
 * Derives a default KPI icon from status (preferred) or trend.
 *
 * @param {string} [status] - KPI status
 * @param {string} [trend] - Trend direction
 * @returns {React.ReactElement} A lucide icon element
 */
function deriveIcon(status, trend) {
  if (status === 'critical' || status === 'at_risk') return <AlertTriangle />;
  if (status === 'completed' || status === 'on_track') return <CheckCircle2 />;
  if (status === 'not_started') return <Clock />;
  if (trend === 'improving') return <TrendingUp />;
  if (trend === 'declining') return <TrendingDown />;
  return <Activity />;
}

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
 * Formats the change percent as an unsigned magnitude with minimal decimals
 * (direction is conveyed by the arrow, matching the mocks): 12 → "12%",
 * 5.4 → "5.4%".
 *
 * @param {number} changePercent - The percentage change value
 * @returns {string} Formatted change string, no sign
 */
function formatChangePercent(changePercent) {
  if (changePercent === null || changePercent === undefined || !Number.isFinite(changePercent)) {
    return '';
  }
  return `${formatNumber(Math.abs(changePercent), { minimumFractionDigits: 0, maximumFractionDigits: 1 })}%`;
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
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn('w-full', className)}
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
    subtitle,
    icon,
    tone = 'blue',
    iconVariant = 'soft',
    changeText,
    changeTone,
    changeLabel = 'vs prev',
    sparklineData,
    showSparkline = false,
    onClick,
    className,
    ...props
  },
  ref
) {
  const resolvedIcon = icon || deriveIcon(status, trend);
  const resolvedTone = icon ? tone : deriveTone(status, trend);
  const toneColors = toneMap[resolvedTone] || toneMap.blue;
  const iconClasses = iconVariant === 'solid'
    ? (toneSolidMap[resolvedTone] || toneSolidMap.blue)
    : cn(toneColors.bg, toneColors.text);
  const resolvedTrend = trend || 'stable';
  const trendColors = trendColorMap[resolvedTrend] || trendColorMap.stable;
  const TrendIcon = getTrendIcon(resolvedTrend);
  const TrendArrow = getTrendArrow(resolvedTrend);
  const statusDotColor = status ? statusIndicatorMap[status] || statusIndicatorMap.not_started : null;
  const isClickable = typeof onClick === 'function';
  const changeDisplay = formatChangePercent(changePercent);

  // Trend row: direction (arrow + color) follows the sign of changePercent when
  // numeric, otherwise the semantic trend. Plain colored text, no pill —
  // matching the mocks. A `changeTone` status (e.g. "High Priority") shows as
  // flat colored text with no arrow.
  const hasPct = Number.isFinite(changePercent);
  const direction = hasPct
    ? changePercent >= 0
      ? 'up'
      : 'down'
    : resolvedTrend === 'improving'
      ? 'up'
      : resolvedTrend === 'declining'
        ? 'down'
        : 'none';
  const DirArrow = direction === 'up' ? ArrowUpRight : direction === 'down' ? ArrowDownRight : null;
  const changeToneColor = { danger: 'text-danger-600', success: 'text-success-600', muted: 'text-slate-500' };
  const dirColor = direction === 'up' ? 'text-success-600' : direction === 'down' ? 'text-danger-600' : 'text-slate-500';
  const isStatusText = Boolean(changeText && changeTone);
  const changeColor = isStatusText ? changeToneColor[changeTone] || 'text-slate-500' : dirColor;
  const changeBody = changeText || changeDisplay || resolvedTrend;

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

  // Icon tile — larger, on the left of the card (matching the reference stat
  // cards where the tinted icon sits beside a stacked label/value/change block).
  const iconEl = (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full',
        'h-12 w-12 [&_svg]:h-6 [&_svg]:w-6',
        iconClasses
      )}
      aria-hidden="true"
    >
      {resolvedIcon}
    </span>
  );

  const labelEl = (
    <div className="flex items-center gap-2 min-w-0">
      {statusDotColor ? (
        <span className={cn('h-2 w-2 shrink-0 rounded-full', statusDotColor)} aria-hidden="true" />
      ) : null}
      <span className="text-sm font-medium text-slate-600 truncate">{label}</span>
    </div>
  );

  const subtitleEl = subtitle ? (
    <span className="text-2xs text-slate-400 truncate">{subtitle}</span>
  ) : null;

  const valueEl = (
    <span className="text-2xl font-bold text-slate-900 tracking-tight truncate">{formattedValue}</span>
  );

  const changeEl = (
    <div className="flex items-center gap-1.5">
      <span className={cn('inline-flex items-center gap-0.5 text-xs font-semibold', changeColor, !changeText && 'capitalize')}>
        {!isStatusText && DirArrow ? <DirArrow className="h-3.5 w-3.5" aria-hidden="true" /> : null}
        {changeBody}
      </span>
      {hasPct && changeLabel ? (
        <span className="text-2xs text-slate-400">{changeLabel}</span>
      ) : null}
    </div>
  );

  const descriptionEl = description ? (
    <p className="mt-1.5 text-2xs text-slate-400 line-clamp-2">{description}</p>
  ) : null;

  // Sparkline cards keep the stacked layout (icon+label on top, value, then the
  // trend line). All other cards use the horizontal icon-left / text-right form.
  const cardContent = showSparkline ? (
    <>
      <div className="flex items-center gap-3 min-w-0">
        {iconEl}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {labelEl}
          {subtitleEl}
          {valueEl}
          {changeEl}
        </div>
      </div>
      {sparklineData && sparklineData.length >= 2 ? (
        <Sparkline data={sparklineData} trend={resolvedTrend} className="mt-3" />
      ) : null}
      {descriptionEl}
    </>
  ) : (
    <div className="flex items-center gap-3.5 min-w-0">
      {iconEl}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {labelEl}
        {subtitleEl}
        {valueEl}
        {changeEl}
        {descriptionEl}
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <Card
        ref={ref}
        className={cn(
          'p-4 cursor-pointer transition-all duration-200',
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
      className={cn('p-4', className)}
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
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  tone: PropTypes.oneOf(['blue', 'green', 'orange', 'purple', 'red', 'cyan', 'slate']),
  iconVariant: PropTypes.oneOf(['soft', 'solid']),
  changeText: PropTypes.string,
  changeTone: PropTypes.oneOf(['danger', 'success', 'muted']),
  changeLabel: PropTypes.string,
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