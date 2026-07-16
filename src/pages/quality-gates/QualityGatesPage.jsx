import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BarChart,
  Bar,
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
  Shield,
  ShieldCheck,
  CheckCircle2,
  FileWarning,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  Edit,
  FileText,
  BarChart2,
  Layers,
  ChevronRight,
  User,
  Calendar,
  Clock,
  Target,
  Zap,
  Lock,
  Unlock,
  Settings,
  Plus,
  Info,
  ThumbsUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation, usePageHeader } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import {
  getQualityGates,
} from '@/lib/mock-api/mockService';
import {
  getAllQualityGateStatuses,
  getAllQualityGateSegments,
  getQualityGateAggregates,
} from '@/data/qualityGates';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { ChartWrapper } from '@/components/shared/ChartWrapper';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusPill } from '@/components/shared/StatusPill';
import { EmptyState } from '@/components/shared/EmptyState';
import { DataTable } from '@/components/shared/DataTable';
import { PermissionGate } from '@/components/shared/PermissionGate';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { InsightBanner } from '@/components/shared/InsightBanner';
import { PageActions } from '@/components/layout/PageActions';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Progress } from '@/components/ui/Progress';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
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
import { PERMISSIONS, ROUTES } from '@/lib/constants';

const STATUS_COLORS = {
  passed: '#10b981',
  failed: '#ef4444',
  waived: '#f59e0b',
  pending: '#3b82f6',
};

const SEGMENT_COLORS = {
  Enterprise: '#16b364',
  Medicare: '#3b82f6',
  Medicaid: '#f59e0b',
  Commercial: '#8b5cf6',
  External: '#ef4444',
  Compliance: '#06b6d4',
};

const GATE_CRITERIA_COLORS = {
  passed: '#10b981',
  failed: '#ef4444',
  waived: '#f59e0b',
  pending: '#a3a3a3',
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
          {entry.name}: {typeof entry.value === 'number' ? entry.value : entry.value}
          {unit}
        </p>
      ))}
    </div>
  );
}

function getOverallStatusBadgeVariant(status) {
  switch (status) {
    case 'passed':
      return 'success';
    case 'failed':
      return 'error';
    case 'waived':
      return 'warning';
    case 'pending':
      return 'info';
    default:
      return 'neutral';
  }
}

function getCriteriaStatusIcon(status) {
  switch (status) {
    case 'passed':
      return CheckCircle;
    case 'failed':
      return XCircle;
    case 'waived':
      return AlertTriangle;
    case 'pending':
      return Clock;
    default:
      return Info;
  }
}

function getCriteriaStatusColor(status) {
  switch (status) {
    case 'passed':
      return 'text-success-500';
    case 'failed':
      return 'text-danger-500';
    case 'waived':
      return 'text-warning-500';
    case 'pending':
      return 'text-info-500';
    default:
      return 'text-slate-400';
  }
}

function getThresholdComparisonColor(actual, threshold, isLowerBetter) {
  if (isLowerBetter) {
    if (actual <= threshold) return 'text-success-600';
    return 'text-danger-600';
  }
  if (actual >= threshold) return 'text-success-600';
  return 'text-danger-600';
}

function WaiverDialog({ open, onOpenChange, onSubmit, loading, qualityGate, gateCriteriaName }) {
  const { currentPersona } = usePersona();
  const [formData, setFormData] = useState({
    reason: '',
    expirationDate: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormData({
        reason: '',
        expirationDate: '',
      });
      setErrors({});
    }
  }, [open]);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleInputChange = useCallback(
    (field) => (e) => {
      handleChange(field, e.target.value);
    },
    [handleChange]
  );

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.reason.trim()) {
      newErrors.reason = 'Waiver reason is required';
    }
    if (!formData.expirationDate.trim()) {
      newErrors.expirationDate = 'Expiration date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    onSubmit({
      gateName: gateCriteriaName || '',
      reason: formData.reason,
      approvedBy: currentPersona.name,
      approvedDate: new Date().toISOString().split('T')[0],
      expirationDate: formData.expirationDate,
    });
  }, [formData, validate, onSubmit, gateCriteriaName, currentPersona.name]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Waiver</DialogTitle>
          <DialogDescription>
            Request a waiver for &ldquo;{gateCriteriaName || 'gate criteria'}&rdquo;
            {qualityGate ? ` on ${qualityGate.name}` : ''}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium leading-none text-slate-700">
              Reason <span className="ml-0.5 text-danger-500" aria-hidden="true">*</span>
            </label>
            <textarea
              className={cn(
                'flex min-h-[100px] w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 transition-colors duration-200',
                'placeholder:text-slate-400',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                'hover:border-slate-400',
                errors.reason
                  ? 'border-danger-500 hover:border-danger-600 focus-visible:ring-danger-500'
                  : 'border-slate-300 focus-visible:border-humana-green-500'
              )}
              placeholder="Provide a detailed justification for the waiver..."
              value={formData.reason}
              onChange={handleInputChange('reason')}
              rows={4}
            />
            {errors.reason ? (
              <p className="text-xs text-danger-500" role="alert">{errors.reason}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium leading-none text-slate-700">
              Expiration Date <span className="ml-0.5 text-danger-500" aria-hidden="true">*</span>
            </label>
            <input
              type="date"
              value={formData.expirationDate}
              onChange={handleInputChange('expirationDate')}
              className={cn(
                'flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                'hover:border-slate-400',
                errors.expirationDate && 'border-danger-500'
              )}
            />
            {errors.expirationDate ? (
              <p className="text-xs text-danger-500" role="alert">{errors.expirationDate}</p>
            ) : null}
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" size="md" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit} loading={loading}>
            Submit Waiver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function QualityGateDetailDialog({ qualityGate, open, onOpenChange, onWaive }) {
  const { hasPermission } = usePersona();
  const [activeTab, setActiveTab] = useState('criteria');

  useEffect(() => {
    if (open) {
      setActiveTab('criteria');
    }
  }, [open]);

  if (!qualityGate) return null;

  const gates = qualityGate.gates || [];
  const waivers = qualityGate.waivers || [];
  const passedCount = gates.filter((g) => g.status === 'passed').length;
  const failedCount = gates.filter((g) => g.status === 'failed').length;
  const waivedCount = gates.filter((g) => g.status === 'waived').length;
  const pendingCount = gates.filter((g) => g.status === 'pending').length;

  const canWaive = hasPermission(PERMISSIONS.EDIT_QUALITY_GATES);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Shield className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{qualityGate.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {qualityGate.application} • Release {qualityGate.release} • {qualityGate.segment}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill status={qualityGate.overallStatus} size="md" dot />
          <Badge variant="outline" size="md">
            {qualityGate.segment}
          </Badge>
          <Badge variant="outline" size="md">
            v{qualityGate.release}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Passed</span>
            <p className="mt-1 text-lg font-semibold text-success-600">{passedCount}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Failed</span>
            <p className="mt-1 text-lg font-semibold text-danger-600">{failedCount}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Waived</span>
            <p className="mt-1 text-lg font-semibold text-warning-600">{waivedCount}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Total Criteria</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{gates.length}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Configured By:</span>
            <span className="font-medium text-slate-900">{qualityGate.configuredBy}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Last Evaluated:</span>
            <span className="font-medium text-slate-900">{formatDate(qualityGate.lastEvaluated)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Application:</span>
            <span className="font-medium text-slate-900">{qualityGate.application}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500">Gate Pass Rate</span>
            <span className="text-xs font-semibold text-slate-900">
              {gates.length > 0 ? Math.round(((passedCount + waivedCount) / gates.length) * 100) : 0}%
            </span>
          </div>
          <Progress
            value={passedCount + waivedCount}
            max={gates.length || 1}
            variant="auto"
            size="md"
            animate
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="criteria">Gate Criteria ({gates.length})</TabsTrigger>
            <TabsTrigger value="waivers">Waivers ({waivers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="criteria">
            <div className="flex flex-col gap-2 pt-2">
              {gates.length === 0 ? (
                <EmptyState
                  type="no_data"
                  title="No gate criteria"
                  message="No gate criteria configured for this quality gate."
                  size="sm"
                />
              ) : (
                <div className="flex flex-col gap-2">
                  {gates.map((gate, index) => {
                    const StatusIcon = getCriteriaStatusIcon(gate.status);
                    const statusColor = getCriteriaStatusColor(gate.status);
                    const isLowerBetter = gate.name.toLowerCase().includes('defect') || gate.name.toLowerCase().includes('critical');
                    const meetsThreshold = isLowerBetter
                      ? gate.actual <= gate.threshold
                      : gate.actual >= gate.threshold;

                    return (
                      <div
                        key={index}
                        className={cn(
                          'rounded-lg border p-4 transition-colors duration-200',
                          gate.status === 'passed' ? 'border-success-200 bg-success-50/20' :
                          gate.status === 'failed' ? 'border-danger-200 bg-danger-50/20' :
                          gate.status === 'waived' ? 'border-warning-200 bg-warning-50/20' :
                          'border-slate-200'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            <StatusIcon
                              className={cn('h-5 w-5 shrink-0 mt-0.5', statusColor)}
                              aria-hidden="true"
                            />
                            <div className="flex flex-col gap-1 min-w-0">
                              <span className="text-sm font-medium text-slate-900">{gate.name}</span>
                              <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-1">
                                  <span className="text-2xs text-slate-400">Threshold:</span>
                                  <span className="text-xs font-semibold text-slate-700">
                                    {gate.threshold}
                                    {gate.name.toLowerCase().includes('rate') || gate.name.toLowerCase().includes('coverage') || gate.name.toLowerCase().includes('compliance') || gate.name.toLowerCase().includes('sla') || gate.name.toLowerCase().includes('accuracy') || gate.name.toLowerCase().includes('enforcement') ? '%' : ''}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-2xs text-slate-400">Actual:</span>
                                  <span className={cn(
                                    'text-xs font-semibold',
                                    meetsThreshold ? 'text-success-600' : 'text-danger-600'
                                  )}>
                                    {gate.actual}
                                    {gate.name.toLowerCase().includes('rate') || gate.name.toLowerCase().includes('coverage') || gate.name.toLowerCase().includes('compliance') || gate.name.toLowerCase().includes('sla') || gate.name.toLowerCase().includes('accuracy') || gate.name.toLowerCase().includes('enforcement') ? '%' : ''}
                                  </span>
                                </div>
                              </div>
                              <Progress
                                value={gate.actual}
                                max={Math.max(gate.threshold, gate.actual, 100)}
                                variant={meetsThreshold ? 'success' : 'error'}
                                size="xs"
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <StatusPill status={gate.status} size="sm" />
                            {canWaive && gate.status === 'failed' ? (
                              <UITooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onWaive(qualityGate, gate.name);
                                    }}
                                    className={cn(
                                      'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                                      'hover:bg-slate-100 hover:text-slate-600',
                                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                                    )}
                                    aria-label={`Waive ${gate.name}`}
                                  >
                                    <Unlock className="h-3.5 w-3.5" aria-hidden="true" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Request Waiver</TooltipContent>
                              </UITooltip>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="waivers">
            <div className="flex flex-col gap-2 pt-2">
              {waivers.length === 0 ? (
                <EmptyState
                  type="no_data"
                  title="No active waivers"
                  message="No waivers have been granted for this quality gate."
                  size="sm"
                  icon={<CheckCircle className="h-8 w-8 text-success-300" />}
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {waivers.map((waiver) => (
                    <div
                      key={waiver.id}
                      className="rounded-lg border border-warning-200 bg-warning-50/20 p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-warning-500 shrink-0" aria-hidden="true" />
                            <span className="text-sm font-semibold text-slate-900">{waiver.gateName}</span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed mt-1">{waiver.reason}</p>
                        </div>
                        <Badge variant="warning" size="sm">Waived</Badge>
                      </div>
                      <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-slate-400 shrink-0" aria-hidden="true" />
                          <span>Approved by: <span className="font-medium text-slate-700">{waiver.approvedBy}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-slate-400 shrink-0" aria-hidden="true" />
                          <span>Approved: <span className="font-medium text-slate-700">{formatDate(waiver.approvedDate)}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-slate-400 shrink-0" aria-hidden="true" />
                          <span>Expires: <span className="font-medium text-slate-700">{formatDate(waiver.expirationDate)}</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function AnalyticsPanel({ qualityGates }) {
  const statusData = useMemo(() => {
    const counts = {};
    for (const qg of qualityGates) {
      counts[qg.overallStatus] = (counts[qg.overallStatus] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: status.charAt(0).toUpperCase() + status.slice(1),
    }));
  }, [qualityGates]);

  const segmentData = useMemo(() => {
    const segments = {};
    for (const qg of qualityGates) {
      if (!segments[qg.segment]) {
        segments[qg.segment] = { passed: 0, failed: 0, waived: 0, total: 0 };
      }
      segments[qg.segment].total++;
      if (qg.overallStatus === 'passed') segments[qg.segment].passed++;
      else if (qg.overallStatus === 'failed') segments[qg.segment].failed++;
      else if (qg.overallStatus === 'waived') segments[qg.segment].waived++;
    }
    return Object.entries(segments).map(([segment, data]) => ({
      segment,
      ...data,
    }));
  }, [qualityGates]);

  const criteriaStatusData = useMemo(() => {
    const counts = { passed: 0, failed: 0, waived: 0, pending: 0 };
    for (const qg of qualityGates) {
      for (const gate of qg.gates || []) {
        if (counts[gate.status] !== undefined) {
          counts[gate.status]++;
        }
      }
    }
    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({
        status,
        count,
        label: status.charAt(0).toUpperCase() + status.slice(1),
      }));
  }, [qualityGates]);

  const waiverData = useMemo(() => {
    const withWaivers = qualityGates.filter((qg) => qg.waivers && qg.waivers.length > 0).length;
    const withoutWaivers = qualityGates.length - withWaivers;
    return [
      { label: 'With Waivers', count: withWaivers },
      { label: 'No Waivers', count: withoutWaivers },
    ];
  }, [qualityGates]);

  const configuredByData = useMemo(() => {
    const counts = {};
    for (const qg of qualityGates) {
      counts[qg.configuredBy] = (counts[qg.configuredBy] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [qualityGates]);

  const passRateBySegment = useMemo(() => {
    const segments = {};
    for (const qg of qualityGates) {
      if (!segments[qg.segment]) {
        segments[qg.segment] = { passed: 0, total: 0 };
      }
      segments[qg.segment].total++;
      if (qg.overallStatus === 'passed') {
        segments[qg.segment].passed++;
      }
    }
    return Object.entries(segments).map(([segment, data]) => ({
      segment,
      passRate: data.total > 0 ? Math.round((data.passed / data.total) * 100) : 0,
    }));
  }, [qualityGates]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PanelCard
        title="Quality Gates by Status"
        subtitle="Distribution across gate statuses"
        icon={<BarChart2 className="h-5 w-5" />}
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
                  nameKey="label"
                  stroke="none"
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} gates`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {statusData.map((item) => (
              <div key={item.status} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[item.status] || '#a3a3a3' }}
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
        title="Gates by Segment"
        subtitle="Passed vs failed by organizational segment"
        icon={<Layers className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={segmentData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
              <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" iconSize={8} />
              <Bar dataKey="passed" name="Passed" fill="#10b981" radius={[3, 3, 0, 0]} barSize={16} stackId="a" />
              <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[0, 0, 0, 0]} barSize={16} stackId="a" />
              <Bar dataKey="waived" name="Waived" fill="#f59e0b" radius={[0, 0, 0, 0]} barSize={16} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Gate Criteria Status"
        subtitle="Individual criteria pass/fail distribution"
        icon={<Target className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={criteriaStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {criteriaStatusData.map((entry) => (
                    <Cell key={entry.status} fill={GATE_CRITERIA_COLORS[entry.status] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} criteria`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {criteriaStatusData.map((item) => (
              <div key={item.status} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: GATE_CRITERIA_COLORS[item.status] || '#a3a3a3' }}
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
        title="Waiver Distribution"
        subtitle="Quality gates with and without active waivers"
        icon={<AlertTriangle className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={waiverData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  <Cell fill="#f59e0b" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} gates`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {waiverData.map((item, index) => (
              <div key={item.label} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: index === 0 ? '#f59e0b' : '#10b981' }}
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
        title="Pass Rate by Segment"
        subtitle="Quality gate pass rate across segments"
        icon={<Shield className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {passRateBySegment.map((item) => (
            <div key={item.segment} className="flex items-center gap-3">
              <div className="w-24 shrink-0">
                <span className="text-sm font-medium text-slate-700">{item.segment}</span>
              </div>
              <div className="flex-1">
                <Progress
                  value={item.passRate}
                  max={100}
                  variant="auto"
                  size="sm"
                  animate
                />
              </div>
              <span className="text-sm font-semibold text-slate-900 w-12 text-right">{item.passRate}%</span>
            </div>
          ))}
        </div>
      </PanelCard>

      <PanelCard
        title="Configured By"
        subtitle="Quality gates by configurer"
        icon={<User className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {configuredByData.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div className="w-32 shrink-0 truncate">
                <span className="text-sm font-medium text-slate-700">{item.name}</span>
              </div>
              <div className="flex-1">
                <Progress
                  value={item.count}
                  max={qualityGates.length || 1}
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

function QualityGatesPageSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading quality gates" aria-busy="true">
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
 * Quality Gates page component.
 * Displays quality gate configurations per release/application with gate criteria,
 * overall status, and waiver management. Supports configure, monitor, and waive
 * actions (simulated). All data from mockService.
 *
 * @returns {React.ReactElement}
 */
function QualityGatesPage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();

  usePageHeader({ title: 'Quality Gates', subtitle: `Quality gate configurations, criteria monitoring, and waiver management for ${currentPersona.name}` });

  const [loading, setLoading] = useState(true);
  const [qualityGates, setQualityGates] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedGate, setSelectedGate] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [waiverOpen, setWaiverOpen] = useState(false);
  const [waiverLoading, setWaiverLoading] = useState(false);
  const [waiverTarget, setWaiverTarget] = useState(null);
  const [waiverCriteriaName, setWaiverCriteriaName] = useState('');
  const [filters, setFilters] = useState({
    overallStatus: '',
    segment: '',
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Measures', path: ROUTES.MEASURES },
      { label: 'Quality Gates' },
    ]);
  }, [setBreadcrumbs]);

  const loadQualityGates = useCallback(async () => {
    setLoading(true);
    try {
      const filterParams = {};
      if (filters.overallStatus) filterParams.overallStatus = filters.overallStatus;
      if (filters.segment) filterParams.segment = filters.segment;
      const data = await getQualityGates(filterParams);
      setQualityGates(data);
    } catch {
      setQualityGates([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadQualityGates();
  }, [loadQualityGates]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    loadQualityGates();
  }, [loadQualityGates]);

  const handleGateClick = useCallback((gate) => {
    setSelectedGate(gate);
    setDetailOpen(true);
  }, []);

  const handleDetailClose = useCallback((open) => {
    setDetailOpen(open);
    if (!open) {
      setSelectedGate(null);
    }
  }, []);

  const handleWaiveClick = useCallback((gate, criteriaName) => {
    setWaiverTarget(gate);
    setWaiverCriteriaName(criteriaName);
    setDetailOpen(false);
    setSelectedGate(null);
    setWaiverOpen(true);
  }, []);

  const handleWaiverSubmit = useCallback(
    (waiverData) => {
      setWaiverLoading(true);
      setTimeout(() => {
        logEvent('quality_gate_update', {
          action: 'Quality Gate Waiver Requested',
          details: `Waiver requested for "${waiverData.gateName}" on ${waiverTarget ? waiverTarget.name : 'quality gate'} by ${currentPersona.name}. Reason: ${waiverData.reason}. Expires: ${waiverData.expirationDate}.`,
          resource: waiverTarget ? waiverTarget.id : '',
          outcome: 'success',
          segment: waiverTarget ? waiverTarget.segment : '',
        });
        toast({
          variant: 'success',
          title: 'Waiver Submitted',
          description: `Waiver for "${waiverData.gateName}" has been submitted for approval.`,
        });
        setWaiverOpen(false);
        setWaiverTarget(null);
        setWaiverCriteriaName('');
        setWaiverLoading(false);
      }, 500);
    },
    [waiverTarget, currentPersona, logEvent, toast]
  );

  const handleExportCSV = useCallback(() => {
    try {
      const data = qualityGates.map((qg) => ({
        id: qg.id,
        name: qg.name,
        release: qg.release,
        application: qg.application,
        segment: qg.segment,
        overallStatus: qg.overallStatus,
        totalCriteria: qg.gates ? qg.gates.length : 0,
        passedCriteria: qg.gates ? qg.gates.filter((g) => g.status === 'passed').length : 0,
        failedCriteria: qg.gates ? qg.gates.filter((g) => g.status === 'failed').length : 0,
        waivedCriteria: qg.gates ? qg.gates.filter((g) => g.status === 'waived').length : 0,
        waivers: qg.waivers ? qg.waivers.length : 0,
        configuredBy: qg.configuredBy,
        lastEvaluated: qg.lastEvaluated,
      }));
      downloadCSV(data, 'quality-gates.csv');
      logEvent('data_export', {
        action: 'Exported Quality Gates',
        details: `Quality gates exported as CSV by ${currentPersona.name}. ${data.length} records.`,
        resource: '/measures',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} quality gates exported as CSV.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export quality gates.',
      });
    }
  }, [qualityGates, currentPersona, logEvent, toast]);

  const handleExportJSON = useCallback(() => {
    try {
      const data = qualityGates.map((qg) => ({
        id: qg.id,
        name: qg.name,
        release: qg.release,
        application: qg.application,
        segment: qg.segment,
        overallStatus: qg.overallStatus,
        totalCriteria: qg.gates ? qg.gates.length : 0,
        passedCriteria: qg.gates ? qg.gates.filter((g) => g.status === 'passed').length : 0,
        failedCriteria: qg.gates ? qg.gates.filter((g) => g.status === 'failed').length : 0,
        waivers: qg.waivers ? qg.waivers.length : 0,
        configuredBy: qg.configuredBy,
        lastEvaluated: qg.lastEvaluated,
      }));
      downloadJSON(data, 'quality-gates.json');
      logEvent('data_export', {
        action: 'Exported Quality Gates',
        details: `Quality gates exported as JSON by ${currentPersona.name}. ${data.length} records.`,
        resource: '/measures',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} quality gates exported as JSON.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export quality gates.',
      });
    }
  }, [qualityGates, currentPersona, logEvent, toast]);

  const kpiData = useMemo(() => {
    const total = qualityGates.length;
    const passed = qualityGates.filter((qg) => qg.overallStatus === 'passed').length;
    const failed = qualityGates.filter((qg) => qg.overallStatus === 'failed').length;
    const withWaivers = qualityGates.filter((qg) => qg.waivers && qg.waivers.length > 0).length;
    const passRate = total > 0 ? Math.round((passed / total) * 1000) / 10 : 0;
    const totalCriteria = qualityGates.reduce((sum, qg) => sum + (qg.gates ? qg.gates.length : 0), 0);

    return [
      {
        id: 'kpi_total',
        label: 'Total Quality Gates',
        value: total,
        unit: 'count',
        trend: 'stable',
        icon: <ShieldCheck />,
        tone: 'blue',
        description: 'Total quality gates configured across all releases.',
      },
      {
        id: 'kpi_pass_rate',
        label: 'Pass Rate',
        value: passRate,
        unit: 'percent',
        trend: passRate >= 70 ? 'improving' : passRate >= 50 ? 'stable' : 'declining',
        icon: <CheckCircle2 />,
        tone: 'green',
        description: 'Percentage of quality gates that passed.',
      },
      {
        id: 'kpi_failed',
        label: 'Failed Gates',
        value: failed,
        unit: 'count',
        trend: failed > 5 ? 'declining' : 'stable',
        icon: <XCircle />,
        tone: 'red',
        description: 'Number of quality gates that failed.',
      },
      {
        id: 'kpi_waivers',
        label: 'Active Waivers',
        value: withWaivers,
        unit: 'count',
        trend: withWaivers > 5 ? 'declining' : 'stable',
        icon: <FileWarning />,
        tone: 'orange',
        description: 'Quality gates with active waivers.',
      },
    ];
  }, [qualityGates]);

  const filterFields = useMemo(() => {
    const statusOptions = getAllQualityGateStatuses().map((s) => ({
      value: s,
      label: s.charAt(0).toUpperCase() + s.slice(1),
    }));

    return [
      {
        id: 'overallStatus',
        label: 'Status',
        type: 'select',
        options: [{ value: '', label: 'All Statuses' }, ...statusOptions],
        defaultValue: '',
      },
      {
        id: 'segment',
        label: 'Segment',
        type: 'select',
        options: SEGMENT_OPTIONS,
        defaultValue: '',
      },
    ];
  }, []);

  const tableColumns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Quality Gate',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleGateClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors line-clamp-2"
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: 'release',
        header: 'Release',
        size: 90,
        cell: ({ row }) => (
          <Badge variant="outline" size="sm">v{row.original.release}</Badge>
        ),
      },
      {
        accessorKey: 'application',
        header: 'Application',
        size: 160,
        cell: ({ row }) => (
          <span className="text-xs font-mono text-slate-500 truncate block max-w-[160px]">
            {row.original.application}
          </span>
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
        accessorKey: 'overallStatus',
        header: 'Status',
        size: 100,
        cell: ({ row }) => (
          <StatusPill status={row.original.overallStatus} size="sm" dot />
        ),
      },
      {
        id: 'criteria',
        header: 'Criteria',
        size: 120,
        enableSorting: false,
        cell: ({ row }) => {
          const gates = row.original.gates || [];
          const passedCount = gates.filter((g) => g.status === 'passed').length;
          const totalCount = gates.length;
          return (
            <div className="flex items-center gap-2">
              <Progress
                value={passedCount}
                max={totalCount || 1}
                variant="auto"
                size="xs"
                className="flex-1"
              />
              <span className="text-xs font-medium text-slate-700 w-10 text-right">
                {passedCount}/{totalCount}
              </span>
            </div>
          );
        },
      },
      {
        id: 'waivers',
        header: 'Waivers',
        size: 80,
        enableSorting: false,
        cell: ({ row }) => {
          const count = row.original.waivers ? row.original.waivers.length : 0;
          return count > 0 ? (
            <Badge variant="warning" size="sm">{count}</Badge>
          ) : (
            <span className="text-xs text-slate-400">0</span>
          );
        },
      },
      {
        accessorKey: 'configuredBy',
        header: 'Configured By',
        size: 130,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.configuredBy}</span>
        ),
      },
      {
        accessorKey: 'lastEvaluated',
        header: 'Last Evaluated',
        size: 120,
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">{formatDate(row.original.lastEvaluated)}</span>
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
                onClick={() => handleGateClick(row.original)}
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
    [handleGateClick]
  );

  const insightData = useMemo(() => {
    if (qualityGates.length === 0) return null;

    const failed = qualityGates.filter((qg) => qg.overallStatus === 'failed');
    const withWaivers = qualityGates.filter((qg) => qg.waivers && qg.waivers.length > 0);
    const passed = qualityGates.filter((qg) => qg.overallStatus === 'passed');
    const passRate = qualityGates.length > 0
      ? Math.round((passed.length / qualityGates.length) * 100)
      : 0;

    if (failed.length > 5) {
      return {
        variant: 'critical',
        title: `${failed.length} quality gates failed`,
        message: `${failed.length} out of ${qualityGates.length} quality gates have failed status. Pass rate is ${passRate}%, below the 90% target. ${withWaivers.length} gates have active waivers. Review failed gates and consider remediation or waiver requests.`,
        source: 'Quality Monitor Agent',
        confidence: 92,
      };
    }

    if (failed.length > 0) {
      return {
        variant: 'warning',
        title: `${failed.length} quality gate${failed.length !== 1 ? 's' : ''} require attention`,
        message: `${failed.length} quality gate${failed.length !== 1 ? 's have' : ' has'} failed status. Overall pass rate is ${passRate}%. ${withWaivers.length} active waiver${withWaivers.length !== 1 ? 's' : ''} in place.`,
        source: 'Quality Monitor Agent',
        confidence: 88,
      };
    }

    return {
      variant: 'success',
      title: 'All quality gates passing',
      message: `All ${qualityGates.length} quality gates are in passed or waived status with a ${passRate}% pass rate.`,
      source: 'Quality Monitor Agent',
      confidence: 96,
    };
  }, [qualityGates]);

  if (loading) {
    return <QualityGatesPageSkeleton />;
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
              aria-label="Refresh quality gates"
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
                    aria-label="Export quality gates"
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
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {qualityGates.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No quality gates found"
              message="No quality gates match the current filter criteria. Try adjusting your filters."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={tableColumns}
              data={qualityGates}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search quality gates..."
              emptyMessage="No quality gates match the search criteria."
              onRowClick={handleGateClick}
            />
          )}
        </TabsContent>

        <TabsContent value="cards">
          {qualityGates.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No quality gates found"
              message="No quality gates match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {qualityGates.map((qg) => {
                const gates = qg.gates || [];
                const waivers = qg.waivers || [];
                const passedCount = gates.filter((g) => g.status === 'passed').length;
                const failedCount = gates.filter((g) => g.status === 'failed').length;
                const waivedCount = gates.filter((g) => g.status === 'waived').length;
                const totalCount = gates.length;
                const passRate = totalCount > 0
                  ? Math.round(((passedCount + waivedCount) / totalCount) * 100)
                  : 0;

                return (
                  <Card
                    key={qg.id}
                    className={cn(
                      'p-5 cursor-pointer transition-all duration-200',
                      'hover:shadow-card-hover hover:border-humana-green-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                      'active:scale-[0.99]',
                      qg.overallStatus === 'failed' && 'border-danger-200'
                    )}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleGateClick(qg)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleGateClick(qg);
                      }
                    }}
                    aria-label={`${qg.name}. Status: ${qg.overallStatus}. ${passedCount}/${totalCount} criteria passed.`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: qg.overallStatus === 'passed'
                              ? '#10b98115'
                              : qg.overallStatus === 'failed'
                                ? '#ef444415'
                                : '#f59e0b15',
                          }}
                        >
                          <Shield
                            className="h-4.5 w-4.5"
                            style={{
                              color: qg.overallStatus === 'passed'
                                ? '#10b981'
                                : qg.overallStatus === 'failed'
                                  ? '#ef4444'
                                  : '#f59e0b',
                            }}
                            aria-hidden="true"
                          />
                        </div>
                        <div className="flex flex-col gap-0 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">{qg.name}</h3>
                          <span className="text-2xs text-slate-500">{qg.segment} • {qg.configuredBy}</span>
                        </div>
                      </div>
                      <StatusPill status={qg.overallStatus} size="sm" dot />
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-2xs text-slate-400 uppercase tracking-wider">Passed</span>
                        <span className="text-sm font-semibold text-success-600">{passedCount}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-2xs text-slate-400 uppercase tracking-wider">Failed</span>
                        <span className="text-sm font-semibold text-danger-600">{failedCount}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-2xs text-slate-400 uppercase tracking-wider">Waived</span>
                        <span className="text-sm font-semibold text-warning-600">{waivedCount}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-2xs text-slate-400">Pass Rate</span>
                        <span className="text-2xs font-medium text-slate-700">{passRate}%</span>
                      </div>
                      <Progress
                        value={passedCount + waivedCount}
                        max={totalCount || 1}
                        variant="auto"
                        size="xs"
                        animate
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" size="sm">v{qg.release}</Badge>
                        {waivers.length > 0 ? (
                          <Badge variant="warning" size="sm">{waivers.length} waiver{waivers.length !== 1 ? 's' : ''}</Badge>
                        ) : null}
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    </div>

                    <div className="mt-2">
                      <span className="text-2xs text-slate-400">
                        Evaluated: {formatDate(qg.lastEvaluated)}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {qualityGates.length === 0 ? (
            <EmptyState
              type="no_chart"
              title="No data for analytics"
              message="No quality gates available to generate analytics. Try adjusting your filters."
              size="lg"
              bordered
            />
          ) : (
            <AnalyticsPanel qualityGates={qualityGates} />
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Panel */}
      {qualityGates.length > 0 && activeTab !== 'analytics' ? (
        <PanelCard
          title="Quality Gate Summary"
          subtitle={`${qualityGates.length} quality gates across ${new Set(qualityGates.map((qg) => qg.segment)).size} segments`}
          icon={<Activity className="h-5 w-5" />}
          collapsible
          defaultCollapsed
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Passed</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-success-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {qualityGates.filter((qg) => qg.overallStatus === 'passed').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Failed</span>
              <div className="flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-danger-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {qualityGates.filter((qg) => qg.overallStatus === 'failed').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Waived</span>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-warning-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {qualityGates.filter((qg) => qg.overallStatus === 'waived').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Total Criteria</span>
              <span className="text-2xl font-semibold text-slate-900">
                {qualityGates.reduce((sum, qg) => sum + (qg.gates ? qg.gates.length : 0), 0)}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Total Waivers</span>
              <span className="text-2xl font-semibold text-slate-900">
                {qualityGates.reduce((sum, qg) => sum + (qg.waivers ? qg.waivers.length : 0), 0)}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Overall Pass Rate</h4>
            <Progress
              value={qualityGates.filter((qg) => qg.overallStatus === 'passed').length}
              max={qualityGates.length || 1}
              variant="auto"
              size="md"
              showValue
              valueFormat="fraction"
              label="Quality Gate Pass Rate"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-slate-900">By Segment</h4>
            {Array.from(new Set(qualityGates.map((qg) => qg.segment))).sort().map((segment) => {
              const segGates = qualityGates.filter((qg) => qg.segment === segment);
              const segPassed = segGates.filter((qg) => qg.overallStatus === 'passed').length;
              return (
                <div key={segment} className="flex items-center gap-3">
                  <div className="w-24 shrink-0 flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: SEGMENT_COLORS[segment] || '#64748b' }}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-slate-700">{segment}</span>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={segPassed}
                      max={segGates.length || 1}
                      variant="auto"
                      size="xs"
                      animate
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 w-12 text-right">
                    {segPassed}/{segGates.length}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-slate-900">By Status</h4>
            {[
              { label: 'Passed', status: 'passed', count: qualityGates.filter((qg) => qg.overallStatus === 'passed').length },
              { label: 'Failed', status: 'failed', count: qualityGates.filter((qg) => qg.overallStatus === 'failed').length },
              { label: 'Waived', status: 'waived', count: qualityGates.filter((qg) => qg.overallStatus === 'waived').length },
              { label: 'Pending', status: 'pending', count: qualityGates.filter((qg) => qg.overallStatus === 'pending').length },
            ].filter((item) => item.count > 0).map((item) => (
              <div key={item.status} className="flex items-center gap-3">
                <div className="w-20 shrink-0">
                  <StatusPill status={item.status} size="sm" dot />
                </div>
                <div className="flex-1">
                  <Progress
                    value={item.count}
                    max={qualityGates.length || 1}
                    variant="primary"
                    size="xs"
                    animate
                  />
                </div>
                <span className="text-sm font-semibold text-slate-900 w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </PanelCard>
      ) : null}

      {/* Detail Dialog */}
      <QualityGateDetailDialog
        qualityGate={selectedGate}
        open={detailOpen}
        onOpenChange={handleDetailClose}
        onWaive={handleWaiveClick}
      />

      {/* Waiver Dialog */}
      <WaiverDialog
        open={waiverOpen}
        onOpenChange={(open) => {
          setWaiverOpen(open);
          if (!open) {
            setWaiverTarget(null);
            setWaiverCriteriaName('');
          }
        }}
        onSubmit={handleWaiverSubmit}
        loading={waiverLoading}
        qualityGate={waiverTarget}
        gateCriteriaName={waiverCriteriaName}
      />
    </div>
  );
}

QualityGatesPage.displayName = 'QualityGatesPage';

export { QualityGatesPage };
export default QualityGatesPage;