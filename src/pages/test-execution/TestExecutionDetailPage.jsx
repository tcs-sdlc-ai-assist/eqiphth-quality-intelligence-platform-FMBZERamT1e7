import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Download,
  Eye,
  Calendar,
  BarChart2,
  AlertTriangle,
  FileText,
  ChevronRight,
  ChevronLeft,
  Timer,
  TestTube,
  Shield,
  User,
  Bug,
  Star,
  Mail,
  Image,
  Video,
  FileCode,
  FileJson,
  Activity,
  Sparkles,
  Lightbulb,
  ArrowLeft,
  ExternalLink,
  Copy,
  Share2,
  Heart,
  Bookmark,
  Clipboard,
  Terminal,
  Info,
  Layers,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import { getTestExecutionById } from '@/data/testExecutions';
import { getTestCaseById } from '@/data/testCases';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { StatusPill } from '@/components/shared/StatusPill';
import { EmptyState } from '@/components/shared/EmptyState';
import { InsightBanner } from '@/components/shared/InsightBanner';
import { PermissionGate } from '@/components/shared/PermissionGate';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Progress } from '@/components/ui/Progress';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
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

/**
 * Formats a duration in seconds to a human-readable string.
 *
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
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

/**
 * Returns the icon component for a given evidence type.
 *
 * @param {string} type - Evidence type
 * @returns {React.ElementType} Icon component
 */
function getEvidenceIcon(type) {
  switch (type) {
    case 'screenshot':
      return Image;
    case 'video':
      return Video;
    case 'log':
      return Terminal;
    case 'har':
      return FileCode;
    case 'report':
      return FileText;
    default:
      return FileText;
  }
}

/**
 * Returns the badge variant for a given evidence type.
 *
 * @param {string} type - Evidence type
 * @returns {string} Badge variant
 */
function getEvidenceVariant(type) {
  switch (type) {
    case 'screenshot':
      return 'info';
    case 'video':
      return 'warning';
    case 'log':
      return 'neutral';
    case 'har':
      return 'primary';
    case 'report':
      return 'success';
    default:
      return 'neutral';
  }
}

/**
 * Returns the log level color class.
 *
 * @param {string} level - Log level
 * @returns {string} Tailwind color class
 */
function getLogLevelColor(level) {
  switch (level) {
    case 'error':
      return 'text-red-400';
    case 'warn':
      return 'text-yellow-400';
    case 'debug':
      return 'text-blue-400';
    case 'info':
    default:
      return 'text-green-400';
  }
}

/**
 * Returns the severity badge variant.
 *
 * @param {string} severity - Defect severity
 * @returns {string} Badge variant
 */
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

/**
 * Renders the execution logs panel.
 *
 * @param {object} props
 * @param {import('@/data/testExecutions').LogEntry[]} props.logs
 * @returns {React.ReactElement}
 */
function LogsPanel({ logs }) {
  const [filterLevel, setFilterLevel] = useState('all');

  const filteredLogs = useMemo(() => {
    if (filterLevel === 'all') return logs;
    return logs.filter((log) => log.level === filterLevel);
  }, [logs, filterLevel]);

  const logCounts = useMemo(() => {
    const counts = { info: 0, warn: 0, error: 0, debug: 0 };
    for (const log of logs) {
      if (counts[log.level] !== undefined) {
        counts[log.level]++;
      }
    }
    return counts;
  }, [logs]);

  if (logs.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No logs available"
        message="No execution logs were captured for this test run."
        size="sm"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-slate-500">Filter:</span>
        <Button
          variant={filterLevel === 'all' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setFilterLevel('all')}
          className="text-xs px-2 py-1 h-7"
        >
          All ({logs.length})
        </Button>
        <Button
          variant={filterLevel === 'info' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setFilterLevel('info')}
          className="text-xs px-2 py-1 h-7"
        >
          Info ({logCounts.info})
        </Button>
        <Button
          variant={filterLevel === 'warn' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setFilterLevel('warn')}
          className="text-xs px-2 py-1 h-7"
        >
          Warn ({logCounts.warn})
        </Button>
        <Button
          variant={filterLevel === 'error' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setFilterLevel('error')}
          className="text-xs px-2 py-1 h-7"
        >
          Error ({logCounts.error})
        </Button>
        {logCounts.debug > 0 ? (
          <Button
            variant={filterLevel === 'debug' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFilterLevel('debug')}
            className="text-xs px-2 py-1 h-7"
          >
            Debug ({logCounts.debug})
          </Button>
        ) : null}
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-950 p-4 max-h-[400px] overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No logs match the selected filter.</p>
        ) : (
          filteredLogs.map((log, index) => (
            <div key={index} className="flex gap-2 text-xs font-mono leading-relaxed py-0.5">
              <span className="text-slate-500 shrink-0 w-20">
                {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : ''}
              </span>
              <span
                className={cn('shrink-0 w-12 uppercase font-semibold', getLogLevelColor(log.level))}
              >
                {log.level}
              </span>
              <span className="text-slate-300 break-words">{log.message}</span>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-2xs text-slate-400">
          Showing {filteredLogs.length} of {logs.length} log entries
        </span>
      </div>
    </div>
  );
}

/**
 * Renders the evidence artifacts panel.
 *
 * @param {object} props
 * @param {import('@/data/testExecutions').Evidence[]} props.evidence
 * @returns {React.ReactElement}
 */
function EvidencePanel({ evidence }) {
  if (evidence.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No evidence captured"
        message="No screenshots, videos, or artifacts were captured during this execution."
        size="sm"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {evidence.map((ev, index) => {
        const IconComponent = getEvidenceIcon(ev.type);
        return (
          <Card
            key={index}
            className={cn(
              'p-4 transition-all duration-200',
              'hover:shadow-card-hover hover:border-humana-green-200'
            )}
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-slate-100">
                <IconComponent className="h-5 w-5 text-slate-500" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{ev.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={getEvidenceVariant(ev.type)} size="sm">
                    {ev.type}
                  </Badge>
                  <span className="text-2xs text-slate-400">
                    {ev.capturedAt ? formatDate(ev.capturedAt, 'MMM d, h:mm a') : ''}
                  </span>
                </div>
                {ev.url ? (
                  <div className="mt-2">
                    <span className="text-2xs text-slate-400 font-mono truncate block">{ev.url}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/**
 * Renders the AI analysis panel.
 *
 * @param {object} props
 * @param {import('@/data/testExecutions').AIAnalysis} props.aiAnalysis
 * @returns {React.ReactElement}
 */
function AIAnalysisPanel({ aiAnalysis }) {
  if (!aiAnalysis || !aiAnalysis.summary) {
    return (
      <EmptyState
        type="no_data"
        title="No AI analysis available"
        message="AI analysis was not generated for this execution."
        size="sm"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-humana-green-500" aria-hidden="true" />
          <span className="text-sm font-semibold text-slate-900">AI Analysis</span>
        </div>
        <Badge variant="primary" size="sm">
          Confidence: {aiAnalysis.confidence}%
        </Badge>
      </div>

      <div className="rounded-lg border border-humana-green-200 bg-humana-green-50/30 p-4">
        <h4 className="text-sm font-semibold text-slate-900 mb-2">Summary</h4>
        <p className="text-sm text-slate-700 leading-relaxed">{aiAnalysis.summary}</p>
      </div>

      {aiAnalysis.rootCause ? (
        <div className="rounded-lg border border-danger-200 bg-danger-50/30 p-4">
          <h4 className="text-sm font-semibold text-danger-900 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-danger-500" aria-hidden="true" />
            Root Cause
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed">{aiAnalysis.rootCause}</p>
        </div>
      ) : null}

      {aiAnalysis.recommendation ? (
        <div className="rounded-lg border border-info-200 bg-info-50/30 p-4">
          <h4 className="text-sm font-semibold text-info-900 mb-2 flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4 text-info-500" aria-hidden="true" />
            Recommendation
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed">{aiAnalysis.recommendation}</p>
        </div>
      ) : null}

      {aiAnalysis.relatedDefects && aiAnalysis.relatedDefects.length > 0 ? (
        <div className="mt-1">
          <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Related Defects</h4>
          <div className="flex flex-wrap gap-1.5">
            {aiAnalysis.relatedDefects.map((defectId) => (
              <Badge key={defectId} variant="error" size="sm">
                {defectId}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-1">
        <Progress
          value={aiAnalysis.confidence}
          max={100}
          variant="primary"
          size="sm"
          showValue
          label="AI Confidence Score"
        />
      </div>
    </div>
  );
}

/**
 * Renders the defects found panel.
 *
 * @param {object} props
 * @param {import('@/data/testExecutions').DefectFound[]} props.defects
 * @returns {React.ReactElement}
 */
function DefectsPanel({ defects }) {
  if (defects.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No defects found"
        message="No defects were discovered during this test execution."
        size="sm"
        icon={<CheckCircle className="h-8 w-8 text-success-300" />}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Bug className="h-4 w-4 text-danger-500" aria-hidden="true" />
        <span className="text-sm font-semibold text-slate-900">
          {defects.length} Defect{defects.length !== 1 ? 's' : ''} Found
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {defects.map((defect) => (
          <Card key={defect.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">{defect.id}</span>
                </div>
                <p className="text-sm font-medium text-slate-900">{defect.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <User className="h-3 w-3 text-slate-400" aria-hidden="true" />
                  <span className="text-2xs text-slate-500">Assignee: {defect.assignee}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <Badge variant={getSeverityBadgeVariant(defect.severity)} size="sm">
                  {defect.severity}
                </Badge>
                <StatusPill status={defect.status} size="sm" dot />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * Renders the step-by-step results panel using the linked test case steps.
 *
 * @param {object} props
 * @param {import('@/data/testCases').TestStep[]} props.steps
 * @param {string} props.executionStatus
 * @returns {React.ReactElement}
 */
function StepResultsPanel({ steps, executionStatus }) {
  if (!steps || steps.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No test steps available"
        message="No step-by-step details are available for this test case."
        size="sm"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Clipboard className="h-4 w-4 text-slate-400" aria-hidden="true" />
        <span className="text-sm font-semibold text-slate-900">
          {steps.length} Test Step{steps.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {steps.map((step, index) => {
          const isLastStep = index === steps.length - 1;
          const stepStatus =
            executionStatus === 'passed'
              ? 'passed'
              : executionStatus === 'failed' && isLastStep
                ? 'failed'
                : executionStatus === 'failed' && index < steps.length - 1
                  ? 'passed'
                  : executionStatus === 'blocked'
                    ? 'blocked'
                    : executionStatus === 'skipped'
                      ? 'skipped'
                      : 'not_run';

          return (
            <div
              key={step.stepNumber}
              className={cn(
                'rounded-lg border p-4 transition-colors duration-200',
                stepStatus === 'passed' ? 'border-success-200 bg-success-50/20' :
                stepStatus === 'failed' ? 'border-danger-200 bg-danger-50/20' :
                stepStatus === 'blocked' ? 'border-warning-200 bg-warning-50/20' :
                'border-slate-200'
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    stepStatus === 'passed' ? 'bg-success-100 text-success-700' :
                    stepStatus === 'failed' ? 'bg-danger-100 text-danger-700' :
                    stepStatus === 'blocked' ? 'bg-warning-100 text-warning-700' :
                    'bg-slate-100 text-slate-600'
                  )}
                >
                  {step.stepNumber}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{step.action}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        <span className="font-medium text-slate-600">Expected:</span>{' '}
                        {step.expectedResult}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {stepStatus === 'passed' ? (
                        <CheckCircle className="h-4 w-4 text-success-500" aria-hidden="true" />
                      ) : stepStatus === 'failed' ? (
                        <XCircle className="h-4 w-4 text-danger-500" aria-hidden="true" />
                      ) : stepStatus === 'blocked' ? (
                        <AlertTriangle className="h-4 w-4 text-warning-500" aria-hidden="true" />
                      ) : (
                        <Clock className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Loading skeleton for the test execution detail page.
 *
 * @returns {React.ReactElement}
 */
function TestExecutionDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading execution detail" aria-busy="true">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-7 w-64" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-80 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Test Execution Detail page component.
 * Displays detailed execution information including logs, evidence,
 * AI analysis summary, defects found, and step-by-step results.
 * Supports export, email, and favorite actions (simulated).
 *
 * @returns {React.ReactElement}
 */
function TestExecutionDetailPage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();
  const navigate = useNavigate();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [execution, setExecution] = useState(null);
  const [testCase, setTestCase] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorited, setIsFavorited] = useState(false);

  const executionId = params.executionId || params['*'] || '';

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Measures', path: ROUTES.MEASURES },
      { label: 'Test Executions', path: ROUTES.MEASURES },
      { label: executionId || 'Execution Detail' },
    ]);
  }, [setBreadcrumbs, executionId]);

  const loadData = useCallback(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      try {
        let exec = null;
        if (executionId) {
          exec = getTestExecutionById(executionId);
        }
        if (!exec) {
          exec = getTestExecutionById('exec_008');
        }
        setExecution(exec);

        if (exec && exec.testCaseId) {
          const tc = getTestCaseById(exec.testCaseId);
          setTestCase(tc);
        } else {
          setTestCase(null);
        }
      } catch {
        setExecution(null);
        setTestCase(null);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [executionId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    loadData();
  }, [loadData]);

  const handleFavorite = useCallback(() => {
    setIsFavorited((prev) => !prev);
    toast({
      variant: 'success',
      title: isFavorited ? 'Removed from Favorites' : 'Added to Favorites',
      description: isFavorited
        ? 'This execution has been removed from your favorites.'
        : 'This execution has been added to your favorites.',
    });
  }, [isFavorited, toast]);

  const handleEmail = useCallback(() => {
    if (!execution) return;
    logEvent('notification_sent', {
      action: 'Execution Report Emailed',
      details: `Execution report for ${execution.id} emailed by ${currentPersona.name}.`,
      resource: execution.id,
      outcome: 'success',
    });
    toast({
      variant: 'success',
      title: 'Email Sent',
      description: `Execution report for ${execution.id} has been emailed to your address.`,
    });
  }, [execution, currentPersona, logEvent, toast]);

  const handleCopyLink = useCallback(() => {
    if (!execution) return;
    try {
      const url = `${window.location.origin}/measures/executions/${execution.id}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url);
      }
    } catch {
      // Silently fail
    }
    toast({
      variant: 'success',
      title: 'Link Copied',
      description: 'Execution link has been copied to your clipboard.',
    });
  }, [execution, toast]);

  const handleExportCSV = useCallback(() => {
    if (!execution) return;
    try {
      const data = [{
        id: execution.id,
        testCaseId: execution.testCaseId,
        suiteName: execution.suiteName,
        status: execution.status,
        environment: execution.environment,
        startTime: execution.startTime,
        endTime: execution.endTime,
        duration: execution.duration,
        executedBy: execution.executedBy,
        defectsFound: execution.defectsFound.length,
        aiConfidence: execution.aiAnalysis ? execution.aiAnalysis.confidence : 0,
        aiSummary: execution.aiAnalysis ? execution.aiAnalysis.summary : '',
        rootCause: execution.aiAnalysis ? execution.aiAnalysis.rootCause : '',
        recommendation: execution.aiAnalysis ? execution.aiAnalysis.recommendation : '',
      }];
      downloadCSV(data, `execution-${execution.id}.csv`);
      logEvent('data_export', {
        action: 'Exported Execution Detail',
        details: `Execution ${execution.id} exported as CSV by ${currentPersona.name}.`,
        resource: execution.id,
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `Execution ${execution.id} exported as CSV.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export execution detail.',
      });
    }
  }, [execution, currentPersona, logEvent, toast]);

  const handleExportJSON = useCallback(() => {
    if (!execution) return;
    try {
      const data = {
        id: execution.id,
        testCaseId: execution.testCaseId,
        suiteName: execution.suiteName,
        status: execution.status,
        environment: execution.environment,
        startTime: execution.startTime,
        endTime: execution.endTime,
        duration: execution.duration,
        executedBy: execution.executedBy,
        logs: execution.logs,
        evidence: execution.evidence,
        aiAnalysis: execution.aiAnalysis,
        defectsFound: execution.defectsFound,
      };
      downloadJSON(data, `execution-${execution.id}.json`);
      logEvent('data_export', {
        action: 'Exported Execution Detail',
        details: `Execution ${execution.id} exported as JSON by ${currentPersona.name}.`,
        resource: execution.id,
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `Execution ${execution.id} exported as JSON.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export execution detail.',
      });
    }
  }, [execution, currentPersona, logEvent, toast]);

  const kpiData = useMemo(() => {
    if (!execution) return [];

    const defectCount = execution.defectsFound ? execution.defectsFound.length : 0;
    const logCount = execution.logs ? execution.logs.length : 0;
    const evidenceCount = execution.evidence ? execution.evidence.length : 0;
    const aiConfidence = execution.aiAnalysis ? execution.aiAnalysis.confidence : 0;

    return [
      {
        id: 'kpi_status',
        label: 'Status',
        value: execution.status.charAt(0).toUpperCase() + execution.status.slice(1).replace('-', ' '),
        unit: undefined,
        trend: execution.status === 'passed' ? 'improving' : execution.status === 'failed' ? 'declining' : 'stable',
        status: execution.status === 'passed' ? 'on_track' : execution.status === 'failed' ? 'critical' : 'at_risk',
        description: `Execution result: ${execution.status}`,
      },
      {
        id: 'kpi_duration',
        label: 'Duration',
        value: formatDuration(execution.duration),
        unit: undefined,
        trend: 'stable',
        status: 'on_track',
        description: `Total execution time`,
      },
      {
        id: 'kpi_defects',
        label: 'Defects Found',
        value: defectCount,
        unit: 'count',
        trend: defectCount > 0 ? 'declining' : 'stable',
        status: defectCount > 2 ? 'critical' : defectCount > 0 ? 'at_risk' : 'on_track',
        description: 'Defects discovered during execution.',
      },
      {
        id: 'kpi_ai_confidence',
        label: 'AI Confidence',
        value: aiConfidence,
        unit: 'percent',
        trend: aiConfidence >= 90 ? 'improving' : 'stable',
        status: aiConfidence >= 90 ? 'on_track' : aiConfidence >= 70 ? 'at_risk' : 'critical',
        description: 'AI analysis confidence score.',
      },
    ];
  }, [execution]);

  const insightData = useMemo(() => {
    if (!execution) return null;

    const aiAnalysis = execution.aiAnalysis;
    if (!aiAnalysis || !aiAnalysis.summary) return null;

    if (execution.status === 'failed') {
      return {
        variant: 'critical',
        title: 'Test Execution Failed',
        message: aiAnalysis.rootCause
          ? `Root cause identified: ${aiAnalysis.rootCause.substring(0, 200)}${aiAnalysis.rootCause.length > 200 ? '…' : ''}`
          : aiAnalysis.summary.substring(0, 200),
        source: 'AI Analysis Engine',
        confidence: aiAnalysis.confidence,
      };
    }

    if (execution.status === 'passed' && execution.defectsFound && execution.defectsFound.length === 0) {
      return {
        variant: 'success',
        title: 'Test Execution Passed',
        message: aiAnalysis.summary.substring(0, 200),
        source: 'AI Analysis Engine',
        confidence: aiAnalysis.confidence,
      };
    }

    if (execution.status === 'blocked') {
      return {
        variant: 'warning',
        title: 'Test Execution Blocked',
        message: aiAnalysis.summary.substring(0, 200),
        source: 'AI Analysis Engine',
        confidence: aiAnalysis.confidence,
      };
    }

    return {
      variant: 'recommendation',
      title: 'AI Analysis Available',
      message: aiAnalysis.summary.substring(0, 200),
      source: 'AI Analysis Engine',
      confidence: aiAnalysis.confidence,
    };
  }, [execution]);

  if (loading) {
    return <TestExecutionDetailSkeleton />;
  }

  if (!execution) {
    return (
      <div className="flex flex-col gap-6">
        <Button
          variant="ghost"
          size="sm"
          iconLeft={<ArrowLeft className="h-3.5 w-3.5" />}
          onClick={handleBack}
        >
          Back
        </Button>
        <EmptyState
          type="no_data"
          title="Execution not found"
          message={`Test execution "${executionId}" could not be found. It may have been removed or the ID is incorrect.`}
          size="lg"
          bordered
          actionLabel="Go Back"
          onAction={handleBack}
          actionIcon={<ArrowLeft className="h-3.5 w-3.5" />}
        />
      </div>
    );
  }

  const logs = execution.logs || [];
  const evidence = execution.evidence || [];
  const aiAnalysis = execution.aiAnalysis || {};
  const defectsFound = execution.defectsFound || [];
  const testSteps = testCase ? testCase.steps || [] : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<ArrowLeft className="h-3.5 w-3.5" />}
            onClick={handleBack}
            className="shrink-0 mt-0.5"
          >
            Back
          </Button>
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
                <Play className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <h1 className="text-xl font-semibold text-slate-900">{execution.id}</h1>
                <p className="text-sm text-slate-500 truncate">
                  {execution.suiteName} • {execution.testCaseId}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <UITooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleFavorite}
                className={cn(
                  'inline-flex items-center justify-center rounded-lg p-2 transition-colors duration-200',
                  'hover:bg-slate-100',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                  isFavorited ? 'text-warning-500' : 'text-slate-400'
                )}
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Bookmark
                  className={cn('h-5 w-5', isFavorited ? 'fill-current' : '')}
                  aria-hidden="true"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
            </TooltipContent>
          </UITooltip>

          <UITooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleCopyLink}
                className={cn(
                  'inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition-colors duration-200',
                  'hover:bg-slate-100 hover:text-slate-600',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2'
                )}
                aria-label="Copy link"
              >
                <Copy className="h-5 w-5" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Copy Link</TooltipContent>
          </UITooltip>

          <Button
            variant="outline"
            size="sm"
            iconLeft={<Mail className="h-3.5 w-3.5" />}
            onClick={handleEmail}
          >
            Email
          </Button>

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
                  <FileJson className="mr-2 h-4 w-4" aria-hidden="true" />
                  JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </PermissionGate>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill status={execution.status} size="md" dot />
        <Badge variant="outline" size="md">
          {execution.environment}
        </Badge>
        <Badge variant="outline" size="md">
          <Timer className="h-3 w-3 mr-1" aria-hidden="true" />
          {formatDuration(execution.duration)}
        </Badge>
        {defectsFound.length > 0 ? (
          <Badge variant="error" size="md">
            <Bug className="h-3 w-3 mr-1" aria-hidden="true" />
            {defectsFound.length} defect{defectsFound.length !== 1 ? 's' : ''}
          </Badge>
        ) : null}
        {aiAnalysis.confidence ? (
          <Badge variant="primary" size="md">
            <Sparkles className="h-3 w-3 mr-1" aria-hidden="true" />
            AI: {aiAnalysis.confidence}%
          </Badge>
        ) : null}
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

      {/* Execution Metadata */}
      <PanelCard
        title="Execution Details"
        subtitle="Metadata and configuration for this test execution"
        icon={<Info className="h-5 w-5" />}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Executed By:</span>
            <span className="font-medium text-slate-900">{execution.executedBy}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Start Time:</span>
            <span className="font-medium text-slate-900">
              {formatDate(execution.startTime, 'MMM d, yyyy h:mm a')}
            </span>
          </div>
          {execution.endTime ? (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">End Time:</span>
              <span className="font-medium text-slate-900">
                {formatDate(execution.endTime, 'MMM d, yyyy h:mm a')}
              </span>
            </div>
          ) : null}
          <div className="flex items-center gap-2 text-sm">
            <TestTube className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Test Case:</span>
            <span className="font-medium text-slate-900">{execution.testCaseId}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Layers className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Suite:</span>
            <span className="font-medium text-slate-900 truncate">{execution.suiteName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Activity className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Environment:</span>
            <span className="font-medium text-slate-900">{execution.environment}</span>
          </div>
        </div>

        {testCase ? (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Linked Test Case</h4>
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-mono text-slate-500">{testCase.id}</span>
                  <p className="text-sm font-medium text-slate-900">{testCase.title}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge
                    variant={
                      testCase.type === 'functional' ? 'primary' :
                      testCase.type === 'performance' ? 'error' :
                      testCase.type === 'security' ? 'error' :
                      testCase.type === 'accessibility' ? 'success' :
                      'info'
                    }
                    size="sm"
                  >
                    {testCase.type}
                  </Badge>
                  <Badge
                    variant={
                      testCase.priority === 'critical' ? 'error' :
                      testCase.priority === 'high' ? 'warning' :
                      'info'
                    }
                    size="sm"
                  >
                    {testCase.priority}
                  </Badge>
                </div>
              </div>
              {testCase.expectedResult ? (
                <p className="mt-2 text-xs text-slate-500 line-clamp-2">{testCase.expectedResult}</p>
              ) : null}
              {testCase.tags && testCase.tags.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {testCase.tags.slice(0, 5).map((tag) => (
                    <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
                  ))}
                  {testCase.tags.length > 5 ? (
                    <Badge variant="outline" size="sm">+{testCase.tags.length - 5}</Badge>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </PanelCard>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            AI Analysis
          </TabsTrigger>
          <TabsTrigger value="steps">
            Steps ({testSteps.length})
          </TabsTrigger>
          <TabsTrigger value="logs">
            Logs ({logs.length})
          </TabsTrigger>
          <TabsTrigger value="evidence">
            Evidence ({evidence.length})
          </TabsTrigger>
          <TabsTrigger value="defects">
            Defects ({defectsFound.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <PanelCard
            title="AI Analysis"
            subtitle="AI-generated analysis of the test execution result"
            icon={<Sparkles className="h-5 w-5" />}
          >
            <AIAnalysisPanel aiAnalysis={aiAnalysis} />
          </PanelCard>
        </TabsContent>

        <TabsContent value="steps">
          <PanelCard
            title="Step-by-Step Results"
            subtitle="Detailed test step execution results"
            icon={<Clipboard className="h-5 w-5" />}
          >
            <StepResultsPanel steps={testSteps} executionStatus={execution.status} />
          </PanelCard>
        </TabsContent>

        <TabsContent value="logs">
          <PanelCard
            title="Execution Logs"
            subtitle="Detailed log output from the test execution"
            icon={<Terminal className="h-5 w-5" />}
          >
            <LogsPanel logs={logs} />
          </PanelCard>
        </TabsContent>

        <TabsContent value="evidence">
          <PanelCard
            title="Evidence Artifacts"
            subtitle="Screenshots, videos, logs, and reports captured during execution"
            icon={<Image className="h-5 w-5" />}
          >
            <EvidencePanel evidence={evidence} />
          </PanelCard>
        </TabsContent>

        <TabsContent value="defects">
          <PanelCard
            title="Defects Found"
            subtitle="Defects discovered during this test execution"
            icon={<Bug className="h-5 w-5" />}
          >
            <DefectsPanel defects={defectsFound} />
          </PanelCard>
        </TabsContent>
      </Tabs>

      {/* Summary Footer */}
      <PanelCard
        title="Execution Summary"
        subtitle="Quick overview of execution metrics"
        icon={<Activity className="h-5 w-5" />}
        collapsible
        defaultCollapsed
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          <div className="flex flex-col gap-1">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Status</span>
            <StatusPill status={execution.status} size="sm" dot />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Duration</span>
            <span className="text-lg font-semibold text-slate-900">{formatDuration(execution.duration)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Log Entries</span>
            <span className="text-lg font-semibold text-slate-900">{logs.length}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Evidence</span>
            <span className="text-lg font-semibold text-slate-900">{evidence.length}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Defects</span>
            <span className={cn(
              'text-lg font-semibold',
              defectsFound.length > 0 ? 'text-danger-600' : 'text-success-600'
            )}>
              {defectsFound.length}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">AI Confidence</span>
            <span className="text-lg font-semibold text-slate-900">{aiAnalysis.confidence || 0}%</span>
          </div>
        </div>

        {execution.status === 'failed' && aiAnalysis.rootCause ? (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Root Cause Summary</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{aiAnalysis.rootCause}</p>
          </div>
        ) : null}

        {execution.status === 'passed' ? (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success-500" aria-hidden="true" />
              <span className="text-sm font-medium text-success-700">
                All assertions passed. Test execution completed successfully.
              </span>
            </div>
          </div>
        ) : null}
      </PanelCard>
    </div>
  );
}

TestExecutionDetailPage.displayName = 'TestExecutionDetailPage';

export { TestExecutionDetailPage };
export default TestExecutionDetailPage;