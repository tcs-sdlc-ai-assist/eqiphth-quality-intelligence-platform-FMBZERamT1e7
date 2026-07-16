import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart2,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation, usePageHeader } from '@/context/NavigationContext';
import { getAllDashboardMetrics } from '@/data/dashboardMetrics';
import { getAllSegmentBreakdowns } from '@/data/dashboardMetrics';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { ChartWrapper } from '@/components/shared/ChartWrapper';
import { FilterBar } from '@/components/shared/FilterBar';
import { InsightBanner } from '@/components/shared/InsightBanner';
import { StatusPill } from '@/components/shared/StatusPill';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageActions } from '@/components/layout/PageActions';
import { Tooltip as UiTooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';
import { Skeleton } from '@/components/ui/Skeleton';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { MEASURE_STATUS, ROUTES } from '@/lib/constants';

/**
 * Color map for risk distribution and quality status charts.
 * @type {Object<string, string>}
 */
const CHART_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#dc2626',
  on_track: '#10b981',
  at_risk: '#f59e0b',
  [MEASURE_STATUS.CRITICAL]: '#ef4444',
  [MEASURE_STATUS.COMPLETED]: '#3b82f6',
  [MEASURE_STATUS.NOT_STARTED]: '#a3a3a3',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  neutral: '#a3a3a3',
};

/**
 * Segment color map for trend charts.
 * @type {Object<string, string>}
 */
const SEGMENT_COLORS = {
  Enterprise: '#16b364',
  Medicare: '#3b82f6',
  Medicaid: '#f59e0b',
  Commercial: '#8b5cf6',
  External: '#ef4444',
  Compliance: '#06b6d4',
};

/**
 * Filter field configurations for the dashboard.
 * @type {import('@/components/shared/FilterBar').FilterFieldConfig[]}
 */
const FILTER_FIELDS = [
  {
    id: 'segment',
    label: 'Segment',
    type: 'select',
    options: [
      { value: '', label: 'All Segments' },
      { value: 'Enterprise', label: 'Enterprise' },
      { value: 'Medicare', label: 'Medicare' },
      { value: 'Medicaid', label: 'Medicaid' },
      { value: 'Commercial', label: 'Commercial' },
      { value: 'External', label: 'External' },
      { value: 'Compliance', label: 'Compliance' },
    ],
    defaultValue: '',
  },
  {
    id: 'riskLevel',
    label: 'Risk Level',
    type: 'select',
    options: [
      { value: '', label: 'All Risk Levels' },
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: 'Critical' },
    ],
    defaultValue: '',
  },
  {
    id: 'qualityStatus',
    label: 'Quality Status',
    type: 'select',
    options: [
      { value: '', label: 'All Statuses' },
      { value: MEASURE_STATUS.ON_TRACK, label: 'On Track' },
      { value: MEASURE_STATUS.AT_RISK, label: 'At Risk' },
      { value: MEASURE_STATUS.CRITICAL, label: 'Critical' },
    ],
    defaultValue: '',
  },
];

/**
 * Custom tooltip for Recharts charts.
 *
 * @param {object} props
 * @param {boolean} props.active
 * @param {object[]} props.payload
 * @param {string} props.label
 * @param {string} [props.unit]
 * @returns {React.ReactElement|null}
 */
function CustomTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-dropdown">
      <p className="text-xs font-medium text-slate-900">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-xs text-slate-600" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
          {unit}
        </p>
      ))}
    </div>
  );
}

/**
 * Renders the KPI summary cards row.
 *
 * @param {object} props
 * @param {import('@/data/dashboardMetrics').KPI[]} props.kpis
 * @returns {React.ReactElement}
 */
const KPI_TONES = ['blue', 'green', 'orange', 'purple', 'cyan', 'red'];
const KPI_ICONS = [
  <BarChart2 key="i0" />,
  <CheckCircle key="i1" />,
  <Activity key="i2" />,
  <Shield key="i3" />,
  <TrendingUp key="i4" />,
  <AlertTriangle key="i5" />,
];

function KpiSummaryRow({ kpis }) {
  if (!Array.isArray(kpis) || kpis.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi, i) => (
        <KpiCard
          key={kpi.id}
          label={kpi.name}
          value={kpi.value}
          unit={kpi.unit}
          trend={kpi.trend}
          changePercent={kpi.changePercent}
          status={kpi.status}
          description={kpi.description}
          icon={KPI_ICONS[i % KPI_ICONS.length]}
          tone={KPI_TONES[i % KPI_TONES.length]}
          changeLabel="vs prev period"
        />
      ))}
    </div>
  );
}

/**
 * Renders the quality score trend chart.
 *
 * @param {object} props
 * @param {import('@/data/dashboardMetrics').TrendMetric[]} props.trendMetrics
 * @param {string} props.selectedMetric
 * @param {function(string): void} props.onMetricChange
 * @returns {React.ReactElement}
 */
function TrendChartPanel({ trendMetrics, selectedMetric, onMetricChange }) {
  const selectedTrend = useMemo(() => {
    return trendMetrics.find((t) => t.id === selectedMetric) || trendMetrics[0];
  }, [trendMetrics, selectedMetric]);

  if (!selectedTrend) {
    return null;
  }

  return (
    <PanelCard
      title="Quality Trends"
      subtitle="12-month trend analysis across key quality metrics"
      icon={<TrendingUp className="h-5 w-5" />}
      actions={
        <Tabs value={selectedMetric} onValueChange={onMetricChange}>
          <TabsList className="h-8">
            {trendMetrics.slice(0, 4).map((metric) => (
              <TabsTrigger key={metric.id} value={metric.id} className="text-2xs px-2 py-1">
                {metric.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      }
    >
      <ChartWrapper height={240} noCard noPadding>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={selectedTrend.data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip
              content={
                <CustomTooltip
                  unit={selectedTrend.unit === 'percent' ? '%' : selectedTrend.unit === 'ratio' ? '' : ''}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="value"
              name={selectedTrend.name}
              stroke="#16b364"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#16b364', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#16b364', strokeWidth: 2, stroke: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </PanelCard>
  );
}

/**
 * Renders the segment breakdown table/chart.
 *
 * @param {object} props
 * @param {import('@/data/dashboardMetrics').SegmentBreakdown[]} props.segments
 * @param {string} props.filterSegment
 * @returns {React.ReactElement}
 */
function SegmentBreakdownPanel({ segments, filterSegment }) {
  const filteredSegments = useMemo(() => {
    if (!filterSegment) {
      return segments;
    }
    return segments.filter((s) => s.segment === filterSegment);
  }, [segments, filterSegment]);

  return (
    <PanelCard
      title="Segment Quality Breakdown"
      subtitle="Quality metrics comparison across organizational segments"
      icon={<BarChart2 className="h-5 w-5" />}
    >
      <ChartWrapper height={220} noCard noPadding>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredSegments} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="segment"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip unit="%" />} />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
              iconSize={8}
            />
            <Bar dataKey="qualityScore" name="Quality Score" fill="#16b364" radius={[4, 4, 0, 0]} barSize={28} />
            <Bar dataKey="passRate" name="Pass Rate" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
            <Bar dataKey="automationCoverage" name="Automation" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Segment</th>
              <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Quality</th>
              <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Pass Rate</th>
              <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Automation</th>
              <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Defects</th>
              <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Readiness</th>
              <th className="pb-2 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSegments.map((seg) => (
              <tr key={seg.segment} className="border-b border-slate-100 last:border-b-0">
                <td className="py-2.5 font-medium text-slate-900">{seg.segment}</td>
                <td className="py-2.5 text-right text-slate-700">{seg.qualityScore.toFixed(1)}</td>
                <td className="py-2.5 text-right text-slate-700">{seg.passRate.toFixed(1)}%</td>
                <td className="py-2.5 text-right text-slate-700">{seg.automationCoverage.toFixed(1)}%</td>
                <td className="py-2.5 text-right text-slate-700">{seg.defectDensity.toFixed(1)}</td>
                <td className="py-2.5 text-right text-slate-700">{seg.releaseReadiness.toFixed(1)}%</td>
                <td className="py-2.5 text-center">
                  <StatusPill status={seg.status} size="sm" dot />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelCard>
  );
}

/**
 * Renders the risk distribution donut chart.
 *
 * @param {object} props
 * @param {import('@/data/dashboardMetrics').RiskDistribution[]} props.riskDistributions
 * @param {string} props.filterRiskLevel
 * @returns {React.ReactElement}
 */
function RiskDistributionPanel({ riskDistributions, filterRiskLevel }) {
  const filteredData = useMemo(() => {
    if (!filterRiskLevel) {
      return riskDistributions;
    }
    return riskDistributions.filter((r) => r.level === filterRiskLevel);
  }, [riskDistributions, filterRiskLevel]);

  const totalApps = useMemo(() => {
    return riskDistributions.reduce((sum, r) => sum + r.count, 0);
  }, [riskDistributions]);

  const riskColors = ['#10b981', '#f59e0b', '#ef4444', '#dc2626'];

  return (
    <PanelCard
      title="Risk Distribution"
      subtitle={`${totalApps} applications across risk levels`}
      icon={<AlertTriangle className="h-5 w-5" />}
    >
      <div className="flex flex-col items-center gap-4 lg:flex-row">
        <ChartWrapper height={170} noCard noPadding className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={64}
                paddingAngle={3}
                dataKey="count"
                nameKey="level"
                stroke="none"
              >
                {filteredData.map((entry, index) => {
                  const colorIndex = riskDistributions.findIndex((r) => r.level === entry.level);
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={riskColors[colorIndex >= 0 ? colorIndex : index]}
                    />
                  );
                })}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} apps`, name.charAt(0).toUpperCase() + name.slice(1)]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <div className="flex flex-col gap-2.5 flex-1">
          {riskDistributions.map((risk, index) => (
            <div key={risk.level} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: riskColors[index] }}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium capitalize text-slate-700">{risk.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">{risk.count}</span>
                <span className="text-xs text-slate-400">({risk.percentage.toFixed(1)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PanelCard>
  );
}

/**
 * Renders the quality status summary panel.
 *
 * @param {object} props
 * @param {import('@/data/dashboardMetrics').QualityStatusSummary[]} props.qualityStatusSummaries
 * @param {string} props.filterStatus
 * @returns {React.ReactElement}
 */
function QualityStatusPanel({ qualityStatusSummaries, filterStatus }) {
  const filteredData = useMemo(() => {
    if (!filterStatus) {
      return qualityStatusSummaries.filter((q) => q.count > 0);
    }
    return qualityStatusSummaries.filter((q) => q.status === filterStatus && q.count > 0);
  }, [qualityStatusSummaries, filterStatus]);

  const totalApps = useMemo(() => {
    return qualityStatusSummaries.reduce((sum, q) => sum + q.count, 0);
  }, [qualityStatusSummaries]);

  const statusColors = {
    [MEASURE_STATUS.ON_TRACK]: '#10b981',
    [MEASURE_STATUS.AT_RISK]: '#f59e0b',
    [MEASURE_STATUS.CRITICAL]: '#ef4444',
    [MEASURE_STATUS.COMPLETED]: '#3b82f6',
    [MEASURE_STATUS.NOT_STARTED]: '#a3a3a3',
  };

  return (
    <PanelCard
      title="Quality Status Summary"
      subtitle={`${totalApps} applications quality status overview`}
      icon={<Shield className="h-5 w-5" />}
    >
      <div className="flex flex-col items-center gap-4 lg:flex-row">
        <ChartWrapper height={170} noCard noPadding className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={64}
                paddingAngle={3}
                dataKey="count"
                nameKey="status"
                stroke="none"
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={statusColors[entry.status] || '#a3a3a3'}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => {
                  const label = name
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase());
                  return [`${value} apps`, label];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <div className="flex flex-col gap-3 flex-1">
          {qualityStatusSummaries
            .filter((q) => q.count > 0 || q.status === MEASURE_STATUS.ON_TRACK || q.status === MEASURE_STATUS.AT_RISK || q.status === MEASURE_STATUS.CRITICAL)
            .map((summary) => (
              <div key={summary.status} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <StatusPill status={summary.status} size="sm" dot />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">{summary.count}</span>
                  <span className="text-xs text-slate-400">
                    ({summary.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </PanelCard>
  );
}

/**
 * Loading skeleton for the dashboard page.
 *
 * @returns {React.ReactElement}
 */
function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading dashboard" aria-busy="true">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-96 rounded-xl" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Executive Dashboard page component.
 * Displays enterprise-level quality metrics KPIs, trend charts,
 * segment breakdown, risk distribution, and quality status summary.
 *
 * @returns {React.ReactElement}
 */
function DashboardPage() {
  const { currentPersona } = usePersona();
  const { setBreadcrumbs } = useNavigation();

  usePageHeader({ title: 'Executive Dashboard', subtitle: `Enterprise-level quality metrics and performance overview for ${currentPersona.name}` });

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedTrendMetric, setSelectedTrendMetric] = useState('trend_quality_score');
  const [filters, setFilters] = useState({
    segment: '',
    riskLevel: '',
    qualityStatus: '',
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Dashboard' },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      try {
        const data = getAllDashboardMetrics();
        setDashboardData(data);
      } catch {
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleTrendMetricChange = useCallback((metricId) => {
    setSelectedTrendMetric(metricId);
  }, []);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      try {
        const data = getAllDashboardMetrics();
        setDashboardData(data);
      } catch {
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const filteredKpis = useMemo(() => {
    if (!dashboardData || !dashboardData.kpis) {
      return [];
    }
    return dashboardData.kpis;
  }, [dashboardData]);

  const filteredSegments = useMemo(() => {
    if (!dashboardData || !dashboardData.segmentBreakdowns) {
      return [];
    }
    let segments = dashboardData.segmentBreakdowns;
    if (filters.segment) {
      segments = segments.filter((s) => s.segment === filters.segment);
    }
    if (filters.qualityStatus) {
      segments = segments.filter((s) => s.status === filters.qualityStatus);
    }
    return segments;
  }, [dashboardData, filters.segment, filters.qualityStatus]);

  const filteredRiskDistributions = useMemo(() => {
    if (!dashboardData || !dashboardData.riskDistributions) {
      return [];
    }
    if (filters.riskLevel) {
      return dashboardData.riskDistributions.filter((r) => r.level === filters.riskLevel);
    }
    return dashboardData.riskDistributions;
  }, [dashboardData, filters.riskLevel]);

  const insightData = useMemo(() => {
    if (!dashboardData || !dashboardData.segmentBreakdowns) {
      return null;
    }
    const criticalSegments = dashboardData.segmentBreakdowns.filter(
      (s) => s.status === MEASURE_STATUS.CRITICAL
    );
    const atRiskSegments = dashboardData.segmentBreakdowns.filter(
      (s) => s.status === MEASURE_STATUS.AT_RISK
    );

    if (criticalSegments.length > 0) {
      return {
        variant: 'critical',
        title: `${criticalSegments.length} segment${criticalSegments.length > 1 ? 's' : ''} at critical status`,
        message: `${criticalSegments.map((s) => s.segment).join(', ')} ${criticalSegments.length > 1 ? 'require' : 'requires'} immediate attention with quality scores below acceptable thresholds.`,
        source: 'Quality Monitor Agent',
        confidence: 94,
      };
    }

    if (atRiskSegments.length > 0) {
      return {
        variant: 'warning',
        title: `${atRiskSegments.length} segment${atRiskSegments.length > 1 ? 's' : ''} at risk`,
        message: `${atRiskSegments.map((s) => s.segment).join(', ')} ${atRiskSegments.length > 1 ? 'are' : 'is'} trending below target quality thresholds and may require intervention.`,
        source: 'Quality Monitor Agent',
        confidence: 87,
      };
    }

    return {
      variant: 'success',
      title: 'All segments performing well',
      message: 'Quality scores across all segments are on track with improving trends.',
      source: 'Quality Monitor Agent',
      confidence: 96,
    };
  }, [dashboardData]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <Activity className="h-12 w-12 text-slate-300" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-slate-900">Unable to load dashboard</h2>
        <p className="text-sm text-slate-500">An error occurred while loading dashboard metrics.</p>
        <Button variant="primary" size="md" onClick={handleRefresh}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Refresh — portalled into the navbar (left of the bell) */}
      <PageActions>
        <UiTooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              iconLeft={<RefreshCw className="h-4 w-4" />}
              onClick={handleRefresh}
              aria-label="Refresh dashboard"
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">Refresh</TooltipContent>
        </UiTooltip>
      </PageActions>

      {/* AI Insight Banner */}
      {insightData ? (
        <InsightBanner
          variant={insightData.variant}
          title={insightData.title}
          message={insightData.message}
          source={insightData.source}
          confidence={insightData.confidence}
          dismissible
          expandable={false}
        />
      ) : null}

      {/* Filters */}
      <FilterBar
        fields={FILTER_FIELDS}
        values={filters}
        onChange={handleFilterChange}
        liveMode
        showApplyButton={false}
        showResetButton
        showActiveFilters
      />

      {/* KPI Summary Cards */}
      <KpiSummaryRow kpis={filteredKpis} />

      {/* Trend Charts */}
      {dashboardData.trendMetrics && dashboardData.trendMetrics.length > 0 ? (
        <TrendChartPanel
          trendMetrics={dashboardData.trendMetrics}
          selectedMetric={selectedTrendMetric}
          onMetricChange={handleTrendMetricChange}
        />
      ) : null}

      {/* Segment Breakdown + Risk/Status Distribution */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Segment Breakdown */}
        <SegmentBreakdownPanel
          segments={filteredSegments}
          filterSegment={filters.segment}
        />

        {/* Risk Distribution + Quality Status */}
        <div className="flex flex-col gap-4">
          <RiskDistributionPanel
            riskDistributions={filteredRiskDistributions}
            filterRiskLevel={filters.riskLevel}
          />
          <QualityStatusPanel
            qualityStatusSummaries={dashboardData.qualityStatusSummaries || []}
            filterStatus={filters.qualityStatus}
          />
        </div>
      </div>

      {/* Release Readiness Progress */}
      <PanelCard
        title="Release Readiness by Segment"
        subtitle="Percentage of applications that have passed all quality gates"
        icon={<CheckCircle className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-4">
          {filteredSegments.map((seg) => (
            <div key={seg.segment} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">{seg.segment}</span>
                  <StatusPill status={seg.status} size="sm" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {seg.releaseReadiness.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={seg.releaseReadiness}
                max={100}
                variant="auto"
                size="sm"
                animate
              />
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}

DashboardPage.displayName = 'DashboardPage';

export { DashboardPage };
export default DashboardPage;