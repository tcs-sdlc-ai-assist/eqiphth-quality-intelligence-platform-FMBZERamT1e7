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
  Database,
  Activity,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Plus,
  Eye,
  Edit,
  Shield,
  Clock,
  BarChart2,
  Layers,
  FileText,
  ChevronRight,
  User,
  Calendar,
  Zap,
  Lock,
  Unlock,
  Server,
  Archive,
  RotateCcw,
  XCircle,
  Search,
  Upload,
  HardDrive,
  ShieldCheck,
  History,
  Tag,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation, usePageHeader } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import {
  getTestDataAssets,
} from '@/lib/mock-api/mockService';
import {
  getAllTestDataTypes,
  getAllTestDataStatuses,
  getAllMaskingStatuses,
  getAllProvisioningStatuses,
  getAllTestDataEnvironments,
} from '@/data/testData';
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
import { PageActions } from '@/components/layout/PageActions';
import { PERMISSIONS, ROUTES } from '@/lib/constants';

const TYPE_COLORS = {
  synthetic: '#16b364',
  masked_production: '#3b82f6',
  golden: '#f59e0b',
  seed: '#8b5cf6',
  reference: '#06b6d4',
  snapshot: '#a3a3a3',
  subset: '#ef4444',
};

const STATUS_COLORS = {
  active: '#10b981',
  stale: '#f59e0b',
  archived: '#a3a3a3',
  provisioning: '#3b82f6',
  error: '#ef4444',
};

const MASKING_COLORS = {
  fully_masked: '#10b981',
  partially_masked: '#f59e0b',
  not_masked: '#ef4444',
  not_applicable: '#a3a3a3',
};

const PROVISIONING_COLORS = {
  provisioned: '#10b981',
  pending: '#f59e0b',
  in_progress: '#3b82f6',
  failed: '#ef4444',
  not_provisioned: '#a3a3a3',
};

const ENVIRONMENT_COLORS = {
  QA: '#16b364',
  Staging: '#3b82f6',
  Performance: '#8b5cf6',
  Production: '#ef4444',
  Development: '#f59e0b',
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
          {entry.name}: {typeof entry.value === 'number' ? entry.value : entry.value}
          {unit}
        </p>
      ))}
    </div>
  );
}

function getTypeBadgeVariant(type) {
  switch (type) {
    case 'synthetic':
      return 'primary';
    case 'masked_production':
      return 'info';
    case 'golden':
      return 'warning';
    case 'seed':
      return 'neutral';
    case 'reference':
      return 'success';
    case 'snapshot':
      return 'neutral';
    case 'subset':
      return 'error';
    default:
      return 'neutral';
  }
}

function getStatusBadgeVariant(status) {
  switch (status) {
    case 'active':
      return 'success';
    case 'stale':
      return 'warning';
    case 'archived':
      return 'neutral';
    case 'provisioning':
      return 'info';
    case 'error':
      return 'error';
    default:
      return 'neutral';
  }
}

function getMaskingBadgeVariant(maskingStatus) {
  switch (maskingStatus) {
    case 'fully_masked':
      return 'success';
    case 'partially_masked':
      return 'warning';
    case 'not_masked':
      return 'error';
    case 'not_applicable':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getProvisioningBadgeVariant(provisioningStatus) {
  switch (provisioningStatus) {
    case 'provisioned':
      return 'success';
    case 'pending':
      return 'warning';
    case 'in_progress':
      return 'info';
    case 'failed':
      return 'error';
    case 'not_provisioned':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function formatLabel(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function TestDataDetailDialog({ testData, open, onOpenChange, onRefresh, onMask, onRetire, onProvision }) {
  const { hasPermission } = usePersona();

  if (!testData) return null;

  const auditTrail = testData.auditTrail || [];
  const canManage = hasPermission(PERMISSIONS.EDIT_PATIENTS);
  const isActive = testData.status === 'active' || testData.status === 'stale';
  const canRefresh = canManage && isActive;
  const canMask = canManage && (testData.maskingStatus === 'not_masked' || testData.maskingStatus === 'partially_masked');
  const canRetire = canManage && testData.status !== 'archived';
  const canProvision = canManage && (testData.provisioningStatus === 'not_provisioned' || testData.provisioningStatus === 'failed');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Database className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{testData.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {testData.id} • {formatLabel(testData.type)} • {testData.environment}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill status={testData.status} size="md" dot />
          <Badge variant={getTypeBadgeVariant(testData.type)} size="md">
            {formatLabel(testData.type)}
          </Badge>
          <Badge variant={getMaskingBadgeVariant(testData.maskingStatus)} size="md">
            {formatLabel(testData.maskingStatus)}
          </Badge>
          <Badge variant={getProvisioningBadgeVariant(testData.provisioningStatus)} size="md">
            {formatLabel(testData.provisioningStatus)}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Status</span>
            <p className="mt-1 text-lg font-semibold text-slate-900 capitalize">{testData.status}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Type</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{formatLabel(testData.type)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Environment</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{testData.environment}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Last Refreshed</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(testData.lastRefreshed)}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Created By:</span>
            <span className="font-medium text-slate-900">{testData.createdBy}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Application:</span>
            <span className="font-medium text-slate-900">{testData.application || '—'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Environment:</span>
            <span className="font-medium text-slate-900">{testData.environment}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Last Refreshed:</span>
            <span className="font-medium text-slate-900">{formatDate(testData.lastRefreshed)}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Masking Status:</span>
            <Badge variant={getMaskingBadgeVariant(testData.maskingStatus)} size="sm">
              {formatLabel(testData.maskingStatus)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Provisioning Status:</span>
            <Badge variant={getProvisioningBadgeVariant(testData.provisioningStatus)} size="sm">
              {formatLabel(testData.provisioningStatus)}
            </Badge>
          </div>
        </div>

        {auditTrail.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
              <History className="h-4 w-4 text-slate-400" aria-hidden="true" />
              Audit Trail ({auditTrail.length})
            </h4>
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
              {auditTrail.map((entry, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <StatusPill status={entry.action} size="sm" />
                        <span className="text-xs text-slate-500">{entry.performedBy}</span>
                      </div>
                      <p className="text-sm text-slate-700 mt-1">{entry.details}</p>
                    </div>
                    <span className="text-2xs text-slate-400 shrink-0">
                      {entry.timestamp ? formatDate(entry.timestamp, 'MMM d, yyyy h:mm a') : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {canManage ? (
          <DialogFooter className="pt-4">
            {canRefresh ? (
              <Button
                variant="outline"
                size="md"
                iconLeft={<RotateCcw className="h-3.5 w-3.5" />}
                onClick={() => onRefresh(testData.id)}
              >
                Refresh
              </Button>
            ) : null}
            {canMask ? (
              <Button
                variant="outline"
                size="md"
                iconLeft={<ShieldCheck className="h-3.5 w-3.5" />}
                onClick={() => onMask(testData.id)}
              >
                Apply Masking
              </Button>
            ) : null}
            {canProvision ? (
              <Button
                variant="primary"
                size="md"
                iconLeft={<Upload className="h-3.5 w-3.5" />}
                onClick={() => onProvision(testData.id)}
              >
                Provision
              </Button>
            ) : null}
            {canRetire ? (
              <Button
                variant="outline"
                size="md"
                iconLeft={<Archive className="h-3.5 w-3.5" />}
                onClick={() => onRetire(testData.id)}
              >
                Retire
              </Button>
            ) : null}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function AnalyticsPanel({ testDataAssets }) {
  const typeData = useMemo(() => {
    const counts = {};
    for (const td of testDataAssets) {
      counts[td.type] = (counts[td.type] || 0) + 1;
    }
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      label: formatLabel(type),
    }));
  }, [testDataAssets]);

  const statusData = useMemo(() => {
    const counts = {};
    for (const td of testDataAssets) {
      counts[td.status] = (counts[td.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: formatLabel(status),
    }));
  }, [testDataAssets]);

  const maskingData = useMemo(() => {
    const counts = {};
    for (const td of testDataAssets) {
      counts[td.maskingStatus] = (counts[td.maskingStatus] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: formatLabel(status),
    }));
  }, [testDataAssets]);

  const provisioningData = useMemo(() => {
    const counts = {};
    for (const td of testDataAssets) {
      counts[td.provisioningStatus] = (counts[td.provisioningStatus] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: formatLabel(status),
    }));
  }, [testDataAssets]);

  const environmentData = useMemo(() => {
    const counts = {};
    for (const td of testDataAssets) {
      counts[td.environment] = (counts[td.environment] || 0) + 1;
    }
    return Object.entries(counts).map(([env, count]) => ({
      environment: env,
      count,
    }));
  }, [testDataAssets]);

  const creatorData = useMemo(() => {
    const counts = {};
    for (const td of testDataAssets) {
      counts[td.createdBy] = (counts[td.createdBy] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([creator, count]) => ({
        creator,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [testDataAssets]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PanelCard
        title="Test Data by Type"
        subtitle="Distribution across data types"
        icon={<Tag className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
              <Bar dataKey="count" name="Assets" radius={[4, 4, 0, 0]} barSize={28}>
                {typeData.map((entry) => (
                  <Cell key={entry.type} fill={TYPE_COLORS[entry.type] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Test Data by Status"
        subtitle="Distribution across asset statuses"
        icon={<Activity className="h-5 w-5" />}
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
                <Tooltip formatter={(value, name) => [`${value} assets`, name]} />
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
        title="Masking Status"
        subtitle="PHI masking coverage across test data assets"
        icon={<ShieldCheck className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={maskingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {maskingData.map((entry) => (
                    <Cell key={entry.status} fill={MASKING_COLORS[entry.status] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} assets`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {maskingData.map((item) => (
              <div key={item.status} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: MASKING_COLORS[item.status] || '#a3a3a3' }}
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
        title="Provisioning Status"
        subtitle="Provisioning state across test data assets"
        icon={<HardDrive className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={provisioningData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {provisioningData.map((entry) => (
                    <Cell key={entry.status} fill={PROVISIONING_COLORS[entry.status] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} assets`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {provisioningData.map((item) => (
              <div key={item.status} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: PROVISIONING_COLORS[item.status] || '#a3a3a3' }}
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
        title="Test Data by Environment"
        subtitle="Distribution across deployment environments"
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
              <Bar dataKey="count" name="Assets" radius={[4, 4, 0, 0]} barSize={32}>
                {environmentData.map((entry) => (
                  <Cell key={entry.environment} fill={ENVIRONMENT_COLORS[entry.environment] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Test Data by Creator"
        subtitle="Top data asset creators"
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
                  max={testDataAssets.length || 1}
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

function TestDataManagementSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading test data management" aria-busy="true">
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
 * Test Data Management page component.
 * Displays test data assets with type, application, environment,
 * masking/provisioning status. Supports request, provision, refresh,
 * mask, retire, audit actions (simulated). All data from mockService.
 *
 * @returns {React.ReactElement}
 */
function TestDataManagementPage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();

  usePageHeader({ title: 'Test Data Management', subtitle: `Test data assets, masking, provisioning, and lifecycle management for ${currentPersona.name}` });

  const [loading, setLoading] = useState(true);
  const [testDataAssets, setTestDataAssets] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedTestData, setSelectedTestData] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [refreshConfirmOpen, setRefreshConfirmOpen] = useState(false);
  const [refreshTarget, setRefreshTarget] = useState(null);
  const [maskConfirmOpen, setMaskConfirmOpen] = useState(false);
  const [maskTarget, setMaskTarget] = useState(null);
  const [retireConfirmOpen, setRetireConfirmOpen] = useState(false);
  const [retireTarget, setRetireTarget] = useState(null);
  const [provisionConfirmOpen, setProvisionConfirmOpen] = useState(false);
  const [provisionTarget, setProvisionTarget] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    environment: '',
    maskingStatus: '',
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Test Data', path: ROUTES.PATIENTS },
      { label: 'Test Data Management' },
    ]);
  }, [setBreadcrumbs]);

  const loadTestData = useCallback(async () => {
    setLoading(true);
    try {
      const filterParams = {};
      if (filters.type) filterParams.type = filters.type;
      if (filters.status) filterParams.status = filters.status;
      if (filters.environment) filterParams.environment = filters.environment;
      if (filters.maskingStatus) filterParams.maskingStatus = filters.maskingStatus;
      const data = await getTestDataAssets(filterParams);
      setTestDataAssets(data);
    } catch {
      setTestDataAssets([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTestData();
  }, [loadTestData]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleRefreshPage = useCallback(() => {
    loadTestData();
  }, [loadTestData]);

  const handleTestDataClick = useCallback((td) => {
    setSelectedTestData(td);
    setDetailOpen(true);
  }, []);

  const handleDetailClose = useCallback((open) => {
    setDetailOpen(open);
    if (!open) {
      setSelectedTestData(null);
    }
  }, []);

  const handleRefreshClick = useCallback((testDataId) => {
    setRefreshTarget(testDataId);
    setRefreshConfirmOpen(true);
  }, []);

  const handleRefreshConfirm = useCallback(() => {
    if (!refreshTarget) return;
    logEvent('data_access', {
      action: 'Test Data Refreshed',
      details: `Test data asset ${refreshTarget} refreshed by ${currentPersona.name}.`,
      resource: refreshTarget,
      outcome: 'success',
    });
    toast({
      variant: 'success',
      title: 'Refresh Initiated',
      description: 'Test data refresh has been initiated. This may take a few minutes.',
    });
    setDetailOpen(false);
    setSelectedTestData(null);
  }, [refreshTarget, currentPersona, logEvent, toast]);

  const handleMaskClick = useCallback((testDataId) => {
    setMaskTarget(testDataId);
    setMaskConfirmOpen(true);
  }, []);

  const handleMaskConfirm = useCallback(() => {
    if (!maskTarget) return;
    logEvent('data_access', {
      action: 'Test Data Masking Applied',
      details: `PHI masking applied to test data asset ${maskTarget} by ${currentPersona.name}.`,
      resource: maskTarget,
      outcome: 'success',
    });
    toast({
      variant: 'success',
      title: 'Masking Applied',
      description: 'PHI masking has been applied to the test data asset.',
    });
    setDetailOpen(false);
    setSelectedTestData(null);
  }, [maskTarget, currentPersona, logEvent, toast]);

  const handleRetireClick = useCallback((testDataId) => {
    setRetireTarget(testDataId);
    setRetireConfirmOpen(true);
  }, []);

  const handleRetireConfirm = useCallback(() => {
    if (!retireTarget) return;
    logEvent('data_access', {
      action: 'Test Data Retired',
      details: `Test data asset ${retireTarget} retired by ${currentPersona.name}.`,
      resource: retireTarget,
      outcome: 'success',
    });
    toast({
      variant: 'success',
      title: 'Test Data Retired',
      description: 'The test data asset has been archived.',
    });
    setDetailOpen(false);
    setSelectedTestData(null);
  }, [retireTarget, currentPersona, logEvent, toast]);

  const handleProvisionClick = useCallback((testDataId) => {
    setProvisionTarget(testDataId);
    setProvisionConfirmOpen(true);
  }, []);

  const handleProvisionConfirm = useCallback(() => {
    if (!provisionTarget) return;
    logEvent('data_access', {
      action: 'Test Data Provisioning Requested',
      details: `Test data provisioning requested for ${provisionTarget} by ${currentPersona.name}.`,
      resource: provisionTarget,
      outcome: 'success',
    });
    toast({
      variant: 'success',
      title: 'Provisioning Requested',
      description: 'Test data provisioning has been initiated. This may take several minutes.',
    });
    setDetailOpen(false);
    setSelectedTestData(null);
  }, [provisionTarget, currentPersona, logEvent, toast]);

  const handleExportCSV = useCallback(() => {
    try {
      const data = testDataAssets.map((td) => ({
        id: td.id,
        name: td.name,
        type: td.type,
        application: td.application,
        environment: td.environment,
        status: td.status,
        maskingStatus: td.maskingStatus,
        provisioningStatus: td.provisioningStatus,
        lastRefreshed: td.lastRefreshed,
        createdBy: td.createdBy,
      }));
      downloadCSV(data, 'test-data-assets.csv');
      logEvent('data_export', {
        action: 'Exported Test Data Assets',
        details: `Test data assets exported as CSV by ${currentPersona.name}. ${data.length} records.`,
        resource: '/patients',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} test data assets exported as CSV.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export test data assets.',
      });
    }
  }, [testDataAssets, currentPersona, logEvent, toast]);

  const handleExportJSON = useCallback(() => {
    try {
      const data = testDataAssets.map((td) => ({
        id: td.id,
        name: td.name,
        type: td.type,
        application: td.application,
        environment: td.environment,
        status: td.status,
        maskingStatus: td.maskingStatus,
        provisioningStatus: td.provisioningStatus,
        lastRefreshed: td.lastRefreshed,
        createdBy: td.createdBy,
      }));
      downloadJSON(data, 'test-data-assets.json');
      logEvent('data_export', {
        action: 'Exported Test Data Assets',
        details: `Test data assets exported as JSON by ${currentPersona.name}. ${data.length} records.`,
        resource: '/patients',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} test data assets exported as JSON.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export test data assets.',
      });
    }
  }, [testDataAssets, currentPersona, logEvent, toast]);

  const kpiData = useMemo(() => {
    const total = testDataAssets.length;
    const active = testDataAssets.filter((td) => td.status === 'active').length;
    const stale = testDataAssets.filter((td) => td.status === 'stale').length;
    const errors = testDataAssets.filter((td) => td.status === 'error').length;
    const fullyMasked = testDataAssets.filter((td) => td.maskingStatus === 'fully_masked').length;
    const provisioned = testDataAssets.filter((td) => td.provisioningStatus === 'provisioned').length;
    const maskingRate = total > 0
      ? Math.round(((fullyMasked + testDataAssets.filter((td) => td.maskingStatus === 'not_applicable').length) / total) * 1000) / 10
      : 0;

    return [
      {
        id: 'kpi_total',
        label: 'Total Assets',
        value: total,
        unit: 'count',
        trend: 'stable',
        icon: <HardDrive />,
        tone: 'blue',
        description: 'Total test data assets in the inventory.',
      },
      {
        id: 'kpi_active',
        label: 'Active',
        value: active,
        unit: 'count',
        trend: 'improving',
        icon: <CheckCircle />,
        tone: 'green',
        description: 'Test data assets in active status.',
      },
      {
        id: 'kpi_stale_errors',
        label: 'Stale / Errors',
        value: stale + errors,
        unit: 'count',
        trend: (stale + errors) > 3 ? 'declining' : 'stable',
        icon: <AlertTriangle />,
        tone: 'red',
        description: 'Assets requiring attention (stale or error).',
      },
      {
        id: 'kpi_masking',
        label: 'Masking Compliance',
        value: maskingRate,
        unit: 'percent',
        trend: maskingRate >= 90 ? 'improving' : 'stable',
        icon: <ShieldCheck />,
        tone: 'purple',
        description: 'Percentage of assets with proper PHI masking.',
      },
    ];
  }, [testDataAssets]);

  const filterFields = useMemo(() => {
    const typeOptions = getAllTestDataTypes().map((t) => ({
      value: t,
      label: formatLabel(t),
    }));
    const statusOptions = getAllTestDataStatuses().map((s) => ({
      value: s,
      label: formatLabel(s),
    }));
    const environmentOptions = getAllTestDataEnvironments().map((e) => ({
      value: e,
      label: e,
    }));
    const maskingOptions = getAllMaskingStatuses().map((m) => ({
      value: m,
      label: formatLabel(m),
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
      {
        id: 'environment',
        label: 'Environment',
        type: 'select',
        options: [{ value: '', label: 'All Environments' }, ...environmentOptions],
        defaultValue: '',
      },
      {
        id: 'maskingStatus',
        label: 'Masking',
        type: 'select',
        options: [{ value: '', label: 'All Masking' }, ...maskingOptions],
        defaultValue: '',
      },
    ];
  }, []);

  const tableColumns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleTestDataClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors line-clamp-2"
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 130,
        cell: ({ row }) => (
          <Badge variant={getTypeBadgeVariant(row.original.type)} size="sm">
            {formatLabel(row.original.type)}
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
        accessorKey: 'application',
        header: 'Application',
        size: 150,
        cell: ({ row }) => (
          <span className="text-xs font-mono text-slate-500 truncate block max-w-[150px]">
            {row.original.application}
          </span>
        ),
      },
      {
        accessorKey: 'maskingStatus',
        header: 'Masking',
        size: 130,
        cell: ({ row }) => (
          <Badge variant={getMaskingBadgeVariant(row.original.maskingStatus)} size="sm">
            {formatLabel(row.original.maskingStatus)}
          </Badge>
        ),
      },
      {
        accessorKey: 'provisioningStatus',
        header: 'Provisioning',
        size: 130,
        cell: ({ row }) => (
          <Badge variant={getProvisioningBadgeVariant(row.original.provisioningStatus)} size="sm">
            {formatLabel(row.original.provisioningStatus)}
          </Badge>
        ),
      },
      {
        accessorKey: 'lastRefreshed',
        header: 'Last Refreshed',
        size: 120,
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">{formatDate(row.original.lastRefreshed)}</span>
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
        size: 100,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5">
            <UITooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTestDataClick(row.original)}
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
            <PermissionGate requiredAction={PERMISSIONS.EDIT_PATIENTS} behavior="hidden">
              {(row.original.status === 'active' || row.original.status === 'stale') ? (
                <UITooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRefreshClick(row.original.id);
                      }}
                      className={cn(
                        'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                        'hover:bg-slate-100 hover:text-slate-600',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                      )}
                      aria-label={`Refresh ${row.original.name}`}
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Refresh</TooltipContent>
                </UITooltip>
              ) : null}
            </PermissionGate>
          </div>
        ),
      },
    ],
    [handleTestDataClick, handleRefreshClick]
  );

  const insightData = useMemo(() => {
    if (testDataAssets.length === 0) return null;

    const staleAssets = testDataAssets.filter((td) => td.status === 'stale');
    const errorAssets = testDataAssets.filter((td) => td.status === 'error');
    const unmasked = testDataAssets.filter((td) => td.maskingStatus === 'not_masked');
    const failedProvisioning = testDataAssets.filter((td) => td.provisioningStatus === 'failed');

    if (errorAssets.length > 0 || failedProvisioning.length > 0) {
      return {
        variant: 'critical',
        title: `${errorAssets.length + failedProvisioning.length} test data issue${(errorAssets.length + failedProvisioning.length) !== 1 ? 's' : ''} detected`,
        message: `${errorAssets.length > 0 ? `${errorAssets.length} asset${errorAssets.length !== 1 ? 's' : ''} in error state. ` : ''}${failedProvisioning.length > 0 ? `${failedProvisioning.length} provisioning failure${failedProvisioning.length !== 1 ? 's' : ''}. ` : ''}${unmasked.length > 0 ? `${unmasked.length} unmasked asset${unmasked.length !== 1 ? 's' : ''} require attention.` : ''}`,
        source: 'Data Validation Agent',
        confidence: 95,
      };
    }

    if (staleAssets.length > 0) {
      return {
        variant: 'warning',
        title: `${staleAssets.length} stale test data asset${staleAssets.length !== 1 ? 's' : ''} detected`,
        message: `${staleAssets.map((s) => s.name).join(', ')} ${staleAssets.length !== 1 ? 'have' : 'has'} not been refreshed recently and may contain outdated data. Consider refreshing before next test execution.`,
        source: 'Data Validation Agent',
        confidence: 90,
      };
    }

    return {
      variant: 'success',
      title: 'All test data assets healthy',
      message: `${testDataAssets.length} test data assets are in good condition with proper masking and provisioning status.`,
      source: 'Data Validation Agent',
      confidence: 96,
    };
  }, [testDataAssets]);

  if (loading) {
    return <TestDataManagementSkeleton />;
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
              onClick={handleRefreshPage}
              aria-label="Refresh test data"
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
                    aria-label="Export test data"
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
          {testDataAssets.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No test data assets found"
              message="No test data assets match the current filter criteria. Try adjusting your filters."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={tableColumns}
              data={testDataAssets}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search test data assets..."
              emptyMessage="No test data assets match the search criteria."
              onRowClick={handleTestDataClick}
            />
          )}
        </TabsContent>

        <TabsContent value="cards">
          {testDataAssets.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No test data assets found"
              message="No test data assets match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {testDataAssets.map((td) => (
                <Card
                  key={td.id}
                  className={cn(
                    'p-5 cursor-pointer transition-all duration-200',
                    'hover:shadow-card-hover hover:border-humana-green-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                    'active:scale-[0.99]',
                    td.status === 'error' && 'border-danger-200',
                    td.status === 'stale' && 'border-warning-200'
                  )}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleTestDataClick(td)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleTestDataClick(td);
                    }
                  }}
                  aria-label={`${td.name}. Status: ${td.status}. Type: ${td.type}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${TYPE_COLORS[td.type] || '#64748b'}15` }}
                      >
                        <Database
                          className="h-4.5 w-4.5"
                          style={{ color: TYPE_COLORS[td.type] || '#64748b' }}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex flex-col gap-0 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">{td.name}</h3>
                        <span className="text-2xs text-slate-500">{td.createdBy} • {td.environment}</span>
                      </div>
                    </div>
                    <StatusPill status={td.status} size="sm" dot />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-2xs text-slate-400 uppercase tracking-wider">Type</span>
                      <Badge variant={getTypeBadgeVariant(td.type)} size="sm">
                        {formatLabel(td.type)}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-2xs text-slate-400 uppercase tracking-wider">Environment</span>
                      <Badge variant="outline" size="sm">{td.environment}</Badge>
                    </div>
                  </div>

                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-2xs text-slate-400 uppercase tracking-wider">Masking</span>
                      <Badge variant={getMaskingBadgeVariant(td.maskingStatus)} size="sm">
                        {formatLabel(td.maskingStatus)}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-2xs text-slate-400 uppercase tracking-wider">Provisioning</span>
                      <Badge variant={getProvisioningBadgeVariant(td.provisioningStatus)} size="sm">
                        {formatLabel(td.provisioningStatus)}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-slate-400" aria-hidden="true" />
                      <span className="text-2xs text-slate-400">
                        Refreshed: {formatDate(td.lastRefreshed)}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  </div>

                  <div className="mt-2">
                    <span className="text-2xs font-mono text-slate-400 truncate block">{td.application}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {testDataAssets.length === 0 ? (
            <EmptyState
              type="no_chart"
              title="No data for analytics"
              message="No test data assets available to generate analytics. Try adjusting your filters."
              size="lg"
              bordered
            />
          ) : (
            <AnalyticsPanel testDataAssets={testDataAssets} />
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Panel */}
      {testDataAssets.length > 0 && activeTab !== 'analytics' ? (
        <PanelCard
          title="Test Data Summary"
          subtitle={`${testDataAssets.length} assets across ${new Set(testDataAssets.map((td) => td.environment)).size} environments`}
          icon={<Activity className="h-5 w-5" />}
          collapsible
          defaultCollapsed
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Active</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-success-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {testDataAssets.filter((td) => td.status === 'active').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Stale</span>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-warning-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {testDataAssets.filter((td) => td.status === 'stale').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Archived</span>
              <div className="flex items-center gap-1.5">
                <Archive className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {testDataAssets.filter((td) => td.status === 'archived').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Error</span>
              <div className="flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-danger-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {testDataAssets.filter((td) => td.status === 'error').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Fully Masked</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-success-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {testDataAssets.filter((td) => td.maskingStatus === 'fully_masked').length}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-slate-900">By Type</h4>
            {getAllTestDataTypes().map((type) => {
              const count = testDataAssets.filter((td) => td.type === type).length;
              if (count === 0) return null;
              return (
                <div key={type} className="flex items-center gap-3">
                  <div className="w-28 shrink-0">
                    <Badge variant={getTypeBadgeVariant(type)} size="sm">{formatLabel(type)}</Badge>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={count}
                      max={testDataAssets.length || 1}
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

          <div className="mt-4 flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-slate-900">By Environment</h4>
            {getAllTestDataEnvironments().map((env) => {
              const count = testDataAssets.filter((td) => td.environment === env).length;
              if (count === 0) return null;
              return (
                <div key={env} className="flex items-center gap-3">
                  <div className="w-28 shrink-0">
                    <Badge variant="outline" size="sm">{env}</Badge>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={count}
                      max={testDataAssets.length || 1}
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

          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Masking Compliance</h4>
            <Progress
              value={
                testDataAssets.length > 0
                  ? Math.round(
                      ((testDataAssets.filter((td) => td.maskingStatus === 'fully_masked').length +
                        testDataAssets.filter((td) => td.maskingStatus === 'not_applicable').length) /
                        testDataAssets.length) *
                        100
                    )
                  : 0
              }
              max={100}
              variant="auto"
              size="md"
              showValue
              label="PHI Masking Coverage"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Provisioning Rate</h4>
            <Progress
              value={
                testDataAssets.length > 0
                  ? Math.round(
                      (testDataAssets.filter((td) => td.provisioningStatus === 'provisioned').length /
                        testDataAssets.length) *
                        100
                    )
                  : 0
              }
              max={100}
              variant="auto"
              size="md"
              showValue
              label="Provisioned Assets"
            />
          </div>
        </PanelCard>
      ) : null}

      {/* Detail Dialog */}
      <TestDataDetailDialog
        testData={selectedTestData}
        open={detailOpen}
        onOpenChange={handleDetailClose}
        onRefresh={handleRefreshClick}
        onMask={handleMaskClick}
        onRetire={handleRetireClick}
        onProvision={handleProvisionClick}
      />

      {/* Refresh Confirmation */}
      <ConfirmDialog
        open={refreshConfirmOpen}
        onOpenChange={setRefreshConfirmOpen}
        title="Refresh Test Data"
        message="Are you sure you want to refresh this test data asset? This will reload the data from the source and reapply any masking rules. Existing data will be replaced."
        variant="info"
        confirmLabel="Refresh"
        cancelLabel="Cancel"
        onConfirm={handleRefreshConfirm}
      />

      {/* Mask Confirmation */}
      <ConfirmDialog
        open={maskConfirmOpen}
        onOpenChange={setMaskConfirmOpen}
        title="Apply PHI Masking"
        message="Are you sure you want to apply PHI masking to this test data asset? All PHI fields will be tokenized using AES-256 encryption. This process cannot be reversed."
        variant="warning"
        confirmLabel="Apply Masking"
        cancelLabel="Cancel"
        onConfirm={handleMaskConfirm}
      />

      {/* Retire Confirmation */}
      <ConfirmDialog
        open={retireConfirmOpen}
        onOpenChange={setRetireConfirmOpen}
        title="Retire Test Data"
        message="Are you sure you want to retire this test data asset? It will be archived and no longer available for provisioning. This action can be reversed by an administrator."
        variant="warning"
        confirmLabel="Retire"
        cancelLabel="Cancel"
        onConfirm={handleRetireConfirm}
      />

      {/* Provision Confirmation */}
      <ConfirmDialog
        open={provisionConfirmOpen}
        onOpenChange={setProvisionConfirmOpen}
        title="Provision Test Data"
        message="Are you sure you want to provision this test data asset? The data will be deployed to the target environment. PHI masking status will be verified before provisioning."
        variant="info"
        confirmLabel="Provision"
        cancelLabel="Cancel"
        onConfirm={handleProvisionConfirm}
      />
    </div>
  );
}

TestDataManagementPage.displayName = 'TestDataManagementPage';

export { TestDataManagementPage };
export default TestDataManagementPage;