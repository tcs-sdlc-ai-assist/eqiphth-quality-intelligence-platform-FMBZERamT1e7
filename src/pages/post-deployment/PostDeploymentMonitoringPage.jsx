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
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  Calendar,
  Clock,
  BarChart2,
  Layers,
  FileText,
  ChevronRight,
  User,
  Zap,
  Shield,
  Target,
  Server,
  Monitor,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Bug,
  GitBranch,
  Sparkles,
  Lightbulb,
  Info,
  ExternalLink,
  Clipboard,
  Heart,
  Gauge,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import {
  getPostDeploymentData,
} from '@/lib/mock-api/mockService';
import {
  getAllProductionHealthMetrics,
  getAllReleaseOutcomes,
  getAllIncidentCorrelations,
  getAllQualityFeedbackLoops,
  getPostDeploymentAggregates,
  getBreachingProductionHealthMetrics,
  getReleaseOutcomesWithIncidents,
  getReleaseRelatedIncidents,
  getOpenIncidentCorrelations,
} from '@/data/postDeployment';
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
import { PERMISSIONS, ROUTES } from '@/lib/constants';

const HEALTH_STATUS_COLORS = {
  healthy: '#10b981',
  degraded: '#f59e0b',
  critical: '#ef4444',
};

const OUTCOME_COLORS = {
  success: '#10b981',
  partial_success: '#f59e0b',
  rollback: '#ef4444',
  failed: '#dc2626',
};

const STABILIZATION_COLORS = {
  stable: '#10b981',
  monitoring: '#3b82f6',
  unstable: '#ef4444',
  rolled_back: '#dc2626',
};

const SEVERITY_COLORS = {
  P1: '#dc2626',
  P2: '#ef4444',
  P3: '#f59e0b',
  P4: '#a3a3a3',
};

const INCIDENT_STATUS_COLORS = {
  open: '#ef4444',
  investigating: '#f59e0b',
  mitigated: '#3b82f6',
  resolved: '#10b981',
  closed: '#a3a3a3',
};

const FEEDBACK_TYPE_COLORS = {
  defect_escape: '#ef4444',
  test_gap: '#f59e0b',
  process_improvement: '#3b82f6',
  automation_opportunity: '#16b364',
  monitoring_gap: '#8b5cf6',
  documentation_gap: '#06b6d4',
};

const FEEDBACK_PRIORITY_COLORS = {
  critical: '#dc2626',
  high: '#f59e0b',
  medium: '#3b82f6',
  low: '#a3a3a3',
};

const FEEDBACK_STATUS_COLORS = {
  new: '#3b82f6',
  acknowledged: '#06b6d4',
  in_progress: '#f59e0b',
  implemented: '#10b981',
  deferred: '#a3a3a3',
  dismissed: '#64748b',
};

const SEGMENT_COLORS = {
  Enterprise: '#16b364',
  Medicare: '#3b82f6',
  Medicaid: '#f59e0b',
  Commercial: '#8b5cf6',
  External: '#ef4444',
  Compliance: '#06b6d4',
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

function getHealthStatusBadgeVariant(status) {
  switch (status) {
    case 'healthy':
      return 'success';
    case 'degraded':
      return 'warning';
    case 'critical':
      return 'error';
    default:
      return 'neutral';
  }
}

function getOutcomeBadgeVariant(outcome) {
  switch (outcome) {
    case 'success':
      return 'success';
    case 'partial_success':
      return 'warning';
    case 'rollback':
      return 'error';
    case 'failed':
      return 'error';
    default:
      return 'neutral';
  }
}

function getStabilizationBadgeVariant(status) {
  switch (status) {
    case 'stable':
      return 'success';
    case 'monitoring':
      return 'info';
    case 'unstable':
      return 'error';
    case 'rolled_back':
      return 'error';
    default:
      return 'neutral';
  }
}

function getSeverityBadgeVariant(severity) {
  switch (severity) {
    case 'P1':
      return 'error';
    case 'P2':
      return 'error';
    case 'P3':
      return 'warning';
    case 'P4':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getFeedbackTypeBadgeVariant(type) {
  switch (type) {
    case 'defect_escape':
      return 'error';
    case 'test_gap':
      return 'warning';
    case 'process_improvement':
      return 'info';
    case 'automation_opportunity':
      return 'primary';
    case 'monitoring_gap':
      return 'warning';
    case 'documentation_gap':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getFeedbackPriorityBadgeVariant(priority) {
  switch (priority) {
    case 'critical':
      return 'error';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getFeedbackStatusBadgeVariant(status) {
  switch (status) {
    case 'new':
      return 'info';
    case 'acknowledged':
      return 'primary';
    case 'in_progress':
      return 'warning';
    case 'implemented':
      return 'success';
    case 'deferred':
      return 'neutral';
    case 'dismissed':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getChangeFailureBadgeVariant(category) {
  switch (category) {
    case 'none':
      return 'success';
    case 'minor':
      return 'warning';
    case 'major':
      return 'error';
    case 'critical':
      return 'error';
    default:
      return 'neutral';
  }
}

function HealthMetricDetailDialog({ metric, open, onOpenChange }) {
  if (!metric) return null;

  const history = metric.history || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Heart className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{metric.applicationName}</DialogTitle>
              <DialogDescription className="mt-1">
                {metric.id} • {formatLabel(metric.metricType)} • {metric.segment}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant={getHealthStatusBadgeVariant(metric.status)} size="md">
            {formatLabel(metric.status)}
          </Badge>
          <Badge variant="outline" size="md">
            {formatLabel(metric.metricType)}
          </Badge>
          <Badge variant="outline" size="md">
            {metric.segment}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Current Value</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {metric.currentValue}{metric.unit === 'percent' ? '%' : metric.unit === 'milliseconds' ? 'ms' : ''}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Threshold</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {metric.threshold}{metric.unit === 'percent' ? '%' : metric.unit === 'milliseconds' ? 'ms' : ''}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Status</span>
            <p className="mt-1 text-lg font-semibold text-slate-900 capitalize">{metric.status}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Trend</span>
            <p className="mt-1 text-lg font-semibold text-slate-900 capitalize">{metric.trend}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Application:</span>
            <span className="font-medium text-slate-900">{metric.applicationName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Segment:</span>
            <span className="font-medium text-slate-900">{metric.segment}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Last Updated:</span>
            <span className="font-medium text-slate-900">{formatDate(metric.lastUpdated, 'MMM d, yyyy h:mm a')}</span>
          </div>
        </div>

        {history.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Recent History</h4>
            <ChartWrapper height={220} noCard noPadding>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="timestamp"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                    tickFormatter={(val) => {
                      try {
                        return new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      } catch {
                        return '';
                      }
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${value}${metric.unit === 'percent' ? '%' : metric.unit === 'milliseconds' ? 'ms' : ''}`,
                      'Value',
                    ]}
                    labelFormatter={(label) => {
                      try {
                        return formatDate(label, 'MMM d, h:mm a');
                      } catch {
                        return label;
                      }
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Value"
                    stroke={HEALTH_STATUS_COLORS[metric.status] || '#16b364'}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: HEALTH_STATUS_COLORS[metric.status] || '#16b364', strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        ) : null}

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Threshold Compliance</h4>
          <Progress
            value={
              metric.metricType === 'uptime'
                ? metric.currentValue
                : metric.metricType === 'error_rate' || metric.metricType === 'response_time'
                  ? Math.max(0, 100 - ((metric.currentValue / Math.max(metric.threshold, 1)) * 100))
                  : (metric.currentValue / Math.max(metric.threshold, 1)) * 100
            }
            max={100}
            variant="auto"
            size="md"
            showValue
            label="Threshold Compliance"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReleaseOutcomeDetailDialog({ releaseOutcome, open, onOpenChange }) {
  if (!releaseOutcome) return null;

  const postDeployIssues = releaseOutcome.postDeployIssues || [];
  const performanceComparison = releaseOutcome.performanceComparison || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <GitBranch className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{releaseOutcome.applicationName} v{releaseOutcome.version}</DialogTitle>
              <DialogDescription className="mt-1">
                {releaseOutcome.releaseId} • {releaseOutcome.segment} • {releaseOutcome.environment}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant={getOutcomeBadgeVariant(releaseOutcome.outcome)} size="md">
            {formatLabel(releaseOutcome.outcome)}
          </Badge>
          <Badge variant={getStabilizationBadgeVariant(releaseOutcome.stabilizationStatus)} size="md">
            {formatLabel(releaseOutcome.stabilizationStatus)}
          </Badge>
          <Badge variant={getChangeFailureBadgeVariant(releaseOutcome.changeFailureCategory)} size="md">
            Change: {formatLabel(releaseOutcome.changeFailureCategory)}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Quality Score</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{releaseOutcome.qualityScore.toFixed(1)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Pre-Deploy Pass</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{releaseOutcome.preDeployTestPassRate.toFixed(1)}%</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Post-Deploy Pass</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{releaseOutcome.postDeployTestPassRate.toFixed(1)}%</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Incidents</span>
            <p className={cn(
              'mt-1 text-lg font-semibold',
              releaseOutcome.incidentCount > 0 ? 'text-danger-600' : 'text-success-600'
            )}>
              {releaseOutcome.incidentCount}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">MTTR</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {releaseOutcome.mttrMinutes > 0 ? `${releaseOutcome.mttrMinutes}m` : '—'}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Rollback Time</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {releaseOutcome.rollbackTimeMinutes > 0 ? `${releaseOutcome.rollbackTimeMinutes}m` : '—'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Deployed By:</span>
            <span className="font-medium text-slate-900">{releaseOutcome.deployedBy}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Deployed At:</span>
            <span className="font-medium text-slate-900">{formatDate(releaseOutcome.deployedAt, 'MMM d, yyyy h:mm a')}</span>
          </div>
          {releaseOutcome.stabilizedAt ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Stabilized At:</span>
              <span className="font-medium text-slate-900">{formatDate(releaseOutcome.stabilizedAt, 'MMM d, yyyy h:mm a')}</span>
            </div>
          ) : null}
        </div>

        {postDeployIssues.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Post-Deployment Issues ({postDeployIssues.length})</h4>
            <div className="flex flex-col gap-2">
              {postDeployIssues.map((issue, index) => (
                <div key={index} className="rounded-lg border border-warning-200 bg-warning-50/30 p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-sm text-slate-700">{issue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {performanceComparison.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Performance Comparison (Pre vs Post)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Metric</th>
                    <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Before</th>
                    <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">After</th>
                    <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Unit</th>
                    <th className="pb-2 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceComparison.map((comp, index) => {
                    const improved = comp.metric.toLowerCase().includes('error') || comp.metric.toLowerCase().includes('time') || comp.metric.toLowerCase().includes('cpu') || comp.metric.toLowerCase().includes('memory')
                      ? comp.after < comp.before
                      : comp.after > comp.before;
                    const changePercent = comp.before > 0
                      ? ((comp.after - comp.before) / comp.before) * 100
                      : 0;

                    return (
                      <tr key={index} className="border-b border-slate-100 last:border-b-0">
                        <td className="py-2.5 font-medium text-slate-900 text-xs">{comp.metric}</td>
                        <td className="py-2.5 text-right text-slate-700">{comp.before}</td>
                        <td className={cn(
                          'py-2.5 text-right font-medium',
                          improved ? 'text-success-600' : 'text-danger-600'
                        )}>
                          {comp.after}
                        </td>
                        <td className="py-2.5 text-right text-slate-500 text-xs">{comp.unit}</td>
                        <td className="py-2.5 text-center">
                          <span className={cn(
                            'text-xs font-medium',
                            improved ? 'text-success-600' : 'text-danger-600'
                          )}>
                            {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function IncidentDetailDialog({ incident, open, onOpenChange }) {
  if (!incident) return null;

  const mitigationActions = incident.mitigationActions || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-danger-50">
              <AlertTriangle className="h-5 w-5 text-danger-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{incident.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {incident.incidentId} • {incident.severity} • {incident.applicationName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant={getSeverityBadgeVariant(incident.severity)} size="md">
            {incident.severity}
          </Badge>
          <StatusPill status={incident.status} size="md" dot />
          {incident.isReleaseRelated ? (
            <Badge variant="warning" size="md">
              Release Related
            </Badge>
          ) : (
            <Badge variant="neutral" size="md">
              Non-Release
            </Badge>
          )}
          <Badge variant="outline" size="md">
            {formatLabel(incident.impactScope)}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Severity</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{incident.severity}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Duration</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {incident.durationMinutes > 0 ? `${incident.durationMinutes}m` : 'Ongoing'}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Affected Users</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{formatNumber(incident.affectedUsers)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Impact</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{formatLabel(incident.impactScope)}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Application:</span>
            <span className="font-medium text-slate-900">{incident.applicationName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Segment:</span>
            <span className="font-medium text-slate-900">{incident.segment}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Assignee:</span>
            <span className="font-medium text-slate-900">{incident.assignee}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Detected:</span>
            <span className="font-medium text-slate-900">{formatDate(incident.detectedAt, 'MMM d, yyyy h:mm a')}</span>
          </div>
          {incident.resolvedAt ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Resolved:</span>
              <span className="font-medium text-slate-900">{formatDate(incident.resolvedAt, 'MMM d, yyyy h:mm a')}</span>
            </div>
          ) : null}
          {incident.correlatedReleaseVersion ? (
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Correlated Release:</span>
              <span className="font-medium text-slate-900">v{incident.correlatedReleaseVersion}</span>
            </div>
          ) : null}
        </div>

        {incident.description ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{incident.description}</p>
          </div>
        ) : null}

        {incident.rootCause ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Root Cause</h4>
            <div className="rounded-lg border border-danger-200 bg-danger-50/30 p-3">
              <p className="text-sm text-slate-700 leading-relaxed">{incident.rootCause}</p>
            </div>
          </div>
        ) : null}

        {mitigationActions.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Mitigation Actions ({mitigationActions.length})</h4>
            <div className="flex flex-col gap-2">
              {mitigationActions.map((action, index) => (
                <div key={index} className="flex items-start gap-2 rounded-lg border border-slate-200 p-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-humana-green-50 text-2xs font-semibold text-humana-green-700">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-700">{action}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function FeedbackLoopDetailDialog({ feedback, open, onOpenChange }) {
  if (!feedback) return null;

  const actionItems = feedback.actionItems || [];
  const relatedTestCases = feedback.relatedTestCases || [];
  const relatedDefects = feedback.relatedDefects || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Lightbulb className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{feedback.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {feedback.id} • {formatLabel(feedback.feedbackType)} • {feedback.applicationName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant={getFeedbackTypeBadgeVariant(feedback.feedbackType)} size="md">
            {formatLabel(feedback.feedbackType)}
          </Badge>
          <Badge variant={getFeedbackPriorityBadgeVariant(feedback.priority)} size="md">
            {feedback.priority}
          </Badge>
          <Badge variant={getFeedbackStatusBadgeVariant(feedback.status)} size="md">
            {formatLabel(feedback.status)}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Impact</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{feedback.estimatedImpact}/10</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Source</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{formatLabel(feedback.source)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Release</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">v{feedback.releaseVersion}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Actions</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{actionItems.length}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Application:</span>
            <span className="font-medium text-slate-900">{feedback.applicationName}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Assignee:</span>
            <span className="font-medium text-slate-900">{feedback.assignee}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Identified:</span>
            <span className="font-medium text-slate-900">{formatDate(feedback.identifiedAt, 'MMM d, yyyy h:mm a')}</span>
          </div>
          {feedback.resolvedAt ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Resolved:</span>
              <span className="font-medium text-slate-900">{formatDate(feedback.resolvedAt, 'MMM d, yyyy h:mm a')}</span>
            </div>
          ) : null}
        </div>

        {feedback.description ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{feedback.description}</p>
          </div>
        ) : null}

        {feedback.resolution ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Resolution</h4>
            <div className="rounded-lg border border-success-200 bg-success-50/30 p-3">
              <p className="text-sm text-slate-700 leading-relaxed">{feedback.resolution}</p>
            </div>
          </div>
        ) : null}

        {actionItems.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Action Items ({actionItems.length})</h4>
            <div className="flex flex-col gap-2">
              {actionItems.map((item, index) => (
                <div key={index} className="flex items-start gap-2 rounded-lg border border-slate-200 p-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-humana-green-50 text-2xs font-semibold text-humana-green-700">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {relatedTestCases.length > 0 || relatedDefects.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Related Items</h4>
            <div className="flex flex-wrap gap-1.5">
              {relatedTestCases.map((tc) => (
                <Badge key={tc} variant="outline" size="sm">{tc}</Badge>
              ))}
              {relatedDefects.map((d) => (
                <Badge key={d} variant="error" size="sm">{d}</Badge>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Estimated Impact</h4>
          <Progress
            value={feedback.estimatedImpact}
            max={10}
            variant="auto"
            size="md"
            showValue
            valueFormat="fraction"
            label="Impact Score"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AnalyticsPanel({ healthMetrics, releaseOutcomes, incidentCorrelations, feedbackLoops }) {
  const healthStatusData = useMemo(() => {
    const counts = {};
    for (const m of healthMetrics) {
      counts[m.status] = (counts[m.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: formatLabel(status),
    }));
  }, [healthMetrics]);

  const outcomeData = useMemo(() => {
    const counts = {};
    for (const r of releaseOutcomes) {
      counts[r.outcome] = (counts[r.outcome] || 0) + 1;
    }
    return Object.entries(counts).map(([outcome, count]) => ({
      outcome,
      count,
      label: formatLabel(outcome),
    }));
  }, [releaseOutcomes]);

  const stabilizationData = useMemo(() => {
    const counts = {};
    for (const r of releaseOutcomes) {
      counts[r.stabilizationStatus] = (counts[r.stabilizationStatus] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: formatLabel(status),
    }));
  }, [releaseOutcomes]);

  const incidentSeverityData = useMemo(() => {
    const counts = {};
    for (const i of incidentCorrelations) {
      counts[i.severity] = (counts[i.severity] || 0) + 1;
    }
    return Object.entries(counts).map(([severity, count]) => ({
      severity,
      count,
      label: severity,
    }));
  }, [incidentCorrelations]);

  const incidentStatusData = useMemo(() => {
    const counts = {};
    for (const i of incidentCorrelations) {
      counts[i.status] = (counts[i.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: formatLabel(status),
    }));
  }, [incidentCorrelations]);

  const feedbackTypeData = useMemo(() => {
    const counts = {};
    for (const f of feedbackLoops) {
      counts[f.feedbackType] = (counts[f.feedbackType] || 0) + 1;
    }
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      label: formatLabel(type),
    }));
  }, [feedbackLoops]);

  const feedbackPriorityData = useMemo(() => {
    const counts = {};
    for (const f of feedbackLoops) {
      counts[f.priority] = (counts[f.priority] || 0) + 1;
    }
    return Object.entries(counts).map(([priority, count]) => ({
      priority,
      count,
      label: formatLabel(priority),
    }));
  }, [feedbackLoops]);

  const qualityScoreData = useMemo(() => {
    return releaseOutcomes
      .map((r) => ({
        name: `${r.applicationName.length > 15 ? r.applicationName.substring(0, 15) + '…' : r.applicationName} v${r.version}`,
        qualityScore: r.qualityScore,
        preDeployPass: r.preDeployTestPassRate,
        postDeployPass: r.postDeployTestPassRate,
      }))
      .sort((a, b) => b.qualityScore - a.qualityScore);
  }, [releaseOutcomes]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PanelCard
        title="Production Health Status"
        subtitle="Distribution of health metric statuses"
        icon={<Heart className="h-5 w-5" />}
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
                    <Cell key={entry.status} fill={HEALTH_STATUS_COLORS[entry.status] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} metrics`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {healthStatusData.map((item) => (
              <div key={item.status} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: HEALTH_STATUS_COLORS[item.status] || '#a3a3a3' }}
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
        title="Release Outcomes"
        subtitle="Deployment outcome distribution"
        icon={<GitBranch className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {outcomeData.map((entry) => (
                    <Cell key={entry.outcome} fill={OUTCOME_COLORS[entry.outcome] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} releases`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {outcomeData.map((item) => (
              <div key={item.outcome} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: OUTCOME_COLORS[item.outcome] || '#a3a3a3' }}
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
        title="Release Quality Scores"
        subtitle="Quality and test pass rates by release"
        icon={<BarChart2 className="h-5 w-5" />}
      >
        <ChartWrapper height={280} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={qualityScoreData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                angle={-25}
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
              <Bar dataKey="qualityScore" name="Quality Score" fill="#16b364" radius={[3, 3, 0, 0]} barSize={12} />
              <Bar dataKey="preDeployPass" name="Pre-Deploy Pass" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={12} />
              <Bar dataKey="postDeployPass" name="Post-Deploy Pass" fill="#8b5cf6" radius={[3, 3, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Incident Severity Distribution"
        subtitle="Incidents by severity level"
        icon={<AlertTriangle className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incidentSeverityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {incidentSeverityData.map((entry) => (
                    <Cell key={entry.severity} fill={SEVERITY_COLORS[entry.severity] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} incidents`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {incidentSeverityData.map((item) => (
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
        title="Incident Status"
        subtitle="Current incident lifecycle status"
        icon={<Activity className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {incidentStatusData.map((item) => (
            <div key={item.status} className="flex items-center gap-3">
              <div className="w-24 shrink-0">
                <StatusPill status={item.status} size="sm" dot />
              </div>
              <div className="flex-1">
                <Progress
                  value={item.count}
                  max={incidentCorrelations.length || 1}
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
        title="Quality Feedback by Type"
        subtitle="Distribution of feedback loop types"
        icon={<Lightbulb className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={feedbackTypeData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
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
                dataKey="label"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Feedback Items" radius={[0, 4, 4, 0]} barSize={16}>
                {feedbackTypeData.map((entry) => (
                  <Cell key={entry.type} fill={FEEDBACK_TYPE_COLORS[entry.type] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Stabilization Status"
        subtitle="Release stabilization state distribution"
        icon={<Shield className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stabilizationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {stabilizationData.map((entry) => (
                    <Cell key={entry.status} fill={STABILIZATION_COLORS[entry.status] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} releases`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {stabilizationData.map((item) => (
              <div key={item.status} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: STABILIZATION_COLORS[item.status] || '#a3a3a3' }}
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
        title="Feedback Priority Distribution"
        subtitle="Quality feedback by priority level"
        icon={<Target className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feedbackPriorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {feedbackPriorityData.map((entry) => (
                    <Cell key={entry.priority} fill={FEEDBACK_PRIORITY_COLORS[entry.priority] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} items`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {feedbackPriorityData.map((item) => (
              <div key={item.priority} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: FEEDBACK_PRIORITY_COLORS[item.priority] || '#a3a3a3' }}
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
    </div>
  );
}

function PostDeploymentMonitoringSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading post-deployment monitoring" aria-busy="true">
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
      <Skeleton className="h-96 rounded-xl" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Post Deployment Monitoring page component.
 * Links release quality to production outcomes with incident correlations,
 * production health metrics, quality feedback loops, and trend charts.
 * All data from mockService.
 *
 * @returns {React.ReactElement}
 */
function PostDeploymentMonitoringPage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [releaseOutcomes, setReleaseOutcomes] = useState([]);
  const [incidentCorrelations, setIncidentCorrelations] = useState([]);
  const [feedbackLoops, setFeedbackLoops] = useState([]);
  const [aggregates, setAggregates] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedHealthMetric, setSelectedHealthMetric] = useState(null);
  const [healthDetailOpen, setHealthDetailOpen] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [releaseDetailOpen, setReleaseDetailOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [incidentDetailOpen, setIncidentDetailOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackDetailOpen, setFeedbackDetailOpen] = useState(false);
  const [filters, setFilters] = useState({
    segment: '',
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Analytics', path: ROUTES.ANALYTICS },
      { label: 'Post-Deployment Monitoring' },
    ]);
  }, [setBreadcrumbs]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPostDeploymentData();
      const hm = data.productionHealthMetrics || getAllProductionHealthMetrics();
      const ro = data.releaseOutcomes || getAllReleaseOutcomes();
      const ic = data.incidentCorrelations || getAllIncidentCorrelations();
      const fl = data.qualityFeedbackLoops || getAllQualityFeedbackLoops();

      setHealthMetrics(hm);
      setReleaseOutcomes(ro);
      setIncidentCorrelations(ic);
      setFeedbackLoops(fl);
      setAggregates(getPostDeploymentAggregates());
    } catch {
      setHealthMetrics(getAllProductionHealthMetrics());
      setReleaseOutcomes(getAllReleaseOutcomes());
      setIncidentCorrelations(getAllIncidentCorrelations());
      setFeedbackLoops(getAllQualityFeedbackLoops());
      setAggregates(getPostDeploymentAggregates());
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

  const handleHealthMetricClick = useCallback((metric) => {
    setSelectedHealthMetric(metric);
    setHealthDetailOpen(true);
  }, []);

  const handleHealthDetailClose = useCallback((open) => {
    setHealthDetailOpen(open);
    if (!open) setSelectedHealthMetric(null);
  }, []);

  const handleReleaseClick = useCallback((release) => {
    setSelectedRelease(release);
    setReleaseDetailOpen(true);
  }, []);

  const handleReleaseDetailClose = useCallback((open) => {
    setReleaseDetailOpen(open);
    if (!open) setSelectedRelease(null);
  }, []);

  const handleIncidentClick = useCallback((incident) => {
    setSelectedIncident(incident);
    setIncidentDetailOpen(true);
  }, []);

  const handleIncidentDetailClose = useCallback((open) => {
    setIncidentDetailOpen(open);
    if (!open) setSelectedIncident(null);
  }, []);

  const handleFeedbackClick = useCallback((feedback) => {
    setSelectedFeedback(feedback);
    setFeedbackDetailOpen(true);
  }, []);

  const handleFeedbackDetailClose = useCallback((open) => {
    setFeedbackDetailOpen(open);
    if (!open) setSelectedFeedback(null);
  }, []);

  const handleExportCSV = useCallback(() => {
    try {
      const data = releaseOutcomes.map((r) => ({
        id: r.id,
        releaseId: r.releaseId,
        application: r.application,
        applicationName: r.applicationName,
        segment: r.segment,
        version: r.version,
        outcome: r.outcome,
        qualityScore: r.qualityScore,
        preDeployTestPassRate: r.preDeployTestPassRate,
        postDeployTestPassRate: r.postDeployTestPassRate,
        incidentCount: r.incidentCount,
        stabilizationStatus: r.stabilizationStatus,
        changeFailureCategory: r.changeFailureCategory,
        deployedBy: r.deployedBy,
        deployedAt: r.deployedAt,
      }));
      downloadCSV(data, 'post-deployment-releases.csv');
      logEvent('data_export', {
        action: 'Exported Post-Deployment Data',
        details: `Post-deployment release outcomes exported as CSV by ${currentPersona.name}. ${data.length} records.`,
        resource: '/analytics',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} release outcomes exported as CSV.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export post-deployment data.',
      });
    }
  }, [releaseOutcomes, currentPersona, logEvent, toast]);

  const handleExportJSON = useCallback(() => {
    try {
      const data = {
        releaseOutcomes: releaseOutcomes.map((r) => ({
          id: r.id,
          releaseId: r.releaseId,
          applicationName: r.applicationName,
          version: r.version,
          outcome: r.outcome,
          qualityScore: r.qualityScore,
          incidentCount: r.incidentCount,
          stabilizationStatus: r.stabilizationStatus,
        })),
        healthMetrics: healthMetrics.length,
        incidents: incidentCorrelations.length,
        feedbackLoops: feedbackLoops.length,
      };
      downloadJSON(data, 'post-deployment-monitoring.json');
      logEvent('data_export', {
        action: 'Exported Post-Deployment Data',
        details: `Post-deployment monitoring data exported as JSON by ${currentPersona.name}.`,
        resource: '/analytics',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: 'Post-deployment monitoring data exported as JSON.',
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export post-deployment data.',
      });
    }
  }, [releaseOutcomes, healthMetrics, incidentCorrelations, feedbackLoops, currentPersona, logEvent, toast]);

  const filteredHealthMetrics = useMemo(() => {
    if (!filters.segment) return healthMetrics;
    return healthMetrics.filter((m) => m.segment === filters.segment);
  }, [healthMetrics, filters.segment]);

  const filteredReleaseOutcomes = useMemo(() => {
    if (!filters.segment) return releaseOutcomes;
    return releaseOutcomes.filter((r) => r.segment === filters.segment);
  }, [releaseOutcomes, filters.segment]);

  const filteredIncidents = useMemo(() => {
    if (!filters.segment) return incidentCorrelations;
    return incidentCorrelations.filter((i) => i.segment === filters.segment);
  }, [incidentCorrelations, filters.segment]);

  const filteredFeedback = useMemo(() => {
    if (!filters.segment) return feedbackLoops;
    return feedbackLoops.filter((f) => f.segment === filters.segment);
  }, [feedbackLoops, filters.segment]);

  const kpiData = useMemo(() => {
    if (!aggregates) return [];

    const breachingMetrics = filteredHealthMetrics.filter((m) => m.status === 'critical' || m.status === 'degraded').length;
    const successfulReleases = filteredReleaseOutcomes.filter((r) => r.outcome === 'success').length;
    const totalReleases = filteredReleaseOutcomes.length;
    const successRate = totalReleases > 0 ? Math.round((successfulReleases / totalReleases) * 1000) / 10 : 0;
    const openIncidents = filteredIncidents.filter((i) => i.status === 'open' || i.status === 'investigating' || i.status === 'mitigated').length;
    const activeFeedback = filteredFeedback.filter((f) => f.status === 'new' || f.status === 'acknowledged' || f.status === 'in_progress').length;

    return [
      {
        id: 'kpi_health',
        label: 'Health Issues',
        value: breachingMetrics,
        unit: 'count',
        trend: breachingMetrics > 5 ? 'declining' : 'stable',
        status: breachingMetrics > 8 ? 'critical' : breachingMetrics > 3 ? 'at_risk' : 'on_track',
        description: 'Production health metrics in degraded or critical state.',
      },
      {
        id: 'kpi_success_rate',
        label: 'Release Success Rate',
        value: successRate,
        unit: 'percent',
        trend: successRate >= 80 ? 'improving' : successRate >= 60 ? 'stable' : 'declining',
        status: successRate >= 80 ? 'on_track' : successRate >= 60 ? 'at_risk' : 'critical',
        description: 'Percentage of releases with successful outcomes.',
      },
      {
        id: 'kpi_incidents',
        label: 'Open Incidents',
        value: openIncidents,
        unit: 'count',
        trend: openIncidents > 5 ? 'declining' : 'stable',
        status: openIncidents > 8 ? 'critical' : openIncidents > 3 ? 'at_risk' : 'on_track',
        description: 'Incidents currently open, investigating, or mitigated.',
      },
      {
        id: 'kpi_feedback',
        label: 'Active Feedback',
        value: activeFeedback,
        unit: 'count',
        trend: 'stable',
        status: activeFeedback > 8 ? 'at_risk' : 'on_track',
        description: 'Quality feedback loops requiring attention.',
      },
    ];
  }, [aggregates, filteredHealthMetrics, filteredReleaseOutcomes, filteredIncidents, filteredFeedback]);

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
  }, []);

  const insightData = useMemo(() => {
    if (!aggregates) return null;

    const criticalHealth = filteredHealthMetrics.filter((m) => m.status === 'critical').length;
    const degradedHealth = filteredHealthMetrics.filter((m) => m.status === 'degraded').length;
    const unstableReleases = filteredReleaseOutcomes.filter((r) => r.stabilizationStatus === 'unstable').length;
    const openIncidents = filteredIncidents.filter((i) => i.status === 'open' || i.status === 'investigating').length;

    if (criticalHealth > 0 || unstableReleases > 0) {
      return {
        variant: 'critical',
        title: `${criticalHealth} critical health metric${criticalHealth !== 1 ? 's' : ''} and ${unstableReleases} unstable release${unstableReleases !== 1 ? 's' : ''}`,
        message: `${criticalHealth} production health metrics are in critical state. ${unstableReleases} release${unstableReleases !== 1 ? 's are' : ' is'} unstable. ${openIncidents} incident${openIncidents !== 1 ? 's' : ''} under investigation. Immediate attention required.`,
        source: 'Incident Response Agent',
        confidence: 93,
      };
    }

    if (degradedHealth > 0 || openIncidents > 3) {
      return {
        variant: 'warning',
        title: `${degradedHealth} degraded metric${degradedHealth !== 1 ? 's' : ''} and ${openIncidents} open incident${openIncidents !== 1 ? 's' : ''}`,
        message: `${degradedHealth} production health metrics are degraded. ${openIncidents} incident${openIncidents !== 1 ? 's are' : ' is'} currently open. ${filteredFeedback.filter((f) => f.status === 'new' || f.status === 'in_progress').length} quality feedback items pending action.`,
        source: 'Incident Response Agent',
        confidence: 88,
      };
    }

    return {
      variant: 'success',
      title: 'Production health is stable',
      message: `All monitored production metrics are within acceptable thresholds. ${filteredReleaseOutcomes.filter((r) => r.outcome === 'success').length} out of ${filteredReleaseOutcomes.length} releases were successful. Average quality score: ${aggregates.averageQualityScore.toFixed(1)}.`,
      source: 'Incident Response Agent',
      confidence: 95,
    };
  }, [aggregates, filteredHealthMetrics, filteredReleaseOutcomes, filteredIncidents, filteredFeedback]);

  const healthColumns = useMemo(
    () => [
      {
        accessorKey: 'applicationName',
        header: 'Application',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleHealthMetricClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors"
          >
            {row.original.applicationName}
          </button>
        ),
      },
      {
        accessorKey: 'metricType',
        header: 'Metric',
        size: 120,
        cell: ({ row }) => (
          <Badge variant="outline" size="sm">{formatLabel(row.original.metricType)}</Badge>
        ),
      },
      {
        accessorKey: 'currentValue',
        header: 'Current',
        size: 100,
        cell: ({ row }) => (
          <span className="text-sm font-medium text-slate-900">
            {row.original.currentValue}
            {row.original.unit === 'percent' ? '%' : row.original.unit === 'milliseconds' ? 'ms' : ''}
          </span>
        ),
      },
      {
        accessorKey: 'threshold',
        header: 'Threshold',
        size: 100,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">
            {row.original.threshold}
            {row.original.unit === 'percent' ? '%' : row.original.unit === 'milliseconds' ? 'ms' : ''}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        cell: ({ row }) => (
          <Badge variant={getHealthStatusBadgeVariant(row.original.status)} size="sm">
            {formatLabel(row.original.status)}
          </Badge>
        ),
      },
      {
        accessorKey: 'segment',
        header: 'Segment',
        size: 100,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.segment}</span>
        ),
      },
      {
        accessorKey: 'trend',
        header: 'Trend',
        size: 100,
        cell: ({ row }) => {
          const trend = row.original.trend;
          return (
            <div className="flex items-center gap-1">
              {trend === 'improving' ? (
                <ArrowUpRight className="h-3 w-3 text-success-500" aria-hidden="true" />
              ) : trend === 'declining' ? (
                <ArrowDownRight className="h-3 w-3 text-danger-500" aria-hidden="true" />
              ) : (
                <Minus className="h-3 w-3 text-slate-400" aria-hidden="true" />
              )}
              <span className={cn(
                'text-xs font-medium capitalize',
                trend === 'improving' ? 'text-success-600' :
                trend === 'declining' ? 'text-danger-600' :
                'text-slate-500'
              )}>
                {trend}
              </span>
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
                onClick={() => handleHealthMetricClick(row.original)}
                className={cn(
                  'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                  'hover:bg-slate-100 hover:text-slate-600',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                )}
                aria-label={`View ${row.original.applicationName}`}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">View Details</TooltipContent>
          </UITooltip>
        ),
      },
    ],
    [handleHealthMetricClick]
  );

  const releaseColumns = useMemo(
    () => [
      {
        accessorKey: 'applicationName',
        header: 'Application',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleReleaseClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors"
          >
            {row.original.applicationName}
          </button>
        ),
      },
      {
        accessorKey: 'version',
        header: 'Version',
        size: 80,
        cell: ({ row }) => (
          <Badge variant="outline" size="sm">v{row.original.version}</Badge>
        ),
      },
      {
        accessorKey: 'outcome',
        header: 'Outcome',
        size: 120,
        cell: ({ row }) => (
          <Badge variant={getOutcomeBadgeVariant(row.original.outcome)} size="sm">
            {formatLabel(row.original.outcome)}
          </Badge>
        ),
      },
      {
        accessorKey: 'qualityScore',
        header: 'Quality',
        size: 80,
        cell: ({ row }) => (
          <span className="text-sm font-medium text-slate-900">{row.original.qualityScore.toFixed(1)}</span>
        ),
      },
      {
        accessorKey: 'incidentCount',
        header: 'Incidents',
        size: 80,
        cell: ({ row }) => {
          const count = row.original.incidentCount;
          return count > 0 ? (
            <Badge variant="error" size="sm">{count}</Badge>
          ) : (
            <span className="text-xs text-slate-400">0</span>
          );
        },
      },
      {
        accessorKey: 'stabilizationStatus',
        header: 'Stabilization',
        size: 120,
        cell: ({ row }) => (
          <Badge variant={getStabilizationBadgeVariant(row.original.stabilizationStatus)} size="sm">
            {formatLabel(row.original.stabilizationStatus)}
          </Badge>
        ),
      },
      {
        accessorKey: 'segment',
        header: 'Segment',
        size: 100,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.segment}</span>
        ),
      },
      {
        accessorKey: 'deployedAt',
        header: 'Deployed',
        size: 130,
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">{formatDate(row.original.deployedAt, 'MMM d, yyyy h:mm a')}</span>
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
                onClick={() => handleReleaseClick(row.original)}
                className={cn(
                  'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                  'hover:bg-slate-100 hover:text-slate-600',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                )}
                aria-label={`View ${row.original.applicationName} v${row.original.version}`}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">View Details</TooltipContent>
          </UITooltip>
        ),
      },
    ],
    [handleReleaseClick]
  );

  const incidentColumns = useMemo(
    () => [
      {
        accessorKey: 'incidentId',
        header: 'ID',
        size: 120,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleIncidentClick(row.original)}
            className="text-xs font-mono text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors"
          >
            {row.original.incidentId}
          </button>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <span className="text-sm text-slate-900 line-clamp-1">{row.original.title}</span>
        ),
      },
      {
        accessorKey: 'severity',
        header: 'Severity',
        size: 80,
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
        accessorKey: 'applicationName',
        header: 'Application',
        size: 150,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700 truncate block max-w-[150px]">{row.original.applicationName}</span>
        ),
      },
      {
        accessorKey: 'isReleaseRelated',
        header: 'Release',
        size: 90,
        cell: ({ row }) => (
          row.original.isReleaseRelated ? (
            <Badge variant="warning" size="sm">Related</Badge>
          ) : (
            <span className="text-xs text-slate-400">No</span>
          )
        ),
      },
      {
        accessorKey: 'assignee',
        header: 'Assignee',
        size: 120,
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
                onClick={() => handleIncidentClick(row.original)}
                className={cn(
                  'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                  'hover:bg-slate-100 hover:text-slate-600',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                )}
                aria-label={`View ${row.original.incidentId}`}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">View Details</TooltipContent>
          </UITooltip>
        ),
      },
    ],
    [handleIncidentClick]
  );

  const feedbackColumns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleFeedbackClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors line-clamp-2"
          >
            {row.original.title}
          </button>
        ),
      },
      {
        accessorKey: 'feedbackType',
        header: 'Type',
        size: 140,
        cell: ({ row }) => (
          <Badge variant={getFeedbackTypeBadgeVariant(row.original.feedbackType)} size="sm">
            {formatLabel(row.original.feedbackType)}
          </Badge>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        size: 90,
        cell: ({ row }) => (
          <Badge variant={getFeedbackPriorityBadgeVariant(row.original.priority)} size="sm">
            {row.original.priority}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        cell: ({ row }) => (
          <Badge variant={getFeedbackStatusBadgeVariant(row.original.status)} size="sm">
            {formatLabel(row.original.status)}
          </Badge>
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
        accessorKey: 'estimatedImpact',
        header: 'Impact',
        size: 70,
        cell: ({ row }) => (
          <span className="text-sm font-medium text-slate-900">{row.original.estimatedImpact}/10</span>
        ),
      },
      {
        accessorKey: 'assignee',
        header: 'Assignee',
        size: 120,
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
                onClick={() => handleFeedbackClick(row.original)}
                className={cn(
                  'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                  'hover:bg-slate-100 hover:text-slate-600',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                )}
                aria-label={`View ${row.original.title}`}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">View Details</TooltipContent>
          </UITooltip>
        ),
      },
    ],
    [handleFeedbackClick]
  );

  if (loading) {
    return <PostDeploymentMonitoringSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">Post-Deployment Monitoring</h1>
          <p className="text-sm text-slate-500">
            Release quality outcomes, production health, incident correlations, and quality feedback loops for {currentPersona.name}
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
          <TabsTrigger value="health">Health ({filteredHealthMetrics.length})</TabsTrigger>
          <TabsTrigger value="releases">Releases ({filteredReleaseOutcomes.length})</TabsTrigger>
          <TabsTrigger value="incidents">Incidents ({filteredIncidents.length})</TabsTrigger>
          <TabsTrigger value="feedback">Feedback ({filteredFeedback.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="flex flex-col gap-6">
            {/* Production Health Summary */}
            <PanelCard
              title="Production Health"
              subtitle={`${filteredHealthMetrics.length} metrics monitored`}
              icon={<Heart className="h-5 w-5" />}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredHealthMetrics.slice(0, 8).map((metric) => (
                  <Card
                    key={metric.id}
                    className={cn(
                      'p-3 cursor-pointer transition-all duration-200',
                      'hover:shadow-card-hover hover:border-humana-green-200',
                      'active:scale-[0.99]',
                      metric.status === 'critical' && 'border-danger-200',
                      metric.status === 'degraded' && 'border-warning-200'
                    )}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleHealthMetricClick(metric)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleHealthMetricClick(metric);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-xs font-medium text-slate-900 truncate">{metric.applicationName}</span>
                        <span className="text-2xs text-slate-500">{formatLabel(metric.metricType)}</span>
                      </div>
                      <Badge variant={getHealthStatusBadgeVariant(metric.status)} size="sm">
                        {formatLabel(metric.status)}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-end justify-between">
                      <span className={cn(
                        'text-lg font-semibold',
                        metric.status === 'healthy' ? 'text-success-600' :
                        metric.status === 'degraded' ? 'text-warning-600' :
                        'text-danger-600'
                      )}>
                        {metric.currentValue}
                        {metric.unit === 'percent' ? '%' : metric.unit === 'milliseconds' ? 'ms' : ''}
                      </span>
                      <span className="text-2xs text-slate-400">
                        Threshold: {metric.threshold}{metric.unit === 'percent' ? '%' : metric.unit === 'milliseconds' ? 'ms' : ''}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
              {filteredHealthMetrics.length > 8 ? (
                <p className="mt-3 text-xs text-slate-400 text-center">
                  +{filteredHealthMetrics.length - 8} more metrics. Switch to Health tab to see all.
                </p>
              ) : null}
            </PanelCard>

            {/* Recent Release Outcomes */}
            <PanelCard
              title="Recent Release Outcomes"
              subtitle={`${filteredReleaseOutcomes.length} releases tracked`}
              icon={<GitBranch className="h-5 w-5" />}
            >
              {filteredReleaseOutcomes.length === 0 ? (
                <EmptyState
                  type="no_data"
                  title="No release outcomes"
                  message="No release outcomes match the current filter criteria."
                  size="sm"
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredReleaseOutcomes.slice(0, 6).map((release) => (
                    <div
                      key={release.id}
                      className={cn(
                        'flex items-start gap-3 rounded-lg border p-4 transition-all duration-200 cursor-pointer',
                        'hover:shadow-card-hover hover:border-humana-green-200',
                        release.outcome === 'success' ? 'border-success-200 bg-success-50/10' :
                        release.outcome === 'partial_success' ? 'border-warning-200 bg-warning-50/10' :
                        'border-danger-200 bg-danger-50/10'
                      )}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleReleaseClick(release)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleReleaseClick(release);
                        }
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <p className="text-sm font-medium text-slate-900">
                              {release.applicationName} <span className="text-slate-500">v{release.version}</span>
                            </p>
                            <span className="text-2xs text-slate-500">
                              {release.segment} • Deployed by {release.deployedBy} • {formatDate(release.deployedAt, 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge variant={getOutcomeBadgeVariant(release.outcome)} size="sm">
                              {formatLabel(release.outcome)}
                            </Badge>
                            <Badge variant={getStabilizationBadgeVariant(release.stabilizationStatus)} size="sm">
                              {formatLabel(release.stabilizationStatus)}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                          <span>Quality: <span className="font-medium text-slate-700">{release.qualityScore.toFixed(1)}</span></span>
                          <span>Pre: <span className="font-medium text-slate-700">{release.preDeployTestPassRate.toFixed(1)}%</span></span>
                          <span>Post: <span className="font-medium text-slate-700">{release.postDeployTestPassRate.toFixed(1)}%</span></span>
                          {release.incidentCount > 0 ? (
                            <Badge variant="error" size="sm">{release.incidentCount} incident{release.incidentCount !== 1 ? 's' : ''}</Badge>
                          ) : null}
                        </div>
                        {release.postDeployIssues && release.postDeployIssues.length > 0 ? (
                          <div className="mt-1.5 text-2xs text-slate-400">
                            {release.postDeployIssues.length} post-deploy issue{release.postDeployIssues.length !== 1 ? 's' : ''}
                          </div>
                        ) : null}
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-2" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              )}
            </PanelCard>

            {/* Open Incidents */}
            <PanelCard
              title="Open Incidents"
              subtitle={`${filteredIncidents.filter((i) => i.status === 'open' || i.status === 'investigating' || i.status === 'mitigated').length} incidents requiring attention`}
              icon={<AlertTriangle className="h-5 w-5" />}
            >
              {filteredIncidents.filter((i) => i.status === 'open' || i.status === 'investigating' || i.status === 'mitigated').length === 0 ? (
                <EmptyState
                  type="no_data"
                  title="No open incidents"
                  message="All incidents have been resolved."
                  size="sm"
                  icon={<CheckCircle className="h-8 w-8 text-success-300" />}
                />
              ) : (
                <div className="flex flex-col gap-2">
                  {filteredIncidents
                    .filter((i) => i.status === 'open' || i.status === 'investigating' || i.status === 'mitigated')
                    .slice(0, 5)
                    .map((incident) => (
                      <div
                        key={incident.id}
                        className={cn(
                          'flex items-start gap-3 rounded-lg border p-3 transition-all duration-200 cursor-pointer',
                          'hover:shadow-card-hover hover:border-humana-green-200',
                          incident.severity === 'P1' ? 'border-danger-200 bg-danger-50/10' :
                          incident.severity === 'P2' ? 'border-danger-200 bg-danger-50/5' :
                          'border-warning-200 bg-warning-50/10'
                        )}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleIncidentClick(incident)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleIncidentClick(incident);
                          }
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <span className="text-xs font-mono text-slate-500">{incident.incidentId}</span>
                              <p className="text-sm font-medium text-slate-900 line-clamp-1">{incident.title}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Badge variant={getSeverityBadgeVariant(incident.severity)} size="sm">
                                {incident.severity}
                              </Badge>
                              <StatusPill status={incident.status} size="sm" />
                            </div>
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-2xs text-slate-400">
                            <span>{incident.applicationName}</span>
                            <span>Assignee: {incident.assignee}</span>
                            {incident.isReleaseRelated ? (
                              <Badge variant="warning" size="sm">Release Related</Badge>
                            ) : null}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-2" aria-hidden="true" />
                      </div>
                    ))}
                </div>
              )}
            </PanelCard>

            {/* Quality Feedback Loops */}
            <PanelCard
              title="Quality Feedback Loops"
              subtitle={`${filteredFeedback.length} feedback items tracked`}
              icon={<Lightbulb className="h-5 w-5" />}
              collapsible
              defaultCollapsed={false}
            >
              {filteredFeedback.length === 0 ? (
                <EmptyState
                  type="no_data"
                  title="No feedback loops"
                  message="No quality feedback loops match the current filter criteria."
                  size="sm"
                />
              ) : (
                <div className="flex flex-col gap-2">
                  {filteredFeedback.slice(0, 5).map((feedback) => (
                    <div
                      key={feedback.id}
                      className={cn(
                        'flex items-start gap-3 rounded-lg border border-slate-200 p-3 transition-all duration-200 cursor-pointer',
                        'hover:shadow-card-hover hover:border-humana-green-200'
                      )}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleFeedbackClick(feedback)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleFeedbackClick(feedback);
                        }
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-slate-900 line-clamp-1">{feedback.title}</p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge variant={getFeedbackTypeBadgeVariant(feedback.feedbackType)} size="sm">
                              {formatLabel(feedback.feedbackType)}
                            </Badge>
                            <Badge variant={getFeedbackPriorityBadgeVariant(feedback.priority)} size="sm">
                              {feedback.priority}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-2xs text-slate-400">
                          <span>{feedback.applicationName}</span>
                          <span>v{feedback.releaseVersion}</span>
                          <Badge variant={getFeedbackStatusBadgeVariant(feedback.status)} size="sm">
                            {formatLabel(feedback.status)}
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-2" aria-hidden="true" />
                    </div>
                  ))}
                  {filteredFeedback.length > 5 ? (
                    <p className="text-xs text-slate-400 text-center mt-1">
                      +{filteredFeedback.length - 5} more. Switch to Feedback tab to see all.
                    </p>
                  ) : null}
                </div>
              )}
            </PanelCard>
          </div>
        </TabsContent>

        <TabsContent value="health">
          {filteredHealthMetrics.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No health metrics found"
              message="No production health metrics match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={healthColumns}
              data={filteredHealthMetrics}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search health metrics..."
              emptyMessage="No health metrics match the search criteria."
              onRowClick={handleHealthMetricClick}
            />
          )}
        </TabsContent>

        <TabsContent value="releases">
          {filteredReleaseOutcomes.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No release outcomes found"
              message="No release outcomes match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={releaseColumns}
              data={filteredReleaseOutcomes}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search releases..."
              emptyMessage="No releases match the search criteria."
              onRowClick={handleReleaseClick}
            />
          )}
        </TabsContent>

        <TabsContent value="incidents">
          {filteredIncidents.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No incidents found"
              message="No incident correlations match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={incidentColumns}
              data={filteredIncidents}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search incidents..."
              emptyMessage="No incidents match the search criteria."
              onRowClick={handleIncidentClick}
            />
          )}
        </TabsContent>

        <TabsContent value="feedback">
          {filteredFeedback.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No feedback loops found"
              message="No quality feedback loops match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={feedbackColumns}
              data={filteredFeedback}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search feedback..."
              emptyMessage="No feedback items match the search criteria."
              onRowClick={handleFeedbackClick}
            />
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {filteredHealthMetrics.length === 0 && filteredReleaseOutcomes.length === 0 ? (
            <EmptyState
              type="no_chart"
              title="No data for analytics"
              message="No post-deployment data available to generate analytics."
              size="lg"
              bordered
            />
          ) : (
            <AnalyticsPanel
              healthMetrics={filteredHealthMetrics}
              releaseOutcomes={filteredReleaseOutcomes}
              incidentCorrelations={filteredIncidents}
              feedbackLoops={filteredFeedback}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Panel */}
      {aggregates ? (
        <PanelCard
          title="Post-Deployment Summary"
          subtitle="Aggregate metrics across all post-deployment monitoring data"
          icon={<Activity className="h-5 w-5" />}
          collapsible
          defaultCollapsed
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Health Metrics</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.totalProductionHealthMetrics}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Releases</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.totalReleaseOutcomes}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg Quality</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.averageQualityScore.toFixed(1)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Total Incidents</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.totalIncidents}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Release Related</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.releaseRelatedIncidents}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Feedback Loops</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.totalFeedbackLoops}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Change Failure Rate</span>
              <span className="text-lg font-semibold text-slate-900">{aggregates.averageChangeFailureRate.toFixed(1)}%</span>
              <Progress
                value={100 - aggregates.averageChangeFailureRate}
                max={100}
                variant="auto"
                size="sm"
                animate
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Average MTTR</span>
              <span className="text-lg font-semibold text-slate-900">{aggregates.averageMTTR}m</span>
              <Progress
                value={Math.max(0, 100 - (aggregates.averageMTTR / 2))}
                max={100}
                variant="auto"
                size="sm"
                animate
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Release Outcome Breakdown</h4>
            <div className="flex flex-col gap-2">
              {Object.entries(aggregates.releaseOutcomeBreakdown || {}).map(([outcome, count]) => (
                <div key={outcome} className="flex items-center gap-3">
                  <div className="w-28 shrink-0">
                    <Badge variant={getOutcomeBadgeVariant(outcome)} size="sm">
                      {formatLabel(outcome)}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={count}
                      max={aggregates.totalReleaseOutcomes || 1}
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
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Incident Severity Breakdown</h4>
            <div className="flex flex-col gap-2">
              {Object.entries(aggregates.incidentSeverityBreakdown || {}).map(([severity, count]) => (
                <div key={severity} className="flex items-center gap-3">
                  <div className="w-16 shrink-0">
                    <Badge variant={getSeverityBadgeVariant(severity)} size="sm">
                      {severity}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={count}
                      max={aggregates.totalIncidents || 1}
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
        </PanelCard>
      ) : null}

      {/* Detail Dialogs */}
      <HealthMetricDetailDialog
        metric={selectedHealthMetric}
        open={healthDetailOpen}
        onOpenChange={handleHealthDetailClose}
      />

      <ReleaseOutcomeDetailDialog
        releaseOutcome={selectedRelease}
        open={releaseDetailOpen}
        onOpenChange={handleReleaseDetailClose}
      />

      <IncidentDetailDialog
        incident={selectedIncident}
        open={incidentDetailOpen}
        onOpenChange={handleIncidentDetailClose}
      />

      <FeedbackLoopDetailDialog
        feedback={selectedFeedback}
        open={feedbackDetailOpen}
        onOpenChange={handleFeedbackDetailClose}
      />
    </div>
  );
}

PostDeploymentMonitoringPage.displayName = 'PostDeploymentMonitoringPage';

export { PostDeploymentMonitoringPage };
export default PostDeploymentMonitoringPage;