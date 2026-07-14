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
  FileText,
  Activity,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  BarChart2,
  Layers,
  ChevronRight,
  User,
  Calendar,
  Clock,
  Target,
  Zap,
  TrendingUp,
  Shield,
  Monitor,
  PieChart as PieChartIcon,
  Table,
  Map,
  Radar,
  AreaChart,
  Search,
  Filter,
  Sparkles,
  Lightbulb,
  Star,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import {
  getReports,
} from '@/lib/mock-api/mockService';
import {
  getAllReportCategories,
  getReportCategoryById,
  getAllReports,
  getReportById,
  getReportsByCategory,
  getReportsByChartType,
  getReportsByFrequency,
  getReportsByOwner,
  getReportsBySegment,
  getReportAggregates,
  getAllReportCategoryNames,
  getAllReportChartTypes,
  getAllReportFrequencies,
  getAllReportOwners,
} from '@/data/reports';
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
  DialogFooter,
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
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { PERMISSIONS, ROUTES, MEASURE_STATUS } from '@/lib/constants';

const CATEGORY_COLORS = {
  executive: '#16b364',
  segment: '#3b82f6',
  application: '#8b5cf6',
  test: '#f59e0b',
  governance: '#06b6d4',
  compliance: '#ef4444',
};

const CATEGORY_ICONS = {
  executive: Briefcase,
  segment: Layers,
  application: Monitor,
  test: CheckCircle2,
  governance: Shield,
  compliance: FileText,
};

const CHART_TYPE_COLORS = {
  bar: '#16b364',
  line: '#3b82f6',
  pie: '#8b5cf6',
  donut: '#f59e0b',
  stacked_bar: '#06b6d4',
  table: '#64748b',
  gauge: '#ef4444',
  heatmap: '#dc2626',
  treemap: '#10b981',
  radar: '#a3a3a3',
  area: '#3b82f6',
  scatter: '#f59e0b',
};

const FREQUENCY_COLORS = {
  daily: '#16b364',
  weekly: '#3b82f6',
  monthly: '#8b5cf6',
  quarterly: '#f59e0b',
  on_demand: '#a3a3a3',
};

const STATUS_CHART_COLORS = {
  [MEASURE_STATUS.ON_TRACK]: '#10b981',
  [MEASURE_STATUS.AT_RISK]: '#f59e0b',
  [MEASURE_STATUS.CRITICAL]: '#ef4444',
  [MEASURE_STATUS.COMPLETED]: '#3b82f6',
  [MEASURE_STATUS.NOT_STARTED]: '#a3a3a3',
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

function getCategoryBadgeVariant(category) {
  switch (category) {
    case 'executive':
      return 'primary';
    case 'segment':
      return 'info';
    case 'application':
      return 'warning';
    case 'test':
      return 'success';
    case 'governance':
      return 'neutral';
    case 'compliance':
      return 'error';
    default:
      return 'neutral';
  }
}

function getChartTypeBadgeVariant(chartType) {
  switch (chartType) {
    case 'bar':
    case 'stacked_bar':
      return 'primary';
    case 'line':
    case 'area':
      return 'info';
    case 'pie':
    case 'donut':
      return 'warning';
    case 'table':
      return 'neutral';
    case 'heatmap':
      return 'error';
    case 'radar':
      return 'success';
    default:
      return 'neutral';
  }
}

function getFrequencyBadgeVariant(frequency) {
  switch (frequency) {
    case 'daily':
      return 'primary';
    case 'weekly':
      return 'info';
    case 'monthly':
      return 'warning';
    case 'quarterly':
      return 'neutral';
    case 'on_demand':
      return 'success';
    default:
      return 'neutral';
  }
}

function getChartTypeIcon(chartType) {
  switch (chartType) {
    case 'bar':
    case 'stacked_bar':
      return BarChart2;
    case 'line':
      return TrendingUp;
    case 'area':
      return AreaChart;
    case 'pie':
    case 'donut':
      return PieChartIcon;
    case 'table':
      return Table;
    case 'heatmap':
      return Map;
    case 'radar':
      return Radar;
    case 'gauge':
      return Target;
    default:
      return BarChart2;
  }
}

function ReportPreviewChart({ report }) {
  if (!report || !report.data || report.data.length === 0) {
    return (
      <EmptyState
        type="no_chart"
        title="No data"
        message="No data available for this report."
        size="sm"
      />
    );
  }

  const chartType = report.chartType;
  const data = report.data;

  if (chartType === 'table') {
    return (
      <div className="overflow-x-auto max-h-[250px]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Label</th>
              <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Value</th>
              {data[0] && data[0].category ? (
                <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Category</th>
              ) : null}
              {data[0] && data[0].status ? (
                <th className="pb-2 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((item, index) => (
              <tr key={index} className="border-b border-slate-100 last:border-b-0">
                <td className="py-2 text-slate-900 text-xs">{item.label}</td>
                <td className="py-2 text-right text-slate-700 text-xs">{typeof item.value === 'number' ? item.value.toFixed(1) : item.value}</td>
                {item.category !== undefined ? (
                  <td className="py-2 text-slate-500 text-xs">{item.category}</td>
                ) : null}
                {item.status !== undefined ? (
                  <td className="py-2 text-center">
                    <StatusPill status={item.status} size="sm" />
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length > 10 ? (
          <p className="text-2xs text-slate-400 text-center mt-2">+{data.length - 10} more rows</p>
        ) : null}
      </div>
    );
  }

  if (chartType === 'pie' || chartType === 'donut') {
    const pieData = data.filter((d) => d.value > 0);
    const innerRadius = chartType === 'donut' ? 45 : 0;
    const defaultColors = ['#16b364', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#10b981', '#a3a3a3'];

    return (
      <ChartWrapper height={220} noCard noPadding>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              nameKey="label"
              stroke="none"
            >
              {pieData.map((entry, index) => {
                let fillColor = defaultColors[index % defaultColors.length];
                if (entry.color === 'success') fillColor = '#10b981';
                else if (entry.color === 'warning') fillColor = '#f59e0b';
                else if (entry.color === 'danger') fillColor = '#ef4444';
                else if (entry.color === 'info') fillColor = '#3b82f6';
                else if (entry.color === 'neutral') fillColor = '#a3a3a3';
                else if (entry.status) {
                  fillColor = STATUS_CHART_COLORS[entry.status] || fillColor;
                }
                return <Cell key={index} fill={fillColor} />;
              })}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value}`, name]} />
          </PieChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }

  if (chartType === 'line' || chartType === 'area') {
    const categories = [...new Set(data.map((d) => d.category).filter(Boolean))];
    const hasCategories = categories.length > 1;

    if (hasCategories) {
      const labels = [...new Set(data.map((d) => d.label))];
      const chartData = labels.map((label) => {
        const point = { label };
        for (const cat of categories) {
          const item = data.find((d) => d.label === label && d.category === cat);
          if (item) {
            point[cat] = item.value;
          }
        }
        return point;
      });

      const lineColors = ['#16b364', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

      return (
        <ChartWrapper height={220} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '10px' }} iconType="circle" iconSize={6} />
              {categories.map((cat, index) => (
                <Line
                  key={cat}
                  type="monotone"
                  dataKey={cat}
                  name={cat}
                  stroke={lineColors[index % lineColors.length]}
                  strokeWidth={2}
                  dot={{ r: 2, fill: lineColors[index % lineColors.length], strokeWidth: 0 }}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      );
    }

    return (
      <ChartWrapper height={220} noCard noPadding>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              name="Value"
              stroke="#16b364"
              strokeWidth={2.5}
              dot={{ r: 2.5, fill: '#16b364', strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }

  if (chartType === 'bar' || chartType === 'stacked_bar') {
    const categories = [...new Set(data.map((d) => d.category).filter(Boolean))];
    const hasCategories = categories.length > 1;

    if (hasCategories && chartType === 'stacked_bar') {
      const labels = [...new Set(data.map((d) => d.label))];
      const chartData = labels.map((label) => {
        const point = { label };
        for (const cat of categories) {
          const item = data.find((d) => d.label === label && d.category === cat);
          if (item) {
            point[cat] = item.value;
          }
        }
        return point;
      });

      const barColors = ['#16b364', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

      return (
        <ChartWrapper height={220} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '10px' }} iconType="circle" iconSize={6} />
              {categories.map((cat, index) => (
                <Bar
                  key={cat}
                  dataKey={cat}
                  name={cat}
                  fill={barColors[index % barColors.length]}
                  radius={index === categories.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
                  barSize={16}
                  stackId="a"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      );
    }

    const defaultColors = ['#16b364', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#10b981', '#a3a3a3'];

    return (
      <ChartWrapper height={220} noCard noPadding>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Value" radius={[4, 4, 0, 0]} barSize={24}>
              {data.map((entry, index) => {
                let fillColor = defaultColors[index % defaultColors.length];
                if (entry.color === 'success') fillColor = '#10b981';
                else if (entry.color === 'warning') fillColor = '#f59e0b';
                else if (entry.color === 'danger') fillColor = '#ef4444';
                else if (entry.color === 'info') fillColor = '#3b82f6';
                else if (entry.color === 'neutral') fillColor = '#a3a3a3';
                else if (entry.status) {
                  fillColor = STATUS_CHART_COLORS[entry.status] || fillColor;
                }
                return <Cell key={index} fill={fillColor} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }

  if (chartType === 'heatmap') {
    return (
      <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto">
        {data.map((item, index) => {
          let bgColor = 'bg-slate-100';
          if (item.value >= 95) bgColor = 'bg-success-100';
          else if (item.value >= 85) bgColor = 'bg-success-50';
          else if (item.value >= 70) bgColor = 'bg-warning-50';
          else if (item.value >= 50) bgColor = 'bg-warning-100';
          else if (item.value > 0) bgColor = 'bg-danger-50';
          else bgColor = 'bg-danger-100';

          return (
            <div key={index} className={cn('flex items-center justify-between rounded-lg px-3 py-2', bgColor)}>
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="text-xs font-medium text-slate-900 truncate">{item.label}</span>
                {item.category ? (
                  <span className="text-2xs text-slate-500">{item.category}</span>
                ) : null}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-semibold text-slate-900">{item.value.toFixed(1)}%</span>
                {item.status ? (
                  <StatusPill status={item.status} size="sm" />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <ChartWrapper height={220} noCard noPadding>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 9, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" name="Value" fill="#16b364" radius={[4, 4, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

function ReportDetailDialog({ report, open, onOpenChange, onExportCSV, onExportJSON }) {
  if (!report) return null;

  const reportFilters = report.filters || [];
  const applicableSegments = report.applicableSegments || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <FileText className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{report.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {report.id} • {formatLabel(report.category)} • {formatLabel(report.chartType)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant={getCategoryBadgeVariant(report.category)} size="md">
            {formatLabel(report.category)}
          </Badge>
          <Badge variant={getChartTypeBadgeVariant(report.chartType)} size="md">
            {formatLabel(report.chartType)}
          </Badge>
          <Badge variant={getFrequencyBadgeVariant(report.frequency)} size="md">
            {formatLabel(report.frequency)}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Category</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{formatLabel(report.category)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Chart Type</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{formatLabel(report.chartType)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Frequency</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{formatLabel(report.frequency)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Data Points</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{report.data ? report.data.length : 0}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Owner:</span>
            <span className="font-medium text-slate-900">{report.owner}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Last Generated:</span>
            <span className="font-medium text-slate-900">{formatDate(report.lastGenerated)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Frequency:</span>
            <span className="font-medium text-slate-900">{formatLabel(report.frequency)}</span>
          </div>
        </div>

        {report.description ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{report.description}</p>
          </div>
        ) : null}

        {applicableSegments.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Applicable Segments</h4>
            <div className="flex flex-wrap gap-1.5">
              {applicableSegments.map((seg) => (
                <Badge key={seg} variant="outline" size="sm">{seg}</Badge>
              ))}
            </div>
          </div>
        ) : null}

        {reportFilters.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Available Filters ({reportFilters.length})</h4>
            <div className="flex flex-col gap-2">
              {reportFilters.map((filter) => (
                <div key={filter.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-sm font-medium text-slate-900">{filter.label}</span>
                      <span className="text-2xs text-slate-500">Type: {filter.type}</span>
                    </div>
                    {filter.options && filter.options.length > 0 ? (
                      <Badge variant="outline" size="sm">{filter.options.length} options</Badge>
                    ) : null}
                  </div>
                  {filter.options && filter.options.length > 0 ? (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {filter.options.slice(0, 5).map((opt) => (
                        <Badge key={opt} variant="outline" size="sm">{opt}</Badge>
                      ))}
                      {filter.options.length > 5 ? (
                        <Badge variant="outline" size="sm">+{filter.options.length - 5}</Badge>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Report Preview</h4>
          <div className="rounded-lg border border-slate-200 p-3">
            <ReportPreviewChart report={report} />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <PermissionGate requiredAction={PERMISSIONS.EXPORT_REPORTS} behavior="hidden">
            <Button
              variant="outline"
              size="md"
              iconLeft={<Download className="h-3.5 w-3.5" />}
              onClick={() => onExportCSV(report)}
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="md"
              iconLeft={<Download className="h-3.5 w-3.5" />}
              onClick={() => onExportJSON(report)}
            >
              Export JSON
            </Button>
          </PermissionGate>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReportBuilderDialog({ open, onOpenChange, reports, onPreview }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedChartType, setSelectedChartType] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('');

  const categoryOptions = useMemo(() => {
    return getAllReportCategoryNames().map((c) => ({
      value: c,
      label: formatLabel(c),
    }));
  }, []);

  const chartTypeOptions = useMemo(() => {
    return getAllReportChartTypes().map((ct) => ({
      value: ct,
      label: formatLabel(ct),
    }));
  }, []);

  const frequencyOptions = useMemo(() => {
    return getAllReportFrequencies().map((f) => ({
      value: f,
      label: formatLabel(f),
    }));
  }, []);

  const filteredReports = useMemo(() => {
    let data = reports;
    if (selectedCategory) {
      data = data.filter((r) => r.category === selectedCategory);
    }
    if (selectedChartType) {
      data = data.filter((r) => r.chartType === selectedChartType);
    }
    if (selectedFrequency) {
      data = data.filter((r) => r.frequency === selectedFrequency);
    }
    return data;
  }, [reports, selectedCategory, selectedChartType, selectedFrequency]);

  const handleReset = useCallback(() => {
    setSelectedCategory('');
    setSelectedChartType('');
    setSelectedFrequency('');
  }, []);

  useEffect(() => {
    if (open) {
      setSelectedCategory('');
      setSelectedChartType('');
      setSelectedFrequency('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Sparkles className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle>Self-Service Report Builder</DialogTitle>
              <DialogDescription className="mt-1">
                Select criteria to find and preview reports. Choose a report to view its full details and export data.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select
            label="Category"
            placeholder="All Categories"
            options={[{ value: '', label: 'All Categories' }, ...categoryOptions]}
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          />
          <Select
            label="Chart Type"
            placeholder="All Chart Types"
            options={[{ value: '', label: 'All Chart Types' }, ...chartTypeOptions]}
            value={selectedChartType}
            onValueChange={setSelectedChartType}
          />
          <Select
            label="Frequency"
            placeholder="All Frequencies"
            options={[{ value: '', label: 'All Frequencies' }, ...frequencyOptions]}
            value={selectedFrequency}
            onValueChange={setSelectedFrequency}
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-slate-500">{filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found</span>
          {(selectedCategory || selectedChartType || selectedFrequency) ? (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset Filters
            </Button>
          ) : null}
        </div>

        <div className="mt-3 flex flex-col gap-2 max-h-[400px] overflow-y-auto">
          {filteredReports.length === 0 ? (
            <EmptyState
              type="no_results"
              title="No reports match"
              message="Try adjusting your filter criteria."
              size="sm"
            />
          ) : (
            filteredReports.map((report) => {
              const ChartIcon = getChartTypeIcon(report.chartType);
              return (
                <div
                  key={report.id}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border border-slate-200 p-3 transition-all duration-200 cursor-pointer',
                    'hover:shadow-card-hover hover:border-humana-green-200'
                  )}
                  role="button"
                  tabIndex={0}
                  onClick={() => onPreview(report)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onPreview(report);
                    }
                  }}
                >
                  <div className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center bg-slate-100">
                    <ChartIcon className="h-4.5 w-4.5 text-slate-500" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 line-clamp-1">{report.name}</p>
                    <p className="text-2xs text-slate-500 line-clamp-1 mt-0.5">{report.description}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <Badge variant={getCategoryBadgeVariant(report.category)} size="sm">
                        {formatLabel(report.category)}
                      </Badge>
                      <Badge variant={getChartTypeBadgeVariant(report.chartType)} size="sm">
                        {formatLabel(report.chartType)}
                      </Badge>
                      <Badge variant={getFrequencyBadgeVariant(report.frequency)} size="sm">
                        {formatLabel(report.frequency)}
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-2" aria-hidden="true" />
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CategoryCardsPanel({ categories, reports, onCategoryClick }) {
  if (categories.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No report categories"
        message="No report categories available."
        size="md"
        bordered
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat) => {
        const CategoryIcon = CATEGORY_ICONS[cat.name.toLowerCase()] || FileText;
        const catReports = reports.filter((r) => r.category === cat.name.toLowerCase());
        const color = CATEGORY_COLORS[cat.name.toLowerCase()] || '#64748b';

        return (
          <Card
            key={cat.id}
            className={cn(
              'p-5 cursor-pointer transition-all duration-200',
              'hover:shadow-card-hover hover:border-humana-green-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
              'active:scale-[0.99]'
            )}
            role="button"
            tabIndex={0}
            onClick={() => onCategoryClick(cat.name.toLowerCase())}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCategoryClick(cat.name.toLowerCase());
              }
            }}
            aria-label={`${cat.name} category. ${cat.reportCount} reports.`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <CategoryIcon
                    className="h-5 w-5"
                    style={{ color }}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900">{cat.name}</h3>
                  <span className="text-2xs text-slate-500">{cat.reportCount} reports</span>
                </div>
              </div>
              <Badge variant={getCategoryBadgeVariant(cat.name.toLowerCase())} size="sm">
                {catReports.length}
              </Badge>
            </div>

            <p className="mt-3 text-xs text-slate-500 line-clamp-2">{cat.description}</p>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {[...new Set(catReports.map((r) => r.chartType))].slice(0, 3).map((ct) => (
                  <Badge key={ct} variant="outline" size="sm">{formatLabel(ct)}</Badge>
                ))}
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function ReportListPanel({ reports, onReportClick }) {
  if (reports.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No reports found"
        message="No reports match the current filter criteria."
        size="md"
        bordered
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {reports.map((report) => {
        const ChartIcon = getChartTypeIcon(report.chartType);

        return (
          <div
            key={report.id}
            className={cn(
              'flex items-start gap-4 rounded-lg border border-slate-200 p-4 transition-all duration-200 cursor-pointer',
              'hover:shadow-card-hover hover:border-humana-green-200'
            )}
            role="button"
            tabIndex={0}
            onClick={() => onReportClick(report)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onReportClick(report);
              }
            }}
          >
            <div
              className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${CATEGORY_COLORS[report.category] || '#64748b'}15` }}
            >
              <ChartIcon
                className="h-5 w-5"
                style={{ color: CATEGORY_COLORS[report.category] || '#64748b' }}
                aria-hidden="true"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">{report.name}</h3>
                  <p className="text-2xs text-slate-500 line-clamp-1">{report.description}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge variant={getCategoryBadgeVariant(report.category)} size="sm">
                    {formatLabel(report.category)}
                  </Badge>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant={getChartTypeBadgeVariant(report.chartType)} size="sm">
                  {formatLabel(report.chartType)}
                </Badge>
                <Badge variant={getFrequencyBadgeVariant(report.frequency)} size="sm">
                  {formatLabel(report.frequency)}
                </Badge>
                <span className="text-2xs text-slate-400">
                  Owner: {report.owner}
                </span>
                <span className="text-2xs text-slate-400">
                  Generated: {formatDate(report.lastGenerated)}
                </span>
                {report.data ? (
                  <span className="text-2xs text-slate-400">
                    {report.data.length} data points
                  </span>
                ) : null}
              </div>
              {report.filters && report.filters.length > 0 ? (
                <div className="mt-1.5 flex items-center gap-1">
                  <Filter className="h-3 w-3 text-slate-400" aria-hidden="true" />
                  <span className="text-2xs text-slate-400">{report.filters.length} filter{report.filters.length !== 1 ? 's' : ''}</span>
                </div>
              ) : null}
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-3" aria-hidden="true" />
          </div>
        );
      })}
    </div>
  );
}

function AnalyticsPanel({ reports, categories }) {
  const categoryData = useMemo(() => {
    const counts = {};
    for (const r of reports) {
      counts[r.category] = (counts[r.category] || 0) + 1;
    }
    return Object.entries(counts).map(([category, count]) => ({
      category,
      count,
      label: formatLabel(category),
    }));
  }, [reports]);

  const chartTypeData = useMemo(() => {
    const counts = {};
    for (const r of reports) {
      counts[r.chartType] = (counts[r.chartType] || 0) + 1;
    }
    return Object.entries(counts).map(([chartType, count]) => ({
      chartType,
      count,
      label: formatLabel(chartType),
    }));
  }, [reports]);

  const frequencyData = useMemo(() => {
    const counts = {};
    for (const r of reports) {
      counts[r.frequency] = (counts[r.frequency] || 0) + 1;
    }
    return Object.entries(counts).map(([frequency, count]) => ({
      frequency,
      count,
      label: formatLabel(frequency),
    }));
  }, [reports]);

  const ownerData = useMemo(() => {
    const counts = {};
    for (const r of reports) {
      counts[r.owner] = (counts[r.owner] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([owner, count]) => ({
        owner,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [reports]);

  const segmentCoverage = useMemo(() => {
    const segments = {};
    for (const r of reports) {
      for (const seg of r.applicableSegments || []) {
        segments[seg] = (segments[seg] || 0) + 1;
      }
    }
    return Object.entries(segments).map(([segment, count]) => ({
      segment,
      count,
    }));
  }, [reports]);

  const dataPointsData = useMemo(() => {
    return reports
      .map((r) => ({
        name: r.name.length > 20 ? r.name.substring(0, 20) + '…' : r.name,
        dataPoints: r.data ? r.data.length : 0,
      }))
      .sort((a, b) => b.dataPoints - a.dataPoints)
      .slice(0, 10);
  }, [reports]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PanelCard
        title="Reports by Category"
        subtitle="Distribution across report categories"
        icon={<BarChart2 className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Reports" radius={[4, 4, 0, 0]} barSize={32}>
                {categoryData.map((entry) => (
                  <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Reports by Chart Type"
        subtitle="Distribution across visualization types"
        icon={<PieChartIcon className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {chartTypeData.map((entry) => (
                    <Cell key={entry.chartType} fill={CHART_TYPE_COLORS[entry.chartType] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} reports`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {chartTypeData.map((item) => (
              <div key={item.chartType} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: CHART_TYPE_COLORS[item.chartType] || '#a3a3a3' }}
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
        title="Reports by Frequency"
        subtitle="Generation frequency distribution"
        icon={<Clock className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={frequencyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {frequencyData.map((entry) => (
                    <Cell key={entry.frequency} fill={FREQUENCY_COLORS[entry.frequency] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} reports`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {frequencyData.map((item) => (
              <div key={item.frequency} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: FREQUENCY_COLORS[item.frequency] || '#a3a3a3' }}
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
        title="Reports by Owner"
        subtitle="Report ownership distribution"
        icon={<User className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {ownerData.map((item) => (
            <div key={item.owner} className="flex items-center gap-3">
              <div className="w-32 shrink-0 truncate">
                <span className="text-sm font-medium text-slate-700">{item.owner}</span>
              </div>
              <div className="flex-1">
                <Progress
                  value={item.count}
                  max={reports.length || 1}
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

      <PanelCard
        title="Segment Coverage"
        subtitle="Reports applicable to each segment"
        icon={<Layers className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={segmentCoverage} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="segment"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Reports" fill="#16b364" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Data Points per Report"
        subtitle="Top reports by data point count"
        icon={<Activity className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataPointsData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="dataPoints" name="Data Points" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>
    </div>
  );
}

function ReportingAnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading reporting analytics" aria-busy="true">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-36" />
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
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Reporting and Analytics page component.
 * Displays report categories (executive, segment, application, test, governance, compliance),
 * report list with filters, self-service report builder, and export actions
 * (simulated client-side CSV/JSON download). All data from mockService.
 *
 * @returns {React.ReactElement}
 */
function ReportingAnalyticsPage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [aggregates, setAggregates] = useState(null);
  const [activeTab, setActiveTab] = useState('categories');
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    chartType: '',
    frequency: '',
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Reports', path: ROUTES.REPORTS },
      { label: 'Reporting & Analytics' },
    ]);
  }, [setBreadcrumbs]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await getReports();
      setReports(getAllReports());
      setCategories(getAllReportCategories());
      setAggregates(getReportAggregates());
    } catch {
      setReports(getAllReports());
      setCategories(getAllReportCategories());
      setAggregates(getReportAggregates());
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

  const handleReportClick = useCallback((report) => {
    setSelectedReport(report);
    setDetailOpen(true);
  }, []);

  const handleDetailClose = useCallback((open) => {
    setDetailOpen(open);
    if (!open) setSelectedReport(null);
  }, []);

  const handleCategoryClick = useCallback((categoryName) => {
    setFilters((prev) => ({ ...prev, category: categoryName }));
    setActiveTab('reports');
  }, []);

  const handleBuilderPreview = useCallback((report) => {
    setBuilderOpen(false);
    setSelectedReport(report);
    setDetailOpen(true);
  }, []);

  const handleExportReportCSV = useCallback(
    (report) => {
      if (!report || !report.data) return;
      try {
        const data = report.data.map((d) => ({
          label: d.label,
          value: d.value,
          category: d.category || '',
          status: d.status || '',
        }));
        downloadCSV(data, `report-${report.id}.csv`);
        logEvent('data_export', {
          action: 'Exported Report Data',
          details: `Report "${report.name}" data exported as CSV by ${currentPersona.name}. ${data.length} records.`,
          resource: report.id,
          outcome: 'success',
        });
        toast({
          variant: 'success',
          title: 'Export Complete',
          description: `"${report.name}" data exported as CSV.`,
        });
      } catch {
        toast({
          variant: 'error',
          title: 'Export Failed',
          description: 'Failed to export report data.',
        });
      }
    },
    [currentPersona, logEvent, toast]
  );

  const handleExportReportJSON = useCallback(
    (report) => {
      if (!report || !report.data) return;
      try {
        const data = {
          id: report.id,
          name: report.name,
          category: report.category,
          chartType: report.chartType,
          frequency: report.frequency,
          owner: report.owner,
          lastGenerated: report.lastGenerated,
          data: report.data,
        };
        downloadJSON(data, `report-${report.id}.json`);
        logEvent('data_export', {
          action: 'Exported Report Data',
          details: `Report "${report.name}" data exported as JSON by ${currentPersona.name}.`,
          resource: report.id,
          outcome: 'success',
        });
        toast({
          variant: 'success',
          title: 'Export Complete',
          description: `"${report.name}" data exported as JSON.`,
        });
      } catch {
        toast({
          variant: 'error',
          title: 'Export Failed',
          description: 'Failed to export report data.',
        });
      }
    },
    [currentPersona, logEvent, toast]
  );

  const handleExportAllCSV = useCallback(() => {
    try {
      const data = filteredReports.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        chartType: r.chartType,
        frequency: r.frequency,
        owner: r.owner,
        lastGenerated: r.lastGenerated,
        dataPoints: r.data ? r.data.length : 0,
        filters: r.filters ? r.filters.length : 0,
        applicableSegments: (r.applicableSegments || []).join('; '),
      }));
      downloadCSV(data, 'reports-catalog.csv');
      logEvent('data_export', {
        action: 'Exported Reports Catalog',
        details: `Reports catalog exported as CSV by ${currentPersona.name}. ${data.length} records.`,
        resource: '/reports',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} reports exported as CSV.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export reports catalog.',
      });
    }
  }, [filteredReports, currentPersona, logEvent, toast]);

  const handleExportAllJSON = useCallback(() => {
    try {
      const data = filteredReports.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        chartType: r.chartType,
        frequency: r.frequency,
        owner: r.owner,
        lastGenerated: r.lastGenerated,
        dataPoints: r.data ? r.data.length : 0,
        filters: r.filters ? r.filters.length : 0,
        applicableSegments: r.applicableSegments || [],
      }));
      downloadJSON(data, 'reports-catalog.json');
      logEvent('data_export', {
        action: 'Exported Reports Catalog',
        details: `Reports catalog exported as JSON by ${currentPersona.name}. ${data.length} records.`,
        resource: '/reports',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} reports exported as JSON.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export reports catalog.',
      });
    }
  }, [filteredReports, currentPersona, logEvent, toast]);

  const filteredReports = useMemo(() => {
    let data = reports;
    if (filters.category) {
      data = data.filter((r) => r.category === filters.category);
    }
    if (filters.chartType) {
      data = data.filter((r) => r.chartType === filters.chartType);
    }
    if (filters.frequency) {
      data = data.filter((r) => r.frequency === filters.frequency);
    }
    return data;
  }, [reports, filters]);

  const kpiData = useMemo(() => {
    if (!aggregates) return [];

    return [
      {
        id: 'kpi_total_reports',
        label: 'Total Reports',
        value: aggregates.totalReports,
        unit: 'count',
        trend: 'stable',
        status: 'on_track',
        description: 'Total reports available in the catalog.',
      },
      {
        id: 'kpi_categories',
        label: 'Categories',
        value: aggregates.totalCategories,
        unit: 'count',
        trend: 'stable',
        status: 'on_track',
        description: 'Number of report categories.',
      },
      {
        id: 'kpi_chart_types',
        label: 'Chart Types',
        value: Object.keys(aggregates.chartTypeBreakdown || {}).length,
        unit: 'count',
        trend: 'stable',
        status: 'on_track',
        description: 'Number of unique visualization types.',
      },
      {
        id: 'kpi_owners',
        label: 'Report Owners',
        value: Object.keys(aggregates.ownerBreakdown || {}).length,
        unit: 'count',
        trend: 'stable',
        status: 'on_track',
        description: 'Number of unique report owners.',
      },
    ];
  }, [aggregates]);

  const filterFields = useMemo(() => {
    const categoryOptions = getAllReportCategoryNames().map((c) => ({
      value: c,
      label: formatLabel(c),
    }));
    const chartTypeOptions = getAllReportChartTypes().map((ct) => ({
      value: ct,
      label: formatLabel(ct),
    }));
    const frequencyOptions = getAllReportFrequencies().map((f) => ({
      value: f,
      label: formatLabel(f),
    }));

    return [
      {
        id: 'category',
        label: 'Category',
        type: 'select',
        options: [{ value: '', label: 'All Categories' }, ...categoryOptions],
        defaultValue: '',
      },
      {
        id: 'chartType',
        label: 'Chart Type',
        type: 'select',
        options: [{ value: '', label: 'All Chart Types' }, ...chartTypeOptions],
        defaultValue: '',
      },
      {
        id: 'frequency',
        label: 'Frequency',
        type: 'select',
        options: [{ value: '', label: 'All Frequencies' }, ...frequencyOptions],
        defaultValue: '',
      },
    ];
  }, []);

  const tableColumns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Report Name',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleReportClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors line-clamp-2"
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        size: 110,
        cell: ({ row }) => (
          <Badge variant={getCategoryBadgeVariant(row.original.category)} size="sm">
            {formatLabel(row.original.category)}
          </Badge>
        ),
      },
      {
        accessorKey: 'chartType',
        header: 'Chart Type',
        size: 120,
        cell: ({ row }) => (
          <Badge variant={getChartTypeBadgeVariant(row.original.chartType)} size="sm">
            {formatLabel(row.original.chartType)}
          </Badge>
        ),
      },
      {
        accessorKey: 'frequency',
        header: 'Frequency',
        size: 100,
        cell: ({ row }) => (
          <Badge variant={getFrequencyBadgeVariant(row.original.frequency)} size="sm">
            {formatLabel(row.original.frequency)}
          </Badge>
        ),
      },
      {
        accessorKey: 'owner',
        header: 'Owner',
        size: 140,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.owner}</span>
        ),
      },
      {
        accessorKey: 'lastGenerated',
        header: 'Last Generated',
        size: 120,
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">{formatDate(row.original.lastGenerated)}</span>
        ),
      },
      {
        id: 'dataPoints',
        header: 'Data',
        size: 70,
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.data ? row.original.data.length : 0}</span>
        ),
      },
      {
        id: 'filterCount',
        header: 'Filters',
        size: 70,
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.filters ? row.original.filters.length : 0}</span>
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
                onClick={() => handleReportClick(row.original)}
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
    [handleReportClick]
  );

  const insightData = useMemo(() => {
    if (!aggregates || reports.length === 0) return null;

    const dailyReports = (aggregates.frequencyBreakdown && aggregates.frequencyBreakdown.daily) || 0;
    const weeklyReports = (aggregates.frequencyBreakdown && aggregates.frequencyBreakdown.weekly) || 0;
    const totalCategories = aggregates.totalCategories || 0;

    return {
      variant: 'insight',
      title: `${reports.length} reports across ${totalCategories} categories`,
      message: `${dailyReports} reports refresh daily, ${weeklyReports} weekly. Use the self-service report builder to find and preview reports matching your criteria. All reports support CSV and JSON export.`,
      source: 'Report Generation Agent',
      confidence: 96,
    };
  }, [aggregates, reports]);

  if (loading) {
    return <ReportingAnalyticsSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">Reporting & Analytics</h1>
          <p className="text-sm text-slate-500">
            Report catalog, self-service builder, and data export for {currentPersona.name}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
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
                <DropdownMenuLabel>Export Catalog</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportAllCSV}>
                  <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                  CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportAllJSON}>
                  <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                  JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </PermissionGate>

          <Button
            variant="primary"
            size="sm"
            iconLeft={<Sparkles className="h-3.5 w-3.5" />}
            onClick={() => setBuilderOpen(true)}
          >
            Report Builder
          </Button>
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
          <TabsTrigger value="categories">Categories ({categories.length})</TabsTrigger>
          <TabsTrigger value="reports">Reports ({filteredReports.length})</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoryCardsPanel
            categories={categories}
            reports={reports}
            onCategoryClick={handleCategoryClick}
          />
        </TabsContent>

        <TabsContent value="reports">
          {filteredReports.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No reports found"
              message="No reports match the current filter criteria. Try adjusting your filters or use the Report Builder."
              size="lg"
              bordered
              actionLabel="Open Report Builder"
              onAction={() => setBuilderOpen(true)}
              actionIcon={<Sparkles className="h-3.5 w-3.5" />}
            />
          ) : (
            <ReportListPanel
              reports={filteredReports}
              onReportClick={handleReportClick}
            />
          )}
        </TabsContent>

        <TabsContent value="table">
          {filteredReports.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No reports found"
              message="No reports match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={tableColumns}
              data={filteredReports}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search reports..."
              emptyMessage="No reports match the search criteria."
              onRowClick={handleReportClick}
            />
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {reports.length === 0 ? (
            <EmptyState
              type="no_chart"
              title="No data for analytics"
              message="No reports available to generate analytics."
              size="lg"
              bordered
            />
          ) : (
            <AnalyticsPanel reports={reports} categories={categories} />
          )}
        </TabsContent>
      </Tabs>

      {/* Report Preview Cards (when on categories tab and no filter) */}
      {activeTab === 'categories' && !filters.category ? (
        <PanelCard
          title="Featured Reports"
          subtitle="Recently generated reports across all categories"
          icon={<Star className="h-5 w-5" />}
          collapsible
          defaultCollapsed={false}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.slice(0, 6).map((report) => {
              const ChartIcon = getChartTypeIcon(report.chartType);
              return (
                <Card
                  key={report.id}
                  className={cn(
                    'p-4 cursor-pointer transition-all duration-200',
                    'hover:shadow-card-hover hover:border-humana-green-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                    'active:scale-[0.99]'
                  )}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleReportClick(report)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleReportClick(report);
                    }
                  }}
                  aria-label={`${report.name}. Category: ${report.category}. Chart: ${report.chartType}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${CATEGORY_COLORS[report.category] || '#64748b'}15` }}
                      >
                        <ChartIcon
                          className="h-4 w-4"
                          style={{ color: CATEGORY_COLORS[report.category] || '#64748b' }}
                          aria-hidden="true"
                        />
                      </div>
                      <Badge variant={getCategoryBadgeVariant(report.category)} size="sm">
                        {formatLabel(report.category)}
                      </Badge>
                    </div>
                    <Badge variant={getChartTypeBadgeVariant(report.chartType)} size="sm">
                      {formatLabel(report.chartType)}
                    </Badge>
                  </div>

                  <p className="mt-2 text-sm font-medium text-slate-900 line-clamp-2">{report.name}</p>
                  <p className="mt-1 text-2xs text-slate-500 line-clamp-1">{report.description}</p>

                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={getFrequencyBadgeVariant(report.frequency)} size="sm">
                        {formatLabel(report.frequency)}
                      </Badge>
                      <span className="text-2xs text-slate-400">{report.owner}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  </div>
                </Card>
              );
            })}
          </div>
          {reports.length > 6 ? (
            <p className="mt-3 text-xs text-slate-400 text-center">
              +{reports.length - 6} more reports. Switch to Reports tab to see all.
            </p>
          ) : null}
        </PanelCard>
      ) : null}

      {/* Summary Panel */}
      {aggregates ? (
        <PanelCard
          title="Report Catalog Summary"
          subtitle="Aggregate metrics across all reports"
          icon={<Activity className="h-5 w-5" />}
          collapsible
          defaultCollapsed
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Total Reports</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.totalReports}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Categories</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.totalCategories}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Chart Types</span>
              <span className="text-2xl font-semibold text-slate-900">{Object.keys(aggregates.chartTypeBreakdown || {}).length}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Frequencies</span>
              <span className="text-2xl font-semibold text-slate-900">{Object.keys(aggregates.frequencyBreakdown || {}).length}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Owners</span>
              <span className="text-2xl font-semibold text-slate-900">{Object.keys(aggregates.ownerBreakdown || {}).length}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Filtered</span>
              <span className="text-2xl font-semibold text-slate-900">{filteredReports.length}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">By Category</h4>
            <div className="flex flex-col gap-2">
              {Object.entries(aggregates.categoryBreakdown || {}).map(([category, count]) => (
                <div key={category} className="flex items-center gap-3">
                  <div className="w-24 shrink-0">
                    <Badge variant={getCategoryBadgeVariant(category)} size="sm">
                      {formatLabel(category)}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={count}
                      max={aggregates.totalReports || 1}
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
            <h4 className="text-sm font-semibold text-slate-900 mb-2">By Frequency</h4>
            <div className="flex flex-col gap-2">
              {Object.entries(aggregates.frequencyBreakdown || {}).map(([frequency, count]) => (
                <div key={frequency} className="flex items-center gap-3">
                  <div className="w-24 shrink-0">
                    <Badge variant={getFrequencyBadgeVariant(frequency)} size="sm">
                      {formatLabel(frequency)}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={count}
                      max={aggregates.totalReports || 1}
                      variant="info"
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
            <h4 className="text-sm font-semibold text-slate-900 mb-2">By Chart Type</h4>
            <div className="flex flex-col gap-2">
              {Object.entries(aggregates.chartTypeBreakdown || {}).map(([chartType, count]) => (
                <div key={chartType} className="flex items-center gap-3">
                  <div className="w-24 shrink-0">
                    <Badge variant={getChartTypeBadgeVariant(chartType)} size="sm">
                      {formatLabel(chartType)}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={count}
                      max={aggregates.totalReports || 1}
                      variant="warning"
                      size="xs"
                      animate
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </PanelCard>
      ) : null}

      {/* Report Detail Dialog */}
      <ReportDetailDialog
        report={selectedReport}
        open={detailOpen}
        onOpenChange={handleDetailClose}
        onExportCSV={handleExportReportCSV}
        onExportJSON={handleExportReportJSON}
      />

      {/* Report Builder Dialog */}
      <ReportBuilderDialog
        open={builderOpen}
        onOpenChange={setBuilderOpen}
        reports={reports}
        onPreview={handleBuilderPreview}
      />
    </div>
  );
}

ReportingAnalyticsPage.displayName = 'ReportingAnalyticsPage';

export { ReportingAnalyticsPage };
export default ReportingAnalyticsPage;