import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Calendar,
  Clock,
  User,
  Layers,
  FileText,
  ChevronRight,
  Shield,
  Eye,
  ArrowLeft,
  Copy,
  Mail,
  Bookmark,
  Info,
  Activity,
  Sparkles,
  Lightbulb,
  History,
  ClipboardCheck,
  ExternalLink,
  Tag,
  Settings,
  Globe,
  Server,
  Lock,
  FileJson,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import {
  getProcedureById,
  getAllProcedures,
  getAllComplianceScores,
  getAllAuditFindings,
  getAllOperatingExpectations,
  getAllAdherenceMetrics,
} from '@/data/governance';
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
 * Formats a raw category/status string into a display-friendly label.
 *
 * @param {string} str - The raw string
 * @returns {string} Formatted display label
 */
function formatLabel(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Returns the badge variant for a procedure status.
 *
 * @param {string} status - Procedure status
 * @returns {string} Badge variant
 */
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

/**
 * Returns the badge variant for a procedure category.
 *
 * @param {string} category - Procedure category
 * @returns {string} Badge variant
 */
function getCategoryBadgeVariant(category) {
  switch (category) {
    case 'quality_assurance':
      return 'primary';
    case 'change_management':
      return 'info';
    case 'incident_management':
      return 'error';
    case 'release_management':
      return 'warning';
    case 'security':
      return 'error';
    case 'data_governance':
      return 'success';
    case 'compliance':
      return 'warning';
    case 'testing':
      return 'primary';
    default:
      return 'neutral';
  }
}

/**
 * Returns the icon component for a procedure category.
 *
 * @param {string} category - Procedure category
 * @returns {React.ElementType} Icon component
 */
function getCategoryIcon(category) {
  switch (category) {
    case 'quality_assurance':
      return ClipboardCheck;
    case 'change_management':
      return Settings;
    case 'incident_management':
      return AlertTriangle;
    case 'release_management':
      return Globe;
    case 'security':
      return Shield;
    case 'data_governance':
      return Server;
    case 'compliance':
      return Lock;
    case 'testing':
      return Activity;
    default:
      return BookOpen;
  }
}

/**
 * Returns the severity badge variant.
 *
 * @param {string} severity - Finding severity
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
      return 'neutral';
    case 'informational':
      return 'success';
    default:
      return 'neutral';
  }
}

/**
 * Returns the expectation status badge variant.
 *
 * @param {string} status - Expectation status
 * @returns {string} Badge variant
 */
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

/**
 * Returns the adherence status badge variant.
 *
 * @param {string} status - Adherence status
 * @returns {string} Badge variant
 */
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

/**
 * Renders the procedure overview panel.
 *
 * @param {object} props
 * @param {import('@/data/governance').Procedure} props.procedure
 * @returns {React.ReactElement}
 */
function OverviewPanel({ procedure }) {
  const applicableSegments = procedure.applicableSegments || [];
  const applicableApplications = procedure.applicableApplications || [];

  return (
    <div className="flex flex-col gap-6">
      {procedure.description ? (
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Description</h4>
          <p className="text-sm text-slate-600 leading-relaxed">{procedure.description}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="text-slate-500">Owner:</span>
          <span className="font-medium text-slate-900">{procedure.owner}</span>
        </div>
        {procedure.approvedBy ? (
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Approved By:</span>
            <span className="font-medium text-slate-900">{procedure.approvedBy}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-warning-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Approved By:</span>
            <span className="font-medium text-warning-600">Pending Approval</span>
          </div>
        )}
        {procedure.effectiveDate ? (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Effective Date:</span>
            <span className="font-medium text-slate-900">{formatDate(procedure.effectiveDate)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Effective Date:</span>
            <span className="font-medium text-slate-500">Not set</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="text-slate-500">Last Review:</span>
          <span className="font-medium text-slate-900">{formatDate(procedure.lastReviewDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="text-slate-500">Next Review:</span>
          <span className="font-medium text-slate-900">{formatDate(procedure.nextReviewDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Tag className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="text-slate-500">Version:</span>
          <span className="font-medium text-slate-900">{procedure.version}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Applicable Segments</h4>
          {applicableSegments.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {applicableSegments.map((seg) => (
                <Badge key={seg} variant="outline" size="sm">{seg}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">All segments (no restrictions)</p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Applicable Applications</h4>
          {applicableApplications.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {applicableApplications.map((app) => (
                <Badge key={app} variant="outline" size="sm">{app}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">All applications (no restrictions)</p>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-900 mb-2">Review Schedule</h4>
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Review Progress</span>
            <span className="text-sm font-medium text-slate-900">
              {procedure.lastReviewDate && procedure.nextReviewDate
                ? (() => {
                    const lastReview = new Date(procedure.lastReviewDate);
                    const nextReview = new Date(procedure.nextReviewDate);
                    const now = new Date();
                    const totalDays = (nextReview - lastReview) / (1000 * 60 * 60 * 24);
                    const elapsedDays = (now - lastReview) / (1000 * 60 * 60 * 24);
                    const progress = totalDays > 0 ? Math.min(Math.round((elapsedDays / totalDays) * 100), 100) : 0;
                    return `${progress}%`;
                  })()
                : '—'}
            </span>
          </div>
          <Progress
            value={
              procedure.lastReviewDate && procedure.nextReviewDate
                ? (() => {
                    const lastReview = new Date(procedure.lastReviewDate);
                    const nextReview = new Date(procedure.nextReviewDate);
                    const now = new Date();
                    const totalDays = (nextReview - lastReview) / (1000 * 60 * 60 * 24);
                    const elapsedDays = (now - lastReview) / (1000 * 60 * 60 * 24);
                    return totalDays > 0 ? Math.min(Math.round((elapsedDays / totalDays) * 100), 100) : 0;
                  })()
                : 0
            }
            max={100}
            variant="auto"
            size="sm"
            animate
          />
          <div className="mt-2 flex items-center justify-between text-2xs text-slate-400">
            <span>Last: {formatDate(procedure.lastReviewDate)}</span>
            <span>Next: {formatDate(procedure.nextReviewDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders the compliance status panel showing related compliance scores.
 *
 * @param {object} props
 * @param {import('@/data/governance').Procedure} props.procedure
 * @param {import('@/data/governance').ComplianceScore[]} props.complianceScores
 * @returns {React.ReactElement}
 */
function ComplianceStatusPanel({ procedure, complianceScores }) {
  const relatedScores = useMemo(() => {
    if (!complianceScores || complianceScores.length === 0) return [];
    const category = procedure.category;
    if (category === 'compliance') {
      return complianceScores;
    }
    if (category === 'security') {
      return complianceScores.filter(
        (cs) => cs.framework === 'HIPAA' || cs.framework === 'SOC2' || cs.framework === 'NIST' || cs.framework === 'PCI_DSS'
      );
    }
    if (category === 'quality_assurance' || category === 'testing') {
      return complianceScores.filter(
        (cs) => cs.framework === 'NCQA' || cs.framework === 'CMS'
      );
    }
    return complianceScores.slice(0, 4);
  }, [procedure, complianceScores]);

  if (relatedScores.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No related compliance frameworks"
        message="No compliance framework scores are associated with this procedure category."
        size="sm"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-500">
        Compliance frameworks related to the <span className="font-medium text-slate-700">{formatLabel(procedure.category)}</span> category.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {relatedScores.map((cs) => {
          const domainScores = cs.domainScores || [];
          const compliantDomains = domainScores.filter((d) => d.status === 'compliant').length;

          return (
            <Card key={cs.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900">{cs.framework}</h4>
                  <span className="text-2xs text-slate-500">
                    Assessor: {cs.assessor}
                  </span>
                </div>
                <StatusPill status={cs.status} size="sm" dot />
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xs text-slate-400">Overall Score</span>
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      cs.overallScore >= 90 ? 'text-success-600' :
                      cs.overallScore >= 75 ? 'text-warning-600' :
                      'text-danger-600'
                    )}
                  >
                    {cs.overallScore.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={cs.overallScore}
                  max={100}
                  variant="auto"
                  size="sm"
                  animate
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-2xs text-slate-400">
                <span>{compliantDomains}/{domainScores.length} domains compliant</span>
                <span>Next: {formatDate(cs.nextAssessmentDate)}</span>
              </div>

              {domainScores.length > 0 ? (
                <div className="mt-3 flex flex-col gap-1.5">
                  {domainScores.slice(0, 4).map((domain, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-2xs text-slate-600 truncate max-w-[140px]">{domain.domain}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xs font-medium text-slate-700">{domain.score.toFixed(0)}%</span>
                        <StatusPill status={domain.status} size="sm" />
                      </div>
                    </div>
                  ))}
                  {domainScores.length > 4 ? (
                    <span className="text-2xs text-slate-400 text-center">
                      +{domainScores.length - 4} more domains
                    </span>
                  ) : null}
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Renders the related audit findings panel.
 *
 * @param {object} props
 * @param {import('@/data/governance').Procedure} props.procedure
 * @param {import('@/data/governance').AuditFinding[]} props.auditFindings
 * @returns {React.ReactElement}
 */
function RelatedFindingsPanel({ procedure, auditFindings }) {
  const relatedFindings = useMemo(() => {
    if (!auditFindings || auditFindings.length === 0) return [];
    const category = procedure.category;
    if (category === 'security') {
      return auditFindings.filter(
        (f) =>
          f.title.toLowerCase().includes('security') ||
          f.title.toLowerCase().includes('oauth') ||
          f.title.toLowerCase().includes('tls') ||
          f.title.toLowerCase().includes('baa') ||
          f.title.toLowerCase().includes('encryption') ||
          f.title.toLowerCase().includes('soc')
      );
    }
    if (category === 'quality_assurance' || category === 'testing') {
      return auditFindings.filter(
        (f) =>
          f.title.toLowerCase().includes('measure') ||
          f.title.toLowerCase().includes('hedis') ||
          f.title.toLowerCase().includes('specification') ||
          f.title.toLowerCase().includes('data accuracy') ||
          f.title.toLowerCase().includes('performance')
      );
    }
    if (category === 'compliance') {
      return auditFindings.filter(
        (f) =>
          f.title.toLowerCase().includes('compliance') ||
          f.title.toLowerCase().includes('reporting') ||
          f.title.toLowerCase().includes('audit') ||
          f.title.toLowerCase().includes('state')
      );
    }
    if (category === 'data_governance') {
      return auditFindings.filter(
        (f) =>
          f.title.toLowerCase().includes('data') ||
          f.title.toLowerCase().includes('linkage') ||
          f.title.toLowerCase().includes('reconciliation')
      );
    }
    if (category === 'incident_management') {
      return auditFindings.filter(
        (f) =>
          f.title.toLowerCase().includes('disaster') ||
          f.title.toLowerCase().includes('recovery') ||
          f.title.toLowerCase().includes('incident')
      );
    }
    return auditFindings.filter(
      (f) => f.status === 'open' || f.status === 'in_progress'
    ).slice(0, 5);
  }, [procedure, auditFindings]);

  if (relatedFindings.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No related audit findings"
        message="No audit findings are directly related to this procedure category."
        size="sm"
        icon={<CheckCircle className="h-8 w-8 text-success-300" />}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-500">
        Audit findings related to the <span className="font-medium text-slate-700">{formatLabel(procedure.category)}</span> category.
      </p>

      {relatedFindings.map((finding) => (
        <div
          key={finding.id}
          className={cn(
            'rounded-lg border p-4',
            finding.severity === 'critical' ? 'border-danger-200 bg-danger-50/10' :
            finding.severity === 'high' ? 'border-warning-200 bg-warning-50/10' :
            'border-slate-200'
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">{finding.id}</span>
              </div>
              <p className="text-sm font-medium text-slate-900">{finding.title}</p>
              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{finding.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <Badge variant={getSeverityBadgeVariant(finding.severity)} size="sm">
                {formatLabel(finding.severity)}
              </Badge>
              <StatusPill status={finding.status} size="sm" dot />
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-2xs text-slate-400">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" aria-hidden="true" />
              <span>{finding.assignee}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              <span>Due: {formatDate(finding.dueDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              <span>Identified: {formatDate(finding.identifiedDate)}</span>
            </div>
            {finding.evidence && finding.evidence.length > 0 ? (
              <Badge variant="outline" size="sm">{finding.evidence.length} evidence</Badge>
            ) : null}
          </div>

          {finding.correctiveAction ? (
            <div className="mt-2 rounded-lg border border-info-200 bg-info-50/20 p-2.5">
              <span className="text-2xs font-medium text-info-700">Corrective Action:</span>
              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{finding.correctiveAction}</p>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/**
 * Renders the related operating expectations panel.
 *
 * @param {object} props
 * @param {import('@/data/governance').Procedure} props.procedure
 * @param {import('@/data/governance').OperatingExpectation[]} props.operatingExpectations
 * @returns {React.ReactElement}
 */
function RelatedExpectationsPanel({ procedure, operatingExpectations }) {
  const relatedExpectations = useMemo(() => {
    if (!operatingExpectations || operatingExpectations.length === 0) return [];
    const category = procedure.category;
    const categoryMap = {
      quality_assurance: 'quality',
      testing: 'quality',
      security: 'security',
      compliance: 'compliance',
      data_governance: 'data',
      incident_management: 'operations',
      change_management: 'operations',
      release_management: 'operations',
    };
    const mappedCategory = categoryMap[category];
    if (mappedCategory) {
      const filtered = operatingExpectations.filter((oe) => oe.category === mappedCategory);
      if (filtered.length > 0) return filtered;
    }
    return operatingExpectations.slice(0, 5);
  }, [procedure, operatingExpectations]);

  if (relatedExpectations.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No related operating expectations"
        message="No operating expectations are associated with this procedure category."
        size="sm"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-500">
        Operating expectations related to the <span className="font-medium text-slate-700">{formatLabel(procedure.category)}</span> category.
      </p>

      {relatedExpectations.map((oe) => {
        const evidence = oe.evidence || [];

        return (
          <div
            key={oe.id}
            className={cn(
              'rounded-lg border p-4',
              oe.status === 'non_compliant' ? 'border-danger-200 bg-danger-50/10' :
              oe.status === 'partially_compliant' ? 'border-warning-200 bg-warning-50/10' :
              oe.status === 'compliant' ? 'border-success-200 bg-success-50/10' :
              'border-slate-200'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">{oe.name}</p>
                <p className="text-xs text-slate-500 line-clamp-2">{oe.description}</p>
              </div>
              <Badge variant={getExpectationStatusBadgeVariant(oe.status)} size="sm">
                {formatLabel(oe.status)}
              </Badge>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-2xs text-slate-400">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" aria-hidden="true" />
                <span>{oe.owner}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                <span>Next Review: {formatDate(oe.nextReviewDate)}</span>
              </div>
              <Badge variant="outline" size="sm">{formatLabel(oe.category)}</Badge>
              {evidence.length > 0 ? (
                <Badge variant="outline" size="sm">{evidence.length} evidence</Badge>
              ) : null}
            </div>

            {evidence.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {evidence.slice(0, 3).map((ev) => (
                  <div key={ev.id} className="flex items-center gap-1 text-2xs text-slate-500">
                    <FileText className="h-3 w-3 text-slate-400" aria-hidden="true" />
                    <span className="truncate max-w-[120px]">{ev.name}</span>
                  </div>
                ))}
                {evidence.length > 3 ? (
                  <span className="text-2xs text-slate-400">+{evidence.length - 3} more</span>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Renders the related adherence metrics panel.
 *
 * @param {object} props
 * @param {import('@/data/governance').Procedure} props.procedure
 * @param {import('@/data/governance').AdherenceMetric[]} props.adherenceMetrics
 * @returns {React.ReactElement}
 */
function RelatedAdherencePanel({ procedure, adherenceMetrics }) {
  const relatedMetrics = useMemo(() => {
    if (!adherenceMetrics || adherenceMetrics.length === 0) return [];
    const category = procedure.category;
    if (category === 'quality_assurance' || category === 'testing') {
      return adherenceMetrics.filter(
        (m) =>
          m.name.toLowerCase().includes('test') ||
          m.name.toLowerCase().includes('quality') ||
          m.name.toLowerCase().includes('coverage') ||
          m.name.toLowerCase().includes('code review')
      );
    }
    if (category === 'security') {
      return adherenceMetrics.filter(
        (m) =>
          m.name.toLowerCase().includes('security') ||
          m.name.toLowerCase().includes('hipaa') ||
          m.name.toLowerCase().includes('vendor') ||
          m.name.toLowerCase().includes('session') ||
          m.name.toLowerCase().includes('dr ')
      );
    }
    if (category === 'compliance') {
      return adherenceMetrics.filter(
        (m) =>
          m.name.toLowerCase().includes('regulatory') ||
          m.name.toLowerCase().includes('compliance') ||
          m.name.toLowerCase().includes('accessibility') ||
          m.name.toLowerCase().includes('baa')
      );
    }
    if (category === 'incident_management') {
      return adherenceMetrics.filter(
        (m) =>
          m.name.toLowerCase().includes('mttr') ||
          m.name.toLowerCase().includes('incident') ||
          m.name.toLowerCase().includes('dr ') ||
          m.name.toLowerCase().includes('environment')
      );
    }
    if (category === 'change_management' || category === 'release_management') {
      return adherenceMetrics.filter(
        (m) =>
          m.name.toLowerCase().includes('change') ||
          m.name.toLowerCase().includes('deployment') ||
          m.name.toLowerCase().includes('failure')
      );
    }
    if (category === 'data_governance') {
      return adherenceMetrics.filter(
        (m) =>
          m.name.toLowerCase().includes('data') ||
          m.name.toLowerCase().includes('freshness')
      );
    }
    return adherenceMetrics.slice(0, 5);
  }, [procedure, adherenceMetrics]);

  if (relatedMetrics.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No related adherence metrics"
        message="No adherence metrics are associated with this procedure category."
        size="sm"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-500">
        Adherence metrics related to the <span className="font-medium text-slate-700">{formatLabel(procedure.category)}</span> category.
      </p>

      {relatedMetrics.map((metric, index) => {
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

/**
 * Renders the related procedures panel.
 *
 * @param {object} props
 * @param {import('@/data/governance').Procedure} props.procedure
 * @param {import('@/data/governance').Procedure[]} props.allProcedures
 * @param {function(import('@/data/governance').Procedure): void} props.onProcedureClick
 * @returns {React.ReactElement}
 */
function RelatedProceduresPanel({ procedure, allProcedures, onProcedureClick }) {
  const relatedProcedures = useMemo(() => {
    if (!allProcedures || allProcedures.length === 0) return [];
    return allProcedures.filter(
      (p) => p.id !== procedure.id && p.category === procedure.category
    );
  }, [procedure, allProcedures]);

  const sameCategoryProcedures = relatedProcedures;
  const otherProcedures = useMemo(() => {
    if (sameCategoryProcedures.length >= 3) return [];
    return allProcedures
      .filter((p) => p.id !== procedure.id && p.category !== procedure.category)
      .filter((p) => {
        const segments = procedure.applicableSegments || [];
        if (segments.length === 0) return true;
        const pSegments = p.applicableSegments || [];
        return segments.some((s) => pSegments.includes(s));
      })
      .slice(0, 3 - sameCategoryProcedures.length);
  }, [procedure, allProcedures, sameCategoryProcedures]);

  const combined = [...sameCategoryProcedures, ...otherProcedures];

  if (combined.length === 0) {
    return (
      <EmptyState
        type="no_data"
        title="No related procedures"
        message="No other procedures share the same category or applicable segments."
        size="sm"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {combined.map((proc) => (
        <div
          key={proc.id}
          className={cn(
            'flex items-start gap-3 rounded-lg border border-slate-200 p-4 transition-all duration-200 cursor-pointer',
            'hover:shadow-card-hover hover:border-humana-green-200'
          )}
          role="button"
          tabIndex={0}
          onClick={() => onProcedureClick(proc)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onProcedureClick(proc);
            }
          }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-mono text-slate-400">{proc.id}</span>
                <p className="text-sm font-medium text-slate-900">{proc.name}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Badge variant={getProcedureStatusBadgeVariant(proc.status)} size="sm">
                  {formatLabel(proc.status)}
                </Badge>
              </div>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-2xs text-slate-400">
              <Badge variant={getCategoryBadgeVariant(proc.category)} size="sm">
                {formatLabel(proc.category)}
              </Badge>
              <span>v{proc.version}</span>
              <span>•</span>
              <span>{proc.owner}</span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-2" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}

/**
 * Loading skeleton for the governance procedure detail page.
 *
 * @returns {React.ReactElement}
 */
function GovernanceProcedureDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading procedure detail" aria-busy="true">
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
 * Governance Procedure Detail page component.
 * Displays individual procedure details with compliance status, evidence,
 * audit trail, and remediation actions. Supports drill-down from Governance Dashboard.
 *
 * @returns {React.ReactElement}
 */
function GovernanceProcedureDetailPage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();
  const navigate = useNavigate();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [procedure, setProcedure] = useState(null);
  const [allProcedures, setAllProcedures] = useState([]);
  const [complianceScores, setComplianceScores] = useState([]);
  const [auditFindings, setAuditFindings] = useState([]);
  const [operatingExpectations, setOperatingExpectations] = useState([]);
  const [adherenceMetrics, setAdherenceMetrics] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorited, setIsFavorited] = useState(false);

  const procedureId = params.procedureId || params['*'] || '';

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Reports', path: ROUTES.REPORTS },
      { label: 'Governance', path: ROUTES.REPORTS },
      { label: procedureId || 'Procedure Detail' },
    ]);
  }, [setBreadcrumbs, procedureId]);

  const loadData = useCallback(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      try {
        let proc = null;
        if (procedureId) {
          proc = getProcedureById(procedureId);
        }
        if (!proc) {
          proc = getProcedureById('proc_001');
        }
        setProcedure(proc);
        setAllProcedures(getAllProcedures());
        setComplianceScores(getAllComplianceScores());
        setAuditFindings(getAllAuditFindings());
        setOperatingExpectations(getAllOperatingExpectations());
        setAdherenceMetrics(getAllAdherenceMetrics());
      } catch {
        setProcedure(null);
        setAllProcedures([]);
        setComplianceScores([]);
        setAuditFindings([]);
        setOperatingExpectations([]);
        setAdherenceMetrics([]);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [procedureId]);

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
        ? 'This procedure has been removed from your favorites.'
        : 'This procedure has been added to your favorites.',
    });
  }, [isFavorited, toast]);

  const handleCopyLink = useCallback(() => {
    if (!procedure) return;
    try {
      const url = `${window.location.origin}/reports/governance/${procedure.id}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url);
      }
    } catch {
      // Silently fail
    }
    toast({
      variant: 'success',
      title: 'Link Copied',
      description: 'Procedure link has been copied to your clipboard.',
    });
  }, [procedure, toast]);

  const handleEmail = useCallback(() => {
    if (!procedure) return;
    logEvent('notification_sent', {
      action: 'Procedure Report Emailed',
      details: `Procedure report for "${procedure.name}" emailed by ${currentPersona.name}.`,
      resource: procedure.id,
      outcome: 'success',
    });
    toast({
      variant: 'success',
      title: 'Email Sent',
      description: `Procedure report for "${procedure.name}" has been emailed.`,
    });
  }, [procedure, currentPersona, logEvent, toast]);

  const handleExportCSV = useCallback(() => {
    if (!procedure) return;
    try {
      const data = [{
        id: procedure.id,
        name: procedure.name,
        category: procedure.category,
        status: procedure.status,
        version: procedure.version,
        owner: procedure.owner,
        approvedBy: procedure.approvedBy || '',
        effectiveDate: procedure.effectiveDate || '',
        lastReviewDate: procedure.lastReviewDate,
        nextReviewDate: procedure.nextReviewDate,
        applicableSegments: (procedure.applicableSegments || []).join('; '),
        applicableApplications: (procedure.applicableApplications || []).join('; '),
        description: procedure.description,
      }];
      downloadCSV(data, `procedure-${procedure.id}.csv`);
      logEvent('data_export', {
        action: 'Exported Procedure Detail',
        details: `Procedure "${procedure.name}" exported as CSV by ${currentPersona.name}.`,
        resource: procedure.id,
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `Procedure "${procedure.name}" exported as CSV.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export procedure detail.',
      });
    }
  }, [procedure, currentPersona, logEvent, toast]);

  const handleExportJSON = useCallback(() => {
    if (!procedure) return;
    try {
      const data = {
        id: procedure.id,
        name: procedure.name,
        category: procedure.category,
        status: procedure.status,
        version: procedure.version,
        owner: procedure.owner,
        approvedBy: procedure.approvedBy || '',
        effectiveDate: procedure.effectiveDate || '',
        lastReviewDate: procedure.lastReviewDate,
        nextReviewDate: procedure.nextReviewDate,
        applicableSegments: procedure.applicableSegments || [],
        applicableApplications: procedure.applicableApplications || [],
        description: procedure.description,
      };
      downloadJSON(data, `procedure-${procedure.id}.json`);
      logEvent('data_export', {
        action: 'Exported Procedure Detail',
        details: `Procedure "${procedure.name}" exported as JSON by ${currentPersona.name}.`,
        resource: procedure.id,
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `Procedure "${procedure.name}" exported as JSON.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export procedure detail.',
      });
    }
  }, [procedure, currentPersona, logEvent, toast]);

  const handleRelatedProcedureClick = useCallback(
    (proc) => {
      setProcedure(proc);
      setActiveTab('overview');
      setBreadcrumbs([
        { label: 'Home', path: ROUTES.DASHBOARD },
        { label: 'Reports', path: ROUTES.REPORTS },
        { label: 'Governance', path: ROUTES.REPORTS },
        { label: proc.id },
      ]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setBreadcrumbs]
  );

  const kpiData = useMemo(() => {
    if (!procedure) return [];

    const applicableSegments = procedure.applicableSegments || [];
    const applicableApplications = procedure.applicableApplications || [];
    const isApproved = Boolean(procedure.approvedBy);
    const isActive = procedure.status === 'active';

    const now = new Date();
    const nextReview = procedure.nextReviewDate ? new Date(procedure.nextReviewDate) : null;
    const daysUntilReview = nextReview ? Math.ceil((nextReview - now) / (1000 * 60 * 60 * 24)) : null;

    return [
      {
        id: 'kpi_status',
        label: 'Status',
        value: formatLabel(procedure.status),
        unit: undefined,
        trend: isActive ? 'improving' : 'stable',
        status: isActive ? 'on_track' : procedure.status === 'under_review' ? 'at_risk' : 'not_started',
        description: `Procedure lifecycle status: ${formatLabel(procedure.status)}`,
      },
      {
        id: 'kpi_version',
        label: 'Version',
        value: procedure.version,
        unit: undefined,
        trend: 'stable',
        status: 'on_track',
        description: `Current procedure version`,
      },
      {
        id: 'kpi_segments',
        label: 'Applicable Segments',
        value: applicableSegments.length > 0 ? applicableSegments.length : 'All',
        unit: applicableSegments.length > 0 ? 'count' : undefined,
        trend: 'stable',
        status: 'on_track',
        description: 'Number of segments this procedure applies to.',
      },
      {
        id: 'kpi_review',
        label: 'Days to Review',
        value: daysUntilReview !== null ? daysUntilReview : '—',
        unit: daysUntilReview !== null ? 'count' : undefined,
        trend: daysUntilReview !== null && daysUntilReview < 30 ? 'declining' : 'stable',
        status: daysUntilReview !== null && daysUntilReview < 30 ? 'at_risk' : 'on_track',
        description: 'Days until the next scheduled review.',
      },
    ];
  }, [procedure]);

  const insightData = useMemo(() => {
    if (!procedure) return null;

    if (procedure.status === 'under_review') {
      return {
        variant: 'warning',
        title: 'Procedure Under Review',
        message: `"${procedure.name}" is currently under review. Version ${procedure.version} is pending approval. Review and approve to make it effective.`,
        source: 'Governance Engine',
        confidence: 95,
      };
    }

    if (procedure.status === 'draft') {
      return {
        variant: 'recommendation',
        title: 'Draft Procedure',
        message: `"${procedure.name}" is in draft status. Complete the review process and obtain approval before it can become effective.`,
        source: 'Governance Engine',
        confidence: 90,
      };
    }

    if (procedure.status === 'deprecated') {
      return {
        variant: 'warning',
        title: 'Deprecated Procedure',
        message: `"${procedure.name}" has been deprecated. Consider archiving or replacing with an updated version.`,
        source: 'Governance Engine',
        confidence: 92,
      };
    }

    const nextReview = procedure.nextReviewDate ? new Date(procedure.nextReviewDate) : null;
    const now = new Date();
    if (nextReview) {
      const daysUntil = Math.ceil((nextReview - now) / (1000 * 60 * 60 * 24));
      if (daysUntil < 30 && daysUntil > 0) {
        return {
          variant: 'warning',
          title: 'Review Due Soon',
          message: `"${procedure.name}" is due for review in ${daysUntil} days (${formatDate(procedure.nextReviewDate)}). Schedule the review to maintain compliance.`,
          source: 'Governance Engine',
          confidence: 88,
        };
      }
      if (daysUntil <= 0) {
        return {
          variant: 'critical',
          title: 'Review Overdue',
          message: `"${procedure.name}" review was due on ${formatDate(procedure.nextReviewDate)} and is now overdue. Immediate review is required.`,
          source: 'Governance Engine',
          confidence: 96,
        };
      }
    }

    return {
      variant: 'success',
      title: 'Procedure Active and Current',
      message: `"${procedure.name}" v${procedure.version} is active and approved by ${procedure.approvedBy || 'pending'}. Next review scheduled for ${formatDate(procedure.nextReviewDate)}.`,
      source: 'Governance Engine',
      confidence: 94,
    };
  }, [procedure]);

  if (loading) {
    return <GovernanceProcedureDetailSkeleton />;
  }

  if (!procedure) {
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
          title="Procedure not found"
          message={`Governance procedure "${procedureId}" could not be found. It may have been removed or the ID is incorrect.`}
          size="lg"
          bordered
          actionLabel="Go Back"
          onAction={handleBack}
          actionIcon={<ArrowLeft className="h-3.5 w-3.5" />}
        />
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(procedure.category);

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
                <CategoryIcon className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <h1 className="text-xl font-semibold text-slate-900">{procedure.name}</h1>
                <p className="text-sm text-slate-500 truncate">
                  {procedure.id} • {formatLabel(procedure.category)} • v{procedure.version}
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
        <Badge variant={getProcedureStatusBadgeVariant(procedure.status)} size="md">
          {formatLabel(procedure.status)}
        </Badge>
        <Badge variant={getCategoryBadgeVariant(procedure.category)} size="md">
          {formatLabel(procedure.category)}
        </Badge>
        <Badge variant="outline" size="md">
          v{procedure.version}
        </Badge>
        {procedure.approvedBy ? (
          <Badge variant="success" size="md">
            <CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />
            Approved
          </Badge>
        ) : (
          <Badge variant="warning" size="md">
            <AlertTriangle className="h-3 w-3 mr-1" aria-hidden="true" />
            Pending Approval
          </Badge>
        )}
        <Badge variant="outline" size="md">
          <Layers className="h-3 w-3 mr-1" aria-hidden="true" />
          {(procedure.applicableSegments || []).length > 0
            ? `${procedure.applicableSegments.length} segments`
            : 'All segments'}
        </Badge>
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

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="findings">Audit Findings</TabsTrigger>
          <TabsTrigger value="expectations">Expectations</TabsTrigger>
          <TabsTrigger value="adherence">Adherence</TabsTrigger>
          <TabsTrigger value="related">Related</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <PanelCard
            title="Procedure Overview"
            subtitle={`${procedure.name} — v${procedure.version}`}
            icon={<BookOpen className="h-5 w-5" />}
          >
            <OverviewPanel procedure={procedure} />
          </PanelCard>
        </TabsContent>

        <TabsContent value="compliance">
          <PanelCard
            title="Compliance Status"
            subtitle="Related compliance framework scores and domain-level details"
            icon={<Shield className="h-5 w-5" />}
          >
            <ComplianceStatusPanel
              procedure={procedure}
              complianceScores={complianceScores}
            />
          </PanelCard>
        </TabsContent>

        <TabsContent value="findings">
          <PanelCard
            title="Related Audit Findings"
            subtitle="Audit findings associated with this procedure category"
            icon={<AlertTriangle className="h-5 w-5" />}
          >
            <RelatedFindingsPanel
              procedure={procedure}
              auditFindings={auditFindings}
            />
          </PanelCard>
        </TabsContent>

        <TabsContent value="expectations">
          <PanelCard
            title="Operating Expectations"
            subtitle="Operating expectations related to this procedure"
            icon={<ClipboardCheck className="h-5 w-5" />}
          >
            <RelatedExpectationsPanel
              procedure={procedure}
              operatingExpectations={operatingExpectations}
            />
          </PanelCard>
        </TabsContent>

        <TabsContent value="adherence">
          <PanelCard
            title="Adherence Metrics"
            subtitle="Adherence metrics related to this procedure category"
            icon={<Activity className="h-5 w-5" />}
          >
            <RelatedAdherencePanel
              procedure={procedure}
              adherenceMetrics={adherenceMetrics}
            />
          </PanelCard>
        </TabsContent>

        <TabsContent value="related">
          <PanelCard
            title="Related Procedures"
            subtitle="Other procedures in the same category or with overlapping scope"
            icon={<Layers className="h-5 w-5" />}
          >
            <RelatedProceduresPanel
              procedure={procedure}
              allProcedures={allProcedures}
              onProcedureClick={handleRelatedProcedureClick}
            />
          </PanelCard>
        </TabsContent>
      </Tabs>

      {/* Summary Footer */}
      <PanelCard
        title="Procedure Summary"
        subtitle="Quick reference for this governance procedure"
        icon={<Info className="h-5 w-5" />}
        collapsible
        defaultCollapsed
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div className="flex flex-col gap-1">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Status</span>
            <Badge variant={getProcedureStatusBadgeVariant(procedure.status)} size="sm">
              {formatLabel(procedure.status)}
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Category</span>
            <Badge variant={getCategoryBadgeVariant(procedure.category)} size="sm">
              {formatLabel(procedure.category)}
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Version</span>
            <span className="text-sm font-semibold text-slate-900">{procedure.version}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Owner</span>
            <span className="text-sm font-semibold text-slate-900 truncate">{procedure.owner}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Approved By</span>
            <span className="text-sm font-semibold text-slate-900 truncate">{procedure.approvedBy || 'Pending'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Segments</span>
            <span className="text-sm font-semibold text-slate-900">
              {(procedure.applicableSegments || []).length > 0
                ? procedure.applicableSegments.length
                : 'All'}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Review Timeline</h4>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span className="text-slate-500">Last Review:</span>
              <span className="font-medium text-slate-900">{formatDate(procedure.lastReviewDate)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span className="text-slate-500">Next Review:</span>
              <span className="font-medium text-slate-900">{formatDate(procedure.nextReviewDate)}</span>
            </div>
            {procedure.effectiveDate ? (
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span className="text-slate-500">Effective:</span>
                <span className="font-medium text-slate-900">{formatDate(procedure.effectiveDate)}</span>
              </div>
            ) : null}
          </div>
        </div>

        {procedure.description ? (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{procedure.description}</p>
          </div>
        ) : null}

        {(procedure.applicableSegments || []).length > 0 ? (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Applicable Segments</h4>
            <div className="flex flex-wrap gap-1.5">
              {procedure.applicableSegments.map((seg) => (
                <Badge key={seg} variant="outline" size="sm">{seg}</Badge>
              ))}
            </div>
          </div>
        ) : null}

        {(procedure.applicableApplications || []).length > 0 ? (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Applicable Applications</h4>
            <div className="flex flex-wrap gap-1.5">
              {procedure.applicableApplications.map((app) => (
                <Badge key={app} variant="outline" size="sm">{app}</Badge>
              ))}
            </div>
          </div>
        ) : null}
      </PanelCard>
    </div>
  );
}

GovernanceProcedureDetailPage.displayName = 'GovernanceProcedureDetailPage';

export { GovernanceProcedureDetailPage };
export default GovernanceProcedureDetailPage;