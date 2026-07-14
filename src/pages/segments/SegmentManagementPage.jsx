import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Layers,
  Activity,
  Shield,
  CheckCircle,
  RefreshCw,
  ChevronRight,
  BarChart2,
  FileText,
  Database,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Eye,
  X,
} from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { getSegments } from '@/lib/mock-api/mockService';
import { getApplicationsBySegment } from '@/data/applications';
import { getQualityGatesBySegment } from '@/data/qualityGates';
import { getComplianceScoresByStatus, getAllComplianceScores } from '@/data/governance';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { ChartWrapper } from '@/components/shared/ChartWrapper';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusPill } from '@/components/shared/StatusPill';
import { EmptyState } from '@/components/shared/EmptyState';
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
import { MEASURE_STATUS, ROUTES } from '@/lib/constants';

const SEGMENT_COLORS = {
  Enterprise: '#16b364',
  Medicare: '#3b82f6',
  Medicaid: '#f59e0b',
  Commercial: '#8b5cf6',
  External: '#ef4444',
  Compliance: '#06b6d4',
};

const STATUS_CHART_COLORS = {
  [MEASURE_STATUS.ON_TRACK]: '#10b981',
  [MEASURE_STATUS.AT_RISK]: '#f59e0b',
  [MEASURE_STATUS.CRITICAL]: '#ef4444',
  [MEASURE_STATUS.COMPLETED]: '#3b82f6',
  [MEASURE_STATUS.NOT_STARTED]: '#a3a3a3',
};

const FILTER_FIELDS = [
  {
    id: 'status',
    label: 'Status',
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

function getTrendIcon(current, previous) {
  if (current > previous) return 'improving';
  if (current < previous) return 'declining';
  return 'stable';
}

function SegmentCard({ segment, onDrillDown }) {
  const trendData = segment.trendData || [];
  const previousScore = trendData.length >= 2 ? trendData[trendData.length - 2].qualityScore : segment.qualityScore;
  const trend = getTrendIcon(segment.qualityScore, previousScore);
  const changePercent = previousScore > 0
    ? ((segment.qualityScore - previousScore) / previousScore) * 100
    : 0;

  const TrendIcon = trend === 'improving' ? ArrowUpRight : trend === 'declining' ? ArrowDownRight : Minus;
  const trendColor = trend === 'improving' ? 'text-success-600' : trend === 'declining' ? 'text-danger-600' : 'text-slate-500';

  return (
    <Card
      className={cn(
        'p-5 cursor-pointer transition-all duration-200',
        'hover:shadow-card-hover hover:border-humana-green-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
        'active:scale-[0.99]'
      )}
      role="button"
      tabIndex={0}
      onClick={() => onDrillDown(segment)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onDrillDown(segment);
        }
      }}
      aria-label={`${segment.name} segment. Quality score: ${segment.qualityScore}. Status: ${segment.status}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${SEGMENT_COLORS[segment.name] || '#64748b'}15` }}
          >
            <Layers
              className="h-5 w-5"
              style={{ color: SEGMENT_COLORS[segment.name] || '#64748b' }}
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 truncate">{segment.name}</h3>
            <p className="text-2xs text-slate-500 truncate">{segment.description}</p>
          </div>
        </div>
        <StatusPill status={segment.status} size="sm" dot />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Quality Score</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-semibold text-slate-900">{segment.qualityScore.toFixed(1)}</span>
            <div className={cn('flex items-center gap-0.5', trendColor)}>
              <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="text-2xs font-medium">
                {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Compliance</span>
          <span className="text-xl font-semibold text-slate-900">{segment.complianceRate.toFixed(1)}%</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Database className="h-3 w-3 text-slate-400" aria-hidden="true" />
            <span className="text-2xs text-slate-500">{segment.applicationCount} apps</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3 text-slate-400" aria-hidden="true" />
            <span className="text-2xs text-slate-500">{segment.releaseCount} releases</span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
      </div>

      <div className="mt-3">
        <Progress
          value={segment.qualityScore}
          max={100}
          variant="auto"
          size="xs"
          animate
        />
      </div>
    </Card>
  );
}

function SegmentDetailDialog({ segment, open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState('overview');

  const applications = useMemo(() => {
    if (!segment) return [];
    return getApplicationsBySegment(segment.name);
  }, [segment]);

  const qualityGates = useMemo(() => {
    if (!segment) return [];
    return getQualityGatesBySegment(segment.name);
  }, [segment]);

  const passedGates = useMemo(() => {
    return qualityGates.filter((qg) => qg.overallStatus === 'passed').length;
  }, [qualityGates]);

  const failedGates = useMemo(() => {
    return qualityGates.filter((qg) => qg.overallStatus === 'failed').length;
  }, [qualityGates]);

  if (!segment) return null;

  const trendData = segment.trendData || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${SEGMENT_COLORS[segment.name] || '#64748b'}15` }}
            >
              <Layers
                className="h-5 w-5"
                style={{ color: SEGMENT_COLORS[segment.name] || '#64748b' }}
                aria-hidden="true"
              />
            </div>
            <div>
              <DialogTitle>{segment.name} Segment</DialogTitle>
              <DialogDescription>{segment.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Quality Score</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{segment.qualityScore.toFixed(1)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Compliance</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{segment.complianceRate.toFixed(1)}%</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Applications</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{segment.applicationCount}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Releases</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{segment.releaseCount}</p>
          </div>
        </div>

        <div className="mt-4">
          <StatusPill status={segment.status} size="md" dot />
          <span className="ml-2 text-sm text-slate-500">Owner: {segment.owner}</span>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="quality_gates">Quality Gates</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="flex flex-col gap-4 pt-2">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Quality Score Trend</h4>
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
                        domain={['auto', 'auto']}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" iconSize={8} />
                      <Line
                        type="monotone"
                        dataKey="qualityScore"
                        name="Quality Score"
                        stroke={SEGMENT_COLORS[segment.name] || '#16b364'}
                        strokeWidth={2}
                        dot={{ r: 2.5, fill: SEGMENT_COLORS[segment.name] || '#16b364', strokeWidth: 0 }}
                        activeDot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="complianceRate"
                        name="Compliance Rate"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 2.5, fill: '#8b5cf6', strokeWidth: 0 }}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Quality Gate Summary</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-success-500" aria-hidden="true" />
                    <span className="text-sm text-slate-700">{passedGates} Passed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <X className="h-4 w-4 text-danger-500" aria-hidden="true" />
                    <span className="text-sm text-slate-700">{failedGates} Failed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-slate-500">{qualityGates.length} Total</span>
                  </div>
                </div>
                <div className="mt-2">
                  <Progress
                    value={passedGates}
                    max={qualityGates.length || 1}
                    variant="auto"
                    size="sm"
                    showValue
                    valueFormat="fraction"
                    label="Gate Pass Rate"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <div className="flex flex-col gap-2 pt-2">
              {applications.length === 0 ? (
                <EmptyState
                  type="no_data"
                  title="No applications"
                  message="No applications found for this segment."
                  size="sm"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Application</th>
                        <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Automation</th>
                        <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Tests</th>
                        <th className="pb-2 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Risk</th>
                        <th className="pb-2 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app.id} className="border-b border-slate-100 last:border-b-0">
                          <td className="py-2.5">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">{app.name}</span>
                              <span className="text-2xs text-slate-500">{app.owner}</span>
                            </div>
                          </td>
                          <td className="py-2.5 text-right text-slate-700">{app.automationCoverage.toFixed(1)}%</td>
                          <td className="py-2.5 text-right text-slate-700">{formatNumber(app.testCaseCount)}</td>
                          <td className="py-2.5 text-center">
                            <StatusPill status={app.riskLevel} size="sm" />
                          </td>
                          <td className="py-2.5 text-center">
                            <StatusPill status={app.qualityStatus} size="sm" dot />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="quality_gates">
            <div className="flex flex-col gap-2 pt-2">
              {qualityGates.length === 0 ? (
                <EmptyState
                  type="no_data"
                  title="No quality gates"
                  message="No quality gates found for this segment."
                  size="sm"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Gate</th>
                        <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Release</th>
                        <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Criteria</th>
                        <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Waivers</th>
                        <th className="pb-2 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qualityGates.map((qg) => (
                        <tr key={qg.id} className="border-b border-slate-100 last:border-b-0">
                          <td className="py-2.5">
                            <span className="font-medium text-slate-900 text-xs">{qg.name}</span>
                          </td>
                          <td className="py-2.5 text-slate-700 text-xs">{qg.release}</td>
                          <td className="py-2.5 text-right text-slate-700">{qg.gates.length}</td>
                          <td className="py-2.5 text-right text-slate-700">{qg.waivers.length}</td>
                          <td className="py-2.5 text-center">
                            <StatusPill status={qg.overallStatus} size="sm" dot />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <div className="flex flex-col gap-4 pt-2">
              <h4 className="text-sm font-semibold text-slate-900">12-Month Quality & Compliance Trends</h4>
              <ChartWrapper height={280} noCard noPadding>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                    <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" iconSize={8} />
                    <Bar
                      dataKey="qualityScore"
                      name="Quality Score"
                      fill={SEGMENT_COLORS[segment.name] || '#16b364'}
                      radius={[3, 3, 0, 0]}
                      barSize={16}
                    />
                    <Bar
                      dataKey="complianceRate"
                      name="Compliance Rate"
                      fill="#8b5cf6"
                      radius={[3, 3, 0, 0]}
                      barSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function SegmentComparisonChart({ segments }) {
  if (!segments || segments.length === 0) return null;

  return (
    <PanelCard
      title="Segment Quality Comparison"
      subtitle="Quality scores and compliance rates across all segments"
      icon={<BarChart2 className="h-5 w-5" />}
    >
      <ChartWrapper height={300} noCard noPadding>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={segments} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
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
            <Legend wrapperStyle={{ fontSize: '12px' }} iconType="circle" iconSize={8} />
            <Bar dataKey="qualityScore" name="Quality Score" fill="#16b364" radius={[4, 4, 0, 0]} barSize={28} />
            <Bar dataKey="complianceRate" name="Compliance Rate" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </PanelCard>
  );
}

function SegmentStatusDistribution({ segments }) {
  const statusData = useMemo(() => {
    const counts = {};
    for (const seg of segments) {
      counts[seg.status] = (counts[seg.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      percentage: segments.length > 0 ? (count / segments.length) * 100 : 0,
    }));
  }, [segments]);

  const pieColors = statusData.map((d) => STATUS_CHART_COLORS[d.status] || '#a3a3a3');

  return (
    <PanelCard
      title="Segment Status Distribution"
      subtitle={`${segments.length} segments across quality statuses`}
      icon={<Shield className="h-5 w-5" />}
    >
      <div className="flex flex-col items-center gap-4 lg:flex-row">
        <ChartWrapper height={200} noCard noPadding className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="count"
                nameKey="status"
                stroke="none"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => {
                  const label = name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                  return [`${value} segment${value !== 1 ? 's' : ''}`, label];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <div className="flex flex-col gap-2.5 flex-1">
          {statusData.map((item) => (
            <div key={item.status} className="flex items-center justify-between gap-3">
              <StatusPill status={item.status} size="sm" dot />
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">{item.count}</span>
                <span className="text-xs text-slate-400">({item.percentage.toFixed(0)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PanelCard>
  );
}

function SegmentTrendOverlay({ segments }) {
  const chartData = useMemo(() => {
    if (!segments || segments.length === 0) return [];
    const months = segments[0].trendData ? segments[0].trendData.map((d) => d.month) : [];
    return months.map((month) => {
      const point = { month };
      for (const seg of segments) {
        const td = (seg.trendData || []).find((d) => d.month === month);
        if (td) {
          point[seg.name] = td.qualityScore;
        }
      }
      return point;
    });
  }, [segments]);

  if (chartData.length === 0) return null;

  return (
    <PanelCard
      title="Quality Score Trends by Segment"
      subtitle="12-month quality score trends across all segments"
      icon={<TrendingUp className="h-5 w-5" />}
    >
      <ChartWrapper height={320} noCard noPadding>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" iconSize={8} />
            {segments.map((seg) => (
              <Line
                key={seg.name}
                type="monotone"
                dataKey={seg.name}
                name={seg.name}
                stroke={SEGMENT_COLORS[seg.name] || '#64748b'}
                strokeWidth={2}
                dot={{ r: 2.5, fill: SEGMENT_COLORS[seg.name] || '#64748b', strokeWidth: 0 }}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </PanelCard>
  );
}

function SegmentManagementSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading segments" aria-busy="true">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-80 rounded-xl" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function SegmentManagementPage() {
  const { currentPersona } = usePersona();
  const { setBreadcrumbs } = useNavigation();

  const [loading, setLoading] = useState(true);
  const [segments, setSegments] = useState([]);
  const [filters, setFilters] = useState({ status: '' });
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Segments' },
    ]);
  }, [setBreadcrumbs]);

  const loadSegments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSegments(filters.status ? { status: filters.status } : {});
      setSegments(data);
    } catch {
      setSegments([]);
    } finally {
      setLoading(false);
    }
  }, [filters.status]);

  useEffect(() => {
    loadSegments();
  }, [loadSegments]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    loadSegments();
  }, [loadSegments]);

  const handleDrillDown = useCallback((segment) => {
    setSelectedSegment(segment);
    setDetailOpen(true);
  }, []);

  const handleDetailClose = useCallback((open) => {
    setDetailOpen(open);
    if (!open) {
      setSelectedSegment(null);
    }
  }, []);

  const kpiData = useMemo(() => {
    if (segments.length === 0) return [];

    const totalApps = segments.reduce((sum, s) => sum + s.applicationCount, 0);
    const totalReleases = segments.reduce((sum, s) => sum + s.releaseCount, 0);
    const avgQuality = segments.reduce((sum, s) => sum + s.qualityScore, 0) / segments.length;
    const avgCompliance = segments.reduce((sum, s) => sum + s.complianceRate, 0) / segments.length;

    return [
      {
        id: 'kpi_segments',
        label: 'Total Segments',
        value: segments.length,
        unit: 'count',
        trend: 'stable',
        status: 'on_track',
      },
      {
        id: 'kpi_apps',
        label: 'Total Applications',
        value: totalApps,
        unit: 'count',
        trend: 'improving',
        status: 'on_track',
      },
      {
        id: 'kpi_avg_quality',
        label: 'Avg Quality Score',
        value: avgQuality,
        unit: 'score',
        trend: 'improving',
        status: avgQuality >= 85 ? 'on_track' : avgQuality >= 75 ? 'at_risk' : 'critical',
      },
      {
        id: 'kpi_avg_compliance',
        label: 'Avg Compliance Rate',
        value: avgCompliance,
        unit: 'percent',
        trend: 'improving',
        status: avgCompliance >= 90 ? 'on_track' : avgCompliance >= 80 ? 'at_risk' : 'critical',
      },
    ];
  }, [segments]);

  if (loading) {
    return <SegmentManagementSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">Segment Management</h1>
          <p className="text-sm text-slate-500">
            Segment-level quality visibility and drill-down for {currentPersona.name}
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
        </div>
      </div>

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

      {/* KPI Summary */}
      {kpiData.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => (
            <KpiCard
              key={kpi.id}
              label={kpi.label}
              value={kpi.value}
              unit={kpi.unit}
              trend={kpi.trend}
              status={kpi.status}
            />
          ))}
        </div>
      ) : null}

      {/* Segment Cards */}
      {segments.length === 0 ? (
        <EmptyState
          type="no_data"
          title="No segments found"
          message="No segments match the current filter criteria."
          size="lg"
          bordered
          actionLabel="Reset Filters"
          onAction={() => setFilters({ status: '' })}
        />
      ) : (
        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-3">
            Segments ({segments.length})
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {segments.map((segment) => (
              <SegmentCard
                key={segment.id}
                segment={segment}
                onDrillDown={handleDrillDown}
              />
            ))}
          </div>
        </div>
      )}

      {/* Comparison Chart */}
      {segments.length > 1 ? (
        <SegmentComparisonChart segments={segments} />
      ) : null}

      {/* Status Distribution + Trend Overlay */}
      {segments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <SegmentStatusDistribution segments={segments} />
          <SegmentTrendOverlay segments={segments} />
        </div>
      ) : null}

      {/* Segment Summary Table */}
      {segments.length > 0 ? (
        <PanelCard
          title="Segment Summary"
          subtitle="Detailed metrics for all segments"
          icon={<Activity className="h-5 w-5" />}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Segment</th>
                  <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Quality</th>
                  <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Compliance</th>
                  <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Apps</th>
                  <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Releases</th>
                  <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Owner</th>
                  <th className="pb-2 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                  <th className="pb-2 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {segments.map((seg) => (
                  <tr key={seg.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: SEGMENT_COLORS[seg.name] || '#64748b' }}
                          aria-hidden="true"
                        />
                        <span className="font-medium text-slate-900">{seg.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right text-slate-700">{seg.qualityScore.toFixed(1)}</td>
                    <td className="py-2.5 text-right text-slate-700">{seg.complianceRate.toFixed(1)}%</td>
                    <td className="py-2.5 text-right text-slate-700">{seg.applicationCount}</td>
                    <td className="py-2.5 text-right text-slate-700">{seg.releaseCount}</td>
                    <td className="py-2.5 text-slate-700 text-xs">{seg.owner}</td>
                    <td className="py-2.5 text-center">
                      <StatusPill status={seg.status} size="sm" dot />
                    </td>
                    <td className="py-2.5 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconLeft={<Eye className="h-3.5 w-3.5" />}
                        onClick={() => handleDrillDown(seg)}
                        aria-label={`View ${seg.name} segment details`}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelCard>
      ) : null}

      {/* Drill-down Dialog */}
      <SegmentDetailDialog
        segment={selectedSegment}
        open={detailOpen}
        onOpenChange={handleDetailClose}
      />
    </div>
  );
}

SegmentManagementPage.displayName = 'SegmentManagementPage';

export { SegmentManagementPage };
export default SegmentManagementPage;