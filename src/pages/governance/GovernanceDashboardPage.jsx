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
  Shield,
  ShieldCheck,
  Activity,
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  FileText,
  BarChart2,
  Layers,
  ChevronRight,
  User,
  Calendar,
  Clock,
  Target,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  ClipboardCheck,
  Search,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  Unlock,
  Settings,
  Star,
  Lightbulb,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation, usePageHeader } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import {
  getAllGovernanceData,
  getAllProcedures,
  getAllComplianceScores,
  getAllAdherenceMetrics,
  getAllAuditFindings,
  getAllOperatingExpectations,
  getGovernanceAggregates,
  getAllProcedureCategories,
  getAllProcedureStatuses,
  getAllComplianceFrameworks,
  getAllAuditFindingSeverities,
  getAllAuditFindingStatuses,
  getAllOperatingExpectationCategories,
  getAllOperatingExpectationStatuses,
  getOpenAuditFindings,
} from '@/data/governance';
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

const COMPLIANCE_COLORS = {
  [MEASURE_STATUS.ON_TRACK]: '#10b981',
  [MEASURE_STATUS.AT_RISK]: '#f59e0b',
  [MEASURE_STATUS.CRITICAL]: '#ef4444',
};

const SEVERITY_COLORS = {
  critical: '#dc2626',
  high: '#f59e0b',
  medium: '#3b82f6',
  low: '#a3a3a3',
  informational: '#06b6d4',
};

const FINDING_STATUS_COLORS = {
  open: '#ef4444',
  in_progress: '#f59e0b',
  remediated: '#3b82f6',
  closed: '#10b981',
  accepted_risk: '#a3a3a3',
};

const PROCEDURE_STATUS_COLORS = {
  active: '#10b981',
  draft: '#3b82f6',
  under_review: '#f59e0b',
  deprecated: '#a3a3a3',
  archived: '#64748b',
};

const PROCEDURE_CATEGORY_COLORS = {
  quality_assurance: '#16b364',
  change_management: '#3b82f6',
  incident_management: '#ef4444',
  release_management: '#8b5cf6',
  security: '#dc2626',
  data_governance: '#06b6d4',
  compliance: '#f59e0b',
  testing: '#10b981',
};

const EXPECTATION_STATUS_COLORS = {
  compliant: '#10b981',
  non_compliant: '#ef4444',
  partially_compliant: '#f59e0b',
  waived: '#a3a3a3',
  pending_review: '#3b82f6',
};

const ADHERENCE_STATUS_COLORS = {
  met: '#10b981',
  not_met: '#ef4444',
  at_risk: '#f59e0b',
  pending: '#a3a3a3',
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

function formatLabel(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
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
      return 'neutral';
    case 'informational':
      return 'success';
    default:
      return 'neutral';
  }
}

function getFindingStatusBadgeVariant(status) {
  switch (status) {
    case 'open':
      return 'error';
    case 'in_progress':
      return 'warning';
    case 'remediated':
      return 'info';
    case 'closed':
      return 'success';
    case 'accepted_risk':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getProcedureStatusBadgeVariant(status) {
  switch (status) {
    case 'active':
      return 'success';
    case 'draft':
      return 'info';
    case 'under_review':
      return 'warning';
    case 'deprecated':
      return 'neutral';
    case 'archived':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getExpectationStatusBadgeVariant(status) {
  switch (status) {
    case 'compliant':
      return 'success';
    case 'non_compliant':
      return 'error';
    case 'partially_compliant':
      return 'warning';
    case 'waived':
      return 'neutral';
    case 'pending_review':
      return 'info';
    default:
      return 'neutral';
  }
}

function getAdherenceStatusBadgeVariant(status) {
  switch (status) {
    case 'met':
      return 'success';
    case 'not_met':
      return 'error';
    case 'at_risk':
      return 'warning';
    case 'pending':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function ProcedureDetailDialog({ procedure, open, onOpenChange }) {
  if (!procedure) return null;

  const applicableSegments = procedure.applicableSegments || [];
  const applicableApplications = procedure.applicableApplications || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <BookOpen className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{procedure.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {procedure.id} • {formatLabel(procedure.category)} • v{procedure.version}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant={getProcedureStatusBadgeVariant(procedure.status)} size="md">
            {formatLabel(procedure.status)}
          </Badge>
          <Badge variant="outline" size="md">
            {formatLabel(procedure.category)}
          </Badge>
          <Badge variant="outline" size="md">
            v{procedure.version}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Status</span>
            <p className="mt-1 text-sm font-semibold text-slate-900 capitalize">{formatLabel(procedure.status)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Version</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{procedure.version}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Category</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{formatLabel(procedure.category)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Segments</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{applicableSegments.length}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Owner:</span>
            <span className="font-medium text-slate-900">{procedure.owner}</span>
          </div>
          {procedure.approvedBy ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Approved By:</span>
              <span className="font-medium text-slate-900">{procedure.approvedBy}</span>
            </div>
          ) : null}
          {procedure.effectiveDate ? (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Effective Date:</span>
              <span className="font-medium text-slate-900">{formatDate(procedure.effectiveDate)}</span>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Last Review:</span>
            <span className="font-medium text-slate-900">{formatDate(procedure.lastReviewDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Next Review:</span>
            <span className="font-medium text-slate-900">{formatDate(procedure.nextReviewDate)}</span>
          </div>
        </div>

        {procedure.description ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{procedure.description}</p>
          </div>
        ) : null}

        {applicableSegments.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Applicable Segments</h4>
            <div className="flex flex-wrap gap-1.5">
              {applicableSegments.map((seg) => (
                <Badge key={seg} variant="outline" size="sm">{seg}</Badge>
              ))}
            </div>
          </div>
        ) : null}

        {applicableApplications.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Applicable Applications</h4>
            <div className="flex flex-wrap gap-1.5">
              {applicableApplications.map((app) => (
                <Badge key={app} variant="outline" size="sm">{app}</Badge>
              ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function ComplianceScoreDetailDialog({ complianceScore, open, onOpenChange }) {
  if (!complianceScore) return null;

  const domainScores = complianceScore.domainScores || [];
  const trendData = complianceScore.trendData || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Shield className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{complianceScore.framework}</DialogTitle>
              <DialogDescription className="mt-1">
                {complianceScore.id} • Compliance Framework
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill status={complianceScore.status} size="md" dot />
          <Badge variant="outline" size="md">
            Score: {complianceScore.overallScore.toFixed(1)}%
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Overall Score</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{complianceScore.overallScore.toFixed(1)}%</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Domains</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{domainScores.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Last Assessment</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(complianceScore.lastAssessmentDate)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Next Assessment</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(complianceScore.nextAssessmentDate)}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Assessor:</span>
            <span className="font-medium text-slate-900">{complianceScore.assessor}</span>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Overall Score</h4>
          <Progress
            value={complianceScore.overallScore}
            max={100}
            variant="auto"
            size="md"
            showValue
            label={`${complianceScore.framework} Compliance`}
          />
        </div>

        {domainScores.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Domain Scores</h4>
            <div className="flex flex-col gap-3">
              {domainScores.map((domain, index) => (
                <div key={index} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">{domain.domain}</span>
                      <StatusPill status={domain.status} size="sm" />
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{domain.score.toFixed(1)}%</span>
                  </div>
                  <Progress
                    value={domain.score}
                    max={100}
                    variant="auto"
                    size="xs"
                    animate
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {trendData.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Score Trend</h4>
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
                    name="Score"
                    stroke="#16b364"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#16b364', strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function AuditFindingDetailDialog({ finding, open, onOpenChange }) {
  if (!finding) return null;

  const evidence = finding.evidence || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-warning-50">
              <AlertTriangle className="h-5 w-5 text-warning-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{finding.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {finding.id} • {formatLabel(finding.severity)} severity
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill status={finding.status} size="md" dot />
          <Badge variant={getSeverityBadgeVariant(finding.severity)} size="md">
            {formatLabel(finding.severity)}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Severity</span>
            <p className="mt-1 text-sm font-semibold text-slate-900 capitalize">{finding.severity}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Status</span>
            <p className="mt-1 text-sm font-semibold text-slate-900 capitalize">{formatLabel(finding.status)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Identified</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(finding.identifiedDate)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Due Date</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(finding.dueDate)}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Assignee:</span>
            <span className="font-medium text-slate-900">{finding.assignee}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Auditor:</span>
            <span className="font-medium text-slate-900">{finding.auditor}</span>
          </div>
          {finding.closedDate ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Closed Date:</span>
              <span className="font-medium text-slate-900">{formatDate(finding.closedDate)}</span>
            </div>
          ) : null}
        </div>

        {finding.description ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Description</h4>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm text-slate-700 leading-relaxed">{finding.description}</p>
            </div>
          </div>
        ) : null}

        {finding.correctiveAction ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Corrective Action Plan</h4>
            <div className="rounded-lg border border-info-200 bg-info-50/30 p-3">
              <p className="text-sm text-slate-700 leading-relaxed">{finding.correctiveAction}</p>
            </div>
          </div>
        ) : null}

        {evidence.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Evidence ({evidence.length})</h4>
            <div className="flex flex-col gap-2">
              {evidence.map((ev) => (
                <div key={ev.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-sm font-medium text-slate-900">{ev.name}</span>
                      <span className="text-2xs text-slate-500">{ev.description}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant="outline" size="sm">{ev.type}</Badge>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-2xs text-slate-400">
                    <span>Uploaded by {ev.uploadedBy}</span>
                    <span>•</span>
                    <span>{formatDate(ev.uploadedDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function OperatingExpectationDetailDialog({ expectation, open, onOpenChange }) {
  if (!expectation) return null;

  const evidence = expectation.evidence || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <ClipboardCheck className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{expectation.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {expectation.id} • {formatLabel(expectation.category)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant={getExpectationStatusBadgeVariant(expectation.status)} size="md">
            {formatLabel(expectation.status)}
          </Badge>
          <Badge variant="outline" size="md">
            {formatLabel(expectation.category)}
          </Badge>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Owner:</span>
            <span className="font-medium text-slate-900">{expectation.owner}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Last Review:</span>
            <span className="font-medium text-slate-900">{formatDate(expectation.lastReviewDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Next Review:</span>
            <span className="font-medium text-slate-900">{formatDate(expectation.nextReviewDate)}</span>
          </div>
        </div>

        {expectation.description ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{expectation.description}</p>
          </div>
        ) : null}

        {evidence.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Evidence ({evidence.length})</h4>
            <div className="flex flex-col gap-2">
              {evidence.map((ev) => (
                <div key={ev.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-sm font-medium text-slate-900">{ev.name}</span>
                      <span className="text-2xs text-slate-500">{ev.description}</span>
                    </div>
                    <Badge variant="outline" size="sm">{ev.type}</Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-2xs text-slate-400">
                    <span>Uploaded by {ev.uploadedBy}</span>
                    <span>•</span>
                    <span>{formatDate(ev.uploadedDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function ComplianceFrameworksPanel({ complianceScores, onScoreClick }) {
  const sortedScores = useMemo(() => {
    return [...complianceScores].sort((a, b) => b.overallScore - a.overallScore);
  }, [complianceScores]);

  if (sortedScores.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No compliance frameworks"
        message="No compliance framework scores available."
        size="md"
        bordered
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {sortedScores.map((cs) => {
        const domainScores = cs.domainScores || [];
        const compliantDomains = domainScores.filter((d) => d.status === 'compliant').length;
        const nonCompliantDomains = domainScores.filter((d) => d.status === 'non_compliant').length;

        return (
          <Card
            key={cs.id}
            className={cn(
              'p-4 cursor-pointer transition-all duration-200',
              'hover:shadow-card-hover hover:border-humana-green-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
              'active:scale-[0.99]',
              cs.status === MEASURE_STATUS.CRITICAL && 'border-danger-200'
            )}
            role="button"
            tabIndex={0}
            onClick={() => onScoreClick(cs)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onScoreClick(cs);
              }
            }}
            aria-label={`${cs.framework}. Score: ${cs.overallScore.toFixed(1)}%. Status: ${cs.status}`}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900">{cs.framework}</h3>
              <StatusPill status={cs.status} size="sm" dot />
            </div>

            <div className="mt-3 flex items-center justify-center">
              <span
                className="text-3xl font-bold"
                style={{
                  color: cs.overallScore >= 90 ? '#10b981' :
                    cs.overallScore >= 75 ? '#f59e0b' : '#ef4444',
                }}
              >
                {cs.overallScore.toFixed(1)}%
              </span>
            </div>

            <div className="mt-3">
              <Progress
                value={cs.overallScore}
                max={100}
                variant="auto"
                size="sm"
                animate
              />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-2xs text-slate-400">Domains</span>
                <span className="text-xs font-semibold text-slate-900">{domainScores.length}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-2xs text-slate-400">Compliant</span>
                <span className="text-xs font-semibold text-success-600">{compliantDomains}/{domainScores.length}</span>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-2xs text-slate-400">
                Next: {formatDate(cs.nextAssessmentDate)}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function AdherenceMetricsPanel({ adherenceMetrics }) {
  if (adherenceMetrics.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No adherence metrics"
        message="No adherence metrics available."
        size="md"
        bordered
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {adherenceMetrics.map((metric, index) => {
        const meetsTarget = metric.status === 'met';
        const isAtRisk = metric.status === 'at_risk';
        const isNotMet = metric.status === 'not_met';

        return (
          <div
            key={index}
            className={cn(
              'rounded-lg border p-4',
              meetsTarget ? 'border-success-200 bg-success-50/10' :
              isNotMet ? 'border-danger-200 bg-danger-50/10' :
              isAtRisk ? 'border-warning-200 bg-warning-50/10' :
              'border-slate-200'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-900">{metric.name}</span>
                  <Badge variant={getAdherenceStatusBadgeVariant(metric.status)} size="sm">
                    {formatLabel(metric.status)}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-2xs text-slate-400">Target:</span>
                    <span className="text-xs font-semibold text-slate-700">{metric.target}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xs text-slate-400">Actual:</span>
                    <span className={cn(
                      'text-xs font-semibold',
                      meetsTarget ? 'text-success-600' :
                      isNotMet ? 'text-danger-600' :
                      'text-warning-600'
                    )}>
                      {metric.actual}
                      {metric.name.toLowerCase().includes('mttr') || metric.name.toLowerCase().includes('frequency') ? '' : '%'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {metric.trend === 'improving' ? (
                      <ArrowUpRight className="h-3 w-3 text-success-500" aria-hidden="true" />
                    ) : metric.trend === 'declining' ? (
                      <ArrowDownRight className="h-3 w-3 text-danger-500" aria-hidden="true" />
                    ) : (
                      <Minus className="h-3 w-3 text-slate-400" aria-hidden="true" />
                    )}
                    <span className={cn(
                      'text-2xs font-medium capitalize',
                      metric.trend === 'improving' ? 'text-success-600' :
                      metric.trend === 'declining' ? 'text-danger-600' :
                      'text-slate-500'
                    )}>
                      {metric.trend}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <Progress
                value={metric.actual}
                max={Math.max(metric.target, metric.actual, 100)}
                variant={meetsTarget ? 'success' : isNotMet ? 'error' : 'warning'}
                size="xs"
                animate
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AnalyticsPanel({ complianceScores, procedures, auditFindings, operatingExpectations, adherenceMetrics }) {
  const complianceChartData = useMemo(() => {
    return complianceScores
      .map((cs) => ({
        framework: cs.framework,
        score: cs.overallScore,
      }))
      .sort((a, b) => b.score - a.score);
  }, [complianceScores]);

  const complianceStatusData = useMemo(() => {
    const counts = {};
    for (const cs of complianceScores) {
      counts[cs.status] = (counts[cs.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: formatLabel(status),
    }));
  }, [complianceScores]);

  const findingSeverityData = useMemo(() => {
    const counts = {};
    for (const f of auditFindings) {
      counts[f.severity] = (counts[f.severity] || 0) + 1;
    }
    return Object.entries(counts).map(([severity, count]) => ({
      severity,
      count,
      label: formatLabel(severity),
    }));
  }, [auditFindings]);

  const findingStatusData = useMemo(() => {
    const counts = {};
    for (const f of auditFindings) {
      counts[f.status] = (counts[f.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: formatLabel(status),
    }));
  }, [auditFindings]);

  const procedureCategoryData = useMemo(() => {
    const counts = {};
    for (const p of procedures) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return Object.entries(counts).map(([category, count]) => ({
      category,
      count,
      label: formatLabel(category),
    }));
  }, [procedures]);

  const procedureStatusData = useMemo(() => {
    const counts = {};
    for (const p of procedures) {
      counts[p.status] = (counts[p.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: formatLabel(status),
    }));
  }, [procedures]);

  const expectationStatusData = useMemo(() => {
    const counts = {};
    for (const oe of operatingExpectations) {
      counts[oe.status] = (counts[oe.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: formatLabel(status),
    }));
  }, [operatingExpectations]);

  const adherenceStatusData = useMemo(() => {
    const counts = {};
    for (const m of adherenceMetrics) {
      counts[m.status] = (counts[m.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: formatLabel(status),
    }));
  }, [adherenceMetrics]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PanelCard
        title="Compliance Framework Scores"
        subtitle="Scores across all compliance frameworks"
        icon={<Shield className="h-5 w-5" />}
      >
        <ChartWrapper height={280} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={complianceChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="framework"
                tick={{ fontSize: 10, fill: '#64748b' }}
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
              <Bar dataKey="score" name="Score" radius={[4, 4, 0, 0]} barSize={28}>
                {complianceChartData.map((entry) => {
                  let color = '#10b981';
                  if (entry.score < 75) color = '#ef4444';
                  else if (entry.score < 90) color = '#f59e0b';
                  return <Cell key={entry.framework} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Audit Findings by Severity"
        subtitle="Distribution of findings across severity levels"
        icon={<AlertTriangle className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={findingSeverityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {findingSeverityData.map((entry) => (
                    <Cell key={entry.severity} fill={SEVERITY_COLORS[entry.severity] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} findings`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {findingSeverityData.map((item) => (
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
        title="Audit Findings by Status"
        subtitle="Finding lifecycle status distribution"
        icon={<Activity className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {findingStatusData.map((item) => (
            <div key={item.status} className="flex items-center gap-3">
              <div className="w-24 shrink-0">
                <Badge variant={getFindingStatusBadgeVariant(item.status)} size="sm">
                  {item.label}
                </Badge>
              </div>
              <div className="flex-1">
                <Progress
                  value={item.count}
                  max={auditFindings.length || 1}
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
        title="Procedures by Category"
        subtitle="Distribution across procedure categories"
        icon={<BookOpen className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={procedureCategoryData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
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
              <Bar dataKey="count" name="Procedures" radius={[0, 4, 4, 0]} barSize={16}>
                {procedureCategoryData.map((entry) => (
                  <Cell key={entry.category} fill={PROCEDURE_CATEGORY_COLORS[entry.category] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Operating Expectations Status"
        subtitle="Compliance status of operating expectations"
        icon={<ClipboardCheck className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expectationStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {expectationStatusData.map((entry) => (
                    <Cell key={entry.status} fill={EXPECTATION_STATUS_COLORS[entry.status] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} expectations`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {expectationStatusData.map((item) => (
              <div key={item.status} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: EXPECTATION_STATUS_COLORS[item.status] || '#a3a3a3' }}
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
        title="Adherence Metrics Status"
        subtitle="Met vs not met adherence metrics"
        icon={<Target className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={adherenceStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {adherenceStatusData.map((entry) => (
                    <Cell key={entry.status} fill={ADHERENCE_STATUS_COLORS[entry.status] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} metrics`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {adherenceStatusData.map((item) => (
              <div key={item.status} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: ADHERENCE_STATUS_COLORS[item.status] || '#a3a3a3' }}
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
        title="Procedure Status"
        subtitle="Procedure lifecycle status distribution"
        icon={<Settings className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {procedureStatusData.map((item) => (
            <div key={item.status} className="flex items-center gap-3">
              <div className="w-24 shrink-0">
                <Badge variant={getProcedureStatusBadgeVariant(item.status)} size="sm">
                  {item.label}
                </Badge>
              </div>
              <div className="flex-1">
                <Progress
                  value={item.count}
                  max={procedures.length || 1}
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
        title="Compliance Score Distribution"
        subtitle="Frameworks by compliance status"
        icon={<BarChart2 className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complianceStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {complianceStatusData.map((entry) => (
                    <Cell key={entry.status} fill={COMPLIANCE_COLORS[entry.status] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} frameworks`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {complianceStatusData.map((item) => (
              <div key={item.status} className="flex items-center justify-between gap-3">
                <StatusPill status={item.status} size="sm" dot />
                <span className="text-sm font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </PanelCard>
    </div>
  );
}

function GovernanceDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading governance dashboard" aria-busy="true">
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
 * Governance Dashboard page component.
 * Displays governance compliance overview with procedure adherence scores,
 * operating expectations status, audit findings, compliance framework scores,
 * and trend charts. Supports drill-down to procedure detail.
 *
 * @returns {React.ReactElement}
 */
function GovernanceDashboardPage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();

  usePageHeader({ title: 'Governance Dashboard', subtitle: `Compliance overview, procedure adherence, audit findings, and operating expectations for ${currentPersona.name}` });

  const [loading, setLoading] = useState(true);
  const [procedures, setProcedures] = useState([]);
  const [complianceScores, setComplianceScores] = useState([]);
  const [adherenceMetrics, setAdherenceMetrics] = useState([]);
  const [auditFindings, setAuditFindings] = useState([]);
  const [operatingExpectations, setOperatingExpectations] = useState([]);
  const [aggregates, setAggregates] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [procedureDetailOpen, setProcedureDetailOpen] = useState(false);
  const [selectedComplianceScore, setSelectedComplianceScore] = useState(null);
  const [complianceDetailOpen, setComplianceDetailOpen] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [findingDetailOpen, setFindingDetailOpen] = useState(false);
  const [selectedExpectation, setSelectedExpectation] = useState(null);
  const [expectationDetailOpen, setExpectationDetailOpen] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Reports', path: ROUTES.REPORTS },
      { label: 'Governance Dashboard' },
    ]);
  }, [setBreadcrumbs]);

  const loadData = useCallback(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      try {
        setProcedures(getAllProcedures());
        setComplianceScores(getAllComplianceScores());
        setAdherenceMetrics(getAllAdherenceMetrics());
        setAuditFindings(getAllAuditFindings());
        setOperatingExpectations(getAllOperatingExpectations());
        setAggregates(getGovernanceAggregates());
      } catch {
        setProcedures([]);
        setComplianceScores([]);
        setAdherenceMetrics([]);
        setAuditFindings([]);
        setOperatingExpectations([]);
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

  const handleRefresh = useCallback(() => {
    loadData();
  }, [loadData]);

  const handleProcedureClick = useCallback((proc) => {
    setSelectedProcedure(proc);
    setProcedureDetailOpen(true);
  }, []);

  const handleProcedureDetailClose = useCallback((open) => {
    setProcedureDetailOpen(open);
    if (!open) setSelectedProcedure(null);
  }, []);

  const handleComplianceScoreClick = useCallback((cs) => {
    setSelectedComplianceScore(cs);
    setComplianceDetailOpen(true);
  }, []);

  const handleComplianceDetailClose = useCallback((open) => {
    setComplianceDetailOpen(open);
    if (!open) setSelectedComplianceScore(null);
  }, []);

  const handleFindingClick = useCallback((finding) => {
    setSelectedFinding(finding);
    setFindingDetailOpen(true);
  }, []);

  const handleFindingDetailClose = useCallback((open) => {
    setFindingDetailOpen(open);
    if (!open) setSelectedFinding(null);
  }, []);

  const handleExpectationClick = useCallback((exp) => {
    setSelectedExpectation(exp);
    setExpectationDetailOpen(true);
  }, []);

  const handleExpectationDetailClose = useCallback((open) => {
    setExpectationDetailOpen(open);
    if (!open) setSelectedExpectation(null);
  }, []);

  const handleExportCSV = useCallback(() => {
    try {
      const data = complianceScores.map((cs) => ({
        id: cs.id,
        framework: cs.framework,
        overallScore: cs.overallScore,
        status: cs.status,
        lastAssessmentDate: cs.lastAssessmentDate,
        nextAssessmentDate: cs.nextAssessmentDate,
        assessor: cs.assessor,
        domains: cs.domainScores ? cs.domainScores.length : 0,
      }));
      downloadCSV(data, 'governance-compliance-scores.csv');
      logEvent('data_export', {
        action: 'Exported Governance Data',
        details: `Governance compliance scores exported as CSV by ${currentPersona.name}. ${data.length} records.`,
        resource: '/reports',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} compliance scores exported as CSV.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export governance data.',
      });
    }
  }, [complianceScores, currentPersona, logEvent, toast]);

  const handleExportJSON = useCallback(() => {
    try {
      const data = {
        complianceScores: complianceScores.map((cs) => ({
          id: cs.id,
          framework: cs.framework,
          overallScore: cs.overallScore,
          status: cs.status,
          lastAssessmentDate: cs.lastAssessmentDate,
          nextAssessmentDate: cs.nextAssessmentDate,
          assessor: cs.assessor,
        })),
        procedures: procedures.length,
        auditFindings: auditFindings.length,
        operatingExpectations: operatingExpectations.length,
        adherenceMetrics: adherenceMetrics.length,
      };
      downloadJSON(data, 'governance-dashboard.json');
      logEvent('data_export', {
        action: 'Exported Governance Data',
        details: `Governance dashboard data exported as JSON by ${currentPersona.name}.`,
        resource: '/reports',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: 'Governance dashboard data exported as JSON.',
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export governance data.',
      });
    }
  }, [complianceScores, procedures, auditFindings, operatingExpectations, adherenceMetrics, currentPersona, logEvent, toast]);

  const kpiData = useMemo(() => {
    if (!aggregates) return [];

    return [
      {
        id: 'kpi_avg_compliance',
        label: 'Avg Compliance Score',
        value: aggregates.averageComplianceScore,
        unit: 'percent',
        trend: aggregates.averageComplianceScore >= 85 ? 'improving' : 'stable',
        icon: <ShieldCheck />,
        tone: 'blue',
        description: 'Average compliance score across all frameworks.',
      },
      {
        id: 'kpi_open_findings',
        label: 'Open Findings',
        value: aggregates.openFindings,
        unit: 'count',
        trend: aggregates.openFindings > 5 ? 'declining' : 'stable',
        icon: <AlertTriangle />,
        tone: 'red',
        description: 'Audit findings currently open or in progress.',
      },
      {
        id: 'kpi_adherence_met',
        label: 'Adherence Met',
        value: aggregates.adherenceMetMet,
        unit: 'count',
        trend: 'improving',
        icon: <CheckCircle2 />,
        tone: 'green',
        description: 'Number of adherence metrics meeting targets.',
      },
      {
        id: 'kpi_compliant_expectations',
        label: 'Compliant Expectations',
        value: aggregates.compliantExpectations,
        unit: 'count',
        trend: aggregates.compliantExpectations >= aggregates.totalOperatingExpectations * 0.7 ? 'improving' : 'stable',
        icon: <ClipboardCheck />,
        tone: 'purple',
        description: 'Operating expectations in compliant status.',
      },
    ];
  }, [aggregates]);

  const insightData = useMemo(() => {
    if (!aggregates) return null;

    const criticalFindings = aggregates.criticalFindings || 0;
    const nonCompliant = aggregates.nonCompliantExpectations || 0;
    const adherenceNotMet = aggregates.adherenceNotMet || 0;

    if (criticalFindings > 0) {
      return {
        variant: 'critical',
        title: `${criticalFindings} critical audit finding${criticalFindings !== 1 ? 's' : ''} require immediate attention`,
        message: `${aggregates.openFindings} total open findings across ${aggregates.totalComplianceFrameworks} compliance frameworks. ${nonCompliant} operating expectation${nonCompliant !== 1 ? 's are' : ' is'} non-compliant. Average compliance score is ${aggregates.averageComplianceScore.toFixed(1)}%.`,
        source: 'Compliance Auditor Agent',
        confidence: 94,
      };
    }

    if (nonCompliant > 0 || adherenceNotMet > 3) {
      return {
        variant: 'warning',
        title: `${nonCompliant} non-compliant expectation${nonCompliant !== 1 ? 's' : ''} and ${adherenceNotMet} unmet adherence metric${adherenceNotMet !== 1 ? 's' : ''}`,
        message: `Review non-compliant operating expectations and unmet adherence metrics. ${aggregates.activeProcedures} active procedures are in place. Average compliance score is ${aggregates.averageComplianceScore.toFixed(1)}%.`,
        source: 'Compliance Auditor Agent',
        confidence: 89,
      };
    }

    return {
      variant: 'success',
      title: 'Governance posture is healthy',
      message: `Average compliance score is ${aggregates.averageComplianceScore.toFixed(1)}% across ${aggregates.totalComplianceFrameworks} frameworks. ${aggregates.activeProcedures} active procedures and ${aggregates.compliantExpectations} compliant operating expectations.`,
      source: 'Compliance Auditor Agent',
      confidence: 96,
    };
  }, [aggregates]);

  const procedureColumns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Procedure',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleProcedureClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors line-clamp-2"
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        size: 140,
        cell: ({ row }) => (
          <Badge variant="outline" size="sm">{formatLabel(row.original.category)}</Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 110,
        cell: ({ row }) => (
          <Badge variant={getProcedureStatusBadgeVariant(row.original.status)} size="sm">
            {formatLabel(row.original.status)}
          </Badge>
        ),
      },
      {
        accessorKey: 'version',
        header: 'Version',
        size: 80,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.version}</span>
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
        accessorKey: 'lastReviewDate',
        header: 'Last Review',
        size: 120,
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">{formatDate(row.original.lastReviewDate)}</span>
        ),
      },
      {
        accessorKey: 'nextReviewDate',
        header: 'Next Review',
        size: 120,
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">{formatDate(row.original.nextReviewDate)}</span>
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
                onClick={() => handleProcedureClick(row.original)}
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
    [handleProcedureClick]
  );

  const findingColumns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 80,
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
            onClick={() => handleFindingClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors line-clamp-2"
          >
            {row.original.title}
          </button>
        ),
      },
      {
        accessorKey: 'severity',
        header: 'Severity',
        size: 100,
        cell: ({ row }) => (
          <Badge variant={getSeverityBadgeVariant(row.original.severity)} size="sm">
            {formatLabel(row.original.severity)}
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
        accessorKey: 'identifiedDate',
        header: 'Identified',
        size: 110,
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">{formatDate(row.original.identifiedDate)}</span>
        ),
      },
      {
        accessorKey: 'dueDate',
        header: 'Due Date',
        size: 110,
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">{formatDate(row.original.dueDate)}</span>
        ),
      },
      {
        id: 'evidence',
        header: 'Evidence',
        size: 70,
        enableSorting: false,
        cell: ({ row }) => {
          const count = row.original.evidence ? row.original.evidence.length : 0;
          return count > 0 ? (
            <Badge variant="outline" size="sm">{count}</Badge>
          ) : (
            <span className="text-xs text-slate-400">0</span>
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
                onClick={() => handleFindingClick(row.original)}
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
    [handleFindingClick]
  );

  const expectationColumns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Expectation',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleExpectationClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors line-clamp-2"
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        size: 110,
        cell: ({ row }) => (
          <Badge variant="outline" size="sm">{formatLabel(row.original.category)}</Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 140,
        cell: ({ row }) => (
          <Badge variant={getExpectationStatusBadgeVariant(row.original.status)} size="sm">
            {formatLabel(row.original.status)}
          </Badge>
        ),
      },
      {
        accessorKey: 'owner',
        header: 'Owner',
        size: 130,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.owner}</span>
        ),
      },
      {
        accessorKey: 'lastReviewDate',
        header: 'Last Review',
        size: 110,
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">{formatDate(row.original.lastReviewDate)}</span>
        ),
      },
      {
        accessorKey: 'nextReviewDate',
        header: 'Next Review',
        size: 110,
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">{formatDate(row.original.nextReviewDate)}</span>
        ),
      },
      {
        id: 'evidence',
        header: 'Evidence',
        size: 70,
        enableSorting: false,
        cell: ({ row }) => {
          const count = row.original.evidence ? row.original.evidence.length : 0;
          return count > 0 ? (
            <Badge variant="outline" size="sm">{count}</Badge>
          ) : (
            <span className="text-xs text-slate-400">0</span>
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
                onClick={() => handleExpectationClick(row.original)}
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
    [handleExpectationClick]
  );

  const openFindings = useMemo(() => {
    return auditFindings.filter((f) => f.status === 'open' || f.status === 'in_progress');
  }, [auditFindings]);

  if (loading) {
    return <GovernanceDashboardSkeleton />;
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
              aria-label="Refresh governance data"
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
                    aria-label="Export governance data"
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance ({complianceScores.length})</TabsTrigger>
          <TabsTrigger value="findings">Findings ({auditFindings.length})</TabsTrigger>
          <TabsTrigger value="procedures">Procedures ({procedures.length})</TabsTrigger>
          <TabsTrigger value="expectations">Expectations ({operatingExpectations.length})</TabsTrigger>
          <TabsTrigger value="adherence">Adherence ({adherenceMetrics.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="flex flex-col gap-6">
            {/* Compliance Frameworks */}
            <PanelCard
              title="Compliance Framework Scores"
              subtitle={`${complianceScores.length} frameworks monitored`}
              icon={<Shield className="h-5 w-5" />}
            >
              <ComplianceFrameworksPanel
                complianceScores={complianceScores}
                onScoreClick={handleComplianceScoreClick}
              />
            </PanelCard>

            {/* Open Audit Findings */}
            <PanelCard
              title="Open Audit Findings"
              subtitle={`${openFindings.length} findings requiring attention`}
              icon={<AlertTriangle className="h-5 w-5" />}
            >
              {openFindings.length === 0 ? (
                <EmptyState
                  type="no_data"
                  title="No open findings"
                  message="All audit findings have been resolved."
                  size="sm"
                  icon={<CheckCircle className="h-8 w-8 text-success-300" />}
                />
              ) : (
                <div className="flex flex-col gap-2">
                  {openFindings.slice(0, 6).map((finding) => (
                    <div
                      key={finding.id}
                      className={cn(
                        'flex items-start gap-3 rounded-lg border p-3 transition-all duration-200 cursor-pointer',
                        'hover:shadow-card-hover hover:border-humana-green-200',
                        finding.severity === 'critical' ? 'border-danger-200 bg-danger-50/10' :
                        finding.severity === 'high' ? 'border-warning-200 bg-warning-50/10' :
                        'border-slate-200'
                      )}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleFindingClick(finding)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleFindingClick(finding);
                        }
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-xs font-mono text-slate-500">{finding.id}</span>
                            <p className="text-sm font-medium text-slate-900 line-clamp-1">{finding.title}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge variant={getSeverityBadgeVariant(finding.severity)} size="sm">
                              {finding.severity}
                            </Badge>
                            <StatusPill status={finding.status} size="sm" />
                          </div>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-2xs text-slate-400">
                          <span>Assignee: {finding.assignee}</span>
                          <span>Due: {formatDate(finding.dueDate)}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-2" aria-hidden="true" />
                    </div>
                  ))}
                  {openFindings.length > 6 ? (
                    <p className="text-xs text-slate-400 text-center mt-1">
                      +{openFindings.length - 6} more findings. Switch to Findings tab to see all.
                    </p>
                  ) : null}
                </div>
              )}
            </PanelCard>

            {/* Adherence Metrics */}
            <PanelCard
              title="Adherence Metrics"
              subtitle={`${adherenceMetrics.length} metrics tracked`}
              icon={<Target className="h-5 w-5" />}
              collapsible
              defaultCollapsed={false}
            >
              <AdherenceMetricsPanel adherenceMetrics={adherenceMetrics} />
            </PanelCard>

            {/* Operating Expectations Summary */}
            {aggregates ? (
              <PanelCard
                title="Operating Expectations Summary"
                subtitle={`${operatingExpectations.length} expectations across ${new Set(operatingExpectations.map((oe) => oe.category)).size} categories`}
                icon={<ClipboardCheck className="h-5 w-5" />}
                collapsible
                defaultCollapsed
              >
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Compliant</span>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-success-500" aria-hidden="true" />
                      <span className="text-2xl font-semibold text-slate-900">{aggregates.compliantExpectations}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Non-Compliant</span>
                    <div className="flex items-center gap-1.5">
                      <XCircle className="h-4 w-4 text-danger-500" aria-hidden="true" />
                      <span className="text-2xl font-semibold text-slate-900">{aggregates.nonCompliantExpectations}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Active Procedures</span>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-humana-green-500" aria-hidden="true" />
                      <span className="text-2xl font-semibold text-slate-900">{aggregates.activeProcedures}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Frameworks</span>
                    <div className="flex items-center gap-1.5">
                      <Shield className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      <span className="text-2xl font-semibold text-slate-900">{aggregates.totalComplianceFrameworks}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Average Compliance Score</h4>
                  <Progress
                    value={aggregates.averageComplianceScore}
                    max={100}
                    variant="auto"
                    size="md"
                    showValue
                    label="Platform Average"
                  />
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <h4 className="text-sm font-semibold text-slate-900">Adherence Summary</h4>
                  {[
                    { label: 'Met', status: 'met', count: aggregates.adherenceMetMet },
                    { label: 'Not Met', status: 'not_met', count: aggregates.adherenceNotMet },
                  ].map((item) => (
                    <div key={item.status} className="flex items-center gap-3">
                      <div className="w-20 shrink-0">
                        <Badge variant={getAdherenceStatusBadgeVariant(item.status)} size="sm">
                          {item.label}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <Progress
                          value={item.count}
                          max={adherenceMetrics.length || 1}
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
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceFrameworksPanel
            complianceScores={complianceScores}
            onScoreClick={handleComplianceScoreClick}
          />
        </TabsContent>

        <TabsContent value="findings">
          {auditFindings.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No audit findings"
              message="No audit findings available."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={findingColumns}
              data={auditFindings}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search audit findings..."
              emptyMessage="No findings match the search criteria."
              onRowClick={handleFindingClick}
            />
          )}
        </TabsContent>

        <TabsContent value="procedures">
          {procedures.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No procedures"
              message="No governance procedures available."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={procedureColumns}
              data={procedures}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search procedures..."
              emptyMessage="No procedures match the search criteria."
              onRowClick={handleProcedureClick}
            />
          )}
        </TabsContent>

        <TabsContent value="expectations">
          {operatingExpectations.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No operating expectations"
              message="No operating expectations available."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={expectationColumns}
              data={operatingExpectations}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search expectations..."
              emptyMessage="No expectations match the search criteria."
              onRowClick={handleExpectationClick}
            />
          )}
        </TabsContent>

        <TabsContent value="adherence">
          <PanelCard
            title="Adherence Metrics"
            subtitle={`${adherenceMetrics.length} metrics tracked against targets`}
            icon={<Target className="h-5 w-5" />}
          >
            <AdherenceMetricsPanel adherenceMetrics={adherenceMetrics} />
          </PanelCard>
        </TabsContent>

        <TabsContent value="analytics">
          {complianceScores.length === 0 && procedures.length === 0 ? (
            <EmptyState
              type="no_chart"
              title="No data for analytics"
              message="No governance data available to generate analytics."
              size="lg"
              bordered
            />
          ) : (
            <AnalyticsPanel
              complianceScores={complianceScores}
              procedures={procedures}
              auditFindings={auditFindings}
              operatingExpectations={operatingExpectations}
              adherenceMetrics={adherenceMetrics}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Procedure Detail Dialog */}
      <ProcedureDetailDialog
        procedure={selectedProcedure}
        open={procedureDetailOpen}
        onOpenChange={handleProcedureDetailClose}
      />

      {/* Compliance Score Detail Dialog */}
      <ComplianceScoreDetailDialog
        complianceScore={selectedComplianceScore}
        open={complianceDetailOpen}
        onOpenChange={handleComplianceDetailClose}
      />

      {/* Audit Finding Detail Dialog */}
      <AuditFindingDetailDialog
        finding={selectedFinding}
        open={findingDetailOpen}
        onOpenChange={handleFindingDetailClose}
      />

      {/* Operating Expectation Detail Dialog */}
      <OperatingExpectationDetailDialog
        expectation={selectedExpectation}
        open={expectationDetailOpen}
        onOpenChange={handleExpectationDetailClose}
      />
    </div>
  );
}

GovernanceDashboardPage.displayName = 'GovernanceDashboardPage';

export { GovernanceDashboardPage };
export default GovernanceDashboardPage;