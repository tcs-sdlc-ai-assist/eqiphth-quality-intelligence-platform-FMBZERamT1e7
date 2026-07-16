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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  TrendingUp,
  Activity,
  Zap,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  BarChart2,
  Layers,
  FileText,
  ChevronRight,
  Target,
  Shield,
  Bug,
  Clock,
  DollarSign,
  Cpu,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  User,
  Calendar,
  Lightbulb,
  Star,
  TrendingDown,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation, usePageHeader } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import {
  getAllAutomationIntelligence,
  getAutomationIntelligenceAggregates,
  getAllHealthScores,
  getAllCoverageMetrics,
  getAllFlakyTests,
  getAllAutomationCandidates,
  getAllROIProjections,
  getPlatformROIProjection,
} from '@/data/automationIntelligence';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { ChartWrapper } from '@/components/shared/ChartWrapper';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusPill } from '@/components/shared/StatusPill';
import { EmptyState } from '@/components/shared/EmptyState';
import { DataTable } from '@/components/shared/DataTable';
import { PermissionGate } from '@/components/shared/PermissionGate';
import { InsightBanner } from '@/components/shared/InsightBanner';
import { PageActions } from '@/components/layout/PageActions';
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

const HEALTH_COLORS = {
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

const SEVERITY_COLORS = {
  critical: '#dc2626',
  high: '#f59e0b',
  medium: '#3b82f6',
  low: '#a3a3a3',
};

const FLAKY_STATUS_COLORS = {
  open: '#ef4444',
  investigating: '#f59e0b',
  fixed: '#10b981',
  accepted: '#3b82f6',
  muted: '#a3a3a3',
};

const CANDIDATE_STATUS_COLORS = {
  recommended: '#3b82f6',
  approved: '#06b6d4',
  in_progress: '#f59e0b',
  completed: '#10b981',
  deferred: '#a3a3a3',
};

const AUTOMATION_STATUS_COLORS = {
  automated: '#10b981',
  manual: '#ef4444',
  hybrid: '#f59e0b',
  planned: '#3b82f6',
};

const SEGMENT_OPTIONS = [
  { value: '', label: 'All Segments' },
  { value: 'Enterprise', label: 'Enterprise' },
  { value: 'Medicare', label: 'Medicare' },
  { value: 'Medicaid', label: 'Medicaid' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'External', label: 'External' },
  { value: 'Compliance', label: 'Compliance' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: MEASURE_STATUS.ON_TRACK, label: 'On Track' },
  { value: MEASURE_STATUS.AT_RISK, label: 'At Risk' },
  { value: MEASURE_STATUS.CRITICAL, label: 'Critical' },
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

function getHealthScoreColor(score) {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}

function getHealthScoreVariant(score) {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
}

function getSeverityBadgeVariant(severity) {
  switch (severity) {
    case 'critical':
      return 'error';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
    default:
      return 'neutral';
  }
}

function getCandidateStatusBadgeVariant(status) {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'warning';
    case 'approved':
      return 'info';
    case 'recommended':
      return 'primary';
    case 'deferred':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function HealthScoreGauge({ score, label, size = 'md' }) {
  const color = getHealthScoreColor(score);
  const radius = size === 'lg' ? 60 : size === 'md' ? 45 : 35;
  const strokeWidth = size === 'lg' ? 10 : size === 'md' ? 8 : 6;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;
  const center = radius + strokeWidth;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={svgSize} height={svgSize} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="central"
          className="transform rotate-90"
          style={{ transformOrigin: `${center}px ${center}px` }}
          fill={color}
          fontSize={size === 'lg' ? 20 : size === 'md' ? 16 : 13}
          fontWeight="700"
        >
          {score.toFixed(0)}
        </text>
      </svg>
      {label ? (
        <span className="text-2xs font-medium text-slate-500 text-center truncate max-w-[100px]">
          {label}
        </span>
      ) : null}
    </div>
  );
}

function HealthScoreDetailDialog({ healthScore, open, onOpenChange }) {
  if (!healthScore) return null;

  const trendData = healthScore.trendData || [];

  const radarData = [
    { subject: 'Coverage', value: healthScore.coverageScore },
    { subject: 'Stability', value: healthScore.stabilityScore },
    { subject: 'Maintenance', value: healthScore.maintenanceScore },
    { subject: 'Speed', value: healthScore.executionSpeedScore },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Activity className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{healthScore.applicationName}</DialogTitle>
              <DialogDescription className="mt-1">
                {healthScore.application} • {healthScore.segment}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill status={healthScore.status} size="md" dot />
          <Badge variant="outline" size="md">
            {healthScore.segment}
          </Badge>
          <Badge variant="outline" size="md">
            Trend: {healthScore.trend}
          </Badge>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <HealthScoreGauge score={healthScore.overallScore} label="Overall Health" size="lg" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Coverage</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{healthScore.coverageScore.toFixed(1)}</p>
            <Progress value={healthScore.coverageScore} max={100} variant="auto" size="xs" className="mt-1" />
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Stability</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{healthScore.stabilityScore.toFixed(1)}</p>
            <Progress value={healthScore.stabilityScore} max={100} variant="auto" size="xs" className="mt-1" />
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Maintenance</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{healthScore.maintenanceScore.toFixed(1)}</p>
            <Progress value={healthScore.maintenanceScore} max={100} variant="auto" size="xs" className="mt-1" />
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Speed</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{healthScore.executionSpeedScore.toFixed(1)}</p>
            <Progress value={healthScore.executionSpeedScore} max={100} variant="auto" size="xs" className="mt-1" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Sub-Score Radar</h4>
            <ChartWrapper height={220} noCard noPadding>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#16b364"
                    fill="#16b364"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Health Score Trend</h4>
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
                    dataKey="score"
                    name="Health Score"
                    stroke={getHealthScoreColor(healthScore.overallScore)}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: getHealthScoreColor(healthScore.overallScore), strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="text-slate-500">Last Assessed:</span>
          <span className="font-medium text-slate-900">{formatDate(healthScore.lastAssessed)}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FlakyTestDetailDialog({ flakyTest, open, onOpenChange }) {
  if (!flakyTest) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-warning-50">
              <Bug className="h-5 w-5 text-warning-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{flakyTest.testName}</DialogTitle>
              <DialogDescription className="mt-1">
                {flakyTest.testCaseId} • {flakyTest.applicationName} • {flakyTest.segment}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill status={flakyTest.status} size="md" dot />
          <Badge variant={getSeverityBadgeVariant(flakyTest.severity)} size="md">
            {flakyTest.severity}
          </Badge>
          <Badge variant="outline" size="md">
            {flakyTest.testType}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Flakiness Rate</span>
            <p className="mt-1 text-lg font-semibold text-danger-600">{flakyTest.flakinessRate}%</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Total Executions</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{flakyTest.totalExecutions}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Inconsistent</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{flakyTest.inconsistentResults}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Last Flake</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(flakyTest.lastFlakeDate)}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Assignee:</span>
            <span className="font-medium text-slate-900">{flakyTest.assignee}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Application:</span>
            <span className="font-medium text-slate-900">{flakyTest.applicationName}</span>
          </div>
        </div>

        {flakyTest.rootCause ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Root Cause</h4>
            <div className="rounded-lg border border-danger-200 bg-danger-50/30 p-3">
              <p className="text-sm text-slate-700 leading-relaxed">{flakyTest.rootCause}</p>
            </div>
          </div>
        ) : null}

        {flakyTest.recommendation ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Recommendation</h4>
            <div className="rounded-lg border border-info-200 bg-info-50/30 p-3">
              <p className="text-sm text-slate-700 leading-relaxed">{flakyTest.recommendation}</p>
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Flakiness Rate</h4>
          <Progress
            value={flakyTest.flakinessRate}
            max={100}
            variant="error"
            size="md"
            showValue
            label="Flakiness Rate"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CandidateDetailDialog({ candidate, open, onOpenChange }) {
  if (!candidate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Lightbulb className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{candidate.testName}</DialogTitle>
              <DialogDescription className="mt-1">
                {candidate.testCaseId} • {candidate.applicationName} • {candidate.segment}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant={getCandidateStatusBadgeVariant(candidate.status)} size="md">
            {candidate.status.replace(/_/g, ' ')}
          </Badge>
          <Badge variant="outline" size="md">
            {candidate.testType}
          </Badge>
          <Badge variant="outline" size="md">
            Currently: {candidate.currentStatus}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Priority Score</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{candidate.priorityScore}/100</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Complexity</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{candidate.complexityScore}/10</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Effort (hrs)</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{candidate.estimatedEffortHours}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Monthly Savings</span>
            <p className="mt-1 text-lg font-semibold text-success-600">{candidate.estimatedMonthlySavingsMinutes}m</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Execution Frequency</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{candidate.executionFrequency}/month</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Manual Time</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{candidate.manualExecutionTimeMinutes} min</p>
          </div>
        </div>

        {candidate.rationale ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Rationale</h4>
            <div className="rounded-lg border border-humana-green-200 bg-humana-green-50/30 p-3">
              <p className="text-sm text-slate-700 leading-relaxed">{candidate.rationale}</p>
            </div>
          </div>
        ) : null}

        {candidate.recommendedFramework ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Recommended Framework</h4>
            <Badge variant="primary" size="md">{candidate.recommendedFramework}</Badge>
          </div>
        ) : null}

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Priority Score</h4>
          <Progress
            value={candidate.priorityScore}
            max={100}
            variant="auto"
            size="md"
            showValue
            label="Automation Priority"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HealthScoresPanel({ healthScores, onHealthScoreClick, filterSegment, filterStatus }) {
  const filteredScores = useMemo(() => {
    let data = healthScores;
    if (filterSegment) {
      data = data.filter((h) => h.segment === filterSegment);
    }
    if (filterStatus) {
      data = data.filter((h) => h.status === filterStatus);
    }
    return data;
  }, [healthScores, filterSegment, filterStatus]);

  const sortedScores = useMemo(() => {
    return [...filteredScores].sort((a, b) => b.overallScore - a.overallScore);
  }, [filteredScores]);

  if (sortedScores.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No health scores found"
        message="No automation health scores match the current filter criteria."
        size="md"
        bordered
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sortedScores.map((hs) => (
        <Card
          key={hs.id}
          className={cn(
            'p-4 cursor-pointer transition-all duration-200',
            'hover:shadow-card-hover hover:border-humana-green-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
            'active:scale-[0.99]'
          )}
          role="button"
          tabIndex={0}
          onClick={() => onHealthScoreClick(hs)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onHealthScoreClick(hs);
            }
          }}
          aria-label={`${hs.applicationName}. Health score: ${hs.overallScore.toFixed(0)}. Status: ${hs.status}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-slate-900 truncate">{hs.applicationName}</h3>
              <span className="text-2xs text-slate-500">{hs.segment}</span>
            </div>
            <StatusPill status={hs.status} size="sm" dot />
          </div>

          <div className="mt-3 flex items-center justify-center">
            <HealthScoreGauge score={hs.overallScore} size="sm" />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-2xs text-slate-400">Coverage</span>
              <Progress value={hs.coverageScore} max={100} variant="auto" size="xs" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-2xs text-slate-400">Stability</span>
              <Progress value={hs.stabilityScore} max={100} variant="auto" size="xs" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-2xs text-slate-400">Maintenance</span>
              <Progress value={hs.maintenanceScore} max={100} variant="auto" size="xs" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-2xs text-slate-400">Speed</span>
              <Progress value={hs.executionSpeedScore} max={100} variant="auto" size="xs" />
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {hs.trend === 'improving' ? (
                <ArrowUpRight className="h-3 w-3 text-success-500" aria-hidden="true" />
              ) : hs.trend === 'declining' ? (
                <ArrowDownRight className="h-3 w-3 text-danger-500" aria-hidden="true" />
              ) : (
                <Minus className="h-3 w-3 text-slate-400" aria-hidden="true" />
              )}
              <span className={cn(
                'text-2xs font-medium capitalize',
                hs.trend === 'improving' ? 'text-success-600' :
                hs.trend === 'declining' ? 'text-danger-600' :
                'text-slate-500'
              )}>
                {hs.trend}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function CoverageOverviewPanel({ coverageMetrics }) {
  const chartData = useMemo(() => {
    return coverageMetrics
      .map((cm) => ({
        name: cm.applicationName.length > 18 ? cm.applicationName.substring(0, 18) + '…' : cm.applicationName,
        automated: cm.automationPercentage,
        target: cm.targetPercentage,
      }))
      .sort((a, b) => b.automated - a.automated);
  }, [coverageMetrics]);

  const coverageByType = useMemo(() => {
    const totals = {};
    for (const cm of coverageMetrics) {
      for (const bt of cm.byTestType || []) {
        if (!totals[bt.type]) {
          totals[bt.type] = { type: bt.type, total: 0, automated: 0 };
        }
        totals[bt.type].total += bt.count;
        totals[bt.type].automated += bt.automated;
      }
    }
    return Object.values(totals).map((t) => ({
      ...t,
      percentage: t.total > 0 ? Math.round((t.automated / t.total) * 1000) / 10 : 0,
      label: t.type.charAt(0).toUpperCase() + t.type.slice(1),
    }));
  }, [coverageMetrics]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PanelCard
        title="Automation Coverage by Application"
        subtitle="Current vs target automation coverage"
        icon={<Target className="h-5 w-5" />}
      >
        <ChartWrapper height={300} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" iconSize={8} />
              <Bar dataKey="automated" name="Current %" fill="#16b364" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="target" name="Target %" fill="#e2e8f0" radius={[3, 3, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Coverage by Test Type"
        subtitle="Automation coverage across test categories"
        icon={<Layers className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {coverageByType.map((item) => (
            <div key={item.type} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 capitalize">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    {formatNumber(item.automated)} / {formatNumber(item.total)}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{item.percentage}%</span>
                </div>
              </div>
              <Progress
                value={item.percentage}
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

function ROIPanel({ roiProjections }) {
  const platformROI = useMemo(() => {
    return roiProjections.find((r) => r.scope === 'platform') || null;
  }, [roiProjections]);

  const segmentROIs = useMemo(() => {
    return roiProjections.filter((r) => r.scope === 'segment');
  }, [roiProjections]);

  const applicationROIs = useMemo(() => {
    return roiProjections.filter((r) => r.scope === 'application');
  }, [roiProjections]);

  const timelineData = useMemo(() => {
    if (!platformROI || !platformROI.projectionTimeline) return [];
    return platformROI.projectionTimeline;
  }, [platformROI]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {platformROI ? (
        <PanelCard
          title="Platform ROI Projection"
          subtitle="Platform-wide automation ROI forecast"
          icon={<DollarSign className="h-5 w-5" />}
          className="xl:col-span-2"
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Current Coverage</span>
              <span className="text-xl font-semibold text-slate-900">{platformROI.currentAutomationCoverage}%</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Projected Coverage</span>
              <span className="text-xl font-semibold text-humana-green-600">{platformROI.projectedAutomationCoverage}%</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Annual Savings</span>
              <span className="text-xl font-semibold text-success-600">${formatNumber(platformROI.annualCostSavings / 1000)}K</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">3-Year ROI</span>
              <span className="text-xl font-semibold text-slate-900">{platformROI.threeYearROI}%</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Payback Period</span>
              <span className="text-xl font-semibold text-slate-900">{platformROI.paybackPeriodMonths} mo</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Confidence</span>
              <span className="text-xl font-semibold text-slate-900">{platformROI.confidence}%</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Defect Detection Improvement</span>
              <Progress value={platformROI.defectDetectionImprovement} max={100} variant="success" size="md" showValue />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Release Velocity Improvement</span>
              <Progress value={platformROI.releaseVelocityImprovement} max={100} variant="primary" size="md" showValue />
            </div>
          </div>

          {timelineData.length > 0 ? (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Quarterly Projection</h4>
              <ChartWrapper height={220} noCard noPadding>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timelineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="quarter"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                      domain={[0, 100]}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" iconSize={8} />
                    <Bar yAxisId="left" dataKey="coverage" name="Coverage %" fill="#16b364" radius={[3, 3, 0, 0]} barSize={20} />
                    <Bar yAxisId="right" dataKey="savings" name="Savings ($)" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </div>
          ) : null}
        </PanelCard>
      ) : null}

      {applicationROIs.length > 0 ? (
        <PanelCard
          title="Application ROI Projections"
          subtitle="Per-application automation ROI estimates"
          icon={<TrendingUp className="h-5 w-5" />}
        >
          <div className="flex flex-col gap-3">
            {applicationROIs.map((roi) => (
              <div key={roi.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-medium text-slate-900 truncate">{roi.applicationName}</span>
                    <span className="text-2xs text-slate-500">{roi.segment}</span>
                  </div>
                  <Badge variant="primary" size="sm">
                    {roi.threeYearROI}% ROI
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-2xs text-slate-400">Current</span>
                    <span className="text-xs font-semibold text-slate-900">{roi.currentAutomationCoverage}%</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-2xs text-slate-400">Projected</span>
                    <span className="text-xs font-semibold text-humana-green-600">{roi.projectedAutomationCoverage}%</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-2xs text-slate-400">Annual Savings</span>
                    <span className="text-xs font-semibold text-success-600">${formatNumber(roi.annualCostSavings / 1000)}K</span>
                  </div>
                </div>
                <div className="mt-2">
                  <Progress
                    value={roi.currentAutomationCoverage}
                    max={100}
                    variant="auto"
                    size="xs"
                    animate
                  />
                </div>
              </div>
            ))}
          </div>
        </PanelCard>
      ) : null}

      {segmentROIs.length > 0 ? (
        <PanelCard
          title="Segment ROI Projections"
          subtitle="Per-segment automation ROI estimates"
          icon={<Layers className="h-5 w-5" />}
        >
          <div className="flex flex-col gap-3">
            {segmentROIs.map((roi) => (
              <div key={roi.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-medium text-slate-900">{roi.segment} Segment</span>
                  </div>
                  <Badge variant="primary" size="sm">
                    {roi.threeYearROI}% ROI
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-2xs text-slate-400">Current</span>
                    <span className="text-xs font-semibold text-slate-900">{roi.currentAutomationCoverage}%</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-2xs text-slate-400">Projected</span>
                    <span className="text-xs font-semibold text-humana-green-600">{roi.projectedAutomationCoverage}%</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-2xs text-slate-400">Annual Savings</span>
                    <span className="text-xs font-semibold text-success-600">${formatNumber(roi.annualCostSavings / 1000)}K</span>
                  </div>
                </div>
                <div className="mt-2">
                  <Progress
                    value={roi.currentAutomationCoverage}
                    max={100}
                    variant="auto"
                    size="xs"
                    animate
                  />
                </div>
              </div>
            ))}
          </div>
        </PanelCard>
      ) : null}
    </div>
  );
}

function AnalyticsPanel({ healthScores, coverageMetrics, flakyTests, automationCandidates, roiProjections }) {
  const healthStatusData = useMemo(() => {
    const counts = {};
    for (const hs of healthScores) {
      counts[hs.status] = (counts[hs.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
  }, [healthScores]);

  const healthTrendData = useMemo(() => {
    const counts = {};
    for (const hs of healthScores) {
      counts[hs.trend] = (counts[hs.trend] || 0) + 1;
    }
    return Object.entries(counts).map(([trend, count]) => ({
      trend,
      count,
      label: trend.charAt(0).toUpperCase() + trend.slice(1),
    }));
  }, [healthScores]);

  const flakySeverityData = useMemo(() => {
    const counts = {};
    for (const ft of flakyTests) {
      counts[ft.severity] = (counts[ft.severity] || 0) + 1;
    }
    return Object.entries(counts).map(([severity, count]) => ({
      severity,
      count,
      label: severity.charAt(0).toUpperCase() + severity.slice(1),
    }));
  }, [flakyTests]);

  const flakyStatusData = useMemo(() => {
    const counts = {};
    for (const ft of flakyTests) {
      counts[ft.status] = (counts[ft.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: status.charAt(0).toUpperCase() + status.slice(1),
    }));
  }, [flakyTests]);

  const candidateStatusData = useMemo(() => {
    const counts = {};
    for (const ac of automationCandidates) {
      counts[ac.status] = (counts[ac.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
  }, [automationCandidates]);

  const healthScoreRanking = useMemo(() => {
    return [...healthScores]
      .sort((a, b) => b.overallScore - a.overallScore)
      .map((hs) => ({
        name: hs.applicationName.length > 18 ? hs.applicationName.substring(0, 18) + '…' : hs.applicationName,
        score: hs.overallScore,
      }));
  }, [healthScores]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PanelCard
        title="Health Score Distribution"
        subtitle="Applications by health status"
        icon={<BarChart2 className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {healthStatusData.map((entry) => (
                    <Cell key={entry.status} fill={HEALTH_COLORS[entry.status] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} apps`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {healthStatusData.map((item) => (
              <div key={item.status} className="flex items-center justify-between gap-3">
                <StatusPill status={item.status} size="sm" dot />
                <span className="text-sm font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title="Health Score Rankings"
        subtitle="Applications ranked by automation health"
        icon={<Star className="h-5 w-5" />}
      >
        <ChartWrapper height={280} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={healthScoreRanking} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Bar dataKey="score" name="Health Score" radius={[4, 4, 0, 0]} barSize={20}>
                {healthScoreRanking.map((entry) => (
                  <Cell key={entry.name} fill={getHealthScoreColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Flaky Tests by Severity"
        subtitle="Distribution of flaky tests across severity levels"
        icon={<Bug className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={flakySeverityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {flakySeverityData.map((entry) => (
                    <Cell key={entry.severity} fill={SEVERITY_COLORS[entry.severity] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} tests`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {flakySeverityData.map((item) => (
              <div key={item.severity} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: SEVERITY_COLORS[item.severity] || '#a3a3a3' }}
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
        title="Flaky Tests by Status"
        subtitle="Investigation status of flaky tests"
        icon={<AlertTriangle className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {flakyStatusData.map((item) => (
            <div key={item.status} className="flex items-center gap-3">
              <div className="w-24 shrink-0">
                <StatusPill status={item.status} size="sm" dot />
              </div>
              <div className="flex-1">
                <Progress
                  value={item.count}
                  max={flakyTests.length || 1}
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
        title="Automation Candidates by Status"
        subtitle="Pipeline of automation recommendations"
        icon={<Lightbulb className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {candidateStatusData.map((item) => (
            <div key={item.status} className="flex items-center gap-3">
              <div className="w-28 shrink-0">
                <Badge variant={getCandidateStatusBadgeVariant(item.status)} size="sm">
                  {item.label}
                </Badge>
              </div>
              <div className="flex-1">
                <Progress
                  value={item.count}
                  max={automationCandidates.length || 1}
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
        title="Health Trend Distribution"
        subtitle="Applications by health trend direction"
        icon={<TrendingUp className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {healthTrendData.map((item) => {
            const TrendIcon = item.trend === 'improving' ? TrendingUp : item.trend === 'declining' ? TrendingDown : Minus;
            const trendColor = item.trend === 'improving' ? 'text-success-600' : item.trend === 'declining' ? 'text-danger-600' : 'text-slate-500';
            return (
              <div key={item.trend} className="flex items-center gap-3">
                <div className="w-28 shrink-0 flex items-center gap-1.5">
                  <TrendIcon className={cn('h-4 w-4', trendColor)} aria-hidden="true" />
                  <span className={cn('text-sm font-medium capitalize', trendColor)}>{item.label}</span>
                </div>
                <div className="flex-1">
                  <Progress
                    value={item.count}
                    max={healthScores.length || 1}
                    variant="primary"
                    size="sm"
                    animate
                  />
                </div>
                <span className="text-sm font-semibold text-slate-900 w-8 text-right">{item.count}</span>
              </div>
            );
          })}
        </div>
      </PanelCard>
    </div>
  );
}

function AutomationIntelligenceSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading automation intelligence" aria-busy="true">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-80 rounded-xl" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Automation Intelligence page component.
 * Displays automation health metrics, coverage analysis, flaky test detection,
 * automation candidates, ROI projections, and trend charts.
 *
 * @returns {React.ReactElement}
 */
function AutomationIntelligencePage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();

  usePageHeader({ title: 'Automation Intelligence', subtitle: `Automation health metrics, coverage analysis, flaky test detection, and ROI projections for ${currentPersona.name}` });

  const [loading, setLoading] = useState(true);
  const [healthScores, setHealthScores] = useState([]);
  const [coverageMetrics, setCoverageMetrics] = useState([]);
  const [flakyTests, setFlakyTests] = useState([]);
  const [automationCandidates, setAutomationCandidates] = useState([]);
  const [roiProjections, setROIProjections] = useState([]);
  const [aggregates, setAggregates] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedHealthScore, setSelectedHealthScore] = useState(null);
  const [healthDetailOpen, setHealthDetailOpen] = useState(false);
  const [selectedFlakyTest, setSelectedFlakyTest] = useState(null);
  const [flakyDetailOpen, setFlakyDetailOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateDetailOpen, setCandidateDetailOpen] = useState(false);
  const [filters, setFilters] = useState({
    segment: '',
    status: '',
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Analytics', path: ROUTES.ANALYTICS },
      { label: 'Automation Intelligence' },
    ]);
  }, [setBreadcrumbs]);

  const loadData = useCallback(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      try {
        setHealthScores(getAllHealthScores());
        setCoverageMetrics(getAllCoverageMetrics());
        setFlakyTests(getAllFlakyTests());
        setAutomationCandidates(getAllAutomationCandidates());
        setROIProjections(getAllROIProjections());
        setAggregates(getAutomationIntelligenceAggregates());
      } catch {
        setHealthScores([]);
        setCoverageMetrics([]);
        setFlakyTests([]);
        setAutomationCandidates([]);
        setROIProjections([]);
        setAggregates(null);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
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

  const handleHealthScoreClick = useCallback((hs) => {
    setSelectedHealthScore(hs);
    setHealthDetailOpen(true);
  }, []);

  const handleHealthDetailClose = useCallback((open) => {
    setHealthDetailOpen(open);
    if (!open) setSelectedHealthScore(null);
  }, []);

  const handleFlakyTestClick = useCallback((ft) => {
    setSelectedFlakyTest(ft);
    setFlakyDetailOpen(true);
  }, []);

  const handleFlakyDetailClose = useCallback((open) => {
    setFlakyDetailOpen(open);
    if (!open) setSelectedFlakyTest(null);
  }, []);

  const handleCandidateClick = useCallback((ac) => {
    setSelectedCandidate(ac);
    setCandidateDetailOpen(true);
  }, []);

  const handleCandidateDetailClose = useCallback((open) => {
    setCandidateDetailOpen(open);
    if (!open) setSelectedCandidate(null);
  }, []);

  const handleExportCSV = useCallback(() => {
    try {
      const data = healthScores.map((hs) => ({
        id: hs.id,
        application: hs.application,
        applicationName: hs.applicationName,
        segment: hs.segment,
        overallScore: hs.overallScore,
        coverageScore: hs.coverageScore,
        stabilityScore: hs.stabilityScore,
        maintenanceScore: hs.maintenanceScore,
        executionSpeedScore: hs.executionSpeedScore,
        status: hs.status,
        trend: hs.trend,
      }));
      downloadCSV(data, 'automation-health-scores.csv');
      logEvent('data_export', {
        action: 'Exported Automation Health Scores',
        details: `Automation health scores exported as CSV by ${currentPersona.name}. ${data.length} records.`,
        resource: '/analytics',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} health scores exported as CSV.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export automation health scores.',
      });
    }
  }, [healthScores, currentPersona, logEvent, toast]);

  const handleExportJSON = useCallback(() => {
    try {
      const data = {
        healthScores: healthScores.map((hs) => ({
          id: hs.id,
          application: hs.application,
          applicationName: hs.applicationName,
          segment: hs.segment,
          overallScore: hs.overallScore,
          coverageScore: hs.coverageScore,
          stabilityScore: hs.stabilityScore,
          maintenanceScore: hs.maintenanceScore,
          executionSpeedScore: hs.executionSpeedScore,
          status: hs.status,
          trend: hs.trend,
        })),
        flakyTests: flakyTests.length,
        automationCandidates: automationCandidates.length,
      };
      downloadJSON(data, 'automation-intelligence.json');
      logEvent('data_export', {
        action: 'Exported Automation Intelligence',
        details: `Automation intelligence data exported as JSON by ${currentPersona.name}.`,
        resource: '/analytics',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: 'Automation intelligence data exported as JSON.',
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export automation intelligence data.',
      });
    }
  }, [healthScores, flakyTests, automationCandidates, currentPersona, logEvent, toast]);

  const kpiData = useMemo(() => {
    if (!aggregates) return [];

    return [
      {
        id: 'kpi_avg_health',
        label: 'Avg Health Score',
        value: aggregates.averageHealthScore,
        unit: 'score',
        trend: aggregates.averageHealthScore >= 75 ? 'improving' : 'declining',
        icon: <Gauge />,
        tone: 'blue',
        description: 'Average automation health score across all applications.',
      },
      {
        id: 'kpi_avg_coverage',
        label: 'Avg Automation Coverage',
        value: aggregates.averageAutomationCoverage,
        unit: 'percent',
        trend: aggregates.averageAutomationCoverage >= 80 ? 'improving' : 'stable',
        icon: <Zap />,
        tone: 'green',
        description: 'Average test automation coverage across all applications.',
      },
      {
        id: 'kpi_flaky_tests',
        label: 'Flaky Tests',
        value: aggregates.totalFlakyTests,
        unit: 'count',
        trend: aggregates.totalFlakyTests > 5 ? 'declining' : 'stable',
        icon: <AlertTriangle />,
        tone: 'orange',
        description: 'Total number of identified flaky tests.',
      },
      {
        id: 'kpi_annual_savings',
        label: 'Annual Cost Savings',
        value: aggregates.platformAnnualCostSavings > 0 ? aggregates.platformAnnualCostSavings / 1000 : 0,
        unit: 'currency',
        trend: 'improving',
        icon: <DollarSign />,
        tone: 'purple',
        description: 'Projected annual cost savings from automation (in thousands).',
      },
    ];
  }, [aggregates]);

  const filterFields = useMemo(() => {
    return [
      {
        id: 'segment',
        label: 'Segment',
        type: 'select',
        options: SEGMENT_OPTIONS,
        defaultValue: '',
      },
      {
        id: 'status',
        label: 'Health Status',
        type: 'select',
        options: STATUS_OPTIONS,
        defaultValue: '',
      },
    ];
  }, []);

  const flakyTestColumns = useMemo(
    () => [
      {
        accessorKey: 'testName',
        header: 'Test Name',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleFlakyTestClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors line-clamp-2"
          >
            {row.original.testName}
          </button>
        ),
      },
      {
        accessorKey: 'applicationName',
        header: 'Application',
        size: 150,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700 truncate block max-w-[150px]">{row.original.applicationName}</span>
        ),
      },
      {
        accessorKey: 'flakinessRate',
        header: 'Flakiness',
        size: 100,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-danger-600">{row.original.flakinessRate}%</span>
          </div>
        ),
      },
      {
        accessorKey: 'severity',
        header: 'Severity',
        size: 100,
        cell: ({ row }) => (
          <Badge variant={getSeverityBadgeVariant(row.original.severity)} size="sm">
            {row.original.severity}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 110,
        cell: ({ row }) => (
          <StatusPill status={row.original.status} size="sm" dot />
        ),
      },
      {
        accessorKey: 'assignee',
        header: 'Assignee',
        size: 130,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.assignee}</span>
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
                onClick={() => handleFlakyTestClick(row.original)}
                className={cn(
                  'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                  'hover:bg-slate-100 hover:text-slate-600',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                )}
                aria-label={`View ${row.original.testName}`}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">View Details</TooltipContent>
          </UITooltip>
        ),
      },
    ],
    [handleFlakyTestClick]
  );

  const candidateColumns = useMemo(
    () => [
      {
        accessorKey: 'testName',
        header: 'Test Case',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleCandidateClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors line-clamp-2"
          >
            {row.original.testName}
          </button>
        ),
      },
      {
        accessorKey: 'applicationName',
        header: 'Application',
        size: 150,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700 truncate block max-w-[150px]">{row.original.applicationName}</span>
        ),
      },
      {
        accessorKey: 'priorityScore',
        header: 'Priority',
        size: 90,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-slate-900">{row.original.priorityScore}</span>
            <span className="text-2xs text-slate-400">/100</span>
          </div>
        ),
      },
      {
        accessorKey: 'estimatedEffortHours',
        header: 'Effort (hrs)',
        size: 90,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.estimatedEffortHours}</span>
        ),
      },
      {
        accessorKey: 'estimatedMonthlySavingsMinutes',
        header: 'Savings/mo',
        size: 100,
        cell: ({ row }) => (
          <span className="text-sm font-medium text-success-600">{row.original.estimatedMonthlySavingsMinutes}m</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        cell: ({ row }) => (
          <Badge variant={getCandidateStatusBadgeVariant(row.original.status)} size="sm">
            {row.original.status.replace(/_/g, ' ')}
          </Badge>
        ),
      },
      {
        accessorKey: 'currentStatus',
        header: 'Current',
        size: 100,
        cell: ({ row }) => (
          <Badge variant="outline" size="sm">{row.original.currentStatus}</Badge>
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
                onClick={() => handleCandidateClick(row.original)}
                className={cn(
                  'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                  'hover:bg-slate-100 hover:text-slate-600',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                )}
                aria-label={`View ${row.original.testName}`}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">View Details</TooltipContent>
          </UITooltip>
        ),
      },
    ],
    [handleCandidateClick]
  );

  const insightData = useMemo(() => {
    if (!aggregates) return null;

    const criticalCount = (aggregates.healthStatusBreakdown && aggregates.healthStatusBreakdown[MEASURE_STATUS.CRITICAL]) || 0;
    const atRiskCount = (aggregates.healthStatusBreakdown && aggregates.healthStatusBreakdown[MEASURE_STATUS.AT_RISK]) || 0;
    const openFlaky = flakyTests.filter((ft) => ft.status === 'open').length;

    if (criticalCount > 0) {
      return {
        variant: 'critical',
        title: `${criticalCount} application${criticalCount > 1 ? 's' : ''} with critical automation health`,
        message: `${criticalCount} application${criticalCount > 1 ? 's have' : ' has'} automation health scores below 60%. ${openFlaky} flaky tests remain open. Immediate attention required to improve test stability and coverage.`,
        source: 'Automation Intelligence Engine',
        confidence: 92,
      };
    }

    if (atRiskCount > 0) {
      return {
        variant: 'warning',
        title: `${atRiskCount} application${atRiskCount > 1 ? 's' : ''} at risk for automation health`,
        message: `${atRiskCount} application${atRiskCount > 1 ? 's are' : ' is'} trending below target automation health thresholds. ${aggregates.totalAutomationCandidates} automation candidates identified for improvement.`,
        source: 'Automation Intelligence Engine',
        confidence: 87,
      };
    }

    return {
      variant: 'success',
      title: 'Automation health performing well',
      message: `Average health score is ${aggregates.averageHealthScore.toFixed(1)}% with ${aggregates.averageAutomationCoverage.toFixed(1)}% automation coverage. Platform-wide annual savings projected at $${formatNumber(aggregates.platformAnnualCostSavings / 1000)}K.`,
      source: 'Automation Intelligence Engine',
      confidence: 94,
    };
  }, [aggregates, flakyTests]);

  const filteredFlakyTests = useMemo(() => {
    let data = flakyTests;
    if (filters.segment) {
      data = data.filter((ft) => ft.segment === filters.segment);
    }
    return data;
  }, [flakyTests, filters.segment]);

  const filteredCandidates = useMemo(() => {
    let data = automationCandidates;
    if (filters.segment) {
      data = data.filter((ac) => ac.segment === filters.segment);
    }
    return [...data].sort((a, b) => b.priorityScore - a.priorityScore);
  }, [automationCandidates, filters.segment]);

  if (loading) {
    return <AutomationIntelligenceSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Refresh + Export — portalled into the navbar (left of the bell) */}
      <PageActions>
        <UITooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              iconLeft={<RefreshCw className="h-4 w-4" />}
              onClick={handleRefresh}
              aria-label="Refresh automation intelligence"
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">Refresh</TooltipContent>
        </UITooltip>

        <PermissionGate requiredAction={PERMISSIONS.EXPORT_REPORTS} behavior="hidden">
          <DropdownMenu>
            <UITooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2"
                    iconLeft={<Download className="h-4 w-4" />}
                    aria-label="Export automation intelligence"
                  />
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Export</TooltipContent>
            </UITooltip>
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

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            trend={kpi.trend}
            icon={kpi.icon}
            tone={kpi.tone}
            iconVariant="solid"
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
          <TabsTrigger value="overview">Health Scores</TabsTrigger>
          <TabsTrigger value="coverage">Coverage</TabsTrigger>
          <TabsTrigger value="flaky">Flaky Tests ({filteredFlakyTests.length})</TabsTrigger>
          <TabsTrigger value="candidates">Candidates ({filteredCandidates.length})</TabsTrigger>
          <TabsTrigger value="roi">ROI</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <HealthScoresPanel
            healthScores={healthScores}
            onHealthScoreClick={handleHealthScoreClick}
            filterSegment={filters.segment}
            filterStatus={filters.status}
          />
        </TabsContent>

        <TabsContent value="coverage">
          {coverageMetrics.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No coverage data"
              message="No automation coverage metrics available."
              size="lg"
              bordered
            />
          ) : (
            <CoverageOverviewPanel coverageMetrics={coverageMetrics} />
          )}
        </TabsContent>

        <TabsContent value="flaky">
          {filteredFlakyTests.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No flaky tests found"
              message="No flaky tests match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={flakyTestColumns}
              data={filteredFlakyTests}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={10}
              searchPlaceholder="Search flaky tests..."
              emptyMessage="No flaky tests match the search criteria."
              onRowClick={handleFlakyTestClick}
            />
          )}
        </TabsContent>

        <TabsContent value="candidates">
          {filteredCandidates.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No automation candidates"
              message="No automation candidates match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={candidateColumns}
              data={filteredCandidates}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={10}
              searchPlaceholder="Search candidates..."
              emptyMessage="No candidates match the search criteria."
              onRowClick={handleCandidateClick}
            />
          )}
        </TabsContent>

        <TabsContent value="roi">
          {roiProjections.length === 0 ? (
            <EmptyState
              type="no_chart"
              title="No ROI projections"
              message="No ROI projection data available."
              size="lg"
              bordered
            />
          ) : (
            <ROIPanel roiProjections={roiProjections} />
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {healthScores.length === 0 ? (
            <EmptyState
              type="no_chart"
              title="No data for analytics"
              message="No automation intelligence data available to generate analytics."
              size="lg"
              bordered
            />
          ) : (
            <AnalyticsPanel
              healthScores={healthScores}
              coverageMetrics={coverageMetrics}
              flakyTests={flakyTests}
              automationCandidates={automationCandidates}
              roiProjections={roiProjections}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Panel */}
      {aggregates ? (
        <PanelCard
          title="Automation Intelligence Summary"
          subtitle="Aggregate metrics across all automation data"
          icon={<Cpu className="h-5 w-5" />}
          collapsible
          defaultCollapsed
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Health Scores</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.totalHealthScores}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg Health</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.averageHealthScore.toFixed(1)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg Coverage</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.averageAutomationCoverage.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Flaky Tests</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.totalFlakyTests}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg Flakiness</span>
              <span className="text-2xl font-semibold text-danger-600">{aggregates.averageFlakinessRate.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Candidates</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.totalAutomationCandidates}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Total Est. Effort</span>
              <span className="text-lg font-semibold text-slate-900">{aggregates.totalEstimatedEffortHours} hours</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Total Monthly Savings</span>
              <span className="text-lg font-semibold text-success-600">{formatNumber(aggregates.totalEstimatedMonthlySavingsMinutes)} minutes</span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Average Health Score</h4>
            <Progress
              value={aggregates.averageHealthScore}
              max={100}
              variant="auto"
              size="md"
              showValue
              label="Platform Average"
            />
          </div>
        </PanelCard>
      ) : null}

      {/* Health Score Detail Dialog */}
      <HealthScoreDetailDialog
        healthScore={selectedHealthScore}
        open={healthDetailOpen}
        onOpenChange={handleHealthDetailClose}
      />

      {/* Flaky Test Detail Dialog */}
      <FlakyTestDetailDialog
        flakyTest={selectedFlakyTest}
        open={flakyDetailOpen}
        onOpenChange={handleFlakyDetailClose}
      />

      {/* Candidate Detail Dialog */}
      <CandidateDetailDialog
        candidate={selectedCandidate}
        open={candidateDetailOpen}
        onOpenChange={handleCandidateDetailClose}
      />
    </div>
  );
}

AutomationIntelligencePage.displayName = 'AutomationIntelligencePage';

export { AutomationIntelligencePage };
export default AutomationIntelligencePage;