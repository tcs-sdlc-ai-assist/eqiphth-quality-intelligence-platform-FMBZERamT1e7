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
  Play,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Download,
  Eye,
  Calendar,
  Zap,
  BarChart2,
  AlertTriangle,
  Layers,
  FileText,
  ChevronRight,
  Timer,
  TestTube,
  Shield,
  Target,
  Pause,
  SkipForward,
  Ban,
  User,
  Bug,
  Search,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import {
  getTestExecutions,
} from '@/lib/mock-api/mockService';
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

const STATUS_COLORS = {
  passed: '#10b981',
  failed: '#ef4444',
  blocked: '#f59e0b',
  skipped: '#a3a3a3',
  'in-progress': '#3b82f6',
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

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '—';
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function ExecutionDetailDialog({ execution, open, onOpenChange }) {
  if (!execution) return null;

  const logs = execution.logs || [];
  const evidence = execution.evidence || [];
  const aiAnalysis = execution.aiAnalysis || {};
  const defectsFound = execution.defectsFound || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Play className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{execution.id}</DialogTitle>
              <DialogDescription className="mt-1">
                {execution.suiteName} • {execution.environment} • {execution.testCaseId}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill status={execution.status} size="md" dot />
          <Badge variant="outline" size="md">
            {execution.environment}
          </Badge>
          <Badge variant="outline" size="md">
            {formatDuration(execution.duration)}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Status</span>
            <p className="mt-1 text-lg font-semibold text-slate-900 capitalize">{execution.status}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Duration</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{formatDuration(execution.duration)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Defects</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{defectsFound.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">AI Confidence</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{aiAnalysis.confidence || 0}%</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Executed By:</span>
            <span className="font-medium text-slate-900">{execution.executedBy}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Start Time:</span>
            <span className="font-medium text-slate-900">{formatDate(execution.startTime, 'MMM d, yyyy h:mm a')}</span>
          </div>
          {execution.endTime ? (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">End Time:</span>
              <span className="font-medium text-slate-900">{formatDate(execution.endTime, 'MMM d, yyyy h:mm a')}</span>
            </div>
          ) : null}
        </div>

        {aiAnalysis.summary ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">AI Analysis</h4>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm text-slate-700 leading-relaxed">{aiAnalysis.summary}</p>
              {aiAnalysis.rootCause ? (
                <div className="mt-2">
                  <span className="text-xs font-medium text-slate-500">Root Cause:</span>
                  <p className="text-sm text-slate-700 mt-0.5">{aiAnalysis.rootCause}</p>
                </div>
              ) : null}
              {aiAnalysis.recommendation ? (
                <div className="mt-2">
                  <span className="text-xs font-medium text-slate-500">Recommendation:</span>
                  <p className="text-sm text-slate-700 mt-0.5">{aiAnalysis.recommendation}</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {defectsFound.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Defects Found ({defectsFound.length})</h4>
            <div className="flex flex-col gap-2">
              {defectsFound.map((defect) => (
                <div key={defect.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs font-mono text-slate-500">{defect.id}</span>
                      <span className="text-sm font-medium text-slate-900">{defect.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant={defect.severity === 'critical' ? 'error' : defect.severity === 'high' ? 'warning' : 'info'} size="sm">
                        {defect.severity}
                      </Badge>
                      <StatusPill status={defect.status} size="sm" />
                    </div>
                  </div>
                  <div className="mt-1 text-2xs text-slate-500">Assignee: {defect.assignee}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {logs.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Execution Logs ({logs.length})</h4>
            <div className="rounded-lg border border-slate-200 bg-slate-950 p-3 max-h-60 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="flex gap-2 text-xs font-mono leading-relaxed">
                  <span className="text-slate-500 shrink-0 w-20">
                    {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : ''}
                  </span>
                  <span
                    className={cn(
                      'shrink-0 w-12 uppercase',
                      log.level === 'error' ? 'text-red-400' :
                      log.level === 'warn' ? 'text-yellow-400' :
                      log.level === 'debug' ? 'text-blue-400' :
                      'text-green-400'
                    )}
                  >
                    {log.level}
                  </span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {evidence.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Evidence ({evidence.length})</h4>
            <div className="flex flex-wrap gap-2">
              {evidence.map((ev, index) => (
                <Badge key={index} variant="outline" size="sm">
                  {ev.type}: {ev.name}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function AnalyticsPanel({ executions }) {
  const statusData = useMemo(() => {
    const counts = {};
    for (const exec of executions) {
      counts[exec.status] = (counts[exec.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
    }));
  }, [executions]);

  const environmentData = useMemo(() => {
    const counts = {};
    for (const exec of executions) {
      counts[exec.environment] = (counts[exec.environment] || 0) + 1;
    }
    return Object.entries(counts).map(([env, count]) => ({
      environment: env,
      count,
    }));
  }, [executions]);

  const suiteData = useMemo(() => {
    const counts = {};
    for (const exec of executions) {
      counts[exec.suiteName] = (counts[exec.suiteName] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([suite, count]) => ({
        suite: suite.length > 25 ? suite.substring(0, 25) + '…' : suite,
        fullSuite: suite,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [executions]);

  const executorData = useMemo(() => {
    const counts = {};
    for (const exec of executions) {
      counts[exec.executedBy] = (counts[exec.executedBy] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([executor, count]) => ({
        executor,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [executions]);

  const durationByStatus = useMemo(() => {
    const totals = {};
    const counts = {};
    for (const exec of executions) {
      if (exec.duration > 0) {
        totals[exec.status] = (totals[exec.status] || 0) + exec.duration;
        counts[exec.status] = (counts[exec.status] || 0) + 1;
      }
    }
    return Object.entries(totals).map(([status, total]) => ({
      status,
      avgDuration: Math.round(total / (counts[status] || 1)),
      label: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
    }));
  }, [executions]);

  const defectsByExecution = useMemo(() => {
    const withDefects = executions.filter((e) => e.defectsFound.length > 0);
    const withoutDefects = executions.filter((e) => e.defectsFound.length === 0);
    return [
      { label: 'With Defects', count: withDefects.length },
      { label: 'No Defects', count: withoutDefects.length },
    ];
  }, [executions]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PanelCard
        title="Execution Status Distribution"
        subtitle="Test execution results breakdown"
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
                <Tooltip formatter={(value, name) => [`${value} executions`, name]} />
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
        title="Executions by Environment"
        subtitle="Distribution across test environments"
        icon={<Layers className="h-5 w-5" />}
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
              <Bar dataKey="count" name="Executions" radius={[4, 4, 0, 0]} barSize={32}>
                {environmentData.map((entry) => (
                  <Cell key={entry.environment} fill={ENVIRONMENT_COLORS[entry.environment] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Executions by Suite"
        subtitle="Top test suites by execution count"
        icon={<TestTube className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={suiteData} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
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
                dataKey="suite"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Executions" fill="#16b364" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Average Duration by Status"
        subtitle="Average execution time per status category"
        icon={<Timer className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={durationByStatus} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
              />
              <Tooltip
                formatter={(value) => [`${formatDuration(value)}`, 'Avg Duration']}
              />
              <Bar dataKey="avgDuration" name="Avg Duration (s)" radius={[4, 4, 0, 0]} barSize={32}>
                {durationByStatus.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Defect Discovery"
        subtitle="Executions with and without defects"
        icon={<Bug className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={defectsByExecution}
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
                <Tooltip formatter={(value, name) => [`${value} executions`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {defectsByExecution.map((item, index) => (
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
        title="Executions by Executor"
        subtitle="Who ran the tests"
        icon={<User className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {executorData.map((item) => (
            <div key={item.executor} className="flex items-center gap-3">
              <div className="w-28 shrink-0 truncate">
                <span className="text-sm font-medium text-slate-700">{item.executor}</span>
              </div>
              <div className="flex-1">
                <Progress
                  value={item.count}
                  max={executions.length || 1}
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

function TestExecutionDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading test execution dashboard" aria-busy="true">
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
 * Test Execution Dashboard page component.
 * Displays execution summary KPIs, execution list with status/duration/environment,
 * trend charts, and drill-down to execution detail. Supports filtering by status,
 * environment, date range, and application.
 *
 * @returns {React.ReactElement}
 */
function TestExecutionDashboardPage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [executions, setExecutions] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedExecution, setSelectedExecution] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    environment: '',
    suiteName: '',
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Measures', path: ROUTES.MEASURES },
      { label: 'Test Execution Dashboard' },
    ]);
  }, [setBreadcrumbs]);

  const loadExecutions = useCallback(async () => {
    setLoading(true);
    try {
      const filterParams = {};
      if (filters.status) filterParams.status = filters.status;
      if (filters.environment) filterParams.environment = filters.environment;
      if (filters.suiteName) filterParams.suiteName = filters.suiteName;
      const data = await getTestExecutions(filterParams);
      setExecutions(data);
    } catch {
      setExecutions([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadExecutions();
  }, [loadExecutions]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    loadExecutions();
  }, [loadExecutions]);

  const handleExecutionClick = useCallback((execution) => {
    setSelectedExecution(execution);
    setDetailOpen(true);
  }, []);

  const handleDetailClose = useCallback((open) => {
    setDetailOpen(open);
    if (!open) {
      setSelectedExecution(null);
    }
  }, []);

  const handleExportCSV = useCallback(() => {
    try {
      const data = executions.map((e) => ({
        id: e.id,
        testCaseId: e.testCaseId,
        suiteName: e.suiteName,
        status: e.status,
        environment: e.environment,
        startTime: e.startTime,
        endTime: e.endTime,
        duration: e.duration,
        executedBy: e.executedBy,
        defectsFound: e.defectsFound.length,
        aiConfidence: e.aiAnalysis ? e.aiAnalysis.confidence : 0,
      }));
      downloadCSV(data, 'test-executions.csv');
      logEvent('data_export', {
        action: 'Exported Test Executions',
        details: `Test executions exported as CSV by ${currentPersona.name}. ${data.length} records.`,
        resource: '/measures',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} executions exported as CSV.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export test executions.',
      });
    }
  }, [executions, currentPersona, logEvent, toast]);

  const handleExportJSON = useCallback(() => {
    try {
      const data = executions.map((e) => ({
        id: e.id,
        testCaseId: e.testCaseId,
        suiteName: e.suiteName,
        status: e.status,
        environment: e.environment,
        startTime: e.startTime,
        endTime: e.endTime,
        duration: e.duration,
        executedBy: e.executedBy,
        defectsFound: e.defectsFound.length,
        aiConfidence: e.aiAnalysis ? e.aiAnalysis.confidence : 0,
      }));
      downloadJSON(data, 'test-executions.json');
      logEvent('data_export', {
        action: 'Exported Test Executions',
        details: `Test executions exported as JSON by ${currentPersona.name}. ${data.length} records.`,
        resource: '/measures',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} executions exported as JSON.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export test executions.',
      });
    }
  }, [executions, currentPersona, logEvent, toast]);

  const kpiData = useMemo(() => {
    const total = executions.length;
    const passed = executions.filter((e) => e.status === 'passed').length;
    const failed = executions.filter((e) => e.status === 'failed').length;
    const blocked = executions.filter((e) => e.status === 'blocked').length;
    const skipped = executions.filter((e) => e.status === 'skipped').length;
    const executed = executions.filter((e) => e.status === 'passed' || e.status === 'failed').length;
    const passRate = executed > 0 ? Math.round((passed / executed) * 1000) / 10 : 0;
    const totalDefects = executions.reduce((sum, e) => sum + e.defectsFound.length, 0);

    const executionsWithDuration = executions.filter((e) => e.duration > 0);
    const avgDuration = executionsWithDuration.length > 0
      ? Math.round(executionsWithDuration.reduce((sum, e) => sum + e.duration, 0) / executionsWithDuration.length)
      : 0;

    return [
      {
        id: 'kpi_total',
        label: 'Total Executions',
        value: total,
        unit: 'count',
        trend: 'improving',
        status: 'on_track',
        description: 'Total test executions across all environments.',
      },
      {
        id: 'kpi_pass_rate',
        label: 'Pass Rate',
        value: passRate,
        unit: 'percent',
        trend: passRate >= 80 ? 'improving' : passRate >= 60 ? 'stable' : 'declining',
        status: passRate >= 80 ? 'on_track' : passRate >= 60 ? 'at_risk' : 'critical',
        description: 'Percentage of executed tests that passed.',
      },
      {
        id: 'kpi_failed',
        label: 'Failed',
        value: failed,
        unit: 'count',
        trend: failed > 5 ? 'declining' : 'stable',
        status: failed > 8 ? 'critical' : failed > 3 ? 'at_risk' : 'on_track',
        description: 'Number of failed test executions.',
      },
      {
        id: 'kpi_defects',
        label: 'Defects Found',
        value: totalDefects,
        unit: 'count',
        trend: totalDefects > 10 ? 'declining' : 'stable',
        status: totalDefects > 15 ? 'at_risk' : 'on_track',
        description: 'Total defects discovered during test execution.',
      },
    ];
  }, [executions]);

  const filterFields = useMemo(() => {
    const suiteNames = [...new Set(executions.map((e) => e.suiteName))].sort();
    const suiteOptions = suiteNames.map((s) => ({
      value: s,
      label: s.length > 40 ? s.substring(0, 40) + '…' : s,
    }));

    return [
      {
        id: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: '', label: 'All Statuses' },
          { value: 'passed', label: 'Passed' },
          { value: 'failed', label: 'Failed' },
          { value: 'blocked', label: 'Blocked' },
          { value: 'skipped', label: 'Skipped' },
          { value: 'in-progress', label: 'In Progress' },
        ],
        defaultValue: '',
      },
      {
        id: 'environment',
        label: 'Environment',
        type: 'select',
        options: [
          { value: '', label: 'All Environments' },
          { value: 'QA', label: 'QA' },
          { value: 'Staging', label: 'Staging' },
          { value: 'Performance', label: 'Performance' },
          { value: 'Production', label: 'Production' },
          { value: 'Development', label: 'Development' },
        ],
        defaultValue: '',
      },
      {
        id: 'suiteName',
        label: 'Suite',
        type: 'select',
        options: [{ value: '', label: 'All Suites' }, ...suiteOptions],
        defaultValue: '',
      },
    ];
  }, [executions]);

  const executionColumns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Execution ID',
        size: 110,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleExecutionClick(row.original)}
            className="text-xs font-mono text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors"
          >
            {row.original.id}
          </button>
        ),
      },
      {
        accessorKey: 'testCaseId',
        header: 'Test Case',
        size: 100,
        cell: ({ row }) => (
          <span className="text-xs font-mono text-slate-500">{row.original.testCaseId}</span>
        ),
      },
      {
        accessorKey: 'suiteName',
        header: 'Suite',
        cell: ({ row }) => (
          <span className="text-sm text-slate-700 truncate block max-w-[200px]">{row.original.suiteName}</span>
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
        accessorKey: 'environment',
        header: 'Environment',
        size: 110,
        cell: ({ row }) => (
          <Badge variant="outline" size="sm">{row.original.environment}</Badge>
        ),
      },
      {
        accessorKey: 'duration',
        header: 'Duration',
        size: 100,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{formatDuration(row.original.duration)}</span>
        ),
      },
      {
        accessorKey: 'executedBy',
        header: 'Executed By',
        size: 130,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.executedBy}</span>
        ),
      },
      {
        accessorKey: 'startTime',
        header: 'Start Time',
        size: 150,
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">{formatDate(row.original.startTime, 'MMM d, yyyy h:mm a')}</span>
        ),
      },
      {
        id: 'defects',
        header: 'Defects',
        size: 70,
        enableSorting: false,
        cell: ({ row }) => {
          const count = row.original.defectsFound.length;
          return count > 0 ? (
            <Badge variant="error" size="sm">{count}</Badge>
          ) : (
            <span className="text-xs text-slate-400">0</span>
          );
        },
      },
      {
        id: 'aiConfidence',
        header: 'AI',
        size: 60,
        enableSorting: false,
        cell: ({ row }) => {
          const confidence = row.original.aiAnalysis ? row.original.aiAnalysis.confidence : 0;
          return (
            <span className="text-xs text-slate-500">{confidence}%</span>
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
                onClick={() => handleExecutionClick(row.original)}
                className={cn(
                  'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                  'hover:bg-slate-100 hover:text-slate-600',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                )}
                aria-label={`View execution ${row.original.id}`}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">View Details</TooltipContent>
          </UITooltip>
        ),
      },
    ],
    [handleExecutionClick]
  );

  const insightData = useMemo(() => {
    if (executions.length === 0) return null;

    const failed = executions.filter((e) => e.status === 'failed');
    const withDefects = executions.filter((e) => e.defectsFound.length > 0);
    const totalDefects = executions.reduce((sum, e) => sum + e.defectsFound.length, 0);

    if (failed.length > 5) {
      return {
        variant: 'warning',
        title: `${failed.length} test executions failed`,
        message: `${failed.length} out of ${executions.length} test executions have failed status. ${withDefects.length} executions discovered ${totalDefects} defects. Review failed executions for root cause analysis.`,
        source: 'Test Orchestration Agent',
        confidence: 88,
      };
    }

    if (withDefects.length > 0) {
      return {
        variant: 'recommendation',
        title: `${totalDefects} defects discovered across ${withDefects.length} executions`,
        message: `AI analysis has identified root causes and recommendations for the discovered defects. Review execution details for actionable insights.`,
        source: 'Test Orchestration Agent',
        confidence: 91,
      };
    }

    return {
      variant: 'success',
      title: 'Test executions performing well',
      message: 'All recent test executions are within expected parameters with no critical failures detected.',
      source: 'Test Orchestration Agent',
      confidence: 95,
    };
  }, [executions]);

  const executionSummary = useMemo(() => {
    const passed = executions.filter((e) => e.status === 'passed').length;
    const failed = executions.filter((e) => e.status === 'failed').length;
    const blocked = executions.filter((e) => e.status === 'blocked').length;
    const skipped = executions.filter((e) => e.status === 'skipped').length;
    const inProgress = executions.filter((e) => e.status === 'in-progress').length;
    const totalDefects = executions.reduce((sum, e) => sum + e.defectsFound.length, 0);
    const avgConfidence = executions.length > 0
      ? Math.round(executions.reduce((sum, e) => sum + ((e.aiAnalysis && e.aiAnalysis.confidence) || 0), 0) / executions.length)
      : 0;

    const executionsWithDuration = executions.filter((e) => e.duration > 0);
    const avgDuration = executionsWithDuration.length > 0
      ? Math.round(executionsWithDuration.reduce((sum, e) => sum + e.duration, 0) / executionsWithDuration.length)
      : 0;

    const totalDuration = executions.reduce((sum, e) => sum + (e.duration || 0), 0);

    return { passed, failed, blocked, skipped, inProgress, totalDefects, avgConfidence, avgDuration, totalDuration };
  }, [executions]);

  const recentExecutions = useMemo(() => {
    return [...executions]
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, 8);
  }, [executions]);

  if (loading) {
    return <TestExecutionDashboardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">Test Execution Dashboard</h1>
          <p className="text-sm text-slate-500">
            Execution summary, results, and trend analysis for {currentPersona.name}
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
          <TabsTrigger value="list">Executions ({executions.length})</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {executions.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No executions found"
              message="No test executions match the current filter criteria. Try adjusting your filters."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={executionColumns}
              data={executions}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search executions..."
              emptyMessage="No executions match the search criteria."
              onRowClick={handleExecutionClick}
            />
          )}
        </TabsContent>

        <TabsContent value="cards">
          {executions.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No executions found"
              message="No test executions match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recentExecutions.map((exec) => (
                <Card
                  key={exec.id}
                  className={cn(
                    'p-4 cursor-pointer transition-all duration-200',
                    'hover:shadow-card-hover hover:border-humana-green-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                    'active:scale-[0.99]'
                  )}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleExecutionClick(exec)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleExecutionClick(exec);
                    }
                  }}
                  aria-label={`Execution ${exec.id}. Status: ${exec.status}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono text-slate-500">{exec.id}</span>
                    <StatusPill status={exec.status} size="sm" dot />
                  </div>
                  <p className="mt-1.5 text-xs font-medium text-slate-900 line-clamp-1">{exec.suiteName}</p>
                  <div className="mt-1 text-2xs text-slate-400">{exec.testCaseId}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline" size="sm">{exec.environment}</Badge>
                    <span className="text-2xs text-slate-400">{formatDuration(exec.duration)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-2xs text-slate-400">{exec.executedBy}</span>
                    {exec.defectsFound.length > 0 ? (
                      <Badge variant="error" size="sm">{exec.defectsFound.length} defects</Badge>
                    ) : null}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-2xs text-slate-400">
                      {formatDate(exec.startTime, 'MMM d, h:mm a')}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  </div>
                </Card>
              ))}
              {executions.length > recentExecutions.length ? (
                <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-200 p-4">
                  <p className="text-sm text-slate-500">
                    +{executions.length - recentExecutions.length} more executions. Switch to list view to see all.
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {executions.length === 0 ? (
            <EmptyState
              type="no_chart"
              title="No data for analytics"
              message="No test execution data available to generate analytics. Try adjusting your filters."
              size="lg"
              bordered
            />
          ) : (
            <AnalyticsPanel executions={executions} />
          )}
        </TabsContent>
      </Tabs>

      {/* Execution Summary Panel */}
      {executions.length > 0 ? (
        <PanelCard
          title="Execution Summary"
          subtitle="Aggregate metrics across all filtered executions"
          icon={<Activity className="h-5 w-5" />}
          collapsible
          defaultCollapsed={false}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Passed</span>
              <span className="text-2xl font-semibold text-success-600">{executionSummary.passed}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Failed</span>
              <span className="text-2xl font-semibold text-danger-600">{executionSummary.failed}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Blocked</span>
              <span className="text-2xl font-semibold text-warning-600">{executionSummary.blocked}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Skipped</span>
              <span className="text-2xl font-semibold text-slate-500">{executionSummary.skipped}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Defects Found</span>
              <span className="text-2xl font-semibold text-slate-900">{executionSummary.totalDefects}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg Duration</span>
              <span className="text-2xl font-semibold text-slate-900">{formatDuration(executionSummary.avgDuration)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg AI Confidence</span>
              <span className="text-2xl font-semibold text-slate-900">{executionSummary.avgConfidence}%</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-500">Pass Rate</span>
              <span className="text-xs font-semibold text-slate-900">
                {kpiData.find((k) => k.id === 'kpi_pass_rate')?.value || 0}%
              </span>
            </div>
            <Progress
              value={kpiData.find((k) => k.id === 'kpi_pass_rate')?.value || 0}
              max={100}
              variant="auto"
              size="md"
              animate
            />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {[
              { label: 'Passed', status: 'passed', count: executionSummary.passed },
              { label: 'Failed', status: 'failed', count: executionSummary.failed },
              { label: 'Blocked', status: 'blocked', count: executionSummary.blocked },
              { label: 'Skipped', status: 'skipped', count: executionSummary.skipped },
              { label: 'In Progress', status: 'in-progress', count: executionSummary.inProgress },
            ].map((item) => (
              <div key={item.status} className="flex items-center gap-3">
                <div className="w-24 shrink-0">
                  <StatusPill status={item.status} size="sm" dot />
                </div>
                <div className="flex-1">
                  <Progress
                    value={item.count}
                    max={executions.length || 1}
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

      {/* Execution Detail Dialog */}
      <ExecutionDetailDialog
        execution={selectedExecution}
        open={detailOpen}
        onOpenChange={handleDetailClose}
      />
    </div>
  );
}

TestExecutionDashboardPage.displayName = 'TestExecutionDashboardPage';

export { TestExecutionDashboardPage };
export default TestExecutionDashboardPage;