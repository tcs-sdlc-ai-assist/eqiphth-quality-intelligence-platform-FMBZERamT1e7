import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Circle,
  Rocket,
  CalendarX,
  ClipboardCheck,
  Bug,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { useNavigation, usePageHeader } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { DataTable } from '@/components/shared/DataTable';
import { FilterBar } from '@/components/shared/FilterBar';
import { RingGauge } from '@/components/shared/RingGauge';
import { PageActions } from '@/components/layout/PageActions';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn, formatDate } from '@/lib/utils';
import { ROUTES, DATE_FORMATS } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Mock data — release events with QA/security/coverage readiness signals.
// Three rows keep the ids used by ReleaseDetailPage (rel-980/981/982) so the
// "view" row action still opens a fully-populated detail page.
// ---------------------------------------------------------------------------
const MOCK_RELEASES = [
  { id: 'rel-1001', crq: 'CRQ000001689980', eventCode: 'MP-REL-2026-04-23-01', eventName: 'Member Portal Release', applications: ['Member Portal'], startDate: '2026-04-23', status: 'scheduled_for_review', hasReleaseEvent: true, qaManual: { executed: 17, total: 24, blocked: 2 }, qaAutomation: { automated: 34, total: 40, failed: 4 }, defects: { open: 10, closed: 0 }, security: { state: 'not_completed' }, coverage: { overall: 65, newCode: 58 } },
  { id: 'rel-1002', crq: 'CRQ000001691241', eventCode: 'BILL-REL-2026-04-18-01', eventName: 'Billing Applications Release', applications: ['Billing Applications'], startDate: '2026-04-18', status: 'implementation_in_progress', hasReleaseEvent: true, qaManual: { executed: 45, total: 50, blocked: 0 }, qaAutomation: { automated: 57, total: 60, failed: 1 }, defects: { open: 4, closed: 6 }, security: { state: 'passed', tools: ['SonarQube', 'Qualys'] }, coverage: { overall: 78, newCode: 72 } },
  { id: 'rel-1003', crq: 'CRQ000001691242', eventCode: 'BILL-REL-2026-04-18-02', eventName: 'Billing Applications Release', applications: ['Billing Applications'], startDate: '2026-04-18', status: 'implementation_in_progress', hasReleaseEvent: true, qaManual: { executed: 30, total: 50, blocked: 5 }, qaAutomation: { automated: 48, total: 60, failed: 6 }, defects: { open: 7, closed: 3 }, security: { state: 'partial', criticalCount: 1 }, coverage: { overall: 62, newCode: 55 } },
  { id: 'rel-1004', crq: 'CRQ000001691623', eventCode: 'PROV-REL-2026-04-19-01', eventName: 'Provider Portal Release', applications: ['Provider Portal'], startDate: '2026-04-19', status: 'scheduled', hasReleaseEvent: true, qaManual: { executed: 0, total: 30, blocked: 0 }, qaAutomation: { automated: 0, total: 30, failed: 0 }, defects: { open: 0, closed: 0 }, security: { state: 'not_completed' }, coverage: { overall: 0, newCode: 0 } },
  { id: 'rel-1005', crq: 'CRQ000001691624', eventCode: 'ENR-REL-2026-04-20-01', eventName: 'Enrollment System Release', applications: ['Enrollment System'], startDate: '2026-04-20', status: 'scheduled_for_review', hasReleaseEvent: true, qaManual: { executed: 15, total: 30, blocked: 1 }, qaAutomation: { automated: 21, total: 30, failed: 3 }, defects: { open: 5, closed: 2 }, security: { state: 'partial', criticalCount: 2 }, coverage: { overall: 71, newCode: 64 } },
  { id: 'rel-980', crq: 'CRQ000001692010', eventCode: 'MCR-REL-2026-04-24-01', eventName: 'Medicare Enrollment Portal R4', applications: ['Medicare Portal'], startDate: '2026-04-24', status: 'implementation_in_progress', hasReleaseEvent: true, qaManual: { executed: 38, total: 40, blocked: 0 }, qaAutomation: { automated: 36, total: 40, failed: 0 }, defects: { open: 3, closed: 12 }, security: { state: 'passed', tools: ['SonarQube', 'Checkmarx'] }, coverage: { overall: 88, newCode: 85 } },
  { id: 'rel-981', crq: 'CRQ000001692011', eventCode: 'CLM-REL-2026-04-25-01', eventName: 'Claims Processor API v2.1', applications: ['Claims Core'], startDate: '2026-04-25', status: 'scheduled_for_review', hasReleaseEvent: true, qaManual: { executed: 28, total: 45, blocked: 6 }, qaAutomation: { automated: 32, total: 50, failed: 10 }, defects: { open: 14, closed: 1 }, security: { state: 'partial', criticalCount: 2 }, coverage: { overall: 71, newCode: 60 } },
  { id: 'rel-982', crq: 'CRQ000001692012', eventCode: 'PVD-REL-2026-04-22-01', eventName: 'Provider Finder Mobile v1.8', applications: ['Provider Directory'], startDate: '2026-04-22', status: 'implementation_in_progress', hasReleaseEvent: true, qaManual: { executed: 40, total: 40, blocked: 0 }, qaAutomation: { automated: 38, total: 38, failed: 0 }, defects: { open: 1, closed: 9 }, security: { state: 'passed', tools: ['SonarQube', 'Qualys'] }, coverage: { overall: 94, newCode: 90 } },
  { id: 'rel-1006', crq: 'CRQ000001692013', eventCode: 'PHM-REL-2026-04-26-01', eventName: 'Pharmacy Portal Release', applications: ['Pharmacy Portal'], startDate: '2026-04-26', status: 'scheduled', hasReleaseEvent: false, qaManual: { executed: 0, total: 20, blocked: 0 }, qaAutomation: { automated: 0, total: 20, failed: 0 }, defects: { open: 0, closed: 0 }, security: { state: 'not_completed' }, coverage: { overall: 0, newCode: 0 } },
  { id: 'rel-1007', crq: 'CRQ000001692014', eventCode: 'CLN-REL-2026-04-27-01', eventName: 'Clinical Platform Release', applications: ['Clinical Platform'], startDate: '2026-04-27', status: 'implementation_in_progress', hasReleaseEvent: true, qaManual: { executed: 12, total: 25, blocked: 2 }, qaAutomation: { automated: 15, total: 25, failed: 4 }, defects: { open: 6, closed: 2 }, security: { state: 'partial', criticalCount: 1 }, coverage: { overall: 58, newCode: 50 } },
  { id: 'rel-1008', crq: 'CRQ000001692015', eventCode: 'CARE-REL-2026-04-28-01', eventName: 'Care Coordination Release', applications: ['Care Coordination'], startDate: '2026-04-28', status: 'scheduled_for_review', hasReleaseEvent: true, qaManual: { executed: 9, total: 15, blocked: 0 }, qaAutomation: { automated: 10, total: 15, failed: 1 }, defects: { open: 2, closed: 3 }, security: { state: 'passed', tools: ['SonarQube'] }, coverage: { overall: 80, newCode: 76 } },
  { id: 'rel-1009', crq: 'CRQ000001692016', eventCode: 'COMM-REL-2026-04-29-01', eventName: 'Communication Hub Release', applications: ['Communication Hub'], startDate: '2026-04-29', status: 'scheduled', hasReleaseEvent: false, qaManual: { executed: 0, total: 10, blocked: 0 }, qaAutomation: { automated: 0, total: 10, failed: 0 }, defects: { open: 0, closed: 0 }, security: { state: 'not_completed' }, coverage: { overall: 0, newCode: 0 } },
  { id: 'rel-1010', crq: 'CRQ000001692017', eventCode: 'AUTH-REL-2026-04-30-01', eventName: 'Authentication Service Release', applications: ['Authentication Service'], startDate: '2026-04-30', status: 'implementation_in_progress', hasReleaseEvent: true, qaManual: { executed: 33, total: 35, blocked: 0 }, qaAutomation: { automated: 40, total: 40, failed: 0 }, defects: { open: 0, closed: 5 }, security: { state: 'passed', tools: ['SonarQube', 'Qualys', 'Checkmarx'] }, coverage: { overall: 91, newCode: 89 } },
  { id: 'rel-1011', crq: 'CRQ000001692018', eventCode: 'NOTIF-REL-2026-05-01-01', eventName: 'Notification Hub Release', applications: ['Notification Hub'], startDate: '2026-05-01', status: 'scheduled_for_review', hasReleaseEvent: true, qaManual: { executed: 10, total: 20, blocked: 3 }, qaAutomation: { automated: 14, total: 20, failed: 5 }, defects: { open: 8, closed: 1 }, security: { state: 'partial', criticalCount: 3 }, coverage: { overall: 49, newCode: 40 } },
  { id: 'rel-1012', crq: 'CRQ000001692019', eventCode: 'STAR-REL-2026-05-02-01', eventName: 'Star Ratings Analytics Release', applications: ['Star Ratings Analytics'], startDate: '2026-05-02', status: 'scheduled', hasReleaseEvent: false, qaManual: { executed: 0, total: 12, blocked: 0 }, qaAutomation: { automated: 0, total: 12, failed: 0 }, defects: { open: 0, closed: 0 }, security: { state: 'not_completed' }, coverage: { overall: 0, newCode: 0 } },
  { id: 'rel-1013', crq: 'CRQ000001692020', eventCode: 'HEDIS-REL-2026-05-03-01', eventName: 'HEDIS Measure Engine Release', applications: ['HEDIS Measure Engine'], startDate: '2026-05-03', status: 'implementation_in_progress', hasReleaseEvent: true, qaManual: { executed: 18, total: 22, blocked: 1 }, qaAutomation: { automated: 20, total: 22, failed: 2 }, defects: { open: 3, closed: 4 }, security: { state: 'passed', tools: ['SonarQube'] }, coverage: { overall: 74, newCode: 70 } },
  { id: 'rel-1014', crq: 'CRQ000001692021', eventCode: 'PARTD-REL-2026-05-04-01', eventName: 'Part D Formulary Manager Release', applications: ['Part D Formulary Manager'], startDate: '2026-05-04', status: 'scheduled_for_review', hasReleaseEvent: true, qaManual: { executed: 8, total: 18, blocked: 2 }, qaAutomation: { automated: 9, total: 18, failed: 4 }, defects: { open: 5, closed: 0 }, security: { state: 'partial', criticalCount: 1 }, coverage: { overall: 55, newCode: 48 } },
  { id: 'rel-1015', crq: 'CRQ000001692022', eventCode: 'MCD-REL-2026-05-05-01', eventName: 'Medicaid Eligibility Engine Release', applications: ['Medicaid Eligibility Engine'], startDate: '2026-05-05', status: 'scheduled', hasReleaseEvent: false, qaManual: { executed: 0, total: 16, blocked: 0 }, qaAutomation: { automated: 0, total: 16, failed: 0 }, defects: { open: 0, closed: 0 }, security: { state: 'not_completed' }, coverage: { overall: 0, newCode: 0 } },
  { id: 'rel-1016', crq: 'CRQ000001692023', eventCode: 'SREG-REL-2026-05-06-01', eventName: 'State Regulatory Reporting Release', applications: ['State Regulatory Reporting'], startDate: '2026-05-06', status: 'implementation_in_progress', hasReleaseEvent: true, qaManual: { executed: 14, total: 14, blocked: 0 }, qaAutomation: { automated: 14, total: 14, failed: 0 }, defects: { open: 0, closed: 6 }, security: { state: 'passed', tools: ['SonarQube', 'Qualys'] }, coverage: { overall: 85, newCode: 80 } },
  { id: 'rel-1017', crq: 'CRQ000001692024', eventCode: 'PNM-REL-2026-05-07-01', eventName: 'Provider Network Management Release', applications: ['Provider Network Management'], startDate: '2026-05-07', status: 'scheduled_for_review', hasReleaseEvent: true, qaManual: { executed: 6, total: 12, blocked: 1 }, qaAutomation: { automated: 7, total: 12, failed: 2 }, defects: { open: 3, closed: 1 }, security: { state: 'partial', criticalCount: 1 }, coverage: { overall: 60, newCode: 52 } },
  { id: 'rel-1018', crq: 'CRQ000001692025', eventCode: 'GRP-REL-2026-05-08-01', eventName: 'Group Enrollment Platform Release', applications: ['Group Enrollment Platform'], startDate: '2026-05-08', status: 'scheduled', hasReleaseEvent: false, qaManual: { executed: 0, total: 10, blocked: 0 }, qaAutomation: { automated: 0, total: 10, failed: 0 }, defects: { open: 0, closed: 0 }, security: { state: 'not_completed' }, coverage: { overall: 0, newCode: 0 } },
  { id: 'rel-1019', crq: 'CRQ000001692026', eventCode: 'IND-REL-2026-05-09-01', eventName: 'Individual Marketplace Release', applications: ['Individual Marketplace'], startDate: '2026-05-09', status: 'implementation_in_progress', hasReleaseEvent: true, qaManual: { executed: 9, total: 9, blocked: 0 }, qaAutomation: { automated: 9, total: 9, failed: 0 }, defects: { open: 0, closed: 3 }, security: { state: 'passed', tools: ['SonarQube'] }, coverage: { overall: 77, newCode: 72 } },
  { id: 'rel-1020', crq: 'CRQ000001692027', eventCode: 'BRK-REL-2026-05-10-01', eventName: 'Broker Portal Release', applications: ['Broker Portal'], startDate: '2026-05-10', status: 'scheduled_for_review', hasReleaseEvent: true, qaManual: { executed: 5, total: 10, blocked: 2 }, qaAutomation: { automated: 6, total: 10, failed: 3 }, defects: { open: 4, closed: 0 }, security: { state: 'partial', criticalCount: 2 }, coverage: { overall: 45, newCode: 38 } },
  { id: 'rel-1021', crq: 'CRQ000001692028', eventCode: 'UND-REL-2026-05-11-01', eventName: 'Underwriting Engine Release', applications: ['Underwriting Engine'], startDate: '2026-05-11', status: 'implementation_in_progress', hasReleaseEvent: true, qaManual: { executed: 20, total: 20, blocked: 0 }, qaAutomation: { automated: 20, total: 20, failed: 0 }, defects: { open: 0, closed: 8 }, security: { state: 'passed', tools: ['SonarQube', 'Qualys'] }, coverage: { overall: 90, newCode: 86 } },
];

const STATUS_META = {
  scheduled_for_review: { label: 'Scheduled for Review', variant: 'warning' },
  implementation_in_progress: { label: 'Implementation In Progress', variant: 'info' },
  scheduled: { label: 'Scheduled', variant: 'neutral' },
};

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  ...Object.entries(STATUS_META).map(([value, meta]) => ({ value, label: meta.label })),
];

const YES_NO_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const APPLICATION_OPTIONS = [
  { value: '', label: 'All Applications' },
  ...Array.from(new Set(MOCK_RELEASES.flatMap((r) => r.applications))).map((name) => ({ value: name, label: name })),
];

const LEGEND = [
  { label: 'On Track', description: 'All quality gates met', icon: <CheckCircle2 className="h-4 w-4 text-success-500" /> },
  { label: 'At Risk', description: 'Some quality gates not met', icon: <AlertTriangle className="h-4 w-4 text-warning-500" /> },
  { label: 'Not Ready', description: 'Multiple quality gates not met', icon: <XCircle className="h-4 w-4 text-danger-500" /> },
  { label: 'Not Applicable', description: 'Quality gate not applicable', icon: <Circle className="h-4 w-4 text-slate-300" /> },
];

/**
 * Renders the Security Scan cell — passed tool checklist, partial warning
 * with a critical/high count, or a "Not Completed" empty state.
 *
 * @param {{ state: 'passed'|'partial'|'not_completed', tools?: string[], criticalCount?: number }} security - Security scan data
 * @returns {React.ReactElement}
 */
function SecurityScanCell({ security }) {
  if (security.state === 'passed') {
    return (
      <div className="flex flex-col gap-0.5">
        {(security.tools || []).map((tool) => (
          <span key={tool} className="flex items-center gap-1 text-2xs text-success-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" /> {tool}
          </span>
        ))}
        <span className="text-2xs font-medium text-success-600">Passed</span>
      </div>
    );
  }

  if (security.state === 'partial') {
    return (
      <div className="flex flex-col items-center gap-0.5 text-center">
        <AlertTriangle className="h-6 w-6 shrink-0 text-warning-500" strokeWidth={2.5} aria-hidden="true" />
        <span className="text-xs font-semibold text-warning-700">Partial</span>
        <span className="text-2xs text-danger-600">{security.criticalCount} Critical</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <XCircle className="h-6 w-6 shrink-0 text-danger-400" strokeWidth={2.5} aria-hidden="true" />
      <span className="text-2xs text-slate-400">Not Completed</span>
    </div>
  );
}

/**
 * Release Readiness page — CRQ/release-event table with QA manual and
 * automation testing rings, defect counts, security scan status, and unit
 * test coverage. Mock data only, mirrors the provided design reference.
 *
 * @returns {React.ReactElement}
 */
function ReleaseReadinessPage() {
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();
  const navigate = useNavigate();

  usePageHeader({ title: 'Release Readiness', subtitle: `Assess release quality and readiness across Humana applications.` });

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ application: '', itsmStatus: '', qaManual: '', securityScan: '' });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Release Readiness' },
    ]);
  }, [setBreadcrumbs]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: 'Release Data Refreshed', description: 'Readiness scores recalculated based on latest CI/CD pipelines.', variant: 'success' });
    }, 400);
  };

  const handleReleaseClick = (releaseId) => {
    navigate(`/releases/${releaseId}`);
  };

  const releases = useMemo(() => {
    return MOCK_RELEASES.filter((r) => {
      if (filters.application && !r.applications.includes(filters.application)) return false;
      if (filters.itsmStatus && r.status !== filters.itsmStatus) return false;
      if (filters.qaManual === 'yes' && r.qaManual.total === 0) return false;
      if (filters.qaManual === 'no' && r.qaManual.total > 0) return false;
      if (filters.securityScan === 'yes' && r.security.state === 'not_completed') return false;
      if (filters.securityScan === 'no' && r.security.state !== 'not_completed') return false;
      return true;
    });
  }, [filters]);

  const kpis = useMemo(() => {
    const total = MOCK_RELEASES.length;
    const noReleaseEvent = MOCK_RELEASES.filter((r) => !r.hasReleaseEvent).length;
    const noQaTesting = MOCK_RELEASES.filter((r) => r.qaManual.total === 0 && r.qaAutomation.total === 0).length;
    const withOpenDefects = MOCK_RELEASES.filter((r) => r.defects.open > 0).length;
    const noSecurity = MOCK_RELEASES.filter((r) => r.security.state === 'not_completed').length;
    const noUnitTests = MOCK_RELEASES.filter((r) => r.coverage.overall === 0).length;
    const pct = (n) => `${Math.round((n / total) * 1000) / 10}%`;

    return [
      { id: 'total', label: 'Total Releases', value: total, alert: false, icon: <Rocket />, iconClass: 'bg-info-500' },
      { id: 'no_event', label: 'Releases With No Release Event', value: noReleaseEvent, changeText: pct(noReleaseEvent), alert: true, icon: <CalendarX />, iconClass: 'bg-slate-400' },
      { id: 'no_qa', label: 'Releases With No QA Testing', value: noQaTesting, changeText: pct(noQaTesting), alert: true, icon: <ClipboardCheck />, iconClass: 'bg-humana-green-500' },
      { id: 'open_defects', label: 'Releases With Open Defects', value: withOpenDefects, changeText: pct(withOpenDefects), alert: true, icon: <Bug />, iconClass: 'bg-warning-500' },
      { id: 'no_security', label: 'Releases With No Security Testing', value: noSecurity, changeText: pct(noSecurity), alert: true, icon: <ShieldCheck />, iconClass: 'bg-violet-500' },
      { id: 'no_unit', label: 'Releases With No Unit Tests', value: noUnitTests, changeText: pct(noUnitTests), alert: true, icon: <Code2 />, iconClass: 'bg-cyan-500' },
    ];
  }, []);

  const filterFields = useMemo(
    () => [
      { id: 'application', label: 'Application', type: 'select', options: APPLICATION_OPTIONS, defaultValue: '' },
      { id: 'itsmStatus', label: 'ITSM Status', type: 'select', options: STATUS_OPTIONS, defaultValue: '' },
      { id: 'qaManual', label: 'QA Manual Testing', type: 'select', options: YES_NO_OPTIONS, defaultValue: '' },
      { id: 'securityScan', label: 'Security Scan', type: 'select', options: YES_NO_OPTIONS, defaultValue: '' },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        id: 'actions',
        header: '',
        size: 44,
        meta: { width: '3.5%' },
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <button type="button" onClick={() => handleReleaseClick(row.original.id)} className="rounded p-1 text-slate-900 hover:bg-slate-100 hover:text-humana-green-600" aria-label={`View ${row.original.eventName}`}>
            <Eye className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          </button>
        ),
      },
      {
        accessorKey: 'crq',
        header: 'CRQ #',
        size: 130,
        meta: { width: '9.5%' },
        cell: ({ row }) => <span className="text-xs tabular-nums text-slate-600 break-all">{row.original.crq}</span>,
      },
      {
        accessorKey: 'eventCode',
        header: 'Release Event',
        size: 190,
        meta: { width: '14%' },
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <button type="button" onClick={() => handleReleaseClick(row.original.id)} className="text-left text-xs font-semibold text-humana-green-600 hover:text-humana-green-700 hover:underline break-all">
              {row.original.eventCode}
            </button>
            <span className="text-xs text-slate-700">{row.original.eventName}</span>
            <span className="text-2xs text-slate-400">{formatDate(row.original.startDate)}</span>
          </div>
        ),
      },
      {
        accessorKey: 'applications',
        header: 'Applications',
        size: 108,
        meta: { width: '8.5%' },
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.applications.map((app) => (
              <Badge key={app} variant="info" size="sm" className="max-w-full whitespace-normal text-center leading-tight">{app}</Badge>
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        size: 92,
        meta: { width: '7%' },
        cell: ({ row }) => <span className="text-xs text-slate-600">{formatDate(row.original.startDate, DATE_FORMATS.SHORT)}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 108,
        meta: { width: '8.5%' },
        cell: ({ row }) => {
          const meta = STATUS_META[row.original.status];
          return <Badge variant={meta.variant} size="sm" className="max-w-full uppercase tracking-wide whitespace-normal text-center leading-tight">{meta.label}</Badge>;
        },
      },
      {
        id: 'qaManual',
        header: 'QA Manual Testing',
        size: 150,
        meta: { width: '12%' },
        enableSorting: false,
        cell: ({ row }) => {
          const qa = row.original.qaManual;
          const pct = qa.total > 0 ? Math.round((qa.executed / qa.total) * 100) : 0;
          return (
            <div className="flex items-center gap-2">
              <RingGauge value={pct} size={44} strokeWidth={4} />
              <div className="flex flex-col text-2xs text-slate-500">
                <span>{qa.executed} / {qa.total} Test Cases Executed</span>
                {qa.blocked > 0 ? <span className="text-danger-600">{qa.blocked} Blocked</span> : null}
              </div>
            </div>
          );
        },
      },
      {
        id: 'qaAutomation',
        header: 'QA Automation Testing',
        size: 158,
        meta: { width: '12.5%' },
        enableSorting: false,
        cell: ({ row }) => {
          const qa = row.original.qaAutomation;
          const pct = qa.total > 0 ? Math.round((qa.automated / qa.total) * 100) : 0;
          return (
            <div className="flex items-center gap-2">
              <RingGauge value={pct} size={44} strokeWidth={4} />
              <div className="flex flex-col text-2xs text-slate-500">
                <span>{qa.automated} / {qa.total} Automated</span>
                {qa.failed > 0 ? <span className="text-danger-600">{qa.failed} Failed</span> : null}
              </div>
            </div>
          );
        },
      },
      {
        id: 'defects',
        header: 'Defects',
        size: 92,
        meta: { width: '6.5%' },
        enableSorting: false,
        cell: ({ row }) => {
          const d = row.original.defects;
          return (
            <div className="flex flex-col text-xs">
              <span className="text-danger-600">Open: {d.open}</span>
              <span className="text-success-600">Closed: {d.closed}</span>
              <span className="font-semibold text-slate-700">Total: {d.open + d.closed}</span>
            </div>
          );
        },
      },
      {
        id: 'security',
        header: 'Security Scan',
        size: 120,
        meta: { width: '8%' },
        enableSorting: false,
        cell: ({ row }) => <SecurityScanCell security={row.original.security} />,
      },
      {
        id: 'coverage',
        header: 'Unit Test Coverage',
        size: 148,
        meta: { width: '10%' },
        enableSorting: false,
        cell: ({ row }) => {
          const c = row.original.coverage;
          return (
            <div className="flex items-center gap-2">
              <RingGauge value={c.overall} size={44} strokeWidth={4} />
              <div className="flex flex-col text-2xs text-slate-500">
                <span>Overall Code: <span className="font-medium text-slate-700">{c.overall}%</span></span>
                <span>New Code: <span className="font-medium text-slate-700">{c.newCode}%</span></span>
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Recalculate — portalled into the navbar (far right) */}
      <PageActions>
        <Button variant="outline" size="sm" iconLeft={<RefreshCw className={loading ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} />} onClick={handleRefresh}>
          Recalculate Scores
        </Button>
      </PageActions>

      {/* Filters */}
      <FilterBar fields={filterFields} values={filters} onChange={setFilters} liveMode showApplyButton={false} showResetButton showActiveFilters />

      {/* KPI Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <Card key={kpi.id} className="relative flex h-full flex-col p-4">
            {kpi.alert ? (
              <span className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-danger-500 text-2xs font-bold text-white" aria-hidden="true">
                !
              </span>
            ) : null}
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white [&_svg]:h-5 [&_svg]:w-5',
                  kpi.iconClass
                )}
                aria-hidden="true"
              >
                {kpi.icon}
              </span>
              <div className="flex min-w-0 items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-slate-900">{kpi.value}</span>
                {kpi.changeText ? <span className="text-sm text-slate-400">({kpi.changeText})</span> : null}
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-500">{kpi.label}</p>
          </Card>
        ))}
      </div>

      {/* Releases table */}
      <DataTable
        columns={columns}
        data={releases}
        enableExport
        enableDensityToggle
        searchAlign="right"
        tableClassName="table-fixed [&_th]:px-2.5 [&_td]:px-2.5 [&_td]:align-top"
        headClassName="normal-case font-bold text-slate-900 whitespace-normal align-bottom"
        pageSize={10}
        searchPlaceholder="Search releases, CRQs, applications..."
        exportFilename="release-readiness"
        emptyMessage="No releases match the current filters."
      />

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-200 pt-4 text-xs text-slate-500">
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            {item.icon}
            <span className="font-medium text-slate-700">{item.label}</span>
            <span className="text-slate-400">{item.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

ReleaseReadinessPage.displayName = 'ReleaseReadinessPage';

export { ReleaseReadinessPage };
export default ReleaseReadinessPage;
