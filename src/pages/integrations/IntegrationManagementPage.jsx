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
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  Settings,
  BarChart2,
  Layers,
  FileText,
  ChevronRight,
  User,
  Calendar,
  Clock,
  Zap,
  Wifi,
  WifiOff,
  Globe,
  Shield,
  Server,
  Link2,
  Play,
  RotateCcw,
  ExternalLink,
  Info,
  Plug,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import {
  getIntegrations,
} from '@/lib/mock-api/mockService';
import {
  getAllIntegrationTypes,
  getAllIntegrationStatuses,
  getAllIntegrationVendors,
  getAllAuthTypes,
  getIntegrationAggregates,
} from '@/data/integrations';
import { IntegrationLogo } from '@/components/shared/IntegrationLogo';
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
import { PERMISSIONS, ROUTES } from '@/lib/constants';

const STATUS_COLORS = {
  active: '#10b981',
  inactive: '#a3a3a3',
  error: '#ef4444',
  maintenance: '#f59e0b',
  pending: '#3b82f6',
};

const TYPE_COLORS = {
  devops: '#16b364',
  test_management: '#3b82f6',
  project_management: '#8b5cf6',
  portfolio_management: '#06b6d4',
  source_control: '#f59e0b',
  ci_cd: '#ef4444',
  code_quality: '#10b981',
  security_scanning: '#dc2626',
  cast_analysis: '#a3a3a3',
  apm: '#3b82f6',
  logging: '#8b5cf6',
  itsm: '#f59e0b',
  analytics: '#06b6d4',
  collaboration: '#16b364',
  identity: '#64748b',
  hr: '#a3a3a3',
};

const AUTH_TYPE_COLORS = {
  oauth2: '#16b364',
  api_key: '#3b82f6',
  token: '#8b5cf6',
  certificate: '#f59e0b',
  basic: '#a3a3a3',
  saml: '#06b6d4',
  oidc: '#ef4444',
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

function formatLabel(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getStatusBadgeVariant(status) {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'neutral';
    case 'error':
      return 'error';
    case 'maintenance':
      return 'warning';
    case 'pending':
      return 'info';
    default:
      return 'neutral';
  }
}

function getTypeBadgeVariant(type) {
  switch (type) {
    case 'devops':
      return 'primary';
    case 'test_management':
      return 'info';
    case 'project_management':
      return 'warning';
    case 'source_control':
      return 'success';
    case 'ci_cd':
      return 'error';
    case 'code_quality':
      return 'primary';
    case 'security_scanning':
      return 'error';
    case 'apm':
      return 'info';
    case 'logging':
      return 'warning';
    case 'itsm':
      return 'neutral';
    case 'analytics':
      return 'success';
    case 'collaboration':
      return 'primary';
    case 'identity':
      return 'neutral';
    case 'hr':
      return 'neutral';
    case 'portfolio_management':
      return 'info';
    case 'cast_analysis':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getAuthTypeBadgeVariant(authType) {
  switch (authType) {
    case 'oauth2':
      return 'primary';
    case 'api_key':
      return 'info';
    case 'token':
      return 'warning';
    case 'certificate':
      return 'success';
    case 'basic':
      return 'neutral';
    case 'saml':
      return 'error';
    case 'oidc':
      return 'error';
    default:
      return 'neutral';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'active':
      return CheckCircle;
    case 'inactive':
      return WifiOff;
    case 'error':
      return XCircle;
    case 'maintenance':
      return Settings;
    case 'pending':
      return Clock;
    default:
      return Wifi;
  }
}

function getSyncStatusColor(status) {
  switch (status) {
    case 'success':
      return 'text-success-600';
    case 'failed':
      return 'text-danger-600';
    case 'partial':
      return 'text-warning-600';
    default:
      return 'text-slate-500';
  }
}

function IntegrationDetailDialog({ integration, open, onOpenChange, onSync, onTestConnection }) {
  const { hasPermission } = usePersona();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (open) {
      setActiveTab('overview');
    }
  }, [open]);

  if (!integration) return null;

  const config = integration.config || {};
  const errorState = integration.errorState || {};
  const syncHistory = integration.syncHistory || [];
  const connectedApplications = integration.connectedApplications || [];
  const scopes = config.scopes || [];
  const customFields = config.customFields || {};

  const canManage = hasPermission(PERMISSIONS.MANAGE_SETTINGS);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-slate-100">
              <IntegrationLogo name={integration.name} size="md" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{integration.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {integration.id} • {formatLabel(integration.type)} • {integration.vendor}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill status={integration.status} size="md" dot />
          <Badge variant={getTypeBadgeVariant(integration.type)} size="md">
            {formatLabel(integration.type)}
          </Badge>
          <Badge variant="outline" size="md">
            {integration.vendor}
          </Badge>
          <Badge variant={getAuthTypeBadgeVariant(config.authType)} size="md">
            {formatLabel(config.authType)}
          </Badge>
          {config.autoSync ? (
            <Badge variant="success" size="md">Auto-Sync</Badge>
          ) : (
            <Badge variant="neutral" size="md">Manual Sync</Badge>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Status</span>
            <p className="mt-1 text-lg font-semibold text-slate-900 capitalize">{integration.status}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Sync Interval</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{config.syncIntervalMinutes || 0}m</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Connected Apps</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{connectedApplications.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Version</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{integration.version || '—'}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Owner:</span>
            <span className="font-medium text-slate-900">{integration.owner}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Base URL:</span>
            <span className="font-medium text-slate-900 text-xs font-mono truncate">{config.baseUrl || '—'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Auth Type:</span>
            <span className="font-medium text-slate-900">{formatLabel(config.authType)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Environment:</span>
            <span className="font-medium text-slate-900">{config.environment || '—'}</span>
          </div>
          {integration.lastSync ? (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Last Sync:</span>
              <span className="font-medium text-slate-900">{formatDate(integration.lastSync, 'MMM d, yyyy h:mm a')}</span>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Created:</span>
            <span className="font-medium text-slate-900">{formatDate(integration.createdDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Last Modified:</span>
            <span className="font-medium text-slate-900">{formatDate(integration.lastModifiedDate)}</span>
          </div>
        </div>

        {integration.description ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{integration.description}</p>
          </div>
        ) : null}

        {errorState.hasError ? (
          <div className="mt-4 rounded-lg border border-danger-200 bg-danger-50/30 p-4">
            <div className="flex items-start gap-2">
              <XCircle className="h-5 w-5 text-danger-500 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-danger-900">Error State</h4>
                <p className="text-sm text-danger-700 mt-1">{errorState.errorMessage}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-danger-600">
                  {errorState.errorCode ? (
                    <span>Code: <span className="font-mono font-medium">{errorState.errorCode}</span></span>
                  ) : null}
                  {errorState.lastErrorDate ? (
                    <span>Last Error: {formatDate(errorState.lastErrorDate, 'MMM d, h:mm a')}</span>
                  ) : null}
                  {errorState.consecutiveFailures > 0 ? (
                    <Badge variant="error" size="sm">{errorState.consecutiveFailures} consecutive failures</Badge>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="overview">Configuration</TabsTrigger>
            <TabsTrigger value="sync">Sync History ({syncHistory.length})</TabsTrigger>
            <TabsTrigger value="apps">Applications ({connectedApplications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="flex flex-col gap-4 pt-2">
              {scopes.length > 0 ? (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Scopes / Permissions ({scopes.length})</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {scopes.map((scope) => (
                      <Badge key={scope} variant="outline" size="sm">{scope}</Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {Object.keys(customFields).length > 0 ? (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Custom Configuration</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Key</th>
                          <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(customFields).map(([key, value]) => (
                          <tr key={key} className="border-b border-slate-100 last:border-b-0">
                            <td className="py-2 text-xs font-mono text-slate-600">{key}</td>
                            <td className="py-2 text-xs text-slate-900">
                              {String(value).includes('*') ? '********' : String(value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-slate-200 p-3">
                  <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Auto Sync</span>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{config.autoSync ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Interval</span>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{config.syncIntervalMinutes || 0} min</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Environment</span>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{config.environment || '—'}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Vendor</span>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{integration.vendor}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sync">
            <div className="flex flex-col gap-2 pt-2">
              {syncHistory.length === 0 ? (
                <EmptyState
                  type="no_data"
                  title="No sync history"
                  message="No synchronization events have been recorded for this integration."
                  size="sm"
                />
              ) : (
                <div className="flex flex-col gap-2">
                  {syncHistory.map((entry, index) => (
                    <div
                      key={index}
                      className={cn(
                        'rounded-lg border p-3',
                        entry.status === 'success' ? 'border-success-200 bg-success-50/10' :
                        entry.status === 'failed' ? 'border-danger-200 bg-danger-50/10' :
                        'border-warning-200 bg-warning-50/10'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            {entry.status === 'success' ? (
                              <CheckCircle className="h-4 w-4 text-success-500 shrink-0" aria-hidden="true" />
                            ) : entry.status === 'failed' ? (
                              <XCircle className="h-4 w-4 text-danger-500 shrink-0" aria-hidden="true" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-warning-500 shrink-0" aria-hidden="true" />
                            )}
                            <StatusPill status={entry.status} size="sm" />
                          </div>
                          <p className="text-sm text-slate-700 mt-1">{entry.details}</p>
                        </div>
                        <div className="flex flex-col items-end gap-0.5 shrink-0">
                          <span className="text-2xs text-slate-400">
                            {entry.timestamp ? formatDate(entry.timestamp, 'MMM d, h:mm a') : ''}
                          </span>
                          <div className="flex items-center gap-2 text-2xs text-slate-500">
                            <span>{formatNumber(entry.recordsProcessed)} processed</span>
                            {entry.recordsFailed > 0 ? (
                              <Badge variant="error" size="sm">{entry.recordsFailed} failed</Badge>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="apps">
            <div className="flex flex-col gap-2 pt-2">
              {connectedApplications.length === 0 ? (
                <EmptyState
                  type="no_data"
                  title="No connected applications"
                  message="No applications are connected through this integration."
                  size="sm"
                />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {connectedApplications.map((appId) => (
                    <Badge key={appId} variant="outline" size="sm">{appId}</Badge>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {canManage ? (
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              size="md"
              iconLeft={<Wifi className="h-3.5 w-3.5" />}
              onClick={() => onTestConnection(integration)}
            >
              Test Connection
            </Button>
            <Button
              variant="primary"
              size="md"
              iconLeft={<RotateCcw className="h-3.5 w-3.5" />}
              onClick={() => onSync(integration)}
              disabled={integration.status === 'error' || integration.status === 'inactive'}
            >
              Sync Now
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function AnalyticsPanel({ integrations }) {
  const statusData = useMemo(() => {
    const counts = {};
    for (const i of integrations) {
      counts[i.status] = (counts[i.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: formatLabel(status),
    }));
  }, [integrations]);

  const typeData = useMemo(() => {
    const counts = {};
    for (const i of integrations) {
      counts[i.type] = (counts[i.type] || 0) + 1;
    }
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      label: formatLabel(type),
    }));
  }, [integrations]);

  const vendorData = useMemo(() => {
    const counts = {};
    for (const i of integrations) {
      counts[i.vendor] = (counts[i.vendor] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([vendor, count]) => ({
        vendor,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [integrations]);

  const authTypeData = useMemo(() => {
    const counts = {};
    for (const i of integrations) {
      const authType = i.config ? i.config.authType : 'unknown';
      counts[authType] = (counts[authType] || 0) + 1;
    }
    return Object.entries(counts).map(([authType, count]) => ({
      authType,
      count,
      label: formatLabel(authType),
    }));
  }, [integrations]);

  const syncIntervalData = useMemo(() => {
    const buckets = {
      '≤5 min': 0,
      '6-15 min': 0,
      '16-60 min': 0,
      '1-24 hrs': 0,
    };
    for (const i of integrations) {
      const interval = i.config ? i.config.syncIntervalMinutes : 0;
      if (interval <= 5) buckets['≤5 min']++;
      else if (interval <= 15) buckets['6-15 min']++;
      else if (interval <= 60) buckets['16-60 min']++;
      else buckets['1-24 hrs']++;
    }
    return Object.entries(buckets).map(([bucket, count]) => ({
      bucket,
      count,
    }));
  }, [integrations]);

  const ownerData = useMemo(() => {
    const counts = {};
    for (const i of integrations) {
      counts[i.owner] = (counts[i.owner] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([owner, count]) => ({
        owner,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [integrations]);

  const connectedAppsData = useMemo(() => {
    return integrations
      .filter((i) => i.connectedApplications && i.connectedApplications.length > 0)
      .map((i) => ({
        name: i.name.length > 18 ? i.name.substring(0, 18) + '…' : i.name,
        apps: i.connectedApplications.length,
      }))
      .sort((a, b) => b.apps - a.apps)
      .slice(0, 10);
  }, [integrations]);

  const errorData = useMemo(() => {
    const withErrors = integrations.filter((i) => i.errorState && i.errorState.hasError).length;
    const withoutErrors = integrations.length - withErrors;
    return [
      { label: 'With Errors', count: withErrors },
      { label: 'No Errors', count: withoutErrors },
    ];
  }, [integrations]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PanelCard
        title="Integrations by Status"
        subtitle="Distribution across connection statuses"
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
                <Tooltip formatter={(value, name) => [`${value} integrations`, name]} />
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
        title="Integrations by Type"
        subtitle="Distribution across integration categories"
        icon={<Layers className="h-5 w-5" />}
      >
        <ChartWrapper height={280} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
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
              <Bar dataKey="count" name="Integrations" radius={[0, 4, 4, 0]} barSize={16}>
                {typeData.map((entry) => (
                  <Cell key={entry.type} fill={TYPE_COLORS[entry.type] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Integrations by Vendor"
        subtitle="Distribution across technology vendors"
        icon={<Globe className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {vendorData.map((item) => (
            <div key={item.vendor} className="flex items-center gap-3">
              <div className="w-28 shrink-0 truncate">
                <span className="text-sm font-medium text-slate-700">{item.vendor}</span>
              </div>
              <div className="flex-1">
                <Progress
                  value={item.count}
                  max={integrations.length || 1}
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
        title="Authentication Types"
        subtitle="Distribution across auth methods"
        icon={<Shield className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={authTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {authTypeData.map((entry) => (
                    <Cell key={entry.authType} fill={AUTH_TYPE_COLORS[entry.authType] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} integrations`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {authTypeData.map((item) => (
              <div key={item.authType} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: AUTH_TYPE_COLORS[item.authType] || '#a3a3a3' }}
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
        title="Connected Applications"
        subtitle="Top integrations by connected application count"
        icon={<Link2 className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={connectedAppsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="apps" name="Applications" fill="#16b364" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Error Distribution"
        subtitle="Integrations with and without errors"
        icon={<AlertTriangle className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={errorData}
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
                <Tooltip formatter={(value, name) => [`${value} integrations`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {errorData.map((item, index) => (
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
        title="Sync Interval Distribution"
        subtitle="How frequently integrations synchronize"
        icon={<Clock className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={syncIntervalData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="bucket"
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
              <Bar dataKey="count" name="Integrations" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Integrations by Owner"
        subtitle="Ownership distribution"
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
                  max={integrations.length || 1}
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

function IntegrationManagementSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading integration management" aria-busy="true">
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
 * Integration Management page component.
 * Displays all mocked integration connections (Azure DevOps, qTest, Jira,
 * GitHub, Jenkins, etc.) with status, last sync, error states, and configuration.
 * Supports sync, test connection, and configure actions (simulated).
 * Uses IntegrationLogo component.
 *
 * @returns {React.ReactElement}
 */
function IntegrationManagementPage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState([]);
  const [activeTab, setActiveTab] = useState('cards');
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    vendor: '',
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Settings', path: ROUTES.SETTINGS },
      { label: 'Integration Management' },
    ]);
  }, [setBreadcrumbs]);

  const loadIntegrations = useCallback(async () => {
    setLoading(true);
    try {
      const filterParams = {};
      if (filters.type) filterParams.type = filters.type;
      if (filters.status) filterParams.status = filters.status;
      if (filters.vendor) filterParams.vendor = filters.vendor;
      const data = await getIntegrations(filterParams);
      setIntegrations(data);
    } catch {
      setIntegrations([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadIntegrations();
  }, [loadIntegrations]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    loadIntegrations();
  }, [loadIntegrations]);

  const handleIntegrationClick = useCallback((integration) => {
    setSelectedIntegration(integration);
    setDetailOpen(true);
  }, []);

  const handleDetailClose = useCallback((open) => {
    setDetailOpen(open);
    if (!open) {
      setSelectedIntegration(null);
    }
  }, []);

  const handleSync = useCallback(
    (integration) => {
      logEvent('integration_sync', {
        action: 'Integration Sync Triggered',
        details: `Manual sync triggered for "${integration.name}" by ${currentPersona.name}.`,
        resource: integration.id,
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Sync Initiated',
        description: `Synchronization for "${integration.name}" has been initiated. This may take a few minutes.`,
      });
      setDetailOpen(false);
      setSelectedIntegration(null);
    },
    [currentPersona, logEvent, toast]
  );

  const handleTestConnection = useCallback(
    (integration) => {
      logEvent('integration_sync', {
        action: 'Integration Connection Test',
        details: `Connection test for "${integration.name}" initiated by ${currentPersona.name}.`,
        resource: integration.id,
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Connection Test Passed',
        description: `Connection to "${integration.name}" is healthy. All endpoints are reachable.`,
      });
    },
    [currentPersona, logEvent, toast]
  );

  const handleExportCSV = useCallback(() => {
    try {
      const data = integrations.map((i) => ({
        id: i.id,
        name: i.name,
        type: i.type,
        status: i.status,
        vendor: i.vendor,
        version: i.version,
        owner: i.owner,
        authType: i.config ? i.config.authType : '',
        autoSync: i.config ? i.config.autoSync : false,
        syncIntervalMinutes: i.config ? i.config.syncIntervalMinutes : 0,
        environment: i.config ? i.config.environment : '',
        lastSync: i.lastSync || '',
        hasError: i.errorState ? i.errorState.hasError : false,
        connectedApps: i.connectedApplications ? i.connectedApplications.length : 0,
        createdDate: i.createdDate,
        lastModifiedDate: i.lastModifiedDate,
      }));
      downloadCSV(data, 'integrations.csv');
      logEvent('data_export', {
        action: 'Exported Integrations',
        details: `Integrations exported as CSV by ${currentPersona.name}. ${data.length} records.`,
        resource: '/settings',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} integrations exported as CSV.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export integrations.',
      });
    }
  }, [integrations, currentPersona, logEvent, toast]);

  const handleExportJSON = useCallback(() => {
    try {
      const data = integrations.map((i) => ({
        id: i.id,
        name: i.name,
        type: i.type,
        status: i.status,
        vendor: i.vendor,
        version: i.version,
        owner: i.owner,
        authType: i.config ? i.config.authType : '',
        autoSync: i.config ? i.config.autoSync : false,
        syncIntervalMinutes: i.config ? i.config.syncIntervalMinutes : 0,
        environment: i.config ? i.config.environment : '',
        lastSync: i.lastSync || '',
        hasError: i.errorState ? i.errorState.hasError : false,
        connectedApps: i.connectedApplications ? i.connectedApplications.length : 0,
        createdDate: i.createdDate,
        lastModifiedDate: i.lastModifiedDate,
      }));
      downloadJSON(data, 'integrations.json');
      logEvent('data_export', {
        action: 'Exported Integrations',
        details: `Integrations exported as JSON by ${currentPersona.name}. ${data.length} records.`,
        resource: '/settings',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} integrations exported as JSON.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export integrations.',
      });
    }
  }, [integrations, currentPersona, logEvent, toast]);

  const kpiData = useMemo(() => {
    const total = integrations.length;
    const active = integrations.filter((i) => i.status === 'active').length;
    const withErrors = integrations.filter((i) => i.errorState && i.errorState.hasError).length;
    const totalConnectedApps = new Set(integrations.flatMap((i) => i.connectedApplications || [])).size;
    const autoSyncCount = integrations.filter((i) => i.config && i.config.autoSync).length;

    return [
      {
        id: 'kpi_total',
        label: 'Total Integrations',
        value: total,
        unit: 'count',
        trend: 'stable',
        status: 'on_track',
        description: 'Total configured integration connections.',
      },
      {
        id: 'kpi_active',
        label: 'Active',
        value: active,
        unit: 'count',
        trend: 'improving',
        status: 'on_track',
        description: 'Integrations currently active and syncing.',
      },
      {
        id: 'kpi_errors',
        label: 'With Errors',
        value: withErrors,
        unit: 'count',
        trend: withErrors > 0 ? 'declining' : 'stable',
        status: withErrors > 2 ? 'critical' : withErrors > 0 ? 'at_risk' : 'on_track',
        description: 'Integrations with active error states.',
      },
      {
        id: 'kpi_connected_apps',
        label: 'Connected Apps',
        value: totalConnectedApps,
        unit: 'count',
        trend: 'improving',
        status: 'on_track',
        description: 'Unique applications connected through integrations.',
      },
    ];
  }, [integrations]);

  const filterFields = useMemo(() => {
    const typeOptions = getAllIntegrationTypes().map((t) => ({
      value: t,
      label: formatLabel(t),
    }));
    const statusOptions = getAllIntegrationStatuses().map((s) => ({
      value: s,
      label: formatLabel(s),
    }));
    const vendorOptions = getAllIntegrationVendors().map((v) => ({
      value: v,
      label: v,
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
        id: 'vendor',
        label: 'Vendor',
        type: 'select',
        options: [{ value: '', label: 'All Vendors' }, ...vendorOptions],
        defaultValue: '',
      },
    ];
  }, []);

  const tableColumns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Integration',
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <IntegrationLogo name={row.original.name} size="sm" />
            <button
              type="button"
              onClick={() => handleIntegrationClick(row.original)}
              className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors"
            >
              {row.original.name}
            </button>
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 140,
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
        accessorKey: 'vendor',
        header: 'Vendor',
        size: 110,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.vendor}</span>
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
        accessorKey: 'lastSync',
        header: 'Last Sync',
        size: 150,
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">
            {row.original.lastSync ? formatDate(row.original.lastSync, 'MMM d, yyyy h:mm a') : '—'}
          </span>
        ),
      },
      {
        id: 'authType',
        header: 'Auth',
        size: 100,
        enableSorting: false,
        cell: ({ row }) => {
          const authType = row.original.config ? row.original.config.authType : '';
          return authType ? (
            <Badge variant={getAuthTypeBadgeVariant(authType)} size="sm">
              {formatLabel(authType)}
            </Badge>
          ) : (
            <span className="text-xs text-slate-400">—</span>
          );
        },
      },
      {
        id: 'connectedApps',
        header: 'Apps',
        size: 60,
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">
            {row.original.connectedApplications ? row.original.connectedApplications.length : 0}
          </span>
        ),
      },
      {
        id: 'error',
        header: 'Error',
        size: 70,
        enableSorting: false,
        cell: ({ row }) => {
          const hasError = row.original.errorState && row.original.errorState.hasError;
          return hasError ? (
            <UITooltip>
              <TooltipTrigger asChild>
                <span>
                  <Badge variant="error" size="sm">
                    <XCircle className="h-3 w-3 mr-0.5" aria-hidden="true" />
                    Error
                  </Badge>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                {row.original.errorState.errorMessage}
              </TooltipContent>
            </UITooltip>
          ) : (
            <CheckCircle className="h-4 w-4 text-success-500" aria-hidden="true" />
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
                  onClick={() => handleIntegrationClick(row.original)}
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
            <PermissionGate requiredAction={PERMISSIONS.MANAGE_SETTINGS} behavior="hidden">
              <UITooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSync(row.original);
                    }}
                    disabled={row.original.status === 'error' || row.original.status === 'inactive'}
                    className={cn(
                      'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                      'hover:bg-slate-100 hover:text-slate-600',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                    aria-label={`Sync ${row.original.name}`}
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Sync Now</TooltipContent>
              </UITooltip>
            </PermissionGate>
          </div>
        ),
      },
    ],
    [handleIntegrationClick, handleSync]
  );

  const insightData = useMemo(() => {
    if (integrations.length === 0) return null;

    const errorIntegrations = integrations.filter((i) => i.errorState && i.errorState.hasError);
    const inactiveIntegrations = integrations.filter((i) => i.status === 'inactive');
    const activeCount = integrations.filter((i) => i.status === 'active').length;

    if (errorIntegrations.length > 0) {
      return {
        variant: 'critical',
        title: `${errorIntegrations.length} integration${errorIntegrations.length !== 1 ? 's' : ''} with errors`,
        message: `${errorIntegrations.map((i) => i.name).join(', ')} ${errorIntegrations.length !== 1 ? 'have' : 'has'} active error states requiring attention. ${activeCount} of ${integrations.length} integrations are active and syncing normally.`,
        source: 'Integration Monitor',
        confidence: 98,
      };
    }

    if (inactiveIntegrations.length > 0) {
      return {
        variant: 'warning',
        title: `${inactiveIntegrations.length} inactive integration${inactiveIntegrations.length !== 1 ? 's' : ''}`,
        message: `${inactiveIntegrations.map((i) => i.name).join(', ')} ${inactiveIntegrations.length !== 1 ? 'are' : 'is'} currently inactive. Consider re-enabling or removing unused integrations.`,
        source: 'Integration Monitor',
        confidence: 90,
      };
    }

    return {
      variant: 'success',
      title: 'All integrations healthy',
      message: `All ${integrations.length} integrations are active and syncing normally. No errors detected across any connection.`,
      source: 'Integration Monitor',
      confidence: 96,
    };
  }, [integrations]);

  if (loading) {
    return <IntegrationManagementSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">Integration Management</h1>
          <p className="text-sm text-slate-500">
            External tool connections, sync status, and configuration management for {currentPersona.name}
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
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="cards">
          {integrations.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No integrations found"
              message="No integrations match the current filter criteria. Try adjusting your filters."
              size="lg"
              bordered
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {integrations.map((integration) => {
                const StatusIcon = getStatusIcon(integration.status);
                const config = integration.config || {};
                const errorState = integration.errorState || {};
                const connectedApps = integration.connectedApplications || [];
                const syncHistory = integration.syncHistory || [];
                const lastSyncEntry = syncHistory.length > 0 ? syncHistory[0] : null;

                return (
                  <Card
                    key={integration.id}
                    className={cn(
                      'p-5 cursor-pointer transition-all duration-200',
                      'hover:shadow-card-hover hover:border-humana-green-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                      'active:scale-[0.99]',
                      errorState.hasError && 'border-danger-200'
                    )}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleIntegrationClick(integration)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleIntegrationClick(integration);
                      }
                    }}
                    aria-label={`${integration.name}. Status: ${integration.status}. Vendor: ${integration.vendor}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-slate-100">
                          <IntegrationLogo name={integration.name} size="md" />
                        </div>
                        <div className="flex flex-col gap-0 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">{integration.name}</h3>
                          <span className="text-2xs text-slate-500">{integration.vendor} • {integration.owner}</span>
                        </div>
                      </div>
                      <StatusPill status={integration.status} size="sm" dot />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-2xs text-slate-400 uppercase tracking-wider">Type</span>
                        <Badge variant={getTypeBadgeVariant(integration.type)} size="sm">
                          {formatLabel(integration.type)}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-2xs text-slate-400 uppercase tracking-wider">Auth</span>
                        <Badge variant={getAuthTypeBadgeVariant(config.authType)} size="sm">
                          {formatLabel(config.authType)}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-2xs text-slate-400">Sync</span>
                        <span className="text-xs font-semibold text-slate-900">
                          {config.autoSync ? `${config.syncIntervalMinutes}m` : 'Manual'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-2xs text-slate-400">Apps</span>
                        <span className="text-xs font-semibold text-slate-900">{connectedApps.length}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-2xs text-slate-400">Version</span>
                        <span className="text-xs font-semibold text-slate-900">{integration.version || '—'}</span>
                      </div>
                    </div>

                    {lastSyncEntry ? (
                      <div className="mt-2.5 flex items-center gap-1.5">
                        {lastSyncEntry.status === 'success' ? (
                          <CheckCircle className="h-3 w-3 text-success-500" aria-hidden="true" />
                        ) : lastSyncEntry.status === 'failed' ? (
                          <XCircle className="h-3 w-3 text-danger-500" aria-hidden="true" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 text-warning-500" aria-hidden="true" />
                        )}
                        <span className={cn('text-2xs', getSyncStatusColor(lastSyncEntry.status))}>
                          Last sync: {formatDate(lastSyncEntry.timestamp, 'MMM d, h:mm a')}
                        </span>
                        <span className="text-2xs text-slate-400">
                          ({formatNumber(lastSyncEntry.recordsProcessed)} records)
                        </span>
                      </div>
                    ) : null}

                    {errorState.hasError ? (
                      <div className="mt-2 flex items-center gap-1.5">
                        <XCircle className="h-3 w-3 text-danger-500" aria-hidden="true" />
                        <span className="text-2xs text-danger-600 line-clamp-1">
                          {errorState.errorMessage}
                        </span>
                      </div>
                    ) : null}

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-2xs text-slate-400">
                        Modified: {formatDate(integration.lastModifiedDate)}
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
          {integrations.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No integrations found"
              message="No integrations match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={tableColumns}
              data={integrations}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search integrations..."
              emptyMessage="No integrations match the search criteria."
              onRowClick={handleIntegrationClick}
            />
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {integrations.length === 0 ? (
            <EmptyState
              type="no_chart"
              title="No data for analytics"
              message="No integrations available to generate analytics. Try adjusting your filters."
              size="lg"
              bordered
            />
          ) : (
            <AnalyticsPanel integrations={integrations} />
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Panel */}
      {integrations.length > 0 && activeTab !== 'analytics' ? (
        <PanelCard
          title="Integration Summary"
          subtitle={`${integrations.length} integrations across ${new Set(integrations.map((i) => i.vendor)).size} vendors`}
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
                  {integrations.filter((i) => i.status === 'active').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Inactive</span>
              <div className="flex items-center gap-1.5">
                <WifiOff className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {integrations.filter((i) => i.status === 'inactive').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Error</span>
              <div className="flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-danger-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {integrations.filter((i) => i.status === 'error').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Auto-Sync</span>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-humana-green-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {integrations.filter((i) => i.config && i.config.autoSync).length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Connected Apps</span>
              <div className="flex items-center gap-1.5">
                <Link2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {new Set(integrations.flatMap((i) => i.connectedApplications || [])).size}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-slate-900">By Type</h4>
            {Array.from(new Set(integrations.map((i) => i.type))).sort().map((type) => {
              const count = integrations.filter((i) => i.type === type).length;
              return (
                <div key={type} className="flex items-center gap-3">
                  <div className="w-28 shrink-0">
                    <Badge variant={getTypeBadgeVariant(type)} size="sm">{formatLabel(type)}</Badge>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={count}
                      max={integrations.length || 1}
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
            <h4 className="text-sm font-semibold text-slate-900 mb-2">By Vendor</h4>
            <div className="flex flex-col gap-2">
              {Array.from(new Set(integrations.map((i) => i.vendor))).sort().map((vendor) => {
                const count = integrations.filter((i) => i.vendor === vendor).length;
                return (
                  <div key={vendor} className="flex items-center gap-3">
                    <div className="w-28 shrink-0 truncate">
                      <span className="text-sm font-medium text-slate-700">{vendor}</span>
                    </div>
                    <div className="flex-1">
                      <Progress
                        value={count}
                        max={integrations.length || 1}
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
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">By Status</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Active', status: 'active', count: integrations.filter((i) => i.status === 'active').length },
                { label: 'Error', status: 'error', count: integrations.filter((i) => i.status === 'error').length },
                { label: 'Inactive', status: 'inactive', count: integrations.filter((i) => i.status === 'inactive').length },
                { label: 'Maintenance', status: 'maintenance', count: integrations.filter((i) => i.status === 'maintenance').length },
                { label: 'Pending', status: 'pending', count: integrations.filter((i) => i.status === 'pending').length },
              ].filter((item) => item.count > 0).map((item) => (
                <div key={item.status} className="flex items-center gap-3">
                  <div className="w-24 shrink-0">
                    <StatusPill status={item.status} size="sm" dot />
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={item.count}
                      max={integrations.length || 1}
                      variant="primary"
                      size="xs"
                      animate
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 w-8 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Health Overview</h4>
            <Progress
              value={integrations.filter((i) => i.status === 'active').length}
              max={integrations.length || 1}
              variant="auto"
              size="md"
              showValue
              valueFormat="fraction"
              label="Active Integrations"
            />
          </div>

          {integrations.filter((i) => i.errorState && i.errorState.hasError).length > 0 ? (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Active Errors</h4>
              <div className="flex flex-col gap-2">
                {integrations
                  .filter((i) => i.errorState && i.errorState.hasError)
                  .map((i) => (
                    <div
                      key={i.id}
                      className="rounded-lg border border-danger-200 bg-danger-50/20 p-3"
                    >
                      <div className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-danger-500 shrink-0 mt-0.5" aria-hidden="true" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <IntegrationLogo name={i.name} size="xs" />
                            <span className="text-sm font-medium text-slate-900">{i.name}</span>
                          </div>
                          <p className="text-xs text-danger-600 mt-0.5">{i.errorState.errorMessage}</p>
                          {i.errorState.errorCode ? (
                            <span className="text-2xs text-danger-500 font-mono mt-0.5 block">
                              Code: {i.errorState.errorCode}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}
        </PanelCard>
      ) : null}

      {/* Detail Dialog */}
      <IntegrationDetailDialog
        integration={selectedIntegration}
        open={detailOpen}
        onOpenChange={handleDetailClose}
        onSync={handleSync}
        onTestConnection={handleTestConnection}
      />
    </div>
  );
}

IntegrationManagementPage.displayName = 'IntegrationManagementPage';

export { IntegrationManagementPage };
export default IntegrationManagementPage;