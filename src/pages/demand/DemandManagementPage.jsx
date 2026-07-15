import { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
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
import GaugeComponent from 'react-gauge-component';
import {
  Boxes,
  Users,
  Clock,
  AlertTriangle,
  Calendar,
  ArrowRight,
  Lightbulb,
  FileText,
  ShoppingCart,
  Stethoscope,
  MessageSquare,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { usePersona } from '@/context/PersonaContext';
import { useToast } from '@/components/ui/Toast';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { ChartWrapper } from '@/components/shared/ChartWrapper';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import { downloadCSV } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

/* ------------------------------------------------------------------ *
 * Mock data — numbers mirror the EQIP Demand Management UX mock.
 * Frontend-only demo: no API, all values are static.
 * ------------------------------------------------------------------ */

const KPIS = [
  { id: 'total', label: 'Total Demand', subtitle: '(Next 90 Days)', value: 3248, unit: 'count', changePercent: 12, changeLabel: 'vs Last 90 Days', trend: 'improving', icon: <Boxes />, tone: 'blue' },
  { id: 'committed', label: 'Committed Demand', subtitle: '(Next 90 Days)', value: 2156, unit: 'count', changePercent: 8, changeLabel: 'vs Last 90 Days', trend: 'improving', icon: <Users />, tone: 'green' },
  { id: 'utilization', label: 'Capacity Utilization', subtitle: '(Next 90 Days)', value: '78%', changePercent: 5, changeLabel: 'vs Last 90 Days', trend: 'improving', icon: <Clock />, tone: 'orange' },
  { id: 'atrisk', label: 'At Risk Initiatives', subtitle: '(Next 90 Days)', value: 18, unit: 'count', changePercent: -10, changeLabel: 'vs Last 90 Days', trend: 'declining', icon: <Users />, tone: 'purple' },
  { id: 'shortage', label: 'Demand Shortage', subtitle: '(Next 90 Days)', value: 236, unit: 'count', changeText: 'High Priority', changeTone: 'danger', icon: <AlertTriangle />, tone: 'red' },
];

const PIPELINE = [
  { name: 'Requirements / Discovery', value: 842, pct: 26, color: '#3b82f6' },
  { name: 'Scoping', value: 654, pct: 20, color: '#16b364' },
  { name: 'Estimating', value: 612, pct: 19, color: '#f59e0b' },
  { name: 'Approved / Funded', value: 778, pct: 24, color: '#8b5cf6' },
  { name: 'On Hold', value: 362, pct: 11, color: '#cbd5e1' },
];

const CAPACITY = [
  { name: 'Available', fte: 854, pct: 22, color: '#16b364' },
  { name: 'Committed', fte: 3012, pct: 78, color: '#3b82f6' },
  { name: 'Over Capacity', fte: 156, pct: 5, color: '#ef4444' },
];

const TREND = [
  { month: "May '25", demand: 2050, capacity: 1900, forecast: false },
  { month: "Jun '25", demand: 2180, capacity: 1980, forecast: false },
  { month: "Jul '25", demand: 2320, capacity: 2050, forecast: false },
  { month: "Aug '25", demand: 2480, capacity: 2120, forecast: false },
  { month: "Sep '25", demand: 2660, capacity: 2190, forecast: false },
  { month: "Oct '25", demand: 2850, capacity: 2260, forecast: true },
  { month: "Nov '25", demand: 3050, capacity: 2330, forecast: true },
  { month: "Dec '25", demand: 3280, capacity: 2410, forecast: true },
];

const PORTFOLIO = [
  { name: 'Insurance', value: 1248, color: '#3b82f6' },
  { name: 'CenterWell', value: 854, color: '#8b5cf6' },
  { name: 'Growth', value: 612, color: '#16b364' },
  { name: 'Corporate Functions', value: 298, color: '#f59e0b' },
  { name: 'Shared Tech', value: 236, color: '#94a3b8' },
];

const AT_RISK = [
  { initiative: 'Member Portal Modernization', portfolio: 'Insurance', goLive: 'Jul 15, 2025', risk: 'High', reason: 'Capacity shortage' },
  { initiative: 'Provider Data Platform', portfolio: 'CenterWell', goLive: 'Aug 01, 2025', risk: 'High', reason: 'Skilled resources' },
  { initiative: 'Claims AI Insights', portfolio: 'Insurance', goLive: 'Jul 30, 2025', risk: 'Medium', reason: 'Multiple dependencies' },
  { initiative: 'Enterprise Auth Transformation', portfolio: 'Shared Tech', goLive: 'Sep 10, 2025', risk: 'Medium', reason: 'Environment readiness' },
  { initiative: 'Benefits Admin Upgrade', portfolio: 'Insurance', goLive: 'Aug 15, 2025', risk: 'Low', reason: 'Manual testing bandwidth' },
];

const INTAKE = [
  { id: 1, title: 'Pharmacy Portal Enhancement', portfolio: 'Insurance', status: 'New', time: '1h ago', icon: <ShoppingCart /> },
  { id: 2, title: 'Provider Search Optimization', portfolio: 'CenterWell', status: 'New', time: '2h ago', icon: <FileText /> },
  { id: 3, title: 'Claims Document AI', portfolio: 'Insurance', status: 'In Review', time: '5h ago', icon: <FileText /> },
  { id: 4, title: 'Member Communications Hub', portfolio: 'Insurance', status: 'In Review', time: '1d ago', icon: <MessageSquare /> },
  { id: 5, title: 'Clinical Scheduling Platform', portfolio: 'CenterWell', status: 'Queued', time: '1d ago', icon: <Stethoscope /> },
];

const RISK_VARIANT = { High: 'error', Medium: 'warning', Low: 'success' };
const INTAKE_VARIANT = { New: 'info', 'In Review': 'warning', Queued: 'neutral', Approved: 'success', 'On Hold': 'neutral' };
const APPROVAL_VARIANT = { Pending: 'warning', Approved: 'success', Rejected: 'error' };

/** Maps the sidebar's hash-based sub-nav links (Demand Management §6.3) to a tab value. */
const HASH_TAB_MAP = {
  '#pipeline': 'pipeline',
  '#intake': 'intake',
  '#inventory': 'inventory',
  '#portfolio': 'portfolio',
  '#approvals': 'approvals',
  '#reports': 'reports',
};

/**
 * Distributes a total across weighted buckets, forcing the last bucket to
 * absorb any rounding remainder so the sum always equals `total` exactly.
 *
 * @param {number} total - The value to distribute
 * @param {{ key: string, pct: number }[]} weights - Buckets with their share of the total
 * @returns {Object<string, number>} Bucket key → whole-number value
 */
function distributeFTE(total, weights) {
  const result = {};
  let used = 0;
  weights.forEach((w, i) => {
    if (i === weights.length - 1) {
      result[w.key] = Math.max(0, total - used);
      return;
    }
    const v = Math.round(total * w.pct);
    result[w.key] = v;
    used += v;
  });
  return result;
}

const PIPELINE_STAGE_WEIGHTS = [
  { key: 'discovery', pct: 0.26 },
  { key: 'scoping', pct: 0.2 },
  { key: 'estimating', pct: 0.19 },
  { key: 'approved', pct: 0.24 },
  { key: 'onHold', pct: 0.11 },
];

/** "Demand Pipeline" tab — All Demand broken out By Portfolio. */
const PIPELINE_BY_PORTFOLIO = PORTFOLIO.map((p) => ({
  portfolio: p.name,
  ...distributeFTE(p.value, PIPELINE_STAGE_WEIGHTS),
  total: p.value,
}));

const REQUEST_TYPES = ['New Application Onboarding', 'Test Automation Request', 'Test Data Request', 'Environment Request', 'Integration Request', 'Reporting Request', 'Governance Exception Request'];
const REQUESTORS = ['Sarah Johnson', 'David Lee', 'Maria Garcia', 'James Wilson', 'Priya Patel', 'Andrew Kim', 'Lisa Thompson', 'Robert Brown'];
const PORTFOLIOS = ['Insurance', 'CenterWell', 'Growth', 'Corporate Functions', 'Shared Tech'];
const INTAKE_STATUSES = ['New', 'In Review', 'Queued', 'Approved'];

/** "Demand Intake" tab — fuller intake queue than the Home panel's 5-row preview. */
const INTAKE_QUEUE = Array.from({ length: 15 }, (_, i) => ({
  demandId: `DEM-${1042 + i}`,
  initiative: [
    'Pharmacy Portal Enhancement', 'Provider Search Optimization', 'Claims Document AI', 'Member Communications Hub',
    'Clinical Scheduling Platform', 'Broker Portal Refresh', 'Underwriting Rules Engine', 'Wellness Rewards Expansion',
    'Partner API Rate Limiting', 'Vendor Data Reconciliation', 'Audit Trail Dashboard', 'Regulatory Filing Automation',
    'Star Ratings Forecast Model', 'HEDIS Measure Onboarding', 'Group Enrollment Self-Service',
  ][i],
  requestType: REQUEST_TYPES[i % REQUEST_TYPES.length],
  requestor: REQUESTORS[i % REQUESTORS.length],
  portfolio: PORTFOLIOS[i % PORTFOLIOS.length],
  status: INTAKE_STATUSES[i % INTAKE_STATUSES.length],
  requestedDate: `2026-07-${String((i % 14) + 1).padStart(2, '0')}`,
}));

/** "Demand Inventory" tab — Backlog sub-area. */
const BACKLOG = Array.from({ length: 10 }, (_, i) => ({
  demandId: `DEM-${900 + i}`,
  initiative: [
    'Legacy Batch Retirement', 'Mobile Accessibility Audit', 'API Gateway Consolidation', 'Test Data Anonymization',
    'Synthetic Monitoring Rollout', 'Chatbot Intent Expansion', 'Provider Credentialing Sync', 'Claims Adjudication Rules v3',
    'Member ID Card Digitization', 'Formulary Update Automation',
  ][i],
  portfolio: PORTFOLIOS[i % PORTFOLIOS.length],
  requestType: REQUEST_TYPES[(i + 2) % REQUEST_TYPES.length],
  priority: ['High', 'Medium', 'Low'][i % 3],
  estimatedFTEs: 4 + ((i * 3) % 18),
  status: 'Backlog',
}));

/** "Demand Inventory" tab — Approved Demand sub-area. */
const APPROVED_DEMAND = Array.from({ length: 9 }, (_, i) => ({
  demandId: `DEM-${700 + i}`,
  initiative: [
    'Member Portal Modernization', 'Provider Data Platform', 'Claims AI Insights', 'Enterprise Auth Transformation',
    'Benefits Admin Upgrade', 'Care Gaps Dashboard', 'Medicare Star Ratings Refresh', 'Pharmacy Network Expansion',
    'Group Enrollment API',
  ][i],
  portfolio: PORTFOLIOS[i % PORTFOLIOS.length],
  committedFTEs: 6 + ((i * 4) % 24),
  owner: REQUESTORS[(i + 3) % REQUESTORS.length],
  targetGoLive: `2026-0${((i % 5) + 7)}-15`,
  status: 'Approved',
}));

/** "Portfolio Demand" tab — Portfolio Roadmap rollup. */
const PORTFOLIO_ROLLUP = PORTFOLIO.map((p) => ({
  portfolio: p.name,
  totalDemand: p.value,
  committed: Math.round(p.value * 0.665),
  atRiskCount: AT_RISK.filter((r) => r.portfolio === p.name).length,
  activeInitiatives: 3 + Math.round(p.value / 200),
}));

/** "Approvals" tab — Resource Requests sub-area. */
const INITIAL_RESOURCE_REQUESTS = Array.from({ length: 8 }, (_, i) => ({
  requestId: `RR-${5010 + i}`,
  initiative: INTAKE_QUEUE[i].initiative,
  portfolio: PORTFOLIOS[i % PORTFOLIOS.length],
  requestor: REQUESTORS[(i + 1) % REQUESTORS.length],
  ftes: 1 + (i % 6),
  approvalStatus: ['Pending', 'Approved', 'Rejected'][i % 3],
  requestedDate: `2026-07-${String((i % 10) + 1).padStart(2, '0')}`,
}));

/** "Approvals" tab — Fieldglass (vendor/contractor) Requests sub-area. */
const INITIAL_FIELDGLASS_REQUESTS = Array.from({ length: 7 }, (_, i) => ({
  requestId: `FG-${8020 + i}`,
  vendor: ['TCS', 'Infosys', 'Accenture', 'Cognizant', 'Wipro'][i % 5],
  role: ['SDET', 'Automation Engineer', 'Performance Engineer', 'Security Engineer', 'Test Data Engineer'][i % 5],
  portfolio: PORTFOLIOS[(i + 2) % PORTFOLIOS.length],
  ftes: 1 + (i % 4),
  approvalStatus: ['Pending', 'Approved', 'Rejected'][(i + 1) % 3],
  requestedDate: `2026-07-${String((i % 12) + 1).padStart(2, '0')}`,
}));

const CAPACITY_WEIGHTS = [
  { key: 'available', pct: 0.22 },
  { key: 'committed', pct: 0.73 },
  { key: 'overCapacity', pct: 0.05 },
];

/** "View Capacity Overview" dialog — capacity breakdown per portfolio. */
const CAPACITY_BY_PORTFOLIO = PORTFOLIO.map((p) => ({
  portfolio: p.name,
  ...distributeFTE(p.value, CAPACITY_WEIGHTS),
  total: p.value,
}));

/** "View Full Forecast" dialog — the 12-month trend as a granular table. */
const FORECAST_TABLE = TREND.map((t) => ({
  month: t.month,
  demand: t.demand,
  capacity: t.capacity,
  gap: t.demand - t.capacity,
  type: t.forecast ? 'Forecast' : 'Actual',
}));

/** "View Recommendations" dialog — AI-generated capacity recommendations. */
const RECOMMENDATIONS = [
  { title: 'Reallocate 40 FTEs from Growth to Insurance', impact: 'High', rationale: 'Insurance is projected to exceed capacity while Growth is under-utilized by comparison over the next 90 days.' },
  { title: 'Backfill 2 Automation Engineer roles in CenterWell', impact: 'Medium', rationale: 'CenterWell has multiple at-risk initiatives citing skilled-resource shortages.' },
  { title: 'Expedite Fieldglass approval for Shared Tech vendor requests', impact: 'Medium', rationale: 'Pending Fieldglass requests are blocking Shared Tech initiative start dates.' },
  { title: 'Defer 2 low-priority backlog items in Corporate Functions', impact: 'Low', rationale: 'Freeing this capacity covers the projected Q4 shortfall for committed initiatives.' },
];

/** "Reports & Analytics" tab — export-ready report definitions. */
const DEMAND_REPORTS = [
  { id: 'insights', title: 'Demand Insights', description: 'Full demand pipeline, intake, and portfolio breakdown for the selected date range.', rows: () => [...PIPELINE, ...PORTFOLIO.map((p) => ({ name: p.name, value: p.value }))] },
  { id: 'capacity', title: 'Capacity Reports', description: 'Available, committed, and over-capacity FTEs by portfolio.', rows: () => PORTFOLIO_ROLLUP },
];

/**
 * A right-aligned footer link rendered at the bottom of a panel.
 *
 * @param {object} props
 * @param {string} props.label - Link text
 * @returns {React.ReactElement}
 */
function PanelFooterLink({ label, onClick }) {
  return (
    <div className="mt-3 -mx-4 -mb-4 border-t border-slate-100">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-center gap-1.5 py-3 text-sm font-medium text-info-600 transition-colors hover:bg-slate-50 hover:text-info-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500"
      >
        {label}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * Compact chart tooltip used across the demand panels.
 *
 * @param {object} props - Recharts tooltip props
 * @returns {React.ReactElement|null}
 */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-dropdown">
      {label ? <p className="text-xs font-medium text-slate-900">{label}</p> : null}
      {payload.map((entry, i) => (
        <p key={i} className="text-xs text-slate-600" style={{ color: entry.color || entry.payload?.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  );
}

/**
 * Demand Management dashboard — capacity-planning view rebuilt to match the
 * EQIP UX mock (Docs/mocks/02-demand-management.png).
 *
 * @returns {React.ReactElement}
 */
function DemandManagementPage() {
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();
  const { approvalAuthority } = usePersona();
  const location = useLocation();
  const [range, setRange] = useState('Last 30 Days');
  const [activeTab, setActiveTab] = useState(() => HASH_TAB_MAP[location.hash] || 'home');
  const [inventorySubTab, setInventorySubTab] = useState('backlog');
  const [resourceRequests, setResourceRequests] = useState(INITIAL_RESOURCE_REQUESTS);
  const [fieldglassRequests, setFieldglassRequests] = useState(INITIAL_FIELDGLASS_REQUESTS);
  const [approvalsSubTab, setApprovalsSubTab] = useState('resource');
  const [openDialog, setOpenDialog] = useState(null);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Demand Management' },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    setActiveTab(HASH_TAB_MAP[location.hash] || 'home');
  }, [location.hash]);

  const intakeColumns = useMemo(() => [
    { accessorKey: 'demandId', header: 'Demand ID', size: 100 },
    { accessorKey: 'initiative', header: 'Initiative' },
    { accessorKey: 'requestType', header: 'Request Type' },
    { accessorKey: 'requestor', header: 'Requestor' },
    { accessorKey: 'portfolio', header: 'Portfolio', size: 130 },
    { accessorKey: 'requestedDate', header: 'Requested', size: 110 },
    { id: 'status', header: 'Status', size: 110, cell: ({ row }) => <Badge variant={INTAKE_VARIANT[row.original.status]} size="sm">{row.original.status}</Badge> },
  ], []);

  const backlogColumns = useMemo(() => [
    { accessorKey: 'demandId', header: 'Demand ID', size: 100 },
    { accessorKey: 'initiative', header: 'Initiative' },
    { accessorKey: 'portfolio', header: 'Portfolio', size: 140 },
    { accessorKey: 'requestType', header: 'Request Type' },
    { id: 'priority', header: 'Priority', size: 100, cell: ({ row }) => <Badge variant={RISK_VARIANT[row.original.priority]} size="sm">{row.original.priority}</Badge> },
    { accessorKey: 'estimatedFTEs', header: 'Est. FTEs', size: 90 },
  ], []);

  const approvedColumns = useMemo(() => [
    { accessorKey: 'demandId', header: 'Demand ID', size: 100 },
    { accessorKey: 'initiative', header: 'Initiative' },
    { accessorKey: 'portfolio', header: 'Portfolio', size: 140 },
    { accessorKey: 'committedFTEs', header: 'Committed FTEs', size: 120 },
    { accessorKey: 'owner', header: 'Owner' },
    { accessorKey: 'targetGoLive', header: 'Target Go Live', size: 120 },
  ], []);

  const decideResourceRequest = (requestId, approvalStatus) => {
    setResourceRequests((prev) => prev.map((r) => (r.requestId === requestId ? { ...r, approvalStatus } : r)));
    toast({ variant: approvalStatus === 'Approved' ? 'success' : 'warning', title: `Request ${approvalStatus.toLowerCase()}`, description: `${requestId} has been ${approvalStatus.toLowerCase()}.` });
  };

  const decideFieldglassRequest = (requestId, approvalStatus) => {
    setFieldglassRequests((prev) => prev.map((r) => (r.requestId === requestId ? { ...r, approvalStatus } : r)));
    toast({ variant: approvalStatus === 'Approved' ? 'success' : 'warning', title: `Request ${approvalStatus.toLowerCase()}`, description: `${requestId} has been ${approvalStatus.toLowerCase()}.` });
  };

  const renderApprovalCell = (request, onDecide) => {
    if (request.approvalStatus !== 'Pending' || !approvalAuthority) {
      return <Badge variant={APPROVAL_VARIANT[request.approvalStatus]} size="sm">{request.approvalStatus}</Badge>;
    }
    return (
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="sm" iconLeft={<CheckCircle2 className="h-3.5 w-3.5" />} onClick={() => onDecide(request.requestId, 'Approved')}>Approve</Button>
        <Button variant="ghost" size="sm" iconLeft={<XCircle className="h-3.5 w-3.5" />} onClick={() => onDecide(request.requestId, 'Rejected')}>Decline</Button>
      </div>
    );
  };

  const resourceReqColumns = useMemo(() => [
    { accessorKey: 'requestId', header: 'Request ID', size: 100 },
    { accessorKey: 'initiative', header: 'Initiative' },
    { accessorKey: 'portfolio', header: 'Portfolio', size: 140 },
    { accessorKey: 'requestor', header: 'Requestor' },
    { accessorKey: 'ftes', header: 'FTEs', size: 80 },
    { accessorKey: 'requestedDate', header: 'Requested', size: 110 },
    { id: 'status', header: 'Status', size: 190, enableSorting: false, cell: ({ row }) => renderApprovalCell(row.original, decideResourceRequest) },
  ], [resourceRequests, approvalAuthority]);

  const fieldglassColumns = useMemo(() => [
    { accessorKey: 'requestId', header: 'Request ID', size: 100 },
    { accessorKey: 'vendor', header: 'Vendor', size: 120 },
    { accessorKey: 'role', header: 'Role' },
    { accessorKey: 'portfolio', header: 'Portfolio', size: 140 },
    { accessorKey: 'ftes', header: 'FTEs', size: 80 },
    { accessorKey: 'requestedDate', header: 'Requested', size: 110 },
    { id: 'status', header: 'Status', size: 190, enableSorting: false, cell: ({ row }) => renderApprovalCell(row.original, decideFieldglassRequest) },
  ], [fieldglassRequests, approvalAuthority]);

  const handleReportExport = (report) => {
    downloadCSV(report.rows(), `demand-${report.id}.csv`);
    toast({ variant: 'success', title: 'Export complete', description: `${report.title} exported to CSV.` });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-humana-green-50 text-humana-green-600">
            <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Demand Management</h1>
            <p className="text-sm text-slate-500">Plan demand. Align capacity. Deliver quality.</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-card">
          <Calendar className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <select value={range} onChange={(e) => setRange(e.target.value)} className="bg-transparent focus:outline-none">
            {['Last 30 Days', 'Last 60 Days', 'Last 90 Days'].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="home">Demand Home</TabsTrigger>
          <TabsTrigger value="pipeline">Demand Pipeline</TabsTrigger>
          <TabsTrigger value="intake">Demand Intake</TabsTrigger>
          <TabsTrigger value="inventory">Demand Inventory</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Demand</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="reports">Reports &amp; Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="flex flex-col gap-4">
      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {KPIS.map((kpi) => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            subtitle={kpi.subtitle}
            value={kpi.value}
            unit={kpi.unit}
            trend={kpi.trend}
            changePercent={kpi.changePercent}
            changeLabel={kpi.changeLabel}
            changeText={kpi.changeText}
            changeTone={kpi.changeTone}
            icon={kpi.icon}
            tone={kpi.tone}
          />
        ))}
      </div>

      {/* Row 1: Pipeline donut · Capacity gauge · Demand vs Capacity trend */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Demand Pipeline */}
        <PanelCard title="Demand Pipeline" subtitle="(Next 90 Days)">
          <div className="flex items-center gap-2">
            <div className="relative h-[160px] w-[160px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PIPELINE} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={76} paddingAngle={2} stroke="none" isAnimationActive={false}>
                    {PIPELINE.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold text-slate-900">3,248</span>
                <span className="text-2xs text-slate-400">FTEs</span>
              </div>
            </div>
            <ul className="flex flex-1 flex-col gap-2">
              {PIPELINE.map((d) => (
                <li key={d.name} className="flex items-center justify-between gap-2 text-xs">
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} aria-hidden="true" />
                    <span className="truncate text-slate-600">{d.name}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-slate-500">
                    <span className="font-semibold text-slate-900">{d.value}</span> ({d.pct}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <PanelFooterLink label="View Demand Pipeline" onClick={() => setActiveTab('pipeline')} />
        </PanelCard>

        {/* Capacity Overview */}
        <PanelCard title="Capacity Overview" subtitle="(Next 90 Days)">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[240px]">
              <GaugeComponent
                type="semicircle"
                value={78}
                minValue={0}
                maxValue={100}
                arc={{
                  width: 0.25,
                  padding: 0.01,
                  cornerRadius: 2,
                  subArcs: [
                    { limit: 40, color: '#16b364' },
                    { limit: 75, color: '#f59e0b' },
                    { limit: 100, color: '#ef4444' },
                  ],
                }}
                pointer={{ type: 'needle', color: '#334155', width: 12, length: 0.7 }}
                labels={{ valueLabel: { hide: true }, tickLabels: { hideMinMax: true } }}
              />
            </div>
            <div className="-mt-2 flex flex-col items-center">
              <span className="text-2xl font-semibold text-slate-900">78%</span>
              <span className="text-2xs text-slate-400">Utilization</span>
            </div>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {CAPACITY.map((c) => (
              <li key={c.name} className="flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: c.color }} aria-hidden="true" />
                  <span className="text-slate-600">{c.name}</span>
                </span>
                <span className="tabular-nums text-slate-500">
                  <span className="font-semibold text-slate-900">{c.fte.toLocaleString()} FTEs</span> ({c.pct}%)
                </span>
              </li>
            ))}
          </ul>
          <PanelFooterLink label="View Capacity Overview" onClick={() => setOpenDialog('capacity')} />
        </PanelCard>

        {/* Demand vs Capacity Trend */}
        <PanelCard title="Demand vs Capacity Trend">
          <ChartWrapper height={190} noCard noPadding>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND} margin={{ top: 8, right: 12, left: -8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="demand" name="Demand (FTEs)" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 2.5, fill: '#8b5cf6', strokeWidth: 0 }} isAnimationActive={false} />
                <Line type="monotone" dataKey="capacity" name="Capacity (FTEs)" stroke="#16b364" strokeWidth={2.5} dot={{ r: 2.5, fill: '#16b364', strokeWidth: 0 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <PanelFooterLink label="View Full Forecast" onClick={() => setOpenDialog('forecast')} />
        </PanelCard>
      </div>

      {/* Row 2: Portfolio bars · At-risk table · Recent intake */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Top Demand by Portfolio */}
        <PanelCard title="Top Demand by Portfolio" subtitle="(Next 90 Days)">
          <ChartWrapper height={190} noCard noPadding>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PORTFOLIO} layout="vertical" margin={{ top: 4, right: 40, left: 20, bottom: 4 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={110} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16} isAnimationActive={false}>
                  {PORTFOLIO.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <PanelFooterLink label="View Portfolio Demand" onClick={() => setActiveTab('portfolio')} />
        </PanelCard>

        {/* Upcoming At Risk Initiatives */}
        <PanelCard title="Upcoming At Risk Initiatives">
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-2xs uppercase tracking-wider text-slate-400">
                  <th className="pb-2 pr-2 font-medium">Initiative</th>
                  <th className="pb-2 pr-2 font-medium">Go Live</th>
                  <th className="pb-2 pr-2 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody>
                {AT_RISK.map((r) => (
                  <tr key={r.initiative} className="border-t border-slate-100">
                    <td className="py-2 pr-2">
                      <p className="font-medium text-slate-800">{r.initiative}</p>
                      <p className="text-2xs text-slate-400">{r.portfolio} · {r.reason}</p>
                    </td>
                    <td className="py-2 pr-2 text-slate-600 whitespace-nowrap">{r.goLive}</td>
                    <td className="py-2 pr-2">
                      <Badge variant={RISK_VARIANT[r.risk]} size="sm">{r.risk}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PanelFooterLink label="View All At Risk Initiatives" onClick={() => setActiveTab('portfolio')} />
        </PanelCard>

        {/* Recent Demand Intake */}
        <PanelCard title="Recent Demand Intake">
          <ul className="flex flex-col divide-y divide-slate-100">
            {INTAKE.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-2.5 first:pt-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 [&_svg]:h-4 [&_svg]:w-4">
                  {item.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{item.title}</p>
                  <p className="text-2xs text-slate-400">{item.portfolio} · New Intake</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Badge variant={INTAKE_VARIANT[item.status]} size="sm">{item.status}</Badge>
                  <span className="text-2xs text-slate-400">{item.time}</span>
                </div>
              </li>
            ))}
          </ul>
          <PanelFooterLink label="View Intake Queue" onClick={() => setActiveTab('intake')} />
        </PanelCard>
      </div>

      {/* Insight banner */}
      <div className="flex flex-col gap-3 rounded-xl border border-humana-green-200 bg-humana-green-50 p-4 sm:flex-row sm:items-center">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-humana-green-100 text-humana-green-600" aria-hidden="true">
          <Lightbulb className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-humana-green-900">Insight</p>
          <p className="text-sm text-humana-green-900/80">
            Demand is projected to exceed capacity by 236 FTEs in the next 90 days. Review at risk initiatives and take early action.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpenDialog('recommendations')}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-humana-green-700 hover:text-humana-green-800"
        >
          View Recommendations <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
        </TabsContent>

        {/* Demand Pipeline — All Demand, By Portfolio */}
        <TabsContent value="pipeline" className="flex flex-col gap-4">
          <PanelCard title="All Demand" subtitle="Pipeline stage breakdown (Next 90 Days)">
            <ul className="flex flex-col gap-2">
              {PIPELINE.map((d) => (
                <li key={d.name} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} aria-hidden="true" />
                    <span className="text-slate-600">{d.name}</span>
                  </span>
                  <span className="tabular-nums text-slate-500">
                    <span className="font-semibold text-slate-900">{d.value.toLocaleString()} FTEs</span> ({d.pct}%)
                  </span>
                </li>
              ))}
            </ul>
          </PanelCard>
          <PanelCard title="By Portfolio" subtitle="Pipeline stage FTEs broken out per portfolio">
            <DataTable
              columns={[
                { accessorKey: 'portfolio', header: 'Portfolio' },
                { accessorKey: 'discovery', header: 'Requirements / Discovery' },
                { accessorKey: 'scoping', header: 'Scoping' },
                { accessorKey: 'estimating', header: 'Estimating' },
                { accessorKey: 'approved', header: 'Approved / Funded' },
                { accessorKey: 'onHold', header: 'On Hold' },
                { accessorKey: 'total', header: 'Total FTEs' },
              ]}
              data={PIPELINE_BY_PORTFOLIO}
              enablePagination={false}
              searchPlaceholder="Search portfolios..."
            />
          </PanelCard>
        </TabsContent>

        {/* Demand Intake — New Intake, Intake Queue */}
        <TabsContent value="intake">
          <PanelCard title="Intake Queue" subtitle="All submitted demand intake requests">
            <DataTable
              columns={intakeColumns}
              data={INTAKE_QUEUE}
              enableExport
              pageSize={10}
              searchPlaceholder="Search intake requests..."
              exportFilename="demand-intake-queue"
            />
          </PanelCard>
        </TabsContent>

        {/* Demand Inventory — Backlog, Approved Demand */}
        <TabsContent value="inventory" className="flex flex-col gap-3">
          <Tabs value={inventorySubTab} onValueChange={setInventorySubTab}>
            <TabsList>
              <TabsTrigger value="backlog">Backlog</TabsTrigger>
              <TabsTrigger value="approved">Approved Demand</TabsTrigger>
            </TabsList>
            <TabsContent value="backlog">
              <DataTable columns={backlogColumns} data={BACKLOG} enableExport pageSize={10} searchPlaceholder="Search backlog..." exportFilename="demand-backlog" />
            </TabsContent>
            <TabsContent value="approved">
              <DataTable columns={approvedColumns} data={APPROVED_DEMAND} enableExport pageSize={10} searchPlaceholder="Search approved demand..." exportFilename="demand-approved" />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Portfolio Demand — Portfolio Roadmap, Initiative Forecast */}
        <TabsContent value="portfolio" className="flex flex-col gap-4">
          <PanelCard title="Top Demand by Portfolio" subtitle="(Next 90 Days)">
            <ChartWrapper height={220} noCard noPadding>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PORTFOLIO} layout="vertical" margin={{ top: 4, right: 40, left: 20, bottom: 4 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={140} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16} isAnimationActive={false}>
                    {PORTFOLIO.map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </PanelCard>
          <PanelCard title="Portfolio Roadmap" subtitle="Demand, commitment, and risk by portfolio">
            <DataTable
              columns={[
                { accessorKey: 'portfolio', header: 'Portfolio' },
                { accessorKey: 'totalDemand', header: 'Total Demand (FTEs)' },
                { accessorKey: 'committed', header: 'Committed (FTEs)' },
                { accessorKey: 'activeInitiatives', header: 'Active Initiatives' },
                {
                  id: 'atRisk',
                  header: 'At Risk Initiatives',
                  cell: ({ row }) => row.original.atRiskCount > 0
                    ? <Badge variant="error" size="sm">{row.original.atRiskCount}</Badge>
                    : <span className="text-slate-400">0</span>,
                },
              ]}
              data={PORTFOLIO_ROLLUP}
              enablePagination={false}
              searchPlaceholder="Search portfolios..."
            />
          </PanelCard>
        </TabsContent>

        {/* Approvals — Resource Requests, Fieldglass Requests */}
        <TabsContent value="approvals" className="flex flex-col gap-3">
          <Tabs value={approvalsSubTab} onValueChange={setApprovalsSubTab}>
            <TabsList>
              <TabsTrigger value="resource">Resource Requests</TabsTrigger>
              <TabsTrigger value="fieldglass">Fieldglass Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="resource">
              <DataTable columns={resourceReqColumns} data={resourceRequests} enableExport pageSize={10} searchPlaceholder="Search resource requests..." exportFilename="demand-resource-requests" />
            </TabsContent>
            <TabsContent value="fieldglass">
              <DataTable columns={fieldglassColumns} data={fieldglassRequests} enableExport pageSize={10} searchPlaceholder="Search Fieldglass requests..." exportFilename="demand-fieldglass-requests" />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Reports & Analytics — Demand Insights, Capacity Reports */}
        <TabsContent value="reports">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {DEMAND_REPORTS.map((report) => (
              <PanelCard key={report.id} title={report.title} subtitle={report.description}>
                <button
                  type="button"
                  onClick={() => handleReportExport(report)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <FileText className="h-4 w-4 text-slate-400" aria-hidden="true" /> Export CSV
                </button>
              </PanelCard>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Capacity Overview */}
      <Dialog open={openDialog === 'capacity'} onOpenChange={(o) => setOpenDialog(o ? 'capacity' : null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Capacity Overview</DialogTitle>
            <DialogDescription>Available, committed, and over-capacity FTEs by portfolio (Next 90 Days).</DialogDescription>
          </DialogHeader>
          <DataTable
            columns={[
              { accessorKey: 'portfolio', header: 'Portfolio' },
              { accessorKey: 'available', header: 'Available' },
              { accessorKey: 'committed', header: 'Committed' },
              { accessorKey: 'overCapacity', header: 'Over Capacity' },
              { accessorKey: 'total', header: 'Total FTEs' },
            ]}
            data={CAPACITY_BY_PORTFOLIO}
            enablePagination={false}
            enableFiltering={false}
            enableColumnVisibility={false}
          />
        </DialogContent>
      </Dialog>

      {/* View Full Forecast */}
      <Dialog open={openDialog === 'forecast'} onOpenChange={(o) => setOpenDialog(o ? 'forecast' : null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Demand vs Capacity — Full Forecast</DialogTitle>
            <DialogDescription>Month-by-month demand, capacity, and gap, including the forecast window.</DialogDescription>
          </DialogHeader>
          <DataTable
            columns={[
              { accessorKey: 'month', header: 'Month' },
              { accessorKey: 'demand', header: 'Demand (FTEs)' },
              { accessorKey: 'capacity', header: 'Capacity (FTEs)' },
              {
                id: 'gap',
                header: 'Gap',
                cell: ({ row }) => (
                  <span className={row.original.gap > 0 ? 'font-medium text-danger-600' : 'font-medium text-success-600'}>
                    {row.original.gap > 0 ? '+' : ''}{row.original.gap}
                  </span>
                ),
              },
              { id: 'type', header: 'Type', cell: ({ row }) => <Badge variant={row.original.type === 'Forecast' ? 'info' : 'neutral'} size="sm">{row.original.type}</Badge> },
            ]}
            data={FORECAST_TABLE}
            enablePagination={false}
            enableFiltering={false}
            enableColumnVisibility={false}
          />
        </DialogContent>
      </Dialog>

      {/* View Recommendations */}
      <Dialog open={openDialog === 'recommendations'} onOpenChange={(o) => setOpenDialog(o ? 'recommendations' : null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Capacity Recommendations</DialogTitle>
            <DialogDescription>AI-generated actions to close the projected 236 FTE demand shortage.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col divide-y divide-slate-100">
            {RECOMMENDATIONS.map((r) => (
              <div key={r.title} className="flex flex-col gap-1 py-3 first:pt-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-slate-900">{r.title}</p>
                  <Badge variant={RISK_VARIANT[r.impact]} size="sm" className="shrink-0">{r.impact}</Badge>
                </div>
                <p className="text-xs text-slate-500">{r.rationale}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

DemandManagementPage.displayName = 'DemandManagementPage';

export { DemandManagementPage };
export default DemandManagementPage;
