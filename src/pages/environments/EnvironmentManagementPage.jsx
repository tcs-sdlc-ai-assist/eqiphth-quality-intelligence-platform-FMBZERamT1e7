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
  Server,
  Activity,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Calendar,
  Clock,
  BarChart2,
  Layers,
  FileText,
  ChevronRight,
  Shield,
  User,
  Zap,
  XCircle,
  Wifi,
  WifiOff,
  Settings,
  Lock,
  Unlock,
  MapPin,
  Monitor,
  Database,
  Globe,
  Wrench,
  Plus,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import {
  getEnvironments,
  reserveEnvironment,
} from '@/lib/mock-api/mockService';
import {
  getAllEnvironmentTypes,
  getAllEnvironmentStatuses,
  getEnvironmentAggregates,
} from '@/data/environments';
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
  available: '#10b981',
  reserved: '#3b82f6',
  maintenance: '#f59e0b',
  down: '#ef4444',
};

const TYPE_COLORS = {
  dev: '#16b364',
  qa: '#3b82f6',
  staging: '#8b5cf6',
  uat: '#f59e0b',
  prod: '#ef4444',
};

const HEALTH_COLORS = {
  healthy: '#10b981',
  degraded: '#f59e0b',
  unhealthy: '#ef4444',
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

function getStatusBadgeVariant(status) {
  switch (status) {
    case 'available':
      return 'success';
    case 'reserved':
      return 'info';
    case 'maintenance':
      return 'warning';
    case 'down':
      return 'error';
    default:
      return 'neutral';
  }
}

function getTypeBadgeVariant(type) {
  switch (type) {
    case 'dev':
      return 'primary';
    case 'qa':
      return 'info';
    case 'staging':
      return 'warning';
    case 'uat':
      return 'neutral';
    case 'prod':
      return 'error';
    default:
      return 'neutral';
  }
}

function getHealthScoreColor(score) {
  if (score >= 90) return '#10b981';
  if (score >= 70) return '#f59e0b';
  return '#ef4444';
}

function getHealthScoreVariant(score) {
  if (score >= 90) return 'success';
  if (score >= 70) return 'warning';
  return 'error';
}

function getStatusIcon(status) {
  switch (status) {
    case 'available':
      return CheckCircle;
    case 'reserved':
      return Lock;
    case 'maintenance':
      return Wrench;
    case 'down':
      return XCircle;
    default:
      return Server;
  }
}

function ReserveDialog({ open, onOpenChange, onSubmit, loading, environment }) {
  const { currentPersona } = usePersona();
  const [formData, setFormData] = useState({
    reservedBy: '',
    reservationStart: '',
    reservationEnd: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormData({
        reservedBy: currentPersona.name || '',
        reservationStart: new Date().toISOString().slice(0, 16),
        reservationEnd: '',
      });
      setErrors({});
    }
  }, [open, currentPersona.name]);

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
    if (!formData.reservedBy.trim()) {
      newErrors.reservedBy = 'Reserved by is required';
    }
    if (!formData.reservationStart.trim()) {
      newErrors.reservationStart = 'Start time is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    onSubmit({
      reservedBy: formData.reservedBy,
      reservationStart: formData.reservationStart ? new Date(formData.reservationStart).toISOString() : new Date().toISOString(),
      reservationEnd: formData.reservationEnd ? new Date(formData.reservationEnd).toISOString() : '',
    });
  }, [formData, validate, onSubmit]);

  if (!environment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reserve Environment</DialogTitle>
          <DialogDescription>
            Reserve &ldquo;{environment.name}&rdquo; for your testing activities.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <Input
            label="Reserved By"
            placeholder="Enter your name"
            value={formData.reservedBy}
            onChange={handleInputChange('reservedBy')}
            error={errors.reservedBy}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium leading-none text-slate-700">
              Start Time <span className="ml-0.5 text-danger-500" aria-hidden="true">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.reservationStart}
              onChange={handleInputChange('reservationStart')}
              className={cn(
                'flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                'hover:border-slate-400',
                errors.reservationStart && 'border-danger-500'
              )}
            />
            {errors.reservationStart ? (
              <p className="text-xs text-danger-500" role="alert">{errors.reservationStart}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium leading-none text-slate-700">
              End Time
            </label>
            <input
              type="datetime-local"
              value={formData.reservationEnd}
              onChange={handleInputChange('reservationEnd')}
              className={cn(
                'flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                'hover:border-slate-400'
              )}
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" size="md" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit} loading={loading}>
            Reserve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EnvironmentDetailDialog({ environment, open, onOpenChange, onReserve }) {
  const { hasPermission } = usePersona();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (open) {
      setActiveTab('overview');
    }
  }, [open]);

  if (!environment) return null;

  const healthChecks = environment.healthChecks || [];
  const conflictDetection = environment.conflictDetection || {};
  const activeConflicts = conflictDetection.activeConflicts || [];
  const applications = environment.applications || [];

  const healthyServices = healthChecks.filter((h) => h.status === 'healthy').length;
  const degradedServices = healthChecks.filter((h) => h.status === 'degraded').length;
  const unhealthyServices = healthChecks.filter((h) => h.status === 'unhealthy').length;

  const canReserve = hasPermission(PERMISSIONS.VIEW_MEASURES) && environment.status === 'available';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Server className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{environment.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {environment.id} • {environment.type} • {environment.region}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill status={environment.status} size="md" dot />
          <Badge variant={getTypeBadgeVariant(environment.type)} size="md">
            {environment.type.toUpperCase()}
          </Badge>
          <Badge variant="outline" size="md">
            {environment.region}
          </Badge>
          <Badge variant={getHealthScoreVariant(environment.healthScore)} size="md">
            Health: {environment.healthScore.toFixed(1)}%
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Health Score</span>
            <p className="mt-1 text-lg font-semibold" style={{ color: getHealthScoreColor(environment.healthScore) }}>
              {environment.healthScore.toFixed(1)}%
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Applications</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{applications.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Services</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{healthChecks.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Conflicts</span>
            <p className={cn(
              'mt-1 text-lg font-semibold',
              activeConflicts.length > 0 ? 'text-danger-600' : 'text-success-600'
            )}>
              {activeConflicts.length}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Owner:</span>
            <span className="font-medium text-slate-900">{environment.owner}</span>
          </div>
          {environment.reservedBy ? (
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Reserved By:</span>
              <span className="font-medium text-slate-900">{environment.reservedBy}</span>
            </div>
          ) : null}
          {environment.reservationStart ? (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Reservation:</span>
              <span className="font-medium text-slate-900">
                {formatDate(environment.reservationStart, 'MMM d, yyyy h:mm a')}
                {environment.reservationEnd ? ` — ${formatDate(environment.reservationEnd, 'MMM d, yyyy h:mm a')}` : ''}
              </span>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Region:</span>
            <span className="font-medium text-slate-900">{environment.region}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Last Deploy:</span>
            <span className="font-medium text-slate-900">{formatDate(environment.lastDeployDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Created:</span>
            <span className="font-medium text-slate-900">{formatDate(environment.createdDate)}</span>
          </div>
        </div>

        {environment.description ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{environment.description}</p>
          </div>
        ) : null}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="overview">Health Checks</TabsTrigger>
            <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
            <TabsTrigger value="conflicts">Conflicts ({activeConflicts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-success-500" aria-hidden="true" />
                  <span className="text-sm text-slate-700">{healthyServices} Healthy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-warning-500" aria-hidden="true" />
                  <span className="text-sm text-slate-700">{degradedServices} Degraded</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-danger-500" aria-hidden="true" />
                  <span className="text-sm text-slate-700">{unhealthyServices} Unhealthy</span>
                </div>
              </div>

              <div className="mt-1">
                <Progress
                  value={environment.healthScore}
                  max={100}
                  variant="auto"
                  size="md"
                  showValue
                  label="Overall Health Score"
                />
              </div>

              {healthChecks.length === 0 ? (
                <EmptyState
                  type="no_data"
                  title="No health checks"
                  message="No service health checks available for this environment."
                  size="sm"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Service</th>
                        <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Response Time</th>
                        <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Last Checked</th>
                        <th className="pb-2 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthChecks.map((hc, index) => (
                        <tr key={index} className="border-b border-slate-100 last:border-b-0">
                          <td className="py-2.5 font-medium text-slate-900">{hc.service}</td>
                          <td className="py-2.5 text-right text-slate-700">
                            {hc.responseTimeMs > 0 ? `${hc.responseTimeMs}ms` : '—'}
                          </td>
                          <td className="py-2.5 text-slate-500 text-xs">
                            {hc.lastChecked ? formatDate(hc.lastChecked, 'MMM d, h:mm a') : '—'}
                          </td>
                          <td className="py-2.5 text-center">
                            <StatusPill status={hc.status} size="sm" dot />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <div className="flex flex-col gap-2 pt-2">
              {applications.length === 0 ? (
                <EmptyState
                  type="no_data"
                  title="No applications"
                  message="No applications deployed to this environment."
                  size="sm"
                />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {applications.map((appId) => (
                    <Badge key={appId} variant="outline" size="sm">
                      {appId}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="conflicts">
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span className="text-sm text-slate-500">
                  Conflict Detection: {conflictDetection.enabled ? 'Enabled' : 'Disabled'}
                </span>
                {conflictDetection.strategy ? (
                  <Badge variant="outline" size="sm">
                    Strategy: {conflictDetection.strategy}
                  </Badge>
                ) : null}
              </div>

              {activeConflicts.length === 0 ? (
                <EmptyState
                  type="no_data"
                  title="No active conflicts"
                  message="No conflicts detected in this environment."
                  size="sm"
                  icon={<CheckCircle className="h-8 w-8 text-success-300" />}
                />
              ) : (
                <div className="flex flex-col gap-2">
                  {activeConflicts.map((conflict, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-warning-200 bg-warning-50/30 p-3"
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning-500 shrink-0 mt-0.5" aria-hidden="true" />
                        <p className="text-sm text-slate-700">{conflict}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {conflictDetection.lastChecked ? (
                <div className="mt-2 text-2xs text-slate-400">
                  Last checked: {formatDate(conflictDetection.lastChecked, 'MMM d, yyyy h:mm a')}
                </div>
              ) : null}
            </div>
          </TabsContent>
        </Tabs>

        {canReserve ? (
          <DialogFooter className="pt-4">
            <Button
              variant="primary"
              size="md"
              iconLeft={<Lock className="h-3.5 w-3.5" />}
              onClick={() => onReserve(environment)}
            >
              Reserve Environment
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function AnalyticsPanel({ environments }) {
  const statusData = useMemo(() => {
    const counts = {};
    for (const env of environments) {
      counts[env.status] = (counts[env.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: status.charAt(0).toUpperCase() + status.slice(1),
    }));
  }, [environments]);

  const typeData = useMemo(() => {
    const counts = {};
    for (const env of environments) {
      counts[env.type] = (counts[env.type] || 0) + 1;
    }
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      label: type.toUpperCase(),
    }));
  }, [environments]);

  const healthData = useMemo(() => {
    return environments
      .map((env) => ({
        name: env.name.length > 18 ? env.name.substring(0, 18) + '…' : env.name,
        healthScore: env.healthScore,
      }))
      .sort((a, b) => b.healthScore - a.healthScore);
  }, [environments]);

  const regionData = useMemo(() => {
    const counts = {};
    for (const env of environments) {
      counts[env.region] = (counts[env.region] || 0) + 1;
    }
    return Object.entries(counts).map(([region, count]) => ({
      region,
      count,
    }));
  }, [environments]);

  const conflictData = useMemo(() => {
    const withConflicts = environments.filter(
      (e) => e.conflictDetection && e.conflictDetection.activeConflicts && e.conflictDetection.activeConflicts.length > 0
    ).length;
    const withoutConflicts = environments.length - withConflicts;
    return [
      { label: 'With Conflicts', count: withConflicts },
      { label: 'No Conflicts', count: withoutConflicts },
    ];
  }, [environments]);

  const appCountData = useMemo(() => {
    return environments
      .map((env) => ({
        name: env.name.length > 18 ? env.name.substring(0, 18) + '…' : env.name,
        apps: env.applications ? env.applications.length : 0,
      }))
      .sort((a, b) => b.apps - a.apps)
      .slice(0, 10);
  }, [environments]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PanelCard
        title="Environments by Status"
        subtitle="Distribution across environment statuses"
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
                <Tooltip formatter={(value, name) => [`${value} environments`, name]} />
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
        title="Environments by Type"
        subtitle="Distribution across environment types"
        icon={<Layers className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
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
              <Bar dataKey="count" name="Environments" radius={[4, 4, 0, 0]} barSize={32}>
                {typeData.map((entry) => (
                  <Cell key={entry.type} fill={TYPE_COLORS[entry.type] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Health Score Rankings"
        subtitle="Environments ranked by health score"
        icon={<Activity className="h-5 w-5" />}
      >
        <ChartWrapper height={300} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={healthData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                angle={-35}
                textAnchor="end"
                height={70}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Bar dataKey="healthScore" name="Health Score" radius={[4, 4, 0, 0]} barSize={18}>
                {healthData.map((entry) => (
                  <Cell key={entry.name} fill={getHealthScoreColor(entry.healthScore)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Conflict Detection"
        subtitle="Environments with and without active conflicts"
        icon={<AlertTriangle className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conflictData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} environments`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {conflictData.map((item, index) => (
              <div key={item.label} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: index === 0 ? '#ef4444' : '#10b981' }}
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
        title="Applications per Environment"
        subtitle="Top environments by deployed application count"
        icon={<Database className="h-5 w-5" />}
      >
        <ChartWrapper height={280} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={appCountData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
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
              <Bar dataKey="apps" name="Applications" fill="#16b364" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Environments by Region"
        subtitle="Geographic distribution of environments"
        icon={<MapPin className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {regionData.map((item) => (
            <div key={item.region} className="flex items-center gap-3">
              <div className="w-28 shrink-0">
                <Badge variant="outline" size="sm">{item.region}</Badge>
              </div>
              <div className="flex-1">
                <Progress
                  value={item.count}
                  max={environments.length || 1}
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

function EnvironmentManagementSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading environment management" aria-busy="true">
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
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Environment Management page component.
 * Displays environment inventory with status, reservation calendar/list,
 * conflict detection, health scores. Supports reserve, release, update
 * status actions (simulated).
 *
 * @returns {React.ReactElement}
 */
function EnvironmentManagementPage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [environments, setEnvironments] = useState([]);
  const [activeTab, setActiveTab] = useState('cards');
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [reserveTarget, setReserveTarget] = useState(null);
  const [reserveLoading, setReserveLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Settings', path: ROUTES.SETTINGS },
      { label: 'Environment Management' },
    ]);
  }, [setBreadcrumbs]);

  const loadEnvironments = useCallback(async () => {
    setLoading(true);
    try {
      const filterParams = {};
      if (filters.type) filterParams.type = filters.type;
      if (filters.status) filterParams.status = filters.status;
      const data = await getEnvironments(filterParams);
      setEnvironments(data);
    } catch {
      setEnvironments([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadEnvironments();
  }, [loadEnvironments]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    loadEnvironments();
  }, [loadEnvironments]);

  const handleEnvironmentClick = useCallback((env) => {
    setSelectedEnvironment(env);
    setDetailOpen(true);
  }, []);

  const handleDetailClose = useCallback((open) => {
    setDetailOpen(open);
    if (!open) {
      setSelectedEnvironment(null);
    }
  }, []);

  const handleReserveClick = useCallback((env) => {
    setReserveTarget(env);
    setDetailOpen(false);
    setSelectedEnvironment(null);
    setReserveOpen(true);
  }, []);

  const handleReserveSubmit = useCallback(
    async (reservationData) => {
      if (!reserveTarget) return;
      setReserveLoading(true);
      try {
        const updated = await reserveEnvironment(reserveTarget.id, reservationData);
        logEvent('environment_action', {
          action: 'Environment Reserved',
          details: `Environment "${updated.name}" reserved by ${reservationData.reservedBy} via ${currentPersona.name}.`,
          resource: updated.id,
          outcome: 'success',
        });
        toast({
          variant: 'success',
          title: 'Environment Reserved',
          description: `"${updated.name}" has been reserved by ${reservationData.reservedBy}.`,
        });
        setReserveOpen(false);
        setReserveTarget(null);
        await loadEnvironments();
      } catch (err) {
        toast({
          variant: 'error',
          title: 'Reservation Failed',
          description: err && err.error ? err.error : 'Failed to reserve environment.',
        });
      } finally {
        setReserveLoading(false);
      }
    },
    [reserveTarget, currentPersona, logEvent, toast, loadEnvironments]
  );

  const handleExportCSV = useCallback(() => {
    try {
      const data = environments.map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        status: e.status,
        healthScore: e.healthScore,
        region: e.region,
        owner: e.owner,
        reservedBy: e.reservedBy || '',
        applications: e.applications ? e.applications.length : 0,
        conflicts: e.conflictDetection && e.conflictDetection.activeConflicts ? e.conflictDetection.activeConflicts.length : 0,
        lastDeployDate: e.lastDeployDate,
        createdDate: e.createdDate,
      }));
      downloadCSV(data, 'environments.csv');
      logEvent('data_export', {
        action: 'Exported Environments',
        details: `Environments exported as CSV by ${currentPersona.name}. ${data.length} records.`,
        resource: '/settings',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} environments exported as CSV.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export environments.',
      });
    }
  }, [environments, currentPersona, logEvent, toast]);

  const handleExportJSON = useCallback(() => {
    try {
      const data = environments.map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        status: e.status,
        healthScore: e.healthScore,
        region: e.region,
        owner: e.owner,
        reservedBy: e.reservedBy || '',
        applications: e.applications ? e.applications.length : 0,
        conflicts: e.conflictDetection && e.conflictDetection.activeConflicts ? e.conflictDetection.activeConflicts.length : 0,
        lastDeployDate: e.lastDeployDate,
        createdDate: e.createdDate,
      }));
      downloadJSON(data, 'environments.json');
      logEvent('data_export', {
        action: 'Exported Environments',
        details: `Environments exported as JSON by ${currentPersona.name}. ${data.length} records.`,
        resource: '/settings',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} environments exported as JSON.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export environments.',
      });
    }
  }, [environments, currentPersona, logEvent, toast]);

  const kpiData = useMemo(() => {
    const total = environments.length;
    const available = environments.filter((e) => e.status === 'available').length;
    const reserved = environments.filter((e) => e.status === 'reserved').length;
    const down = environments.filter((e) => e.status === 'down').length;
    const maintenance = environments.filter((e) => e.status === 'maintenance').length;
    const avgHealth = total > 0
      ? Math.round((environments.reduce((sum, e) => sum + e.healthScore, 0) / total) * 10) / 10
      : 0;
    const withConflicts = environments.filter(
      (e) => e.conflictDetection && e.conflictDetection.activeConflicts && e.conflictDetection.activeConflicts.length > 0
    ).length;

    return [
      {
        id: 'kpi_total',
        label: 'Total Environments',
        value: total,
        unit: 'count',
        trend: 'stable',
        status: 'on_track',
        description: 'Total environments in the inventory.',
      },
      {
        id: 'kpi_available',
        label: 'Available',
        value: available,
        unit: 'count',
        trend: available > 5 ? 'improving' : 'stable',
        status: available > 3 ? 'on_track' : 'at_risk',
        description: 'Environments available for use.',
      },
      {
        id: 'kpi_avg_health',
        label: 'Avg Health Score',
        value: avgHealth,
        unit: 'percent',
        trend: avgHealth >= 85 ? 'improving' : avgHealth >= 70 ? 'stable' : 'declining',
        status: avgHealth >= 85 ? 'on_track' : avgHealth >= 70 ? 'at_risk' : 'critical',
        description: 'Average health score across all environments.',
      },
      {
        id: 'kpi_issues',
        label: 'Issues',
        value: down + maintenance + withConflicts,
        unit: 'count',
        trend: (down + maintenance + withConflicts) > 3 ? 'declining' : 'stable',
        status: (down + maintenance) > 2 ? 'critical' : (down + maintenance + withConflicts) > 3 ? 'at_risk' : 'on_track',
        description: 'Environments down, in maintenance, or with conflicts.',
      },
    ];
  }, [environments]);

  const filterFields = useMemo(() => {
    const typeOptions = getAllEnvironmentTypes().map((t) => ({
      value: t,
      label: t.toUpperCase(),
    }));
    const statusOptions = getAllEnvironmentStatuses().map((s) => ({
      value: s,
      label: s.charAt(0).toUpperCase() + s.slice(1),
    }));

    return [
      {
        id: 'type',
        label: 'Type',
        type: 'select',
        options: [{ value: '', label: 'All Types' }, ...typeOptions],
        defaultValue: '',
      },
      {
        id: 'status',
        label: 'Status',
        type: 'select',
        options: [{ value: '', label: 'All Statuses' }, ...statusOptions],
        defaultValue: '',
      },
    ];
  }, []);

  const tableColumns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Environment',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleEnvironmentClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors"
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 80,
        cell: ({ row }) => (
          <Badge variant={getTypeBadgeVariant(row.original.type)} size="sm">
            {row.original.type.toUpperCase()}
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
        accessorKey: 'healthScore',
        header: 'Health',
        size: 120,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Progress
              value={row.original.healthScore}
              max={100}
              variant="auto"
              size="xs"
              className="flex-1"
            />
            <span className="text-xs font-medium text-slate-700 w-12 text-right">
              {row.original.healthScore.toFixed(1)}%
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'region',
        header: 'Region',
        size: 100,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.region}</span>
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
        accessorKey: 'reservedBy',
        header: 'Reserved By',
        size: 130,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.reservedBy || '—'}</span>
        ),
      },
      {
        id: 'apps',
        header: 'Apps',
        size: 60,
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">
            {row.original.applications ? row.original.applications.length : 0}
          </span>
        ),
      },
      {
        id: 'conflicts',
        header: 'Conflicts',
        size: 80,
        enableSorting: false,
        cell: ({ row }) => {
          const count = row.original.conflictDetection && row.original.conflictDetection.activeConflicts
            ? row.original.conflictDetection.activeConflicts.length
            : 0;
          return count > 0 ? (
            <Badge variant="error" size="sm">{count}</Badge>
          ) : (
            <span className="text-xs text-slate-400">0</span>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        size: 100,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5">
            <UITooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleEnvironmentClick(row.original)}
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
            {row.original.status === 'available' ? (
              <UITooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReserveClick(row.original);
                    }}
                    className={cn(
                      'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                      'hover:bg-slate-100 hover:text-slate-600',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                    )}
                    aria-label={`Reserve ${row.original.name}`}
                  >
                    <Lock className="h-4 w-4" aria-hidden="true" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Reserve</TooltipContent>
              </UITooltip>
            ) : null}
          </div>
        ),
      },
    ],
    [handleEnvironmentClick, handleReserveClick]
  );

  const insightData = useMemo(() => {
    if (environments.length === 0) return null;

    const downEnvs = environments.filter((e) => e.status === 'down');
    const maintenanceEnvs = environments.filter((e) => e.status === 'maintenance');
    const conflictEnvs = environments.filter(
      (e) => e.conflictDetection && e.conflictDetection.activeConflicts && e.conflictDetection.activeConflicts.length > 0
    );
    const unhealthyEnvs = environments.filter((e) => e.healthScore < 70);

    if (downEnvs.length > 0) {
      return {
        variant: 'critical',
        title: `${downEnvs.length} environment${downEnvs.length > 1 ? 's' : ''} down`,
        message: `${downEnvs.map((e) => e.name).join(', ')} ${downEnvs.length > 1 ? 'are' : 'is'} currently offline. Immediate attention required to restore service availability.`,
        source: 'Environment Guardian Agent',
        confidence: 98,
      };
    }

    if (maintenanceEnvs.length > 0 || conflictEnvs.length > 0) {
      const issues = [];
      if (maintenanceEnvs.length > 0) {
        issues.push(`${maintenanceEnvs.length} under maintenance`);
      }
      if (conflictEnvs.length > 0) {
        issues.push(`${conflictEnvs.length} with active conflicts`);
      }
      return {
        variant: 'warning',
        title: `Environment issues detected: ${issues.join(', ')}`,
        message: `${unhealthyEnvs.length} environment${unhealthyEnvs.length !== 1 ? 's have' : ' has'} health scores below 70%. Review environment health and resolve conflicts to ensure testing continuity.`,
        source: 'Environment Guardian Agent',
        confidence: 91,
      };
    }

    return {
      variant: 'success',
      title: 'All environments healthy',
      message: `All ${environments.length} environments are operational with an average health score of ${(environments.reduce((sum, e) => sum + e.healthScore, 0) / environments.length).toFixed(1)}%.`,
      source: 'Environment Guardian Agent',
      confidence: 95,
    };
  }, [environments]);

  const reservationList = useMemo(() => {
    return environments
      .filter((e) => e.status === 'reserved' && e.reservedBy)
      .sort((a, b) => {
        if (a.reservationStart && b.reservationStart) {
          return new Date(a.reservationStart) - new Date(b.reservationStart);
        }
        return 0;
      });
  }, [environments]);

  if (loading) {
    return <EnvironmentManagementSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">Environment Management</h1>
          <p className="text-sm text-slate-500">
            Environment inventory, health monitoring, reservations, and conflict detection for {currentPersona.name}
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
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="reservations">Reservations ({reservationList.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="cards">
          {environments.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No environments found"
              message="No environments match the current filter criteria. Try adjusting your filters."
              size="lg"
              bordered
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {environments.map((env) => {
                const StatusIcon = getStatusIcon(env.status);
                const conflictCount = env.conflictDetection && env.conflictDetection.activeConflicts
                  ? env.conflictDetection.activeConflicts.length
                  : 0;
                const serviceCount = env.healthChecks ? env.healthChecks.length : 0;
                const healthyCount = env.healthChecks ? env.healthChecks.filter((h) => h.status === 'healthy').length : 0;

                return (
                  <Card
                    key={env.id}
                    className={cn(
                      'p-5 cursor-pointer transition-all duration-200',
                      'hover:shadow-card-hover hover:border-humana-green-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                      'active:scale-[0.99]',
                      env.status === 'down' && 'border-danger-200'
                    )}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleEnvironmentClick(env)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleEnvironmentClick(env);
                      }
                    }}
                    aria-label={`${env.name}. Status: ${env.status}. Health: ${env.healthScore.toFixed(0)}%`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${STATUS_COLORS[env.status] || '#64748b'}15` }}
                        >
                          <StatusIcon
                            className="h-4.5 w-4.5"
                            style={{ color: STATUS_COLORS[env.status] || '#64748b' }}
                            aria-hidden="true"
                          />
                        </div>
                        <div className="flex flex-col gap-0 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">{env.name}</h3>
                          <span className="text-2xs text-slate-500">{env.owner} • {env.region}</span>
                        </div>
                      </div>
                      <StatusPill status={env.status} size="sm" dot />
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-2xs text-slate-400 uppercase tracking-wider">Type</span>
                        <Badge variant={getTypeBadgeVariant(env.type)} size="sm">
                          {env.type.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-2xs text-slate-400 uppercase tracking-wider">Apps</span>
                        <span className="text-sm font-semibold text-slate-900">
                          {env.applications ? env.applications.length : 0}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-2xs text-slate-400 uppercase tracking-wider">Services</span>
                        <span className="text-sm font-semibold text-slate-900">
                          {healthyCount}/{serviceCount}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-2xs text-slate-400">Health Score</span>
                        <span
                          className="text-2xs font-medium"
                          style={{ color: getHealthScoreColor(env.healthScore) }}
                        >
                          {env.healthScore.toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={env.healthScore}
                        max={100}
                        variant="auto"
                        size="xs"
                        animate
                      />
                    </div>

                    {env.reservedBy ? (
                      <div className="mt-2.5 flex items-center gap-1.5">
                        <Lock className="h-3 w-3 text-info-500" aria-hidden="true" />
                        <span className="text-2xs text-slate-500 truncate">
                          Reserved by {env.reservedBy}
                        </span>
                      </div>
                    ) : null}

                    {conflictCount > 0 ? (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <AlertTriangle className="h-3 w-3 text-warning-500" aria-hidden="true" />
                        <span className="text-2xs text-warning-600">
                          {conflictCount} active conflict{conflictCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    ) : null}

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-2xs text-slate-400">
                        Last deploy: {formatDate(env.lastDeployDate)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list">
          {environments.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No environments found"
              message="No environments match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={tableColumns}
              data={environments}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search environments..."
              emptyMessage="No environments match the search criteria."
              onRowClick={handleEnvironmentClick}
            />
          )}
        </TabsContent>

        <TabsContent value="reservations">
          {reservationList.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No active reservations"
              message="No environments are currently reserved. Reserve an available environment to get started."
              size="lg"
              bordered
            />
          ) : (
            <PanelCard
              title="Active Reservations"
              subtitle={`${reservationList.length} environment${reservationList.length !== 1 ? 's' : ''} currently reserved`}
              icon={<Calendar className="h-5 w-5" />}
            >
              <div className="flex flex-col gap-3">
                {reservationList.map((env) => (
                  <div
                    key={env.id}
                    className={cn(
                      'flex items-start gap-4 rounded-lg border border-slate-200 p-4 transition-all duration-200',
                      'hover:shadow-card-hover hover:border-humana-green-200 cursor-pointer'
                    )}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleEnvironmentClick(env)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleEnvironmentClick(env);
                      }
                    }}
                  >
                    <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-info-50">
                      <Lock className="h-5 w-5 text-info-500" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">{env.name}</h3>
                          <span className="text-2xs text-slate-500">
                            {env.type.toUpperCase()} • {env.region} • {env.owner}
                          </span>
                        </div>
                        <Badge variant={getTypeBadgeVariant(env.type)} size="sm">
                          {env.type.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                          <span className="text-slate-500">Reserved by:</span>
                          <span className="font-medium text-slate-900">{env.reservedBy}</span>
                        </div>
                        {env.reservationStart ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                            <span className="text-slate-500">Period:</span>
                            <span className="font-medium text-slate-900 text-xs">
                              {formatDate(env.reservationStart, 'MMM d, h:mm a')}
                              {env.reservationEnd ? ` — ${formatDate(env.reservationEnd, 'MMM d, h:mm a')}` : ' — Open-ended'}
                            </span>
                          </div>
                        ) : null}
                      </div>
                      <div className="mt-2">
                        <Progress
                          value={env.healthScore}
                          max={100}
                          variant="auto"
                          size="xs"
                          animate
                        />
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-3" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </PanelCard>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {environments.length === 0 ? (
            <EmptyState
              type="no_chart"
              title="No data for analytics"
              message="No environments available to generate analytics. Try adjusting your filters."
              size="lg"
              bordered
            />
          ) : (
            <AnalyticsPanel environments={environments} />
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Panel */}
      {environments.length > 0 && activeTab !== 'analytics' ? (
        <PanelCard
          title="Environment Summary"
          subtitle={`${environments.length} environments across ${new Set(environments.map((e) => e.type)).size} types`}
          icon={<Activity className="h-5 w-5" />}
          collapsible
          defaultCollapsed
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Available</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-success-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {environments.filter((e) => e.status === 'available').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Reserved</span>
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-info-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {environments.filter((e) => e.status === 'reserved').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Maintenance</span>
              <div className="flex items-center gap-1.5">
                <Wrench className="h-4 w-4 text-warning-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {environments.filter((e) => e.status === 'maintenance').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Down</span>
              <div className="flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-danger-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {environments.filter((e) => e.status === 'down').length}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {getAllEnvironmentTypes().map((type) => {
              const count = environments.filter((e) => e.type === type).length;
              if (count === 0) return null;
              return (
                <div key={type} className="flex items-center gap-3">
                  <div className="w-16 shrink-0">
                    <Badge variant={getTypeBadgeVariant(type)} size="sm">{type.toUpperCase()}</Badge>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={count}
                      max={environments.length || 1}
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

          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Average Health Score</h4>
            <Progress
              value={
                environments.length > 0
                  ? environments.reduce((sum, e) => sum + e.healthScore, 0) / environments.length
                  : 0
              }
              max={100}
              variant="auto"
              size="md"
              showValue
              label="Platform Average"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Total Applications Deployed</h4>
            <span className="text-2xl font-semibold text-slate-900">
              {formatNumber(environments.reduce((sum, e) => sum + (e.applications ? e.applications.length : 0), 0))}
            </span>
            <span className="text-sm text-slate-500 ml-2">across all environments</span>
          </div>
        </PanelCard>
      ) : null}

      {/* Detail Dialog */}
      <EnvironmentDetailDialog
        environment={selectedEnvironment}
        open={detailOpen}
        onOpenChange={handleDetailClose}
        onReserve={handleReserveClick}
      />

      {/* Reserve Dialog */}
      <ReserveDialog
        open={reserveOpen}
        onOpenChange={(open) => {
          setReserveOpen(open);
          if (!open) setReserveTarget(null);
        }}
        onSubmit={handleReserveSubmit}
        loading={reserveLoading}
        environment={reserveTarget}
      />
    </div>
  );
}

EnvironmentManagementPage.displayName = 'EnvironmentManagementPage';

export { EnvironmentManagementPage };
export default EnvironmentManagementPage;