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
  Activity,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  BarChart2,
  Layers,
  FileText,
  ChevronRight,
  User,
  Calendar,
  Clock,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Users,
  Star,
  Award,
  Flag,
  DollarSign,
  Gauge,
  Monitor,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import {
  getAdoptionData,
} from '@/lib/mock-api/mockService';
import {
  getAllPlatformUsageMetrics,
  getAllUserAdoptionRates,
  getAllFeatureUtilizations,
  getAllValueRealizationKPIs,
  getAllAdoptionMilestones,
  getAdoptionAggregates,
} from '@/data/adoption';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { ChartWrapper } from '@/components/shared/ChartWrapper';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusPill } from '@/components/shared/StatusPill';
import { EmptyState } from '@/components/shared/EmptyState';
import { DataTable } from '@/components/shared/DataTable';
import { PermissionGate } from '@/components/shared/PermissionGate';
import { InsightBanner } from '@/components/shared/InsightBanner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Progress } from '@/components/ui/Progress';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu';
import {
  Tooltip as UITooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/Tooltip';
import { PERMISSIONS, ROUTES, MEASURE_STATUS } from '@/lib/constants';

const STATUS_COLORS = {
  [MEASURE_STATUS.ON_TRACK]: '#10b981',
  [MEASURE_STATUS.AT_RISK]: '#f59e0b',
  [MEASURE_STATUS.CRITICAL]: '#ef4444',
};

const SEGMENT_COLORS = {
  Enterprise: '#16b364',
  Medicare: '#3b82f6',
  Medicaid: '#f59e0b',
  Commercial: '#8b5cf6',
  External: '#ef4444',
  Compliance: '#06b6d4',
};

const MILESTONE_STATUS_COLORS = {
  achieved: '#10b981',
  on_track: '#3b82f6',
  at_risk: '#f59e0b',
  missed: '#ef4444',
  upcoming: '#a3a3a3',
};

const MILESTONE_CATEGORY_COLORS = {
  onboarding: '#16b364',
  feature_rollout: '#3b82f6',
  integration: '#8b5cf6',
  training: '#f59e0b',
  optimization: '#06b6d4',
};

const KPI_CATEGORY_COLORS = {
  efficiency: '#16b364',
  quality: '#3b82f6',
  compliance: '#8b5cf6',
  cost: '#f59e0b',
  velocity: '#06b6d4',
  risk: '#ef4444',
};

const FEATURE_CATEGORY_COLORS = {
  dashboard: '#16b364',
  quality_management: '#3b82f6',
  test_management: '#8b5cf6',
  compliance: '#f59e0b',
  analytics: '#06b6d4',
  governance: '#ef4444',
  automation: '#10b981',
  collaboration: '#a3a3a3',
  administration: '#64748b',
};

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

function formatLabel(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getMilestoneStatusBadgeVariant(status) {
  switch (status) {
    case 'achieved':
      return 'success';
    case 'on_track':
      return 'info';
    case 'at_risk':
      return 'warning';
    case 'missed':
      return 'error';
    case 'upcoming':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getMilestoneCategoryBadgeVariant(category) {
  switch (category) {
    case 'onboarding':
      return 'primary';
    case 'feature_rollout':
      return 'info';
    case 'integration':
      return 'warning';
    case 'training':
      return 'neutral';
    case 'optimization':
      return 'success';
    default:
      return 'neutral';
  }
}

function getKPICategoryBadgeVariant(category) {
  switch (category) {
    case 'efficiency':
      return 'primary';
    case 'quality':
      return 'info';
    case 'compliance':
      return 'warning';
    case 'cost':
      return 'success';
    case 'velocity':
      return 'info';
    case 'risk':
      return 'error';
    default:
      return 'neutral';
  }
}

function getTrendIcon(trend) {
  if (trend === 'improving') return ArrowUpRight;
  if (trend === 'declining') return ArrowDownRight;
  return Minus;
}

function getTrendColor(trend) {
  if (trend === 'improving') return 'text-success-600';
  if (trend === 'declining') return 'text-danger-600';
  return 'text-slate-500';
}

function UsageMetricDetailDialog({ metric, open, onOpenChange }) {
  if (!metric) return null;

  const trendData = metric.trendData || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Activity className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{metric.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {metric.id} • Platform Usage Metric
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill status={metric.status} size="md" dot />
          <Badge variant="outline" size="md">
            {formatLabel(metric.unit)}
          </Badge>
          <Badge variant="outline" size="md">
            Trend: {metric.trend}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Current</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {formatNumber(metric.currentValue)}
              {metric.unit === 'percent' ? '%' : metric.unit === 'minutes' ? 'm' : ''}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Previous</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {formatNumber(metric.previousValue)}
              {metric.unit === 'percent' ? '%' : metric.unit === 'minutes' ? 'm' : ''}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Change</span>
            <p className={cn(
              'mt-1 text-lg font-semibold',
              metric.changePercent > 0 ? 'text-success-600' : metric.changePercent < 0 ? 'text-danger-600' : 'text-slate-900'
            )}>
              {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Trend</span>
            <p className="mt-1 text-lg font-semibold text-slate-900 capitalize">{metric.trend}</p>
          </div>
        </div>

        {metric.description ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{metric.description}</p>
          </div>
        ) : null}

        {trendData.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">12-Month Trend</h4>
            <ChartWrapper height={220} noCard noPadding>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip unit={metric.unit === 'percent' ? '%' : ''} />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name={metric.name}
                    stroke="#16b364"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#16b364', strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function AdoptionRateDetailDialog({ adoptionRate, open, onOpenChange }) {
  if (!adoptionRate) return null;

  const trendData = adoptionRate.trendData || [];
  const topFeatures = adoptionRate.topFeatures || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Users className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{adoptionRate.personaName}</DialogTitle>
              <DialogDescription className="mt-1">
                {adoptionRate.role} • {adoptionRate.segment}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill status={adoptionRate.status} size="md" dot />
          <Badge variant="outline" size="md">
            {adoptionRate.segment}
          </Badge>
          <Badge variant="outline" size="md">
            Trend: {adoptionRate.trend}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Adoption Rate</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{adoptionRate.adoptionRate.toFixed(1)}%</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Active Users</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{adoptionRate.activeUsers}/{adoptionRate.totalUsers}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Sessions/Week</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{adoptionRate.averageSessionsPerWeek.toFixed(1)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg Duration</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{adoptionRate.averageSessionDurationMinutes.toFixed(0)}m</p>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Adoption Rate</h4>
          <Progress
            value={adoptionRate.adoptionRate}
            max={100}
            variant="auto"
            size="md"
            showValue
            label="User Adoption"
          />
        </div>

        {topFeatures.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Top Features Used</h4>
            <div className="flex flex-wrap gap-1.5">
              {topFeatures.map((feature) => (
                <Badge key={feature} variant="outline" size="sm">{feature}</Badge>
              ))}
            </div>
          </div>
        ) : null}

        {trendData.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Adoption Rate Trend</h4>
            <ChartWrapper height={220} noCard noPadding>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip unit="%" />} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    name="Adoption Rate"
                    stroke="#16b364"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#16b364', strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function ValueKPIDetailDialog({ kpi, open, onOpenChange }) {
  if (!kpi) return null;

  const trendData = kpi.trendData || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Target className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{kpi.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {kpi.id} • {formatLabel(kpi.category)} • Value Realization KPI
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill status={kpi.status} size="md" dot />
          <Badge variant={getKPICategoryBadgeVariant(kpi.category)} size="md">
            {formatLabel(kpi.category)}
          </Badge>
          <Badge variant="outline" size="md">
            {formatLabel(kpi.unit)}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Baseline</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {kpi.unit === 'currency' ? '$' : ''}{formatNumber(kpi.baselineValue)}
              {kpi.unit === 'percent' ? '%' : kpi.unit === 'hours' ? 'h' : kpi.unit === 'days' ? 'd' : ''}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Current</span>
            <p className="mt-1 text-lg font-semibold text-humana-green-600">
              {kpi.unit === 'currency' ? '$' : ''}{formatNumber(kpi.currentValue)}
              {kpi.unit === 'percent' ? '%' : kpi.unit === 'hours' ? 'h' : kpi.unit === 'days' ? 'd' : ''}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Target</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {kpi.unit === 'currency' ? '$' : ''}{formatNumber(kpi.targetValue)}
              {kpi.unit === 'percent' ? '%' : kpi.unit === 'hours' ? 'h' : kpi.unit === 'days' ? 'd' : ''}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Realization</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{kpi.realizationPercent.toFixed(1)}%</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Improvement</span>
            <p className="mt-1 text-lg font-semibold text-success-600">{kpi.improvementPercent.toFixed(1)}%</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Owner</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{kpi.owner}</p>
          </div>
        </div>

        {kpi.description ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{kpi.description}</p>
          </div>
        ) : null}

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Value Realization Progress</h4>
          <Progress
            value={kpi.realizationPercent}
            max={100}
            variant="auto"
            size="md"
            showValue
            label="Target Realization"
          />
        </div>

        {trendData.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Quarterly Trend</h4>
            <ChartWrapper height={220} noCard noPadding>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="quarter"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Value" fill="#16b364" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function PlatformUsagePanel({ metrics, onMetricClick }) {
  const sortedMetrics = useMemo(() => {
    return [...metrics].sort((a, b) => b.changePercent - a.changePercent);
  }, [metrics]);

  if (sortedMetrics.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No usage metrics"
        message="No platform usage metrics available."
        size="md"
        bordered
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sortedMetrics.map((metric) => {
        const TrendIcon = getTrendIcon(metric.trend);
        const trendColor = getTrendColor(metric.trend);

        return (
          <Card
            key={metric.id}
            className={cn(
              'p-4 cursor-pointer transition-all duration-200',
              'hover:shadow-card-hover hover:border-humana-green-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
              'active:scale-[0.99]'
            )}
            role="button"
            tabIndex={0}
            onClick={() => onMetricClick(metric)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onMetricClick(metric);
              }
            }}
            aria-label={`${metric.name}. Value: ${metric.currentValue}. Change: ${metric.changePercent}%`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-slate-900 truncate">{metric.name}</h3>
                <span className="text-2xs text-slate-500">{formatLabel(metric.unit)}</span>
              </div>
              <StatusPill status={metric.status} size="sm" dot />
            </div>

            <div className="mt-3 flex items-end justify-between gap-2">
              <span className="text-2xl font-semibold text-slate-900">
                {formatNumber(metric.currentValue)}
                {metric.unit === 'percent' ? '%' : metric.unit === 'minutes' ? 'm' : metric.unit === 'ratio' ? '' : ''}
              </span>
              <div className={cn('flex items-center gap-0.5', trendColor)}>
                <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="text-xs font-medium">
                  {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="mt-2 text-2xs text-slate-400">
              Previous: {formatNumber(metric.previousValue)}
              {metric.unit === 'percent' ? '%' : metric.unit === 'minutes' ? 'm' : ''}
            </div>

            <div className="mt-2.5 flex items-center justify-end">
              <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function UserAdoptionPanel({ adoptionRates, onAdoptionClick, filterSegment }) {
  const filteredRates = useMemo(() => {
    let data = adoptionRates;
    if (filterSegment) {
      data = data.filter((r) => r.segment === filterSegment);
    }
    return [...data].sort((a, b) => b.adoptionRate - a.adoptionRate);
  }, [adoptionRates, filterSegment]);

  if (filteredRates.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No adoption rates"
        message="No user adoption rates match the current filter criteria."
        size="md"
        bordered
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {filteredRates.map((rate) => {
        const TrendIcon = getTrendIcon(rate.trend);
        const trendColor = getTrendColor(rate.trend);

        return (
          <div
            key={rate.id}
            className={cn(
              'flex items-start gap-4 rounded-lg border border-slate-200 p-4 transition-all duration-200 cursor-pointer',
              'hover:shadow-card-hover hover:border-humana-green-200'
            )}
            role="button"
            tabIndex={0}
            onClick={() => onAdoptionClick(rate)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onAdoptionClick(rate);
              }
            }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">{rate.personaName}</h3>
                  <span className="text-2xs text-slate-500">{rate.role} • {rate.segment}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <StatusPill status={rate.status} size="sm" dot />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-2xs text-slate-400">Adoption</span>
                  <span className="text-sm font-semibold text-slate-900">{rate.adoptionRate.toFixed(1)}%</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-2xs text-slate-400">Active</span>
                  <span className="text-sm font-semibold text-slate-900">{rate.activeUsers}/{rate.totalUsers}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-2xs text-slate-400">Sessions/wk</span>
                  <span className="text-sm font-semibold text-slate-900">{rate.averageSessionsPerWeek.toFixed(1)}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-2xs text-slate-400">Trend</span>
                  <div className={cn('flex items-center gap-0.5', trendColor)}>
                    <TrendIcon className="h-3 w-3" aria-hidden="true" />
                    <span className="text-xs font-medium capitalize">{rate.trend}</span>
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <Progress
                  value={rate.adoptionRate}
                  max={100}
                  variant="auto"
                  size="xs"
                  animate
                />
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-2" aria-hidden="true" />
          </div>
        );
      })}
    </div>
  );
}

function FeatureUtilizationPanel({ features }) {
  const sortedFeatures = useMemo(() => {
    return [...features].sort((a, b) => b.utilizationRate - a.utilizationRate);
  }, [features]);

  if (sortedFeatures.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No feature utilization data"
        message="No feature utilization data available."
        size="md"
        bordered
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sortedFeatures.map((feature) => {
        const TrendIcon = getTrendIcon(feature.trend);
        const trendColor = getTrendColor(feature.trend);

        return (
          <div
            key={feature.id}
            className="rounded-lg border border-slate-200 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">{feature.featureName}</h3>
                  <Badge variant="outline" size="sm">{formatLabel(feature.category)}</Badge>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-2xs text-slate-400">Utilization</span>
                    <span className="text-sm font-semibold text-slate-900">{feature.utilizationRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-2xs text-slate-400">Page Views</span>
                    <span className="text-sm font-semibold text-slate-900">{formatNumber(feature.totalPageViews)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-2xs text-slate-400">Unique Users</span>
                    <span className="text-sm font-semibold text-slate-900">{formatNumber(feature.uniqueUsers)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-2xs text-slate-400">Avg Time</span>
                    <span className="text-sm font-semibold text-slate-900">{feature.averageTimeOnFeatureMinutes.toFixed(1)}m</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <StatusPill status={feature.status} size="sm" dot />
                <div className={cn('flex items-center gap-0.5', trendColor)}>
                  <TrendIcon className="h-3 w-3" aria-hidden="true" />
                  <span className="text-2xs font-medium capitalize">{feature.trend}</span>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <Progress
                value={feature.utilizationRate}
                max={100}
                variant="auto"
                size="xs"
                animate
              />
            </div>
            {feature.topPersonas && feature.topPersonas.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {feature.topPersonas.map((p) => (
                  <Badge key={p} variant="outline" size="sm">{p}</Badge>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function ValueRealizationPanel({ kpis, onKPIClick }) {
  const sortedKPIs = useMemo(() => {
    return [...kpis].sort((a, b) => b.realizationPercent - a.realizationPercent);
  }, [kpis]);

  if (sortedKPIs.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No value realization KPIs"
        message="No value realization KPI data available."
        size="md"
        bordered
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sortedKPIs.map((kpi) => (
        <div
          key={kpi.id}
          className={cn(
            'rounded-lg border border-slate-200 p-4 transition-all duration-200 cursor-pointer',
            'hover:shadow-card-hover hover:border-humana-green-200'
          )}
          role="button"
          tabIndex={0}
          onClick={() => onKPIClick(kpi)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onKPIClick(kpi);
            }
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 truncate">{kpi.name}</h3>
                <Badge variant={getKPICategoryBadgeVariant(kpi.category)} size="sm">
                  {formatLabel(kpi.category)}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-slate-500 line-clamp-1">{kpi.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <StatusPill status={kpi.status} size="sm" dot />
              <span className="text-lg font-semibold text-slate-900">{kpi.realizationPercent.toFixed(1)}%</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-2xs text-slate-400">Baseline</span>
              <span className="text-xs font-semibold text-slate-700">
                {kpi.unit === 'currency' ? '$' : ''}{formatNumber(kpi.baselineValue)}
                {kpi.unit === 'percent' ? '%' : kpi.unit === 'hours' ? 'h' : kpi.unit === 'days' ? 'd' : ''}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-2xs text-slate-400">Current</span>
              <span className="text-xs font-semibold text-humana-green-600">
                {kpi.unit === 'currency' ? '$' : ''}{formatNumber(kpi.currentValue)}
                {kpi.unit === 'percent' ? '%' : kpi.unit === 'hours' ? 'h' : kpi.unit === 'days' ? 'd' : ''}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-2xs text-slate-400">Target</span>
              <span className="text-xs font-semibold text-slate-700">
                {kpi.unit === 'currency' ? '$' : ''}{formatNumber(kpi.targetValue)}
                {kpi.unit === 'percent' ? '%' : kpi.unit === 'hours' ? 'h' : kpi.unit === 'days' ? 'd' : ''}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-2xs text-slate-400">Improvement</span>
              <span className="text-xs font-semibold text-success-600">{kpi.improvementPercent.toFixed(1)}%</span>
            </div>
          </div>

          <div className="mt-2">
            <Progress
              value={kpi.realizationPercent}
              max={100}
              variant="auto"
              size="xs"
              animate
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-2xs text-slate-400">Owner: {kpi.owner}</span>
            <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MilestonesPanel({ milestones }) {
  const sortedMilestones = useMemo(() => {
    const statusOrder = ['at_risk', 'on_track', 'upcoming', 'achieved', 'missed'];
    return [...milestones].sort((a, b) => {
      const aIdx = statusOrder.indexOf(a.status);
      const bIdx = statusOrder.indexOf(b.status);
      return aIdx - bIdx;
    });
  }, [milestones]);

  if (sortedMilestones.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No milestones"
        message="No adoption milestones available."
        size="md"
        bordered
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sortedMilestones.map((milestone) => (
        <div
          key={milestone.id}
          className={cn(
            'rounded-lg border p-4',
            milestone.status === 'achieved' ? 'border-success-200 bg-success-50/10' :
            milestone.status === 'at_risk' ? 'border-warning-200 bg-warning-50/10' :
            milestone.status === 'missed' ? 'border-danger-200 bg-danger-50/10' :
            'border-slate-200'
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-slate-900">{milestone.title}</h3>
                <Badge variant={getMilestoneStatusBadgeVariant(milestone.status)} size="sm">
                  {formatLabel(milestone.status)}
                </Badge>
                <Badge variant={getMilestoneCategoryBadgeVariant(milestone.category)} size="sm">
                  {formatLabel(milestone.category)}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-slate-500 line-clamp-2">{milestone.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-lg font-semibold text-slate-900">{milestone.completionPercent}%</span>
            </div>
          </div>

          <div className="mt-2">
            <Progress
              value={milestone.completionPercent}
              max={100}
              variant={milestone.status === 'achieved' ? 'success' : milestone.status === 'at_risk' ? 'warning' : milestone.status === 'missed' ? 'error' : 'primary'}
              size="xs"
              animate
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-2xs text-slate-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                <span>Target: {formatDate(milestone.targetDate)}</span>
              </div>
              {milestone.achievedDate ? (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-success-500" aria-hidden="true" />
                  <span>Achieved: {formatDate(milestone.achievedDate)}</span>
                </div>
              ) : null}
            </div>
            <span>Owner: {milestone.owner}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsPanel({ usageMetrics, adoptionRates, featureUtilizations, valueKPIs, milestones }) {
  const adoptionBySegment = useMemo(() => {
    const segments = {};
    for (const rate of adoptionRates) {
      if (!segments[rate.segment]) {
        segments[rate.segment] = { totalUsers: 0, activeUsers: 0 };
      }
      segments[rate.segment].totalUsers += rate.totalUsers;
      segments[rate.segment].activeUsers += rate.activeUsers;
    }
    return Object.entries(segments).map(([segment, data]) => ({
      segment,
      adoptionRate: data.totalUsers > 0 ? Math.round((data.activeUsers / data.totalUsers) * 1000) / 10 : 0,
      totalUsers: data.totalUsers,
      activeUsers: data.activeUsers,
    }));
  }, [adoptionRates]);

  const featureCategoryData = useMemo(() => {
    const counts = {};
    for (const f of featureUtilizations) {
      counts[f.category] = (counts[f.category] || 0) + 1;
    }
    return Object.entries(counts).map(([category, count]) => ({
      category,
      count,
      label: formatLabel(category),
    }));
  }, [featureUtilizations]);

  const featureUtilizationChart = useMemo(() => {
    return featureUtilizations
      .map((f) => ({
        name: f.featureName.length > 20 ? f.featureName.substring(0, 20) + '…' : f.featureName,
        utilization: f.utilizationRate,
      }))
      .sort((a, b) => b.utilization - a.utilization)
      .slice(0, 10);
  }, [featureUtilizations]);

  const kpiCategoryData = useMemo(() => {
    const counts = {};
    for (const k of valueKPIs) {
      counts[k.category] = (counts[k.category] || 0) + 1;
    }
    return Object.entries(counts).map(([category, count]) => ({
      category,
      count,
      label: formatLabel(category),
    }));
  }, [valueKPIs]);

  const kpiRealizationChart = useMemo(() => {
    return valueKPIs
      .map((k) => ({
        name: k.name.length > 25 ? k.name.substring(0, 25) + '…' : k.name,
        realization: k.realizationPercent,
      }))
      .sort((a, b) => b.realization - a.realization);
  }, [valueKPIs]);

  const milestoneStatusData = useMemo(() => {
    const counts = {};
    for (const m of milestones) {
      counts[m.status] = (counts[m.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: formatLabel(status),
    }));
  }, [milestones]);

  const milestoneCategoryData = useMemo(() => {
    const counts = {};
    for (const m of milestones) {
      counts[m.category] = (counts[m.category] || 0) + 1;
    }
    return Object.entries(counts).map(([category, count]) => ({
      category,
      count,
      label: formatLabel(category),
    }));
  }, [milestones]);

  const adoptionTrendData = useMemo(() => {
    if (usageMetrics.length === 0) return [];
    const adoptionMetric = usageMetrics.find((m) => m.id === 'pum_006');
    if (!adoptionMetric || !adoptionMetric.trendData) return [];
    return adoptionMetric.trendData;
  }, [usageMetrics]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PanelCard
        title="Adoption by Segment"
        subtitle="User adoption rates across organizational segments"
        icon={<Layers className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adoptionBySegment} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="segment"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Bar dataKey="adoptionRate" name="Adoption Rate" radius={[4, 4, 0, 0]} barSize={32}>
                {adoptionBySegment.map((entry) => (
                  <Cell key={entry.segment} fill={SEGMENT_COLORS[entry.segment] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Platform Adoption Trend"
        subtitle="Monthly platform adoption rate over 12 months"
        icon={<TrendingUp className="h-5 w-5" />}
      >
        {adoptionTrendData.length > 0 ? (
          <ChartWrapper height={250} noCard noPadding>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adoptionTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip unit="%" />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Adoption Rate"
                  stroke="#16b364"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#16b364', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>
        ) : (
          <EmptyState type="no_chart" title="No trend data" message="No adoption trend data available." size="sm" />
        )}
      </PanelCard>

      <PanelCard
        title="Feature Utilization Rankings"
        subtitle="Top features by utilization rate"
        icon={<Star className="h-5 w-5" />}
      >
        <ChartWrapper height={280} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureUtilizationChart} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                domain={[0, 100]}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Bar dataKey="utilization" name="Utilization %" fill="#16b364" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Value Realization Progress"
        subtitle="KPI realization percentages"
        icon={<Target className="h-5 w-5" />}
      >
        <ChartWrapper height={280} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={kpiRealizationChart} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                domain={[0, 100]}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 9, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                width={100}
              />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Bar dataKey="realization" name="Realization %" radius={[0, 4, 4, 0]} barSize={14}>
                {kpiRealizationChart.map((entry) => {
                  let color = '#10b981';
                  if (entry.realization < 70) color = '#ef4444';
                  else if (entry.realization < 85) color = '#f59e0b';
                  return <Cell key={entry.name} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Milestone Status Distribution"
        subtitle="Adoption milestones by status"
        icon={<Flag className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={milestoneStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {milestoneStatusData.map((entry) => (
                    <Cell key={entry.status} fill={MILESTONE_STATUS_COLORS[entry.status] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} milestones`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {milestoneStatusData.map((item) => (
              <div key={item.status} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: MILESTONE_STATUS_COLORS[item.status] || '#a3a3a3' }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title="KPI Categories"
        subtitle="Value realization KPIs by category"
        icon={<BarChart2 className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={kpiCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {kpiCategoryData.map((entry) => (
                    <Cell key={entry.category} fill={KPI_CATEGORY_COLORS[entry.category] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} KPIs`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {kpiCategoryData.map((item) => (
              <div key={item.category} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: KPI_CATEGORY_COLORS[item.category] || '#a3a3a3' }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title="Feature Categories"
        subtitle="Feature utilization by category"
        icon={<Monitor className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureCategoryData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                angle={-25}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Features" radius={[4, 4, 0, 0]} barSize={28}>
                {featureCategoryData.map((entry) => (
                  <Cell key={entry.category} fill={FEATURE_CATEGORY_COLORS[entry.category] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Milestone Categories"
        subtitle="Adoption milestones by category"
        icon={<Award className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {milestoneCategoryData.map((item) => (
            <div key={item.category} className="flex items-center gap-3">
              <div className="w-28 shrink-0">
                <Badge variant={getMilestoneCategoryBadgeVariant(item.category)} size="sm">
                  {item.label}
                </Badge>
              </div>
              <div className="flex-1">
                <Progress
                  value={item.count}
                  max={milestones.length || 1}
                  variant="primary"
                  size="sm"
                  animate
                />
              </div>
              <span className="text-sm font-semibold text-slate-900 w-8 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}

function AdoptionImpactSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading adoption impact" aria-busy="true">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-10 w-full rounded-lg" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-80 rounded-xl" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Adoption and Impact Dashboard page component.
 * Tracks platform usage metrics, user adoption rates, feature utilization,
 * value realization KPIs with trend charts and data tables.
 * All data from mockService.
 *
 * @returns {React.ReactElement}
 */
function AdoptionImpactPage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [usageMetrics, setUsageMetrics] = useState([]);
  const [adoptionRates, setAdoptionRates] = useState([]);
  const [featureUtilizations, setFeatureUtilizations] = useState([]);
  const [valueKPIs, setValueKPIs] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [aggregates, setAggregates] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [metricDetailOpen, setMetricDetailOpen] = useState(false);
  const [selectedAdoption, setSelectedAdoption] = useState(null);
  const [adoptionDetailOpen, setAdoptionDetailOpen] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [kpiDetailOpen, setKpiDetailOpen] = useState(false);
  const [filters, setFilters] = useState({
    segment: '',
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Analytics', path: ROUTES.ANALYTICS },
      { label: 'Adoption & Impact' },
    ]);
  }, [setBreadcrumbs]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await getAdoptionData();
      setUsageMetrics(getAllPlatformUsageMetrics());
      setAdoptionRates(getAllUserAdoptionRates());
      setFeatureUtilizations(getAllFeatureUtilizations());
      setValueKPIs(getAllValueRealizationKPIs());
      setMilestones(getAllAdoptionMilestones());
      setAggregates(getAdoptionAggregates());
    } catch {
      setUsageMetrics(getAllPlatformUsageMetrics());
      setAdoptionRates(getAllUserAdoptionRates());
      setFeatureUtilizations(getAllFeatureUtilizations());
      setValueKPIs(getAllValueRealizationKPIs());
      setMilestones(getAllAdoptionMilestones());
      setAggregates(getAdoptionAggregates());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    loadData();
  }, [loadData]);

  const handleMetricClick = useCallback((metric) => {
    setSelectedMetric(metric);
    setMetricDetailOpen(true);
  }, []);

  const handleMetricDetailClose = useCallback((open) => {
    setMetricDetailOpen(open);
    if (!open) setSelectedMetric(null);
  }, []);

  const handleAdoptionClick = useCallback((rate) => {
    setSelectedAdoption(rate);
    setAdoptionDetailOpen(true);
  }, []);

  const handleAdoptionDetailClose = useCallback((open) => {
    setAdoptionDetailOpen(open);
    if (!open) setSelectedAdoption(null);
  }, []);

  const handleKPIClick = useCallback((kpi) => {
    setSelectedKPI(kpi);
    setKpiDetailOpen(true);
  }, []);

  const handleKPIDetailClose = useCallback((open) => {
    setKpiDetailOpen(open);
    if (!open) setSelectedKPI(null);
  }, []);

  const handleExportCSV = useCallback(() => {
    try {
      const data = usageMetrics.map((m) => ({
        id: m.id,
        name: m.name,
        currentValue: m.currentValue,
        previousValue: m.previousValue,
        unit: m.unit,
        trend: m.trend,
        changePercent: m.changePercent,
        status: m.status,
      }));
      downloadCSV(data, 'adoption-usage-metrics.csv');
      logEvent('data_export', {
        action: 'Exported Adoption Data',
        details: `Adoption usage metrics exported as CSV by ${currentPersona.name}. ${data.length} records.`,
        resource: '/analytics',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} usage metrics exported as CSV.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export adoption data.',
      });
    }
  }, [usageMetrics, currentPersona, logEvent, toast]);

  const handleExportJSON = useCallback(() => {
    try {
      const data = {
        usageMetrics: usageMetrics.map((m) => ({
          id: m.id,
          name: m.name,
          currentValue: m.currentValue,
          previousValue: m.previousValue,
          unit: m.unit,
          trend: m.trend,
          changePercent: m.changePercent,
          status: m.status,
        })),
        adoptionRates: adoptionRates.length,
        featureUtilizations: featureUtilizations.length,
        valueKPIs: valueKPIs.length,
        milestones: milestones.length,
      };
      downloadJSON(data, 'adoption-impact.json');
      logEvent('data_export', {
        action: 'Exported Adoption Data',
        details: `Adoption impact data exported as JSON by ${currentPersona.name}.`,
        resource: '/analytics',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: 'Adoption impact data exported as JSON.',
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export adoption data.',
      });
    }
  }, [usageMetrics, adoptionRates, featureUtilizations, valueKPIs, milestones, currentPersona, logEvent, toast]);

  const SEGMENT_OPTIONS = useMemo(() => [
    { value: '', label: 'All Segments' },
    { value: 'Enterprise', label: 'Enterprise' },
    { value: 'Medicare', label: 'Medicare' },
    { value: 'Medicaid', label: 'Medicaid' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'External', label: 'External' },
    { value: 'Compliance', label: 'Compliance' },
  ], []);

  const filterFields = useMemo(() => {
    return [
      {
        id: 'segment',
        label: 'Segment',
        type: 'select',
        options: SEGMENT_OPTIONS,
        defaultValue: '',
      },
    ];
  }, [SEGMENT_OPTIONS]);

  const kpiData = useMemo(() => {
    if (!aggregates) return [];

    return [
      {
        id: 'kpi_adoption_rate',
        label: 'Overall Adoption Rate',
        value: aggregates.overallAdoptionRate,
        unit: 'percent',
        trend: aggregates.overallAdoptionRate >= 80 ? 'improving' : 'stable',
        status: aggregates.overallAdoptionRate >= 80 ? 'on_track' : aggregates.overallAdoptionRate >= 60 ? 'at_risk' : 'critical',
        description: 'Percentage of provisioned users actively using the platform.',
      },
      {
        id: 'kpi_active_users',
        label: 'Active Users',
        value: aggregates.totalActiveUsers,
        unit: 'count',
        trend: 'improving',
        status: 'on_track',
        description: 'Total active users across all personas.',
      },
      {
        id: 'kpi_avg_realization',
        label: 'Avg Value Realization',
        value: aggregates.averageRealizationPercent,
        unit: 'percent',
        trend: aggregates.averageRealizationPercent >= 80 ? 'improving' : 'stable',
        status: aggregates.averageRealizationPercent >= 80 ? 'on_track' : 'at_risk',
        description: 'Average value realization across all KPIs.',
      },
      {
        id: 'kpi_milestones_achieved',
        label: 'Milestones Achieved',
        value: aggregates.achievedMilestones,
        unit: 'count',
        trend: 'improving',
        status: 'on_track',
        description: `${aggregates.achievedMilestones} of ${aggregates.totalMilestones} milestones achieved.`,
      },
    ];
  }, [aggregates]);

  const insightData = useMemo(() => {
    if (!aggregates) return null;

    const atRiskAdoption = (aggregates.adoptionStatusBreakdown && aggregates.adoptionStatusBreakdown[MEASURE_STATUS.AT_RISK]) || 0;
    const avgUtilization = aggregates.averageUtilizationRate || 0;
    const avgRealization = aggregates.averageRealizationPercent || 0;

    if (atRiskAdoption > 3) {
      return {
        variant: 'warning',
        title: `${atRiskAdoption} persona${atRiskAdoption !== 1 ? 's' : ''} at risk for adoption`,
        message: `${atRiskAdoption} user persona${atRiskAdoption !== 1 ? 's are' : ' is'} below target adoption rates. Overall platform adoption is ${aggregates.overallAdoptionRate.toFixed(1)}%. Average feature utilization is ${avgUtilization.toFixed(1)}%. Consider targeted training and engagement campaigns.`,
        source: 'Adoption Analytics Engine',
        confidence: 89,
      };
    }

    if (avgRealization < 80) {
      return {
        variant: 'recommendation',
        title: 'Value realization below target',
        message: `Average value realization is ${avgRealization.toFixed(1)}%, below the 90% target. ${aggregates.achievedMilestones} of ${aggregates.totalMilestones} milestones achieved. Focus on completing remaining milestones to improve value realization.`,
        source: 'Adoption Analytics Engine',
        confidence: 85,
      };
    }

    return {
      variant: 'success',
      title: 'Platform adoption performing well',
      message: `Overall adoption rate is ${aggregates.overallAdoptionRate.toFixed(1)}% with ${aggregates.totalActiveUsers} active users. Average value realization is ${avgRealization.toFixed(1)}%. ${aggregates.achievedMilestones} of ${aggregates.totalMilestones} milestones achieved.`,
      source: 'Adoption Analytics Engine',
      confidence: 94,
    };
  }, [aggregates]);

  const adoptionColumns = useMemo(
    () => [
      {
        accessorKey: 'personaName',
        header: 'Persona',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleAdoptionClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors"
          >
            {row.original.personaName}
          </button>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        size: 160,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700 truncate block max-w-[160px]">{row.original.role}</span>
        ),
      },
      {
        accessorKey: 'segment',
        header: 'Segment',
        size: 100,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: SEGMENT_COLORS[row.original.segment] || '#64748b' }}
              aria-hidden="true"
            />
            <span className="text-sm text-slate-700">{row.original.segment}</span>
          </div>
        ),
      },
      {
        accessorKey: 'adoptionRate',
        header: 'Adoption',
        size: 120,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Progress
              value={row.original.adoptionRate}
              max={100}
              variant="auto"
              size="xs"
              className="flex-1"
            />
            <span className="text-xs font-medium text-slate-700 w-12 text-right">
              {row.original.adoptionRate.toFixed(1)}%
            </span>
          </div>
        ),
      },
      {
        id: 'users',
        header: 'Users',
        size: 80,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.activeUsers}/{row.original.totalUsers}</span>
        ),
      },
      {
        accessorKey: 'averageSessionsPerWeek',
        header: 'Sessions/wk',
        size: 90,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.averageSessionsPerWeek.toFixed(1)}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        cell: ({ row }) => (
          <StatusPill status={row.original.status} size="sm" dot />
        ),
      },
      {
        accessorKey: 'trend',
        header: 'Trend',
        size: 90,
        cell: ({ row }) => {
          const TrendIcon = getTrendIcon(row.original.trend);
          const trendColor = getTrendColor(row.original.trend);
          return (
            <div className={cn('flex items-center gap-1', trendColor)}>
              <TrendIcon className="h-3 w-3" aria-hidden="true" />
              <span className="text-xs font-medium capitalize">{row.original.trend}</span>
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        size: 60,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <UITooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => handleAdoptionClick(row.original)}
                className={cn(
                  'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                  'hover:bg-slate-100 hover:text-slate-600',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                )}
                aria-label={`View ${row.original.personaName}`}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">View Details</TooltipContent>
          </UITooltip>
        ),
      },
    ],
    [handleAdoptionClick]
  );

  const valueKPIColumns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'KPI',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleKPIClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors line-clamp-2"
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        size: 100,
        cell: ({ row }) => (
          <Badge variant={getKPICategoryBadgeVariant(row.original.category)} size="sm">
            {formatLabel(row.original.category)}
          </Badge>
        ),
      },
      {
        accessorKey: 'realizationPercent',
        header: 'Realization',
        size: 120,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Progress
              value={row.original.realizationPercent}
              max={100}
              variant="auto"
              size="xs"
              className="flex-1"
            />
            <span className="text-xs font-medium text-slate-700 w-12 text-right">
              {row.original.realizationPercent.toFixed(1)}%
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'improvementPercent',
        header: 'Improvement',
        size: 100,
        cell: ({ row }) => (
          <span className="text-sm font-medium text-success-600">{row.original.improvementPercent.toFixed(1)}%</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        cell: ({ row }) => (
          <StatusPill status={row.original.status} size="sm" dot />
        ),
      },
      {
        accessorKey: 'owner',
        header: 'Owner',
        size: 130,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.owner}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 60,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <UITooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => handleKPIClick(row.original)}
                className={cn(
                  'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                  'hover:bg-slate-100 hover:text-slate-600',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                )}
                aria-label={`View ${row.original.name}`}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">View Details</TooltipContent>
          </UITooltip>
        ),
      },
    ],
    [handleKPIClick]
  );

  const filteredAdoptionRates = useMemo(() => {
    if (!filters.segment) return adoptionRates;
    return adoptionRates.filter((r) => r.segment === filters.segment);
  }, [adoptionRates, filters.segment]);

  if (loading) {
    return <AdoptionImpactSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">Adoption & Impact Dashboard</h1>
          <p className="text-sm text-slate-500">
            Platform usage metrics, user adoption rates, feature utilization, and value realization for {currentPersona.name}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            iconLeft={<RefreshCw className="h-3.5 w-3.5" />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>

          <PermissionGate requiredAction={PERMISSIONS.EXPORT_REPORTS} behavior="hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  iconLeft={<Download className="h-3.5 w-3.5" />}
                >
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Export as</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportCSV}>
                  <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                  CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON}>
                  <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                  JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </PermissionGate>
        </div>
      </div>

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

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            trend={kpi.trend}
            status={kpi.status}
            description={kpi.description}
          />
        ))}
      </div>

      {/* Filters */}
      <FilterBar
        fields={filterFields}
        values={filters}
        onChange={handleFilterChange}
        liveMode
        showApplyButton={false}
        showResetButton
        showActiveFilters
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage Metrics ({usageMetrics.length})</TabsTrigger>
          <TabsTrigger value="adoption">User Adoption ({filteredAdoptionRates.length})</TabsTrigger>
          <TabsTrigger value="features">Features ({featureUtilizations.length})</TabsTrigger>
          <TabsTrigger value="value">Value KPIs ({valueKPIs.length})</TabsTrigger>
          <TabsTrigger value="milestones">Milestones ({milestones.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="flex flex-col gap-6">
            {/* Platform Usage Summary */}
            <PanelCard
              title="Platform Usage Metrics"
              subtitle={`${usageMetrics.length} metrics tracked`}
              icon={<Activity className="h-5 w-5" />}
            >
              <PlatformUsagePanel
                metrics={usageMetrics.slice(0, 6)}
                onMetricClick={handleMetricClick}
              />
              {usageMetrics.length > 6 ? (
                <p className="mt-3 text-xs text-slate-400 text-center">
                  +{usageMetrics.length - 6} more metrics. Switch to Usage Metrics tab to see all.
                </p>
              ) : null}
            </PanelCard>

            {/* User Adoption Summary */}
            <PanelCard
              title="User Adoption Rates"
              subtitle={`${filteredAdoptionRates.length} personas tracked`}
              icon={<Users className="h-5 w-5" />}
            >
              <UserAdoptionPanel
                adoptionRates={filteredAdoptionRates.slice(0, 5)}
                onAdoptionClick={handleAdoptionClick}
                filterSegment={filters.segment}
              />
              {filteredAdoptionRates.length > 5 ? (
                <p className="mt-3 text-xs text-slate-400 text-center">
                  +{filteredAdoptionRates.length - 5} more. Switch to User Adoption tab to see all.
                </p>
              ) : null}
            </PanelCard>

            {/* Value Realization Summary */}
            <PanelCard
              title="Value Realization KPIs"
              subtitle={`${valueKPIs.length} KPIs tracked`}
              icon={<Target className="h-5 w-5" />}
            >
              <ValueRealizationPanel
                kpis={valueKPIs.slice(0, 4)}
                onKPIClick={handleKPIClick}
              />
              {valueKPIs.length > 4 ? (
                <p className="mt-3 text-xs text-slate-400 text-center">
                  +{valueKPIs.length - 4} more KPIs. Switch to Value KPIs tab to see all.
                </p>
              ) : null}
            </PanelCard>

            {/* Milestones Summary */}
            <PanelCard
              title="Adoption Milestones"
              subtitle={`${milestones.length} milestones tracked`}
              icon={<Flag className="h-5 w-5" />}
              collapsible
              defaultCollapsed={false}
            >
              <MilestonesPanel milestones={milestones.slice(0, 5)} />
              {milestones.length > 5 ? (
                <p className="mt-3 text-xs text-slate-400 text-center">
                  +{milestones.length - 5} more milestones. Switch to Milestones tab to see all.
                </p>
              ) : null}
            </PanelCard>
          </div>
        </TabsContent>

        <TabsContent value="usage">
          {usageMetrics.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No usage metrics"
              message="No platform usage metrics available."
              size="lg"
              bordered
            />
          ) : (
            <PlatformUsagePanel
              metrics={usageMetrics}
              onMetricClick={handleMetricClick}
            />
          )}
        </TabsContent>

        <TabsContent value="adoption">
          {filteredAdoptionRates.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No adoption rates"
              message="No user adoption rates match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={adoptionColumns}
              data={filteredAdoptionRates}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search adoption rates..."
              emptyMessage="No adoption rates match the search criteria."
              onRowClick={handleAdoptionClick}
            />
          )}
        </TabsContent>

        <TabsContent value="features">
          {featureUtilizations.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No feature utilization data"
              message="No feature utilization data available."
              size="lg"
              bordered
            />
          ) : (
            <PanelCard
              title="Feature Utilization"
              subtitle={`${featureUtilizations.length} features tracked`}
              icon={<Monitor className="h-5 w-5" />}
            >
              <FeatureUtilizationPanel features={featureUtilizations} />
            </PanelCard>
          )}
        </TabsContent>

        <TabsContent value="value">
          {valueKPIs.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No value realization KPIs"
              message="No value realization KPI data available."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={valueKPIColumns}
              data={valueKPIs}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search value KPIs..."
              emptyMessage="No KPIs match the search criteria."
              onRowClick={handleKPIClick}
            />
          )}
        </TabsContent>

        <TabsContent value="milestones">
          {milestones.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No milestones"
              message="No adoption milestones available."
              size="lg"
              bordered
            />
          ) : (
            <PanelCard
              title="Adoption Milestones"
              subtitle={`${milestones.length} milestones tracked`}
              icon={<Flag className="h-5 w-5" />}
            >
              <MilestonesPanel milestones={milestones} />
            </PanelCard>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {usageMetrics.length === 0 && adoptionRates.length === 0 ? (
            <EmptyState
              type="no_chart"
              title="No data for analytics"
              message="No adoption data available to generate analytics."
              size="lg"
              bordered
            />
          ) : (
            <AnalyticsPanel
              usageMetrics={usageMetrics}
              adoptionRates={adoptionRates}
              featureUtilizations={featureUtilizations}
              valueKPIs={valueKPIs}
              milestones={milestones}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Panel */}
      {aggregates ? (
        <PanelCard
          title="Adoption & Impact Summary"
          subtitle="Aggregate metrics across all adoption data"
          icon={<Award className="h-5 w-5" />}
          collapsible
          defaultCollapsed
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Usage Metrics</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.totalPlatformUsageMetrics}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg Adoption</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.averageAdoptionRate.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Active Users</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.totalActiveUsers}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Provisioned</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.totalProvisionedUsers}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg Utilization</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.averageUtilizationRate.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg Realization</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.averageRealizationPercent.toFixed(1)}%</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Overall Adoption Rate</span>
              <Progress
                value={aggregates.overallAdoptionRate}
                max={100}
                variant="auto"
                size="md"
                showValue
                label="Platform Adoption"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Average Value Realization</span>
              <Progress
                value={aggregates.averageRealizationPercent}
                max={100}
                variant="auto"
                size="md"
                showValue
                label="Value Realization"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Milestone Progress</h4>
            <div className="flex flex-col gap-2">
              {Object.entries(aggregates.milestoneStatusBreakdown || {}).map(([status, count]) => (
                <div key={status} className="flex items-center gap-3">
                  <div className="w-24 shrink-0">
                    <Badge variant={getMilestoneStatusBadgeVariant(status)} size="sm">
                      {formatLabel(status)}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={count}
                      max={aggregates.totalMilestones || 1}
                      variant="primary"
                      size="xs"
                      animate
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Feature Utilization</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Total Features</span>
                <span className="text-lg font-semibold text-slate-900">{aggregates.totalFeatureUtilizations}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg Utilization</span>
                <span className="text-lg font-semibold text-slate-900">{aggregates.averageUtilizationRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Value Realization KPIs</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Total KPIs</span>
                <span className="text-lg font-semibold text-slate-900">{aggregates.totalValueRealizationKPIs}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg Realization</span>
                <span className="text-lg font-semibold text-slate-900">{aggregates.averageRealizationPercent.toFixed(1)}%</span>
              </div>
            </div>
            {aggregates.kpiStatusBreakdown ? (
              <div className="mt-2 flex flex-col gap-2">
                {Object.entries(aggregates.kpiStatusBreakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-3">
                    <div className="w-20 shrink-0">
                      <StatusPill status={status} size="sm" dot />
                    </div>
                    <div className="flex-1">
                      <Progress
                        value={count}
                        max={aggregates.totalValueRealizationKPIs || 1}
                        variant="primary"
                        size="xs"
                        animate
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </PanelCard>
      ) : null}

      {/* Detail Dialogs */}
      <UsageMetricDetailDialog
        metric={selectedMetric}
        open={metricDetailOpen}
        onOpenChange={handleMetricDetailClose}
      />

      <AdoptionRateDetailDialog
        adoptionRate={selectedAdoption}
        open={adoptionDetailOpen}
        onOpenChange={handleAdoptionDetailClose}
      />

      <ValueKPIDetailDialog
        kpi={selectedKPI}
        open={kpiDetailOpen}
        onOpenChange={handleKPIDetailClose}
      />
    </div>
  );
}

AdoptionImpactPage.displayName = 'AdoptionImpactPage';

export { AdoptionImpactPage };
export default AdoptionImpactPage;