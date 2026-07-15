import { forwardRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { BarChart2, TrendingUp, PieChart, Activity } from 'lucide-react';

/**
 * Resolves the empty state icon based on chart type.
 *
 * @param {string} chartType - The chart type
 * @returns {React.ElementType} The icon component
 */
function getEmptyIcon(chartType) {
  switch (chartType) {
    case 'bar':
    case 'stacked_bar':
      return BarChart2;
    case 'line':
    case 'area':
      return TrendingUp;
    case 'pie':
    case 'donut':
      return PieChart;
    default:
      return Activity;
  }
}

/**
 * Loading skeleton for the chart area.
 *
 * @param {object} props
 * @param {number|string} props.height - Chart height
 * @param {string} [props.className] - Additional class names
 * @returns {React.ReactElement}
 */
function ChartSkeleton({ height, className }) {
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn('flex flex-col gap-3', className)}
      role="status"
      aria-label="Loading chart"
      aria-busy="true"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton
        className="w-full rounded-lg"
        style={{ height: resolvedHeight }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

ChartSkeleton.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
};

/**
 * Empty state component for when no chart data is available.
 *
 * @param {object} props
 * @param {number|string} props.height - Chart height
 * @param {string} [props.message] - Custom empty state message
 * @param {string} [props.chartType] - Chart type for icon selection
 * @param {string} [props.className] - Additional class names
 * @returns {React.ReactElement}
 */
function ChartEmptyState({ height, message, chartType, className }) {
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height;
  const IconComponent = getEmptyIcon(chartType);

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50/50',
        className
      )}
      style={{ height: resolvedHeight }}
      role="status"
      aria-label={message || 'No data available'}
    >
      <IconComponent className="h-8 w-8 text-slate-300" aria-hidden="true" />
      <p className="text-sm text-slate-500">
        {message || 'No data available to display.'}
      </p>
    </div>
  );
}

ChartEmptyState.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  message: PropTypes.string,
  chartType: PropTypes.string,
  className: PropTypes.string,
};

/**
 * Error state component for when chart rendering fails.
 *
 * @param {object} props
 * @param {number|string} props.height - Chart height
 * @param {string} [props.message] - Custom error message
 * @param {function} [props.onRetry] - Retry callback
 * @param {string} [props.className] - Additional class names
 * @returns {React.ReactElement}
 */
function ChartErrorState({ height, message, onRetry, className }) {
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-danger-200 bg-danger-50/50',
        className
      )}
      style={{ height: resolvedHeight }}
      role="alert"
    >
      <Activity className="h-8 w-8 text-danger-300" aria-hidden="true" />
      <p className="text-sm text-danger-600">
        {message || 'Failed to render chart.'}
      </p>
      {typeof onRetry === 'function' ? (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'text-xs font-medium text-danger-600 hover:text-danger-700 underline transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2 rounded'
          )}
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

ChartErrorState.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  message: PropTypes.string,
  onRetry: PropTypes.func,
  className: PropTypes.string,
};

/**
 * Reusable ChartWrapper component that provides consistent sizing, loading
 * state, empty state, error state, and design system styling for Recharts
 * and echarts-for-react charts. Wraps chart content in a Card with optional
 * title, subtitle, and action toolbar.
 *
 * @param {object} props
 * @param {string} [props.title] - Chart title displayed in the header
 * @param {string} [props.subtitle] - Subtitle or description displayed below the title
 * @param {React.ReactNode} [props.actions] - Action elements (buttons, dropdowns) rendered in the header toolbar
 * @param {number|string} [props.height=300] - Chart area height in pixels (number) or CSS value (string)
 * @param {number|string} [props.minHeight] - Minimum chart area height
 * @param {boolean} [props.loading=false] - Whether the chart is in a loading state
 * @param {boolean} [props.empty=false] - Whether the chart has no data to display
 * @param {boolean} [props.error=false] - Whether the chart encountered an error
 * @param {string} [props.emptyMessage] - Custom message for the empty state
 * @param {string} [props.errorMessage] - Custom message for the error state
 * @param {string} [props.chartType] - Chart type hint for empty state icon (bar, line, pie, donut, area, stacked_bar)
 * @param {function} [props.onRetry] - Retry callback for error state
 * @param {boolean} [props.noPadding=false] - Whether to remove default body padding
 * @param {boolean} [props.noCard=false] - Whether to render without the Card wrapper
 * @param {string} [props.className] - Additional class names for the outer container
 * @param {string} [props.chartClassName] - Additional class names for the chart area container
 * @param {string} [props.headerClassName] - Additional class names for the header section
 * @param {React.ReactNode} [props.children] - Chart content (Recharts or echarts-for-react components)
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const ChartWrapper = forwardRef(function ChartWrapper(
  {
    title,
    subtitle,
    actions,
    height = 300,
    minHeight,
    loading = false,
    empty = false,
    error = false,
    emptyMessage,
    errorMessage,
    chartType,
    onRetry,
    noPadding = false,
    noCard = false,
    className,
    chartClassName,
    headerClassName,
    children,
    ...props
  },
  ref
) {
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height;
  const resolvedMinHeight = minHeight
    ? typeof minHeight === 'number'
      ? `${minHeight}px`
      : minHeight
    : undefined;

  const hasHeader = title || subtitle || actions;

  const headerContent = hasHeader ? (
    <div
      className={cn(
        'flex items-start justify-between gap-4',
        !noPadding && 'px-4 pt-4',
        noPadding && 'px-0 pt-0',
        headerClassName
      )}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        {title ? (
          <h3 className="text-sm font-semibold leading-tight text-slate-900 truncate">
            {title}
          </h3>
        ) : null}
        {subtitle ? (
          <p className="text-xs text-slate-500 line-clamp-2">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      ) : null}
    </div>
  ) : null;

  const renderContent = () => {
    if (loading) {
      return (
        <ChartSkeleton
          height={height}
          className={chartClassName}
        />
      );
    }

    if (error) {
      return (
        <ChartErrorState
          height={height}
          message={errorMessage}
          onRetry={onRetry}
          className={chartClassName}
        />
      );
    }

    if (empty) {
      return (
        <ChartEmptyState
          height={height}
          message={emptyMessage}
          chartType={chartType}
          className={chartClassName}
        />
      );
    }

    return (
      <div
        className={cn('w-full', chartClassName)}
        style={{
          height: resolvedHeight,
          minHeight: resolvedMinHeight,
        }}
      >
        {children}
      </div>
    );
  };

  const bodyContent = (
    <div
      className={cn(
        !noPadding && hasHeader ? 'px-4 pb-4 pt-3' : '',
        !noPadding && !hasHeader ? 'p-4' : '',
        noPadding ? '' : ''
      )}
    >
      {renderContent()}
    </div>
  );

  if (noCard) {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col', className)}
        {...props}
      >
        {headerContent}
        {bodyContent}
      </div>
    );
  }

  return (
    <Card
      ref={ref}
      className={cn('overflow-hidden', className)}
      {...props}
    >
      {headerContent}
      {bodyContent}
    </Card>
  );
});

ChartWrapper.displayName = 'ChartWrapper';

ChartWrapper.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  loading: PropTypes.bool,
  empty: PropTypes.bool,
  error: PropTypes.bool,
  emptyMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  chartType: PropTypes.oneOf(['bar', 'line', 'pie', 'donut', 'area', 'stacked_bar', 'radar', 'scatter', 'heatmap', 'treemap', 'gauge', 'table']),
  onRetry: PropTypes.func,
  noPadding: PropTypes.bool,
  noCard: PropTypes.bool,
  className: PropTypes.string,
  chartClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  children: PropTypes.node,
};

export { ChartWrapper };
export default ChartWrapper;