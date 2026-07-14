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
  Activity,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Download,
  Plus,
  Filter,
  BarChart2,
  ArrowRight,
  User,
  Calendar,
  Tag,
  Layers,
  FileText,
  ChevronRight,
  Eye,
  ThumbsUp,
  UserPlus,
  XCircle,
  Inbox,
  Zap,
  Target,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import {
  getDemandPipeline,
  intakeDemand,
  approveDemand,
  assignDemand,
  exportDemand,
} from '@/lib/mock-api/mockService';
import { getAllDemandTypes, getAllDemandStatuses, getAllDemandPriorities } from '@/data/demands';
import { getAllPersonas } from '@/data/personas';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { ChartWrapper } from '@/components/shared/ChartWrapper';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusPill } from '@/components/shared/StatusPill';
import { EmptyState } from '@/components/shared/EmptyState';
import { DataTable } from '@/components/shared/DataTable';
import { PermissionGate } from '@/components/shared/PermissionGate';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Progress } from '@/components/ui/Progress';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
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
import { PERMISSIONS, ROUTES, MEASURE_STATUS } from '@/lib/constants';

const PRIORITY_COLORS = {
  critical: '#dc2626',
  high: '#f59e0b',
  medium: '#3b82f6',
  low: '#a3a3a3',
};

const STATUS_COLORS = {
  intake: '#8b5cf6',
  analysis: '#3b82f6',
  approved: '#06b6d4',
  in_progress: '#f59e0b',
  completed: '#10b981',
  deferred: '#a3a3a3',
  rejected: '#ef4444',
};

const TYPE_COLORS = {
  feature: '#16b364',
  enhancement: '#3b82f6',
  defect: '#ef4444',
  compliance: '#8b5cf6',
  infrastructure: '#f59e0b',
  integration: '#06b6d4',
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

function getPriorityBadgeVariant(priority) {
  switch (priority) {
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

function getTypeBadgeVariant(type) {
  switch (type) {
    case 'feature':
      return 'primary';
    case 'enhancement':
      return 'info';
    case 'defect':
      return 'error';
    case 'compliance':
      return 'warning';
    case 'infrastructure':
      return 'neutral';
    case 'integration':
      return 'success';
    default:
      return 'neutral';
  }
}

function IntakeDialog({ open, onOpenChange, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'feature',
    priority: 'medium',
    segment: 'Enterprise',
    application: '',
    description: '',
    estimatedEffort: '',
    targetDate: '',
    requestor: '',
  });
  const [errors, setErrors] = useState({});

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
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.requestor.trim()) {
      newErrors.requestor = 'Requestor is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    onSubmit({
      ...formData,
      estimatedEffort: formData.estimatedEffort ? Number(formData.estimatedEffort) : 0,
      status: 'intake',
      intakeDate: new Date().toISOString().split('T')[0],
      assignee: '',
      approver: '',
      analytics: {
        complexityScore: Math.floor(Math.random() * 5) + 3,
        businessValue: Math.floor(Math.random() * 5) + 5,
        riskScore: Math.floor(Math.random() * 5) + 2,
        estimatedROI: Math.floor(Math.random() * 30) + 10,
        impactedMeasures: [],
        dependencies: [],
      },
    });
  }, [formData, validate, onSubmit]);

  const handleOpenChange = useCallback(
    (nextOpen) => {
      if (!nextOpen) {
        setFormData({
          title: '',
          type: 'feature',
          priority: 'medium',
          segment: 'Enterprise',
          application: '',
          description: '',
          estimatedEffort: '',
          targetDate: '',
          requestor: '',
        });
        setErrors({});
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange]
  );

  const typeOptions = useMemo(() => {
    return getAllDemandTypes().map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }));
  }, []);

  const priorityOptions = useMemo(() => {
    return getAllDemandPriorities().map((p) => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }));
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Demand Intake</DialogTitle>
          <DialogDescription>
            Submit a new demand for review and prioritization.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <Input
            label="Title"
            placeholder="Enter demand title"
            value={formData.title}
            onChange={handleInputChange('title')}
            error={errors.title}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Type"
              options={typeOptions}
              value={formData.type}
              onValueChange={(val) => handleChange('type', val)}
            />
            <Select
              label="Priority"
              options={priorityOptions}
              value={formData.priority}
              onValueChange={(val) => handleChange('priority', val)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Segment"
              options={SEGMENT_OPTIONS.filter((s) => s.value !== '')}
              value={formData.segment}
              onValueChange={(val) => handleChange('segment', val)}
            />
            <Input
              label="Estimated Effort (SP)"
              type="number"
              placeholder="e.g. 13"
              value={formData.estimatedEffort}
              onChange={handleInputChange('estimatedEffort')}
            />
          </div>

          <Input
            label="Requestor"
            placeholder="Enter requestor name"
            value={formData.requestor}
            onChange={handleInputChange('requestor')}
            error={errors.requestor}
            required
          />

          <Input
            label="Target Date"
            type="date"
            value={formData.targetDate}
            onChange={handleInputChange('targetDate')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium leading-none text-slate-700">
              Description <span className="ml-0.5 text-danger-500" aria-hidden="true">*</span>
            </label>
            <textarea
              className={cn(
                'flex min-h-[80px] w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 transition-colors duration-200',
                'placeholder:text-slate-400',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                'hover:border-slate-400',
                errors.description
                  ? 'border-danger-500 hover:border-danger-600 focus-visible:ring-danger-500'
                  : 'border-slate-300 focus-visible:border-humana-green-500'
              )}
              placeholder="Describe the demand in detail..."
              value={formData.description}
              onChange={handleInputChange('description')}
              rows={3}
            />
            {errors.description ? (
              <p className="text-xs text-danger-500" role="alert">{errors.description}</p>
            ) : null}
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" size="md" onClick={() => handleOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit} loading={loading}>
            Submit Demand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DemandDetailDialog({ demand, open, onOpenChange, onApprove, onAssign }) {
  const { hasPermission } = usePersona();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignee, setAssignee] = useState('');

  const personas = useMemo(() => getAllPersonas(), []);
  const assigneeOptions = useMemo(() => {
    return personas.map((p) => ({ value: p.name, label: `${p.name} (${p.role})` }));
  }, [personas]);

  const handleAssignSubmit = useCallback(() => {
    if (!assignee || !demand) return;
    onAssign(demand.id, assignee);
    setAssignDialogOpen(false);
    setAssignee('');
  }, [assignee, demand, onAssign]);

  if (!demand) return null;

  const canApprove = hasPermission(PERMISSIONS.EDIT_QUALITY_GATES) &&
    (demand.status === 'intake' || demand.status === 'analysis');
  const canAssign = hasPermission(PERMISSIONS.EDIT_MEASURES) &&
    (demand.status === 'approved' || demand.status === 'in_progress');

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div
                className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50"
              >
                <ClipboardList className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="pr-8">{demand.title}</DialogTitle>
                <DialogDescription className="mt-1">
                  {demand.id} • {demand.type} • {demand.segment}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <StatusPill status={demand.status} size="md" dot />
            <Badge variant={getPriorityBadgeVariant(demand.priority)} size="md">
              {demand.priority}
            </Badge>
            <Badge variant={getTypeBadgeVariant(demand.type)} size="md">
              {demand.type}
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-slate-200 p-3">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Effort</span>
              <p className="mt-1 text-lg font-semibold text-slate-900">{demand.estimatedEffort} SP</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Business Value</span>
              <p className="mt-1 text-lg font-semibold text-slate-900">{demand.analytics.businessValue}/10</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Complexity</span>
              <p className="mt-1 text-lg font-semibold text-slate-900">{demand.analytics.complexityScore}/10</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Risk</span>
              <p className="mt-1 text-lg font-semibold text-slate-900">{demand.analytics.riskScore}/10</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Requestor:</span>
              <span className="font-medium text-slate-900">{demand.requestor}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <UserPlus className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Assignee:</span>
              <span className="font-medium text-slate-900">{demand.assignee || 'Unassigned'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Intake Date:</span>
              <span className="font-medium text-slate-900">{formatDate(demand.intakeDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Target Date:</span>
              <span className="font-medium text-slate-900">{demand.targetDate ? formatDate(demand.targetDate) : '—'}</span>
            </div>
            {demand.approver ? (
              <div className="flex items-center gap-2 text-sm">
                <ThumbsUp className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
                <span className="text-slate-500">Approver:</span>
                <span className="font-medium text-slate-900">{demand.approver}</span>
              </div>
            ) : null}
            <div className="flex items-center gap-2 text-sm">
              <Layers className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Application:</span>
              <span className="font-medium text-slate-900">{demand.application || '—'}</span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{demand.description}</p>
          </div>

          {demand.analytics.estimatedROI > 0 ? (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Estimated ROI</h4>
              <Progress
                value={demand.analytics.estimatedROI}
                max={100}
                variant="primary"
                size="md"
                showValue
                label={`${demand.analytics.estimatedROI}% estimated return`}
              />
            </div>
          ) : null}

          {demand.analytics.impactedMeasures && demand.analytics.impactedMeasures.length > 0 ? (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Impacted Measures</h4>
              <div className="flex flex-wrap gap-1.5">
                {demand.analytics.impactedMeasures.map((m) => (
                  <Badge key={m} variant="outline" size="sm">{m}</Badge>
                ))}
              </div>
            </div>
          ) : null}

          {demand.analytics.dependencies && demand.analytics.dependencies.length > 0 ? (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Dependencies</h4>
              <div className="flex flex-wrap gap-1.5">
                {demand.analytics.dependencies.map((d) => (
                  <Badge key={d} variant="outline" size="sm">{d}</Badge>
                ))}
              </div>
            </div>
          ) : null}

          <DialogFooter className="pt-4">
            {canApprove ? (
              <Button
                variant="primary"
                size="md"
                iconLeft={<ThumbsUp className="h-3.5 w-3.5" />}
                onClick={() => onApprove(demand.id)}
              >
                Approve
              </Button>
            ) : null}
            {canAssign ? (
              <Button
                variant="outline"
                size="md"
                iconLeft={<UserPlus className="h-3.5 w-3.5" />}
                onClick={() => setAssignDialogOpen(true)}
              >
                Assign
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Assign Demand</DialogTitle>
            <DialogDescription>
              Select a person to assign this demand to.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Select
              label="Assignee"
              placeholder="Select assignee"
              options={assigneeOptions}
              value={assignee}
              onValueChange={setAssignee}
            />
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" size="md" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleAssignSubmit} disabled={!assignee}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function KanbanColumn({ title, status, demands, onDemandClick, color }) {
  return (
    <div className="flex flex-col gap-2 min-w-[240px] max-w-[280px]">
      <div className="flex items-center justify-between px-1 pb-1 border-b-2" style={{ borderColor: color }}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">{title}</span>
          <Badge variant="neutral" size="sm">{demands.length}</Badge>
        </div>
      </div>
      <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
        {demands.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-xs text-slate-400">
            No items
          </div>
        ) : (
          demands.map((demand) => (
            <button
              key={demand.id}
              type="button"
              onClick={() => onDemandClick(demand)}
              className={cn(
                'flex flex-col gap-1.5 rounded-lg border border-slate-200 bg-white p-3 text-left transition-all duration-200',
                'hover:shadow-card-hover hover:border-humana-green-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                'active:scale-[0.99]'
              )}
            >
              <p className="text-xs font-medium text-slate-900 line-clamp-2">{demand.title}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant={getPriorityBadgeVariant(demand.priority)} size="sm">
                  {demand.priority}
                </Badge>
                <Badge variant={getTypeBadgeVariant(demand.type)} size="sm">
                  {demand.type}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-2xs text-slate-400">{demand.segment}</span>
                <span className="text-2xs text-slate-400">{demand.estimatedEffort} SP</span>
              </div>
              {demand.assignee ? (
                <div className="flex items-center gap-1 mt-0.5">
                  <User className="h-3 w-3 text-slate-400" aria-hidden="true" />
                  <span className="text-2xs text-slate-500 truncate">{demand.assignee}</span>
                </div>
              ) : null}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function KanbanView({ demands, onDemandClick }) {
  const columns = useMemo(() => {
    const statusOrder = ['intake', 'analysis', 'approved', 'in_progress', 'completed', 'deferred'];
    const statusLabels = {
      intake: 'Intake',
      analysis: 'Analysis',
      approved: 'Approved',
      in_progress: 'In Progress',
      completed: 'Completed',
      deferred: 'Deferred',
    };

    return statusOrder.map((status) => ({
      status,
      title: statusLabels[status] || status,
      color: STATUS_COLORS[status] || '#a3a3a3',
      demands: demands.filter((d) => d.status === status),
    }));
  }, [demands]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((col) => (
        <KanbanColumn
          key={col.status}
          title={col.title}
          status={col.status}
          demands={col.demands}
          onDemandClick={onDemandClick}
          color={col.color}
        />
      ))}
    </div>
  );
}

function AnalyticsPanel({ demands }) {
  const statusData = useMemo(() => {
    const counts = {};
    for (const d of demands) {
      counts[d.status] = (counts[d.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
  }, [demands]);

  const priorityData = useMemo(() => {
    const counts = {};
    for (const d of demands) {
      counts[d.priority] = (counts[d.priority] || 0) + 1;
    }
    return Object.entries(counts).map(([priority, count]) => ({
      priority,
      count,
      label: priority.charAt(0).toUpperCase() + priority.slice(1),
    }));
  }, [demands]);

  const typeData = useMemo(() => {
    const counts = {};
    for (const d of demands) {
      counts[d.type] = (counts[d.type] || 0) + 1;
    }
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    }));
  }, [demands]);

  const segmentData = useMemo(() => {
    const counts = {};
    for (const d of demands) {
      counts[d.segment] = (counts[d.segment] || 0) + 1;
    }
    return Object.entries(counts).map(([segment, count]) => ({
      segment,
      count,
    }));
  }, [demands]);

  const effortBySegment = useMemo(() => {
    const totals = {};
    for (const d of demands) {
      totals[d.segment] = (totals[d.segment] || 0) + d.estimatedEffort;
    }
    return Object.entries(totals).map(([segment, effort]) => ({
      segment,
      effort,
    }));
  }, [demands]);

  const avgAnalytics = useMemo(() => {
    if (demands.length === 0) return { complexity: 0, businessValue: 0, risk: 0, roi: 0 };
    const totals = demands.reduce(
      (acc, d) => ({
        complexity: acc.complexity + d.analytics.complexityScore,
        businessValue: acc.businessValue + d.analytics.businessValue,
        risk: acc.risk + d.analytics.riskScore,
        roi: acc.roi + d.analytics.estimatedROI,
      }),
      { complexity: 0, businessValue: 0, risk: 0, roi: 0 }
    );
    const len = demands.length;
    return {
      complexity: Math.round((totals.complexity / len) * 10) / 10,
      businessValue: Math.round((totals.businessValue / len) * 10) / 10,
      risk: Math.round((totals.risk / len) * 10) / 10,
      roi: Math.round((totals.roi / len) * 10) / 10,
    };
  }, [demands]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PanelCard
        title="Demand by Status"
        subtitle="Distribution of demands across pipeline stages"
        icon={<BarChart2 className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
              <Bar dataKey="count" name="Demands" radius={[4, 4, 0, 0]} barSize={32}>
                {statusData.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#a3a3a3'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Demand by Priority"
        subtitle="Priority distribution across all demands"
        icon={<AlertTriangle className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {priorityData.map((entry) => (
                    <Cell key={entry.priority} fill={PRIORITY_COLORS[entry.priority] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} demands`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {priorityData.map((item) => (
              <div key={item.priority} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: PRIORITY_COLORS[item.priority] || '#a3a3a3' }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium capitalize text-slate-700">{item.priority}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title="Demand by Type"
        subtitle="Type distribution across all demands"
        icon={<Tag className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Demands" radius={[0, 4, 4, 0]} barSize={20}>
                {typeData.map((entry) => (
                  <Cell key={entry.type} fill={TYPE_COLORS[entry.type] || '#a3a3a3'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Effort by Segment"
        subtitle="Total estimated effort (story points) by segment"
        icon={<Layers className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={effortBySegment} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
              />
              <Tooltip content={<CustomTooltip unit=" SP" />} />
              <Bar dataKey="effort" name="Story Points" fill="#16b364" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Average Analytics Scores"
        subtitle="Average complexity, business value, risk, and ROI across all demands"
        icon={<Zap className="h-5 w-5" />}
        className="xl:col-span-2"
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg Complexity</span>
            <span className="text-2xl font-semibold text-slate-900">{avgAnalytics.complexity}</span>
            <Progress value={avgAnalytics.complexity} max={10} variant="info" size="sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg Business Value</span>
            <span className="text-2xl font-semibold text-slate-900">{avgAnalytics.businessValue}</span>
            <Progress value={avgAnalytics.businessValue} max={10} variant="primary" size="sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg Risk Score</span>
            <span className="text-2xl font-semibold text-slate-900">{avgAnalytics.risk}</span>
            <Progress value={avgAnalytics.risk} max={10} variant="warning" size="sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg Est. ROI</span>
            <span className="text-2xl font-semibold text-slate-900">{avgAnalytics.roi}%</span>
            <Progress value={avgAnalytics.roi} max={100} variant="success" size="sm" />
          </div>
        </div>
      </PanelCard>
    </div>
  );
}

function DemandManagementSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading demand management" aria-busy="true">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex items-center gap-2">
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
      <Skeleton className="h-96 rounded-xl" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function DemandManagementPage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [demands, setDemands] = useState([]);
  const [activeTab, setActiveTab] = useState('pipeline');
  const [viewMode, setViewMode] = useState('kanban');
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [intakeLoading, setIntakeLoading] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState(null);
  const [filters, setFilters] = useState({
    segment: '',
    status: '',
    priority: '',
    type: '',
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Measures', path: ROUTES.MEASURES },
      { label: 'Demand Management' },
    ]);
  }, [setBreadcrumbs]);

  const loadDemands = useCallback(async () => {
    setLoading(true);
    try {
      const filterParams = {};
      if (filters.segment) filterParams.segment = filters.segment;
      if (filters.status) filterParams.status = filters.status;
      if (filters.priority) filterParams.priority = filters.priority;
      if (filters.type) filterParams.type = filters.type;
      const data = await getDemandPipeline(filterParams);
      setDemands(data);
    } catch {
      setDemands([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadDemands();
  }, [loadDemands]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    loadDemands();
  }, [loadDemands]);

  const handleIntakeSubmit = useCallback(
    async (demandData) => {
      setIntakeLoading(true);
      try {
        const created = await intakeDemand(demandData);
        logEvent('demand_update', {
          action: 'Demand Intake',
          details: `New demand "${created.title}" submitted by ${currentPersona.name}.`,
          resource: created.id,
          outcome: 'success',
          segment: created.segment,
        });
        toast({
          variant: 'success',
          title: 'Demand Submitted',
          description: `"${created.title}" has been submitted for review.`,
        });
        setIntakeOpen(false);
        await loadDemands();
      } catch (err) {
        toast({
          variant: 'error',
          title: 'Submission Failed',
          description: err && err.error ? err.error : 'Failed to submit demand.',
        });
      } finally {
        setIntakeLoading(false);
      }
    },
    [currentPersona, logEvent, toast, loadDemands]
  );

  const handleApprove = useCallback(
    (demandId) => {
      setApproveTarget(demandId);
      setApproveConfirmOpen(true);
    },
    []
  );

  const handleApproveConfirm = useCallback(async () => {
    if (!approveTarget) return;
    try {
      const updated = await approveDemand(approveTarget);
      logEvent('demand_update', {
        action: 'Demand Approved',
        details: `Demand "${updated.title}" approved by ${currentPersona.name}.`,
        resource: updated.id,
        outcome: 'success',
        segment: updated.segment,
      });
      toast({
        variant: 'success',
        title: 'Demand Approved',
        description: `"${updated.title}" has been approved.`,
      });
      setDetailOpen(false);
      setSelectedDemand(null);
      await loadDemands();
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Approval Failed',
        description: err && err.error ? err.error : 'Failed to approve demand.',
      });
    }
  }, [approveTarget, currentPersona, logEvent, toast, loadDemands]);

  const handleAssign = useCallback(
    async (demandId, assigneeName) => {
      try {
        const updated = await assignDemand(demandId, assigneeName);
        logEvent('demand_update', {
          action: 'Demand Assigned',
          details: `Demand "${updated.title}" assigned to ${assigneeName} by ${currentPersona.name}.`,
          resource: updated.id,
          outcome: 'success',
          segment: updated.segment,
        });
        toast({
          variant: 'success',
          title: 'Demand Assigned',
          description: `"${updated.title}" has been assigned to ${assigneeName}.`,
        });
        setDetailOpen(false);
        setSelectedDemand(null);
        await loadDemands();
      } catch (err) {
        toast({
          variant: 'error',
          title: 'Assignment Failed',
          description: err && err.error ? err.error : 'Failed to assign demand.',
        });
      }
    },
    [currentPersona, logEvent, toast, loadDemands]
  );

  const handleDemandClick = useCallback((demand) => {
    setSelectedDemand(demand);
    setDetailOpen(true);
  }, []);

  const handleDetailClose = useCallback((open) => {
    setDetailOpen(open);
    if (!open) {
      setSelectedDemand(null);
    }
  }, []);

  const handleExportCSV = useCallback(async () => {
    try {
      const data = await exportDemand(filters);
      downloadCSV(data, 'demand-pipeline.csv');
      logEvent('data_export', {
        action: 'Exported Demand Pipeline',
        details: `Demand pipeline exported as CSV by ${currentPersona.name}. ${data.length} records.`,
        resource: '/measures',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} demands exported as CSV.`,
      });
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: err && err.error ? err.error : 'Failed to export demands.',
      });
    }
  }, [filters, currentPersona, logEvent, toast]);

  const handleExportJSON = useCallback(async () => {
    try {
      const data = await exportDemand(filters);
      downloadJSON(data, 'demand-pipeline.json');
      logEvent('data_export', {
        action: 'Exported Demand Pipeline',
        details: `Demand pipeline exported as JSON by ${currentPersona.name}. ${data.length} records.`,
        resource: '/measures',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} demands exported as JSON.`,
      });
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: err && err.error ? err.error : 'Failed to export demands.',
      });
    }
  }, [filters, currentPersona, logEvent, toast]);

  const kpiData = useMemo(() => {
    const total = demands.length;
    const pending = demands.filter((d) => d.status === 'intake' || d.status === 'analysis').length;
    const approved = demands.filter((d) => d.status === 'approved').length;
    const inProgress = demands.filter((d) => d.status === 'in_progress').length;
    const completed = demands.filter((d) => d.status === 'completed').length;
    const totalEffort = demands.reduce((sum, d) => sum + d.estimatedEffort, 0);

    return [
      {
        id: 'kpi_total',
        label: 'Total Demands',
        value: total,
        unit: 'count',
        trend: 'stable',
        status: 'on_track',
        description: 'Total number of demands in the pipeline.',
      },
      {
        id: 'kpi_pending',
        label: 'Pending Review',
        value: pending,
        unit: 'count',
        trend: pending > 5 ? 'declining' : 'stable',
        status: pending > 8 ? 'at_risk' : 'on_track',
        description: 'Demands awaiting triage or analysis.',
      },
      {
        id: 'kpi_approved',
        label: 'Approved',
        value: approved,
        unit: 'count',
        trend: 'improving',
        status: 'on_track',
        description: 'Demands approved and ready for assignment.',
      },
      {
        id: 'kpi_in_progress',
        label: 'In Progress',
        value: inProgress,
        unit: 'count',
        trend: 'improving',
        status: 'on_track',
        description: 'Demands currently being worked on.',
      },
    ];
  }, [demands]);

  const filterFields = useMemo(() => {
    const statusOptions = getAllDemandStatuses().map((s) => ({
      value: s,
      label: s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
    const priorityOptions = getAllDemandPriorities().map((p) => ({
      value: p,
      label: p.charAt(0).toUpperCase() + p.slice(1),
    }));
    const typeOptions = getAllDemandTypes().map((t) => ({
      value: t,
      label: t.charAt(0).toUpperCase() + t.slice(1),
    }));

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
        label: 'Status',
        type: 'select',
        options: [{ value: '', label: 'All Statuses' }, ...statusOptions],
        defaultValue: '',
      },
      {
        id: 'priority',
        label: 'Priority',
        type: 'select',
        options: [{ value: '', label: 'All Priorities' }, ...priorityOptions],
        defaultValue: '',
      },
      {
        id: 'type',
        label: 'Type',
        type: 'select',
        options: [{ value: '', label: 'All Types' }, ...typeOptions],
        defaultValue: '',
      },
    ];
  }, []);

  const tableColumns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 100,
        cell: ({ row }) => (
          <span className="text-xs font-mono text-slate-500">{row.original.id}</span>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleDemandClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors"
          >
            {row.original.title}
          </button>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 110,
        cell: ({ row }) => (
          <Badge variant={getTypeBadgeVariant(row.original.type)} size="sm">
            {row.original.type}
          </Badge>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        size: 100,
        cell: ({ row }) => (
          <Badge variant={getPriorityBadgeVariant(row.original.priority)} size="sm">
            {row.original.priority}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        cell: ({ row }) => (
          <StatusPill status={row.original.status} size="sm" dot />
        ),
      },
      {
        accessorKey: 'segment',
        header: 'Segment',
        size: 110,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.segment}</span>
        ),
      },
      {
        accessorKey: 'estimatedEffort',
        header: 'Effort (SP)',
        size: 90,
        cell: ({ row }) => (
          <span className="text-sm font-medium text-slate-900">{row.original.estimatedEffort}</span>
        ),
      },
      {
        accessorKey: 'assignee',
        header: 'Assignee',
        size: 140,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.assignee || '—'}</span>
        ),
      },
      {
        accessorKey: 'targetDate',
        header: 'Target Date',
        size: 120,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">
            {row.original.targetDate ? formatDate(row.original.targetDate) : '—'}
          </span>
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
                onClick={() => handleDemandClick(row.original)}
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
    [handleDemandClick]
  );

  if (loading) {
    return <DemandManagementSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">Demand Management</h1>
          <p className="text-sm text-slate-500">
            Pipeline view, intake, triage, and approval workflow for {currentPersona.name}
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

          <PermissionGate requiredAction={PERMISSIONS.EDIT_MEASURES} behavior="hidden">
            <Button
              variant="primary"
              size="sm"
              iconLeft={<Plus className="h-3.5 w-3.5" />}
              onClick={() => setIntakeOpen(true)}
            >
              New Demand
            </Button>
          </PermissionGate>
        </div>
      </div>

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

      {/* Tabs: Pipeline / List / Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <TabsList>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {activeTab === 'pipeline' ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400 mr-1">View:</span>
              <Button
                variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="text-xs px-2 py-1 h-7"
              >
                Kanban
              </Button>
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="text-xs px-2 py-1 h-7"
              >
                Table
              </Button>
            </div>
          ) : null}
        </div>

        <TabsContent value="pipeline">
          {demands.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No demands found"
              message="No demands match the current filter criteria. Try adjusting your filters or create a new demand."
              size="lg"
              bordered
              actionLabel="New Demand"
              onAction={hasPermission(PERMISSIONS.EDIT_MEASURES) ? () => setIntakeOpen(true) : undefined}
              actionIcon={<Plus className="h-3.5 w-3.5" />}
            />
          ) : viewMode === 'kanban' ? (
            <KanbanView demands={demands} onDemandClick={handleDemandClick} />
          ) : (
            <DataTable
              columns={tableColumns}
              data={demands}
              enableSorting
              enableFiltering={false}
              enablePagination
              enableColumnVisibility
              pageSize={10}
              emptyMessage="No demands match the current filters."
              onRowClick={handleDemandClick}
            />
          )}
        </TabsContent>

        <TabsContent value="list">
          {demands.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No demands found"
              message="No demands match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={tableColumns}
              data={demands}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search demands..."
              emptyMessage="No demands match the search criteria."
              onRowClick={handleDemandClick}
            />
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {demands.length === 0 ? (
            <EmptyState
              type="no_chart"
              title="No data for analytics"
              message="No demands available to generate analytics. Try adjusting your filters."
              size="lg"
              bordered
            />
          ) : (
            <AnalyticsPanel demands={demands} />
          )}
        </TabsContent>
      </Tabs>

      {/* Pipeline Summary */}
      {demands.length > 0 && activeTab !== 'analytics' ? (
        <PanelCard
          title="Pipeline Summary"
          subtitle="Demand pipeline progress overview"
          icon={<Activity className="h-5 w-5" />}
          collapsible
          defaultCollapsed={false}
        >
          <div className="flex flex-col gap-3">
            {[
              { label: 'Intake', status: 'intake', count: demands.filter((d) => d.status === 'intake').length },
              { label: 'Analysis', status: 'analysis', count: demands.filter((d) => d.status === 'analysis').length },
              { label: 'Approved', status: 'approved', count: demands.filter((d) => d.status === 'approved').length },
              { label: 'In Progress', status: 'in_progress', count: demands.filter((d) => d.status === 'in_progress').length },
              { label: 'Completed', status: 'completed', count: demands.filter((d) => d.status === 'completed').length },
              { label: 'Deferred', status: 'deferred', count: demands.filter((d) => d.status === 'deferred').length },
            ].map((stage) => (
              <div key={stage.status} className="flex items-center gap-3">
                <div className="w-24 shrink-0">
                  <StatusPill status={stage.status} size="sm" dot />
                </div>
                <div className="flex-1">
                  <Progress
                    value={stage.count}
                    max={demands.length || 1}
                    variant="primary"
                    size="sm"
                    animate
                  />
                </div>
                <span className="text-sm font-semibold text-slate-900 w-8 text-right">{stage.count}</span>
              </div>
            ))}
          </div>
        </PanelCard>
      ) : null}

      {/* Intake Dialog */}
      <IntakeDialog
        open={intakeOpen}
        onOpenChange={setIntakeOpen}
        onSubmit={handleIntakeSubmit}
        loading={intakeLoading}
      />

      {/* Detail Dialog */}
      <DemandDetailDialog
        demand={selectedDemand}
        open={detailOpen}
        onOpenChange={handleDetailClose}
        onApprove={handleApprove}
        onAssign={handleAssign}
      />

      {/* Approve Confirmation */}
      <ConfirmDialog
        open={approveConfirmOpen}
        onOpenChange={setApproveConfirmOpen}
        title="Approve Demand"
        message="Are you sure you want to approve this demand? It will be moved to the approved status and become available for assignment."
        variant="info"
        confirmLabel="Approve"
        cancelLabel="Cancel"
        onConfirm={handleApproveConfirm}
      />
    </div>
  );
}

DemandManagementPage.displayName = 'DemandManagementPage';

export { DemandManagementPage };
export default DemandManagementPage;