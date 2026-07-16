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
  Calendar,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Ban,
  FileText,
  BarChart2,
  Layers,
  User,
  ChevronRight,
  Zap,
  Timer,
  Server,
  Settings,
  SkipForward,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation, usePageHeader } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import {
  getSchedules,
  createSchedule,
  editSchedule,
  pauseSchedule,
  resumeSchedule,
  disableSchedule,
  deleteSchedule,
} from '@/lib/mock-api/mockService';
import {
  getAllScheduleStatuses,
  getAllScheduleFrequencies,
  getAllScheduleEnvironments,
} from '@/data/schedules';
import { getAllApplications } from '@/data/applications';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { ChartWrapper } from '@/components/shared/ChartWrapper';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusPill } from '@/components/shared/StatusPill';
import { EmptyState } from '@/components/shared/EmptyState';
import { DataTable } from '@/components/shared/DataTable';
import { PermissionGate } from '@/components/shared/PermissionGate';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
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
  active: '#10b981',
  paused: '#f59e0b',
  disabled: '#a3a3a3',
};

const FREQUENCY_COLORS = {
  daily: '#16b364',
  weekly: '#3b82f6',
  cron: '#8b5cf6',
};

const ENVIRONMENT_COLORS = {
  QA: '#16b364',
  Staging: '#3b82f6',
  Performance: '#8b5cf6',
  Production: '#ef4444',
  Development: '#f59e0b',
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

function getStatusBadgeVariant(status) {
  switch (status) {
    case 'active':
      return 'success';
    case 'paused':
      return 'warning';
    case 'disabled':
      return 'neutral';
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
    case 'cron':
      return 'warning';
    default:
      return 'neutral';
  }
}

function CreateEditDialog({ open, onOpenChange, onSubmit, loading, schedule }) {
  const isEdit = Boolean(schedule);
  const applications = useMemo(() => getAllApplications(), []);
  const applicationOptions = useMemo(() => {
    return applications.map((a) => ({ value: a.id, label: a.name }));
  }, [applications]);

  const frequencyOptions = useMemo(() => {
    return getAllScheduleFrequencies().map((f) => ({
      value: f,
      label: f.charAt(0).toUpperCase() + f.slice(1),
    }));
  }, []);

  const environmentOptions = useMemo(() => {
    return getAllScheduleEnvironments().map((e) => ({
      value: e,
      label: e,
    }));
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    testSuiteId: '',
    frequency: 'daily',
    cronExpression: '',
    environment: 'QA',
    application: '',
    segment: 'Enterprise',
    description: '',
    createdBy: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (schedule) {
      setFormData({
        name: schedule.name || '',
        testSuiteId: schedule.testSuiteId || '',
        frequency: schedule.frequency || 'daily',
        cronExpression: schedule.cronExpression || '',
        environment: schedule.environment || 'QA',
        application: schedule.application || '',
        segment: schedule.segment || 'Enterprise',
        description: schedule.description || '',
        createdBy: schedule.createdBy || '',
      });
    } else {
      setFormData({
        name: '',
        testSuiteId: '',
        frequency: 'daily',
        cronExpression: '',
        environment: 'QA',
        application: '',
        segment: 'Enterprise',
        description: '',
        createdBy: '',
      });
    }
    setErrors({});
  }, [schedule, open]);

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
    if (!formData.name.trim()) {
      newErrors.name = 'Schedule name is required';
    }
    if (!formData.createdBy.trim()) {
      newErrors.createdBy = 'Creator is required';
    }
    if (formData.frequency === 'cron' && !formData.cronExpression.trim()) {
      newErrors.cronExpression = 'Cron expression is required for cron frequency';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    const nextRun = new Date(Date.now() + 86400000).toISOString();
    onSubmit({
      ...formData,
      status: 'active',
      nextRun,
      lastRun: '',
      notifications: {
        onSuccess: false,
        onFailure: true,
        onSkip: true,
        channels: ['email'],
        recipients: [formData.createdBy],
      },
      retryPolicy: {
        enabled: true,
        maxRetries: 2,
        retryDelaySeconds: 300,
        backoffStrategy: 'exponential',
      },
    });
  }, [formData, validate, onSubmit]);

  const handleOpenChange = useCallback(
    (nextOpen) => {
      if (!nextOpen) {
        setFormData({
          name: '',
          testSuiteId: '',
          frequency: 'daily',
          cronExpression: '',
          environment: 'QA',
          application: '',
          segment: 'Enterprise',
          description: '',
          createdBy: '',
        });
        setErrors({});
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Schedule' : 'Create Schedule'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the schedule configuration below.'
              : 'Configure a new test execution schedule.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <Input
            label="Schedule Name"
            placeholder="Enter schedule name"
            value={formData.name}
            onChange={handleInputChange('name')}
            error={errors.name}
            required
          />

          <Input
            label="Test Suite ID"
            placeholder="e.g. ts_claims_unit"
            value={formData.testSuiteId}
            onChange={handleInputChange('testSuiteId')}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Frequency"
              options={frequencyOptions}
              value={formData.frequency}
              onValueChange={(val) => handleChange('frequency', val)}
            />
            <Select
              label="Environment"
              options={environmentOptions}
              value={formData.environment}
              onValueChange={(val) => handleChange('environment', val)}
            />
          </div>

          {formData.frequency === 'cron' ? (
            <Input
              label="Cron Expression"
              placeholder="e.g. 0 4 * * 1,3,5"
              value={formData.cronExpression}
              onChange={handleInputChange('cronExpression')}
              error={errors.cronExpression}
              required
            />
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Segment"
              options={SEGMENT_OPTIONS.filter((s) => s.value !== '')}
              value={formData.segment}
              onValueChange={(val) => handleChange('segment', val)}
            />
            <Select
              label="Application"
              placeholder="Select application"
              options={applicationOptions}
              value={formData.application}
              onValueChange={(val) => handleChange('application', val)}
            />
          </div>

          <Input
            label="Created By"
            placeholder="Enter creator name"
            value={formData.createdBy}
            onChange={handleInputChange('createdBy')}
            error={errors.createdBy}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium leading-none text-slate-700">
              Description
            </label>
            <textarea
              className={cn(
                'flex min-h-[80px] w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 transition-colors duration-200',
                'placeholder:text-slate-400',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                'hover:border-slate-400',
                'border-slate-300 focus-visible:border-humana-green-500'
              )}
              placeholder="Describe the schedule purpose..."
              value={formData.description}
              onChange={handleInputChange('description')}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" size="md" onClick={() => handleOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Save Changes' : 'Create Schedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ScheduleDetailDialog({ schedule, open, onOpenChange, onPause, onResume, onDisable, onDelete }) {
  const { hasPermission } = usePersona();

  if (!schedule) return null;

  const canManage = hasPermission(PERMISSIONS.EDIT_MEASURES);
  const notifications = schedule.notifications || {};
  const retryPolicy = schedule.retryPolicy || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Calendar className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{schedule.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {schedule.id} • {schedule.frequency} • {schedule.environment}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill status={schedule.status} size="md" dot />
          <Badge variant={getFrequencyBadgeVariant(schedule.frequency)} size="md">
            {schedule.frequency}
          </Badge>
          <Badge variant="outline" size="md">
            {schedule.environment}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Status</span>
            <p className="mt-1 text-lg font-semibold text-slate-900 capitalize">{schedule.status}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Frequency</span>
            <p className="mt-1 text-lg font-semibold text-slate-900 capitalize">{schedule.frequency}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Environment</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{schedule.environment}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Segment</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{schedule.segment}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Created By:</span>
            <span className="font-medium text-slate-900">{schedule.createdBy}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Created Date:</span>
            <span className="font-medium text-slate-900">{formatDate(schedule.createdDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Next Run:</span>
            <span className="font-medium text-slate-900">
              {schedule.nextRun ? formatDate(schedule.nextRun, 'MMM d, yyyy h:mm a') : '—'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Last Run:</span>
            <span className="font-medium text-slate-900">
              {schedule.lastRun ? formatDate(schedule.lastRun, 'MMM d, yyyy h:mm a') : '—'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Test Suite:</span>
            <span className="font-medium text-slate-900">{schedule.testSuiteId || '—'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Application:</span>
            <span className="font-medium text-slate-900">{schedule.application || '—'}</span>
          </div>
          {schedule.cronExpression ? (
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Cron Expression:</span>
              <span className="font-mono text-xs font-medium text-slate-900">{schedule.cronExpression}</span>
            </div>
          ) : null}
        </div>

        {schedule.description ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{schedule.description}</p>
          </div>
        ) : null}

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Notification Configuration</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-slate-200 p-3">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">On Success</span>
              <p className="mt-1 text-sm font-semibold text-slate-900">{notifications.onSuccess ? 'Yes' : 'No'}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">On Failure</span>
              <p className="mt-1 text-sm font-semibold text-slate-900">{notifications.onFailure ? 'Yes' : 'No'}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">On Skip</span>
              <p className="mt-1 text-sm font-semibold text-slate-900">{notifications.onSkip ? 'Yes' : 'No'}</p>
            </div>
          </div>
          {notifications.channels && notifications.channels.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-xs text-slate-500 mr-1">Channels:</span>
              {notifications.channels.map((ch) => (
                <Badge key={ch} variant="outline" size="sm">{ch}</Badge>
              ))}
            </div>
          ) : null}
          {notifications.recipients && notifications.recipients.length > 0 ? (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <span className="text-xs text-slate-500 mr-1">Recipients:</span>
              {notifications.recipients.map((r) => (
                <Badge key={r} variant="outline" size="sm">{r}</Badge>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Retry Policy</h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-slate-200 p-3">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Enabled</span>
              <p className="mt-1 text-sm font-semibold text-slate-900">{retryPolicy.enabled ? 'Yes' : 'No'}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Max Retries</span>
              <p className="mt-1 text-sm font-semibold text-slate-900">{retryPolicy.maxRetries || 0}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Delay</span>
              <p className="mt-1 text-sm font-semibold text-slate-900">{retryPolicy.retryDelaySeconds || 0}s</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Backoff</span>
              <p className="mt-1 text-sm font-semibold text-slate-900 capitalize">{retryPolicy.backoffStrategy || '—'}</p>
            </div>
          </div>
        </div>

        {canManage ? (
          <DialogFooter className="pt-4">
            {schedule.status === 'active' ? (
              <Button
                variant="outline"
                size="md"
                iconLeft={<Pause className="h-3.5 w-3.5" />}
                onClick={() => onPause(schedule.id)}
              >
                Pause
              </Button>
            ) : null}
            {schedule.status === 'paused' ? (
              <Button
                variant="primary"
                size="md"
                iconLeft={<Play className="h-3.5 w-3.5" />}
                onClick={() => onResume(schedule.id)}
              >
                Resume
              </Button>
            ) : null}
            {schedule.status !== 'disabled' ? (
              <Button
                variant="outline"
                size="md"
                iconLeft={<Ban className="h-3.5 w-3.5" />}
                onClick={() => onDisable(schedule.id)}
              >
                Disable
              </Button>
            ) : null}
            <Button
              variant="destructive"
              size="md"
              iconLeft={<Trash2 className="h-3.5 w-3.5" />}
              onClick={() => onDelete(schedule.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function AnalyticsPanel({ schedules }) {
  const statusData = useMemo(() => {
    const counts = {};
    for (const s of schedules) {
      counts[s.status] = (counts[s.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: status.charAt(0).toUpperCase() + status.slice(1),
    }));
  }, [schedules]);

  const frequencyData = useMemo(() => {
    const counts = {};
    for (const s of schedules) {
      counts[s.frequency] = (counts[s.frequency] || 0) + 1;
    }
    return Object.entries(counts).map(([frequency, count]) => ({
      frequency,
      count,
      label: frequency.charAt(0).toUpperCase() + frequency.slice(1),
    }));
  }, [schedules]);

  const environmentData = useMemo(() => {
    const counts = {};
    for (const s of schedules) {
      counts[s.environment] = (counts[s.environment] || 0) + 1;
    }
    return Object.entries(counts).map(([env, count]) => ({
      environment: env,
      count,
    }));
  }, [schedules]);

  const segmentData = useMemo(() => {
    const counts = {};
    for (const s of schedules) {
      counts[s.segment] = (counts[s.segment] || 0) + 1;
    }
    return Object.entries(counts).map(([segment, count]) => ({
      segment,
      count,
    }));
  }, [schedules]);

  const creatorData = useMemo(() => {
    const counts = {};
    for (const s of schedules) {
      counts[s.createdBy] = (counts[s.createdBy] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([creator, count]) => ({
        creator,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [schedules]);

  const applicationData = useMemo(() => {
    const counts = {};
    for (const s of schedules) {
      const appLabel = s.application ? (s.application.length > 20 ? s.application.substring(0, 20) + '…' : s.application) : 'Unknown';
      counts[appLabel] = (counts[appLabel] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([app, count]) => ({
        application: app,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [schedules]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PanelCard
        title="Schedules by Status"
        subtitle="Distribution across schedule statuses"
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
                <Tooltip formatter={(value, name) => [`${value} schedules`, name]} />
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
        title="Schedules by Frequency"
        subtitle="Distribution across execution frequencies"
        icon={<Timer className="h-5 w-5" />}
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
                <Tooltip formatter={(value, name) => [`${value} schedules`, name]} />
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
        title="Schedules by Environment"
        subtitle="Distribution across execution environments"
        icon={<Server className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={environmentData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="environment"
                tick={{ fontSize: 11, fill: '#64748b' }}
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
              <Bar dataKey="count" name="Schedules" radius={[4, 4, 0, 0]} barSize={32}>
                {environmentData.map((entry) => (
                  <Cell key={entry.environment} fill={ENVIRONMENT_COLORS[entry.environment] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Schedules by Segment"
        subtitle="Distribution across organizational segments"
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
              <Bar dataKey="count" name="Schedules" fill="#16b364" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Schedules by Creator"
        subtitle="Top schedule creators"
        icon={<User className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {creatorData.map((item) => (
            <div key={item.creator} className="flex items-center gap-3">
              <div className="w-28 shrink-0 truncate">
                <span className="text-sm font-medium text-slate-700">{item.creator}</span>
              </div>
              <div className="flex-1">
                <Progress
                  value={item.count}
                  max={schedules.length || 1}
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
        title="Schedules by Application"
        subtitle="Top applications with scheduled tests"
        icon={<Zap className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={applicationData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
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
                dataKey="application"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Schedules" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>
    </div>
  );
}

function SchedulerPageSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading scheduler" aria-busy="true">
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

/**
 * Scheduler page component.
 * Displays schedule list with name, test suite, frequency, next/last run, status.
 * Supports create, edit, pause, resume, disable, delete actions via dialogs.
 *
 * @returns {React.ReactElement}
 */
function SchedulerPage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();

  usePageHeader({ title: 'Test Execution Scheduler', subtitle: `Manage test execution schedules, frequencies, and automation for ${currentPersona.name}` });

  const [loading, setLoading] = useState(true);
  const [schedulesData, setSchedulesData] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [createEditOpen, setCreateEditOpen] = useState(false);
  const [createEditLoading, setCreateEditLoading] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [pauseConfirmOpen, setPauseConfirmOpen] = useState(false);
  const [pauseTarget, setPauseTarget] = useState(null);
  const [resumeConfirmOpen, setResumeConfirmOpen] = useState(false);
  const [resumeTarget, setResumeTarget] = useState(null);
  const [disableConfirmOpen, setDisableConfirmOpen] = useState(false);
  const [disableTarget, setDisableTarget] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    frequency: '',
    environment: '',
    segment: '',
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Measures', path: ROUTES.MEASURES },
      { label: 'Scheduler' },
    ]);
  }, [setBreadcrumbs]);

  const loadSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const filterParams = {};
      if (filters.status) filterParams.status = filters.status;
      if (filters.frequency) filterParams.frequency = filters.frequency;
      if (filters.environment) filterParams.environment = filters.environment;
      if (filters.segment) filterParams.segment = filters.segment;
      const data = await getSchedules(filterParams);
      setSchedulesData(data);
    } catch {
      setSchedulesData([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    loadSchedules();
  }, [loadSchedules]);

  const handleCreateClick = useCallback(() => {
    setEditTarget(null);
    setCreateEditOpen(true);
  }, []);

  const handleEditClick = useCallback((sched) => {
    setEditTarget(sched);
    setCreateEditOpen(true);
  }, []);

  const handleCreateEditSubmit = useCallback(
    async (formData) => {
      setCreateEditLoading(true);
      try {
        if (editTarget) {
          const updated = await editSchedule(editTarget.id, formData);
          logEvent('schedule_change', {
            action: 'Schedule Updated',
            details: `Schedule "${updated.name}" updated by ${currentPersona.name}.`,
            resource: updated.id,
            outcome: 'success',
            segment: updated.segment,
          });
          toast({
            variant: 'success',
            title: 'Schedule Updated',
            description: `"${updated.name}" has been updated successfully.`,
          });
        } else {
          const created = await createSchedule(formData);
          logEvent('schedule_change', {
            action: 'Schedule Created',
            details: `Schedule "${created.name}" created by ${currentPersona.name}.`,
            resource: created.id,
            outcome: 'success',
            segment: created.segment,
          });
          toast({
            variant: 'success',
            title: 'Schedule Created',
            description: `"${created.name}" has been created successfully.`,
          });
        }
        setCreateEditOpen(false);
        setEditTarget(null);
        await loadSchedules();
      } catch (err) {
        toast({
          variant: 'error',
          title: editTarget ? 'Update Failed' : 'Creation Failed',
          description: err && err.error ? err.error : 'An error occurred.',
        });
      } finally {
        setCreateEditLoading(false);
      }
    },
    [editTarget, currentPersona, logEvent, toast, loadSchedules]
  );

  const handleScheduleClick = useCallback((sched) => {
    setSelectedSchedule(sched);
    setDetailOpen(true);
  }, []);

  const handleDetailClose = useCallback((open) => {
    setDetailOpen(open);
    if (!open) {
      setSelectedSchedule(null);
    }
  }, []);

  const handlePauseClick = useCallback((scheduleId) => {
    setPauseTarget(scheduleId);
    setPauseConfirmOpen(true);
  }, []);

  const handlePauseConfirm = useCallback(async () => {
    if (!pauseTarget) return;
    try {
      const updated = await pauseSchedule(pauseTarget);
      logEvent('schedule_change', {
        action: 'Schedule Paused',
        details: `Schedule "${updated.name}" paused by ${currentPersona.name}.`,
        resource: updated.id,
        outcome: 'success',
        segment: updated.segment,
      });
      toast({
        variant: 'success',
        title: 'Schedule Paused',
        description: `"${updated.name}" has been paused.`,
      });
      setDetailOpen(false);
      setSelectedSchedule(null);
      await loadSchedules();
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Pause Failed',
        description: err && err.error ? err.error : 'Failed to pause schedule.',
      });
    }
  }, [pauseTarget, currentPersona, logEvent, toast, loadSchedules]);

  const handleResumeClick = useCallback((scheduleId) => {
    setResumeTarget(scheduleId);
    setResumeConfirmOpen(true);
  }, []);

  const handleResumeConfirm = useCallback(async () => {
    if (!resumeTarget) return;
    try {
      const updated = await resumeSchedule(resumeTarget);
      logEvent('schedule_change', {
        action: 'Schedule Resumed',
        details: `Schedule "${updated.name}" resumed by ${currentPersona.name}.`,
        resource: updated.id,
        outcome: 'success',
        segment: updated.segment,
      });
      toast({
        variant: 'success',
        title: 'Schedule Resumed',
        description: `"${updated.name}" has been resumed.`,
      });
      setDetailOpen(false);
      setSelectedSchedule(null);
      await loadSchedules();
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Resume Failed',
        description: err && err.error ? err.error : 'Failed to resume schedule.',
      });
    }
  }, [resumeTarget, currentPersona, logEvent, toast, loadSchedules]);

  const handleDisableClick = useCallback((scheduleId) => {
    setDisableTarget(scheduleId);
    setDisableConfirmOpen(true);
  }, []);

  const handleDisableConfirm = useCallback(async () => {
    if (!disableTarget) return;
    try {
      const updated = await disableSchedule(disableTarget);
      logEvent('schedule_change', {
        action: 'Schedule Disabled',
        details: `Schedule "${updated.name}" disabled by ${currentPersona.name}.`,
        resource: updated.id,
        outcome: 'success',
        segment: updated.segment,
      });
      toast({
        variant: 'success',
        title: 'Schedule Disabled',
        description: `"${updated.name}" has been disabled.`,
      });
      setDetailOpen(false);
      setSelectedSchedule(null);
      await loadSchedules();
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Disable Failed',
        description: err && err.error ? err.error : 'Failed to disable schedule.',
      });
    }
  }, [disableTarget, currentPersona, logEvent, toast, loadSchedules]);

  const handleDeleteClick = useCallback((scheduleId) => {
    setDeleteTarget(scheduleId);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteSchedule(deleteTarget);
      logEvent('schedule_change', {
        action: 'Schedule Deleted',
        details: `Schedule ${deleteTarget} deleted by ${currentPersona.name}.`,
        resource: deleteTarget,
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Schedule Deleted',
        description: 'The schedule has been deleted.',
      });
      setDetailOpen(false);
      setSelectedSchedule(null);
      await loadSchedules();
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Delete Failed',
        description: err && err.error ? err.error : 'Failed to delete schedule.',
      });
    }
  }, [deleteTarget, currentPersona, logEvent, toast, loadSchedules]);

  const handleExportCSV = useCallback(() => {
    try {
      const data = schedulesData.map((s) => ({
        id: s.id,
        name: s.name,
        testSuiteId: s.testSuiteId,
        frequency: s.frequency,
        cronExpression: s.cronExpression,
        status: s.status,
        environment: s.environment,
        segment: s.segment,
        application: s.application,
        createdBy: s.createdBy,
        createdDate: s.createdDate,
        nextRun: s.nextRun,
        lastRun: s.lastRun,
      }));
      downloadCSV(data, 'schedules.csv');
      logEvent('data_export', {
        action: 'Exported Schedules',
        details: `Schedules exported as CSV by ${currentPersona.name}. ${data.length} records.`,
        resource: '/measures',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} schedules exported as CSV.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export schedules.',
      });
    }
  }, [schedulesData, currentPersona, logEvent, toast]);

  const handleExportJSON = useCallback(() => {
    try {
      const data = schedulesData.map((s) => ({
        id: s.id,
        name: s.name,
        testSuiteId: s.testSuiteId,
        frequency: s.frequency,
        cronExpression: s.cronExpression,
        status: s.status,
        environment: s.environment,
        segment: s.segment,
        application: s.application,
        createdBy: s.createdBy,
        createdDate: s.createdDate,
        nextRun: s.nextRun,
        lastRun: s.lastRun,
      }));
      downloadJSON(data, 'schedules.json');
      logEvent('data_export', {
        action: 'Exported Schedules',
        details: `Schedules exported as JSON by ${currentPersona.name}. ${data.length} records.`,
        resource: '/measures',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} schedules exported as JSON.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export schedules.',
      });
    }
  }, [schedulesData, currentPersona, logEvent, toast]);

  const kpiData = useMemo(() => {
    const total = schedulesData.length;
    const active = schedulesData.filter((s) => s.status === 'active').length;
    const paused = schedulesData.filter((s) => s.status === 'paused').length;
    const disabled = schedulesData.filter((s) => s.status === 'disabled').length;

    return [
      {
        id: 'kpi_total',
        label: 'Total Schedules',
        value: total,
        unit: 'count',
        trend: 'stable',
        icon: <Calendar />,
        tone: 'blue',
        description: 'Total configured test execution schedules.',
      },
      {
        id: 'kpi_active',
        label: 'Active',
        value: active,
        unit: 'count',
        trend: 'improving',
        icon: <CheckCircle />,
        tone: 'green',
        description: 'Schedules currently active and running.',
      },
      {
        id: 'kpi_paused',
        label: 'Paused',
        value: paused,
        unit: 'count',
        trend: paused > 3 ? 'declining' : 'stable',
        icon: <Pause />,
        tone: 'orange',
        description: 'Schedules temporarily paused.',
      },
      {
        id: 'kpi_disabled',
        label: 'Disabled',
        value: disabled,
        unit: 'count',
        trend: 'stable',
        icon: <Ban />,
        tone: 'red',
        description: 'Schedules that have been disabled.',
      },
    ];
  }, [schedulesData]);

  const filterFields = useMemo(() => {
    const statusOptions = getAllScheduleStatuses().map((s) => ({
      value: s,
      label: s.charAt(0).toUpperCase() + s.slice(1),
    }));
    const frequencyOptions = getAllScheduleFrequencies().map((f) => ({
      value: f,
      label: f.charAt(0).toUpperCase() + f.slice(1),
    }));
    const environmentOptions = getAllScheduleEnvironments().map((e) => ({
      value: e,
      label: e,
    }));

    return [
      {
        id: 'status',
        label: 'Status',
        type: 'select',
        options: [{ value: '', label: 'All Statuses' }, ...statusOptions],
        defaultValue: '',
      },
      {
        id: 'frequency',
        label: 'Frequency',
        type: 'select',
        options: [{ value: '', label: 'All Frequencies' }, ...frequencyOptions],
        defaultValue: '',
      },
      {
        id: 'environment',
        label: 'Environment',
        type: 'select',
        options: [{ value: '', label: 'All Environments' }, ...environmentOptions],
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
        header: 'Schedule Name',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleScheduleClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors line-clamp-2"
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: 'testSuiteId',
        header: 'Test Suite',
        size: 130,
        cell: ({ row }) => (
          <span className="text-xs font-mono text-slate-500">{row.original.testSuiteId}</span>
        ),
      },
      {
        accessorKey: 'frequency',
        header: 'Frequency',
        size: 100,
        cell: ({ row }) => (
          <Badge variant={getFrequencyBadgeVariant(row.original.frequency)} size="sm">
            {row.original.frequency}
          </Badge>
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
        accessorKey: 'environment',
        header: 'Environment',
        size: 110,
        cell: ({ row }) => (
          <Badge variant="outline" size="sm">{row.original.environment}</Badge>
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
        accessorKey: 'nextRun',
        header: 'Next Run',
        size: 150,
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">
            {row.original.nextRun ? formatDate(row.original.nextRun, 'MMM d, yyyy h:mm a') : '—'}
          </span>
        ),
      },
      {
        accessorKey: 'lastRun',
        header: 'Last Run',
        size: 150,
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">
            {row.original.lastRun ? formatDate(row.original.lastRun, 'MMM d, yyyy h:mm a') : '—'}
          </span>
        ),
      },
      {
        accessorKey: 'createdBy',
        header: 'Creator',
        size: 120,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.createdBy}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 140,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5">
            <UITooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleScheduleClick(row.original)}
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
            <PermissionGate requiredAction={PERMISSIONS.EDIT_MEASURES} behavior="hidden">
              <UITooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(row.original);
                    }}
                    className={cn(
                      'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                      'hover:bg-slate-100 hover:text-slate-600',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                    )}
                    aria-label={`Edit ${row.original.name}`}
                  >
                    <Edit className="h-4 w-4" aria-hidden="true" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Edit</TooltipContent>
              </UITooltip>
            </PermissionGate>
            <PermissionGate requiredAction={PERMISSIONS.EDIT_MEASURES} behavior="hidden">
              {row.original.status === 'active' ? (
                <UITooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePauseClick(row.original.id);
                      }}
                      className={cn(
                        'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                        'hover:bg-slate-100 hover:text-slate-600',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                      )}
                      aria-label={`Pause ${row.original.name}`}
                    >
                      <Pause className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Pause</TooltipContent>
                </UITooltip>
              ) : row.original.status === 'paused' ? (
                <UITooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResumeClick(row.original.id);
                      }}
                      className={cn(
                        'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                        'hover:bg-slate-100 hover:text-slate-600',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                      )}
                      aria-label={`Resume ${row.original.name}`}
                    >
                      <Play className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Resume</TooltipContent>
                </UITooltip>
              ) : null}
            </PermissionGate>
          </div>
        ),
      },
    ],
    [handleScheduleClick, handleEditClick, handlePauseClick, handleResumeClick]
  );

  if (loading) {
    return <SchedulerPageSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Actions — portalled into the navbar (Create Schedule leftmost, then Refresh/Export left of the bell) */}
      <PageActions>
        <PermissionGate requiredAction={PERMISSIONS.EDIT_MEASURES} behavior="hidden">
          <Button
            variant="primary"
            size="sm"
            iconLeft={<Plus className="h-4 w-4" />}
            onClick={handleCreateClick}
          >
            Create Schedule
          </Button>
        </PermissionGate>

        <UITooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              iconLeft={<RefreshCw className="h-4 w-4" />}
              onClick={handleRefresh}
              aria-label="Refresh schedules"
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
                    aria-label="Export schedules"
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

      {/* Tabs: List / Cards / Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {schedulesData.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No schedules found"
              message="No schedules match the current filter criteria. Try adjusting your filters or create a new schedule."
              size="lg"
              bordered
              actionLabel={hasPermission(PERMISSIONS.EDIT_MEASURES) ? 'Create Schedule' : undefined}
              onAction={hasPermission(PERMISSIONS.EDIT_MEASURES) ? handleCreateClick : undefined}
              actionIcon={<Plus className="h-3.5 w-3.5" />}
            />
          ) : (
            <DataTable
              columns={tableColumns}
              data={schedulesData}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search schedules..."
              emptyMessage="No schedules match the search criteria."
              onRowClick={handleScheduleClick}
            />
          )}
        </TabsContent>

        <TabsContent value="cards">
          {schedulesData.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No schedules found"
              message="No schedules match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {schedulesData.map((sched) => (
                <Card
                  key={sched.id}
                  className={cn(
                    'p-5 cursor-pointer transition-all duration-200',
                    'hover:shadow-card-hover hover:border-humana-green-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                    'active:scale-[0.99]'
                  )}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleScheduleClick(sched)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleScheduleClick(sched);
                    }
                  }}
                  aria-label={`${sched.name}. Status: ${sched.status}. Frequency: ${sched.frequency}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
                        <Calendar className="h-4.5 w-4.5 text-humana-green-600" aria-hidden="true" />
                      </div>
                      <div className="flex flex-col gap-0 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">{sched.name}</h3>
                        <span className="text-2xs text-slate-500">{sched.segment} • {sched.createdBy}</span>
                      </div>
                    </div>
                    <StatusPill status={sched.status} size="sm" dot />
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-2xs text-slate-400 uppercase tracking-wider">Frequency</span>
                      <Badge variant={getFrequencyBadgeVariant(sched.frequency)} size="sm">
                        {sched.frequency}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-2xs text-slate-400 uppercase tracking-wider">Environment</span>
                      <Badge variant="outline" size="sm">{sched.environment}</Badge>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-2xs text-slate-400 uppercase tracking-wider">Suite</span>
                      <span className="text-xs font-mono text-slate-500 truncate">{sched.testSuiteId}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs text-slate-400">Next Run</span>
                      <span className="text-2xs text-slate-600">
                        {sched.nextRun ? formatDate(sched.nextRun, 'MMM d, h:mm a') : '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xs text-slate-400">Last Run</span>
                      <span className="text-2xs text-slate-600">
                        {sched.lastRun ? formatDate(sched.lastRun, 'MMM d, h:mm a') : '—'}
                      </span>
                    </div>
                  </div>

                  {sched.cronExpression ? (
                    <div className="mt-2">
                      <span className="text-2xs text-slate-400">Cron: </span>
                      <span className="text-2xs font-mono text-slate-600">{sched.cronExpression}</span>
                    </div>
                  ) : null}

                  <div className="mt-2.5 flex items-center justify-end">
                    <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {schedulesData.length === 0 ? (
            <EmptyState
              type="no_chart"
              title="No data for analytics"
              message="No schedules available to generate analytics. Try adjusting your filters."
              size="lg"
              bordered
            />
          ) : (
            <AnalyticsPanel schedules={schedulesData} />
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Panel */}
      {schedulesData.length > 0 && activeTab !== 'analytics' ? (
        <PanelCard
          title="Schedule Summary"
          subtitle={`${schedulesData.length} schedules across ${new Set(schedulesData.map((s) => s.segment)).size} segments`}
          icon={<Activity className="h-5 w-5" />}
          collapsible
          defaultCollapsed
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Active</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-success-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {schedulesData.filter((s) => s.status === 'active').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Paused</span>
              <div className="flex items-center gap-1.5">
                <Pause className="h-4 w-4 text-warning-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {schedulesData.filter((s) => s.status === 'paused').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Disabled</span>
              <div className="flex items-center gap-1.5">
                <Ban className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {schedulesData.filter((s) => s.status === 'disabled').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Total</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">{schedulesData.length}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {['daily', 'weekly', 'cron'].map((freq) => {
              const count = schedulesData.filter((s) => s.frequency === freq).length;
              return (
                <div key={freq} className="flex items-center gap-3">
                  <div className="w-16 shrink-0">
                    <Badge variant={getFrequencyBadgeVariant(freq)} size="sm" className="capitalize">{freq}</Badge>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={count}
                      max={schedulesData.length || 1}
                      variant="primary"
                      size="xs"
                      animate
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {Array.from(new Set(schedulesData.map((s) => s.environment))).sort().map((env) => {
              const count = schedulesData.filter((s) => s.environment === env).length;
              return (
                <div key={env} className="flex items-center gap-3">
                  <div className="w-24 shrink-0">
                    <Badge variant="outline" size="sm">{env}</Badge>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={count}
                      max={schedulesData.length || 1}
                      variant="info"
                      size="xs"
                      animate
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </PanelCard>
      ) : null}

      {/* Create/Edit Dialog */}
      <CreateEditDialog
        open={createEditOpen}
        onOpenChange={(open) => {
          setCreateEditOpen(open);
          if (!open) setEditTarget(null);
        }}
        onSubmit={handleCreateEditSubmit}
        loading={createEditLoading}
        schedule={editTarget}
      />

      {/* Detail Dialog */}
      <ScheduleDetailDialog
        schedule={selectedSchedule}
        open={detailOpen}
        onOpenChange={handleDetailClose}
        onPause={handlePauseClick}
        onResume={handleResumeClick}
        onDisable={handleDisableClick}
        onDelete={handleDeleteClick}
      />

      {/* Pause Confirmation */}
      <ConfirmDialog
        open={pauseConfirmOpen}
        onOpenChange={setPauseConfirmOpen}
        title="Pause Schedule"
        message="Are you sure you want to pause this schedule? It will stop executing until resumed."
        variant="warning"
        confirmLabel="Pause"
        cancelLabel="Cancel"
        onConfirm={handlePauseConfirm}
      />

      {/* Resume Confirmation */}
      <ConfirmDialog
        open={resumeConfirmOpen}
        onOpenChange={setResumeConfirmOpen}
        title="Resume Schedule"
        message="Are you sure you want to resume this schedule? It will start executing again on the next scheduled run."
        variant="info"
        confirmLabel="Resume"
        cancelLabel="Cancel"
        onConfirm={handleResumeConfirm}
      />

      {/* Disable Confirmation */}
      <ConfirmDialog
        open={disableConfirmOpen}
        onOpenChange={setDisableConfirmOpen}
        title="Disable Schedule"
        message="Are you sure you want to disable this schedule? It will be permanently stopped until manually re-enabled."
        variant="warning"
        confirmLabel="Disable"
        cancelLabel="Cancel"
        onConfirm={handleDisableConfirm}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Schedule"
        message="Are you sure you want to delete this schedule? This action cannot be undone."
        variant="delete"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

SchedulerPage.displayName = 'SchedulerPage';

export { SchedulerPage };
export default SchedulerPage;