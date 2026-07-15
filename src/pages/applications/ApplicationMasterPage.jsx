import { useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Boxes,
  Workflow,
  Layers,
  Server,
  Users,
  Search,
  SlidersHorizontal,
  Download,
  Plus,
  ArrowRight,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { cn, downloadCSV } from '@/lib/utils';
import { useNavigation } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { KpiCard } from '@/components/shared/KpiCard';
import { IntegrationLogo } from '@/components/shared/IntegrationLogo';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import { ROUTES } from '@/lib/constants';

/* Mock data mirrors Docs/mocks/03-application-master.png (frontend-only). */

const KPIS = [
  { id: 'apps', label: 'Total Applications', value: 428, changeText: '12 this month', trend: 'improving', icon: <Boxes />, tone: 'blue' },
  { id: 'integrations', label: 'Active Integrations', value: 1256, changeText: '38 this month', trend: 'improving', icon: <Workflow />, tone: 'green' },
  { id: 'tech', label: 'Technologies', value: 186, changeText: '5 this month', trend: 'improving', icon: <Layers />, tone: 'purple' },
  { id: 'envs', label: 'Environments', value: 64, changeText: '2 this month', trend: 'improving', icon: <Server />, tone: 'slate' },
  { id: 'owners', label: 'Application Owners', value: 142, changeText: 'No change', trend: 'stable', icon: <Users />, tone: 'orange' },
];

const TABS = ['Applications', 'Application Map', 'Inventory Insights', 'Lifecycle', 'Quality Attributes', 'APIs & Services', 'Technologies & Frameworks', 'Dependencies', 'Ownership & Contacts'];

/** Maps the sidebar's hash-based sub-nav links (Application Master §6.4) to a tab label. */
const HASH_TAB_MAP = {
  '#apis': 'APIs & Services',
  '#tech': 'Technologies & Frameworks',
  '#dependencies': 'Dependencies',
  '#ownership': 'Ownership & Contacts',
};

/** Mock API catalog for the "APIs & Services" sub-nav tab. */
const API_CATALOG = [
  { name: '/members/{id}/eligibility', method: 'GET', app: 'Member Portal', status: 'Healthy' },
  { name: '/claims/submit', method: 'POST', app: 'Claims Platform', status: 'Healthy' },
  { name: '/providers/search', method: 'GET', app: 'Provider Portal', status: 'Degraded' },
  { name: '/enrollment/plans', method: 'GET', app: 'Enrollment System', status: 'Healthy' },
  { name: '/billing/invoices', method: 'GET', app: 'Billing Platform', status: 'Healthy' },
  { name: '/pharmacy/formulary', method: 'GET', app: 'Pharmacy Portal', status: 'Healthy' },
  { name: '/reports/generate', method: 'POST', app: 'Reporting Platform', status: 'Healthy' },
  { name: '/care/gaps', method: 'GET', app: 'Care Management', status: 'Degraded' },
  { name: '/auth/token', method: 'POST', app: 'Auth Service', status: 'Healthy' },
  { name: '/notifications/send', method: 'POST', app: 'Notification Hub', status: 'Healthy' },
];

/** Mock upstream dependency graph for the "Dependencies" sub-nav tab. */
const DEPENDENCY_MAP = {
  'Member Portal': ['Auth Service', 'Notification Hub'],
  'Claims Platform': ['Provider Portal', 'Payment Gateway'],
  'Provider Portal': ['Auth Service', 'Provider Directory'],
  'Enrollment System': ['Eligibility API', 'Auth Service'],
  'Billing Platform': ['Payment Gateway', 'Claims Platform'],
  'Pharmacy Portal': ['Formulary Service', 'Member Portal'],
  'Reporting Platform': ['Data Lake Sync'],
  'Care Management': ['Care Gaps Engine', 'Member Portal'],
};

const API_STATUS_VARIANT = { Healthy: 'success', Degraded: 'warning' };

/** The exact rows shown in the mock, followed by generated rows so filtering
 *  and pagination have realistic volume. */
const SEED = [
  { code: 'MP', name: 'Member Portal', id: 'APP-00123', capability: 'Member Engagement', owner: 'Sarah Johnson', stage: 'Production', criticality: 'High', score: 92, tech: ['Java', 'React', 'AWS'], extra: 3, envs: 6, updated: 'May 28, 2026', ago: '2h ago' },
  { code: 'CP', name: 'Claims Platform', id: 'APP-00234', capability: 'Claims Management', owner: 'David Lee', stage: 'Production', criticality: 'High', score: 88, tech: ['.NET', 'SQL', 'Azure'], extra: 2, envs: 5, updated: 'May 27, 2026', ago: '1d ago' },
  { code: 'PR', name: 'Provider Portal', id: 'APP-00345', capability: 'Provider Management', owner: 'Maria Garcia', stage: 'Production', criticality: 'High', score: 76, tech: ['Java', 'Angular', 'AWS'], extra: 2, envs: 6, updated: 'May 26, 2026', ago: '2d ago' },
  { code: 'ES', name: 'Enrollment System', id: 'APP-00456', capability: 'Enrollment', owner: 'James Wilson', stage: 'Production', criticality: 'Medium', score: 74, tech: ['.NET', 'Azure', 'SQL'], extra: 1, envs: 4, updated: 'May 25, 2026', ago: '2d ago' },
  { code: 'BP', name: 'Billing Platform', id: 'APP-00567', capability: 'Billing & Payments', owner: 'Priya Patel', stage: 'Production', criticality: 'Medium', score: 65, tech: ['Java', 'SQL', 'AWS'], extra: 2, envs: 5, updated: 'May 24, 2026', ago: '3d ago' },
  { code: 'PH', name: 'Pharmacy Portal', id: 'APP-00678', capability: 'Pharmacy Management', owner: 'Andrew Kim', stage: 'Production', criticality: 'Medium', score: 91, tech: ['React', 'Node', 'AWS'], extra: 2, envs: 4, updated: 'May 23, 2026', ago: '3d ago' },
  { code: 'RP', name: 'Reporting Platform', id: 'APP-00789', capability: 'Analytics & Reporting', owner: 'Lisa Thompson', stage: 'Production', criticality: 'Low', score: 82, tech: ['Python', 'BI', 'Azure'], extra: 1, envs: 3, updated: 'May 22, 2026', ago: '4d ago' },
  { code: 'CM', name: 'Care Management', id: 'APP-00890', capability: 'Care Management', owner: 'Robert Brown', stage: 'UAT', criticality: 'Medium', score: 68, tech: ['.NET', 'Azure', 'SQL'], extra: 1, envs: 3, updated: 'May 21, 2026', ago: '5d ago' },
];

const CAPABILITIES = ['Member Engagement', 'Claims Management', 'Provider Management', 'Enrollment', 'Billing & Payments', 'Pharmacy Management', 'Analytics & Reporting', 'Care Management'];
const OWNERS = ['Sarah Johnson', 'David Lee', 'Maria Garcia', 'James Wilson', 'Priya Patel', 'Andrew Kim', 'Lisa Thompson', 'Robert Brown', 'Nina Alvarez', 'Tom Becker'];
const STAGES = ['Production', 'UAT', 'Dev'];
const CRITS = ['High', 'Medium', 'Low'];
const TECHS = ['Java', '.NET', 'React', 'Angular', 'AWS', 'Azure', 'SQL', 'Node', 'Python', 'BI'];
const NAMES = ['Auth Service', 'Notification Hub', 'Document Store', 'Rewards Engine', 'Appointment Scheduler', 'Eligibility API', 'Formulary Service', 'Claims Router', 'Member Search', 'Payment Gateway', 'Consent Manager', 'Care Gaps Engine', 'Fraud Detection', 'Data Lake Sync', 'Identity Broker', 'Wellness Portal', 'Provider Directory', 'Benefits Calculator', 'Audit Ledger', 'Message Queue'];

/** Builds the full application list — the mock seed plus deterministic extras. */
function buildApplications() {
  const list = [...SEED];
  for (let i = 0; i < NAMES.length; i += 1) {
    const name = NAMES[i];
    const words = name.split(' ');
    const code = (words[0][0] + (words[1] ? words[1][0] : words[0][1])).toUpperCase();
    const score = 55 + ((i * 17) % 45);
    const t0 = TECHS[i % TECHS.length];
    const t1 = TECHS[(i + 3) % TECHS.length];
    const t2 = TECHS[(i + 6) % TECHS.length];
    list.push({
      code,
      name,
      id: `APP-0${1001 + i}`,
      capability: CAPABILITIES[i % CAPABILITIES.length],
      owner: OWNERS[i % OWNERS.length],
      stage: STAGES[i % STAGES.length],
      criticality: CRITS[i % CRITS.length],
      score,
      tech: [t0, t1, t2],
      extra: i % 3,
      envs: 2 + (i % 5),
      updated: 'May 20, 2026',
      ago: `${(i % 9) + 1}d ago`,
    });
  }
  return list;
}

const CRIT_DOT = { High: 'bg-danger-500', Medium: 'bg-warning-500', Low: 'bg-success-500' };
const STAGE_VARIANT = { Production: 'success', UAT: 'info', Dev: 'neutral' };
const PAGE_SIZE = 10;

/**
 * Circular quality-score badge — a colored ring around the numeric score.
 *
 * @param {object} props
 * @param {number} props.score - Quality score (0-100)
 * @returns {React.ReactElement}
 */
function ScoreRing({ score }) {
  const color = score >= 85 ? '#16b364' : score >= 70 ? '#f59e0b' : '#ef4444';
  const r = 16;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <span className="relative inline-flex h-10 w-10 items-center justify-center">
      <svg className="h-10 w-10 -rotate-90" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r={r} fill="none" stroke="#e2e8f0" strokeWidth="3" />
        <circle cx="20" cy="20" r={r} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <span className="absolute text-xs font-semibold text-slate-800">{score}</span>
    </span>
  );
}

/**
 * Sortable column header button.
 *
 * @param {object} props
 * @param {string} props.label - Column label
 * @param {string} props.field - Sort key
 * @param {{key:string,dir:string}} props.sort - Current sort state
 * @param {function(string):void} props.onSort - Sort toggle handler
 * @param {string} [props.align] - Text alignment
 * @returns {React.ReactElement}
 */
function SortHeader({ label, field, sort, onSort, align = 'left' }) {
  const active = sort.key === field;
  return (
    <th className={cn('px-4 py-2.5 font-medium', align === 'center' && 'text-center')}>
      <button type="button" onClick={() => onSort(field)} className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-slate-700">
        {label}
        {active ? (
          sort.dir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
        ) : (
          <ChevronsUpDown className="h-3 w-3 text-slate-300" />
        )}
      </button>
    </th>
  );
}

/** Deterministic mock release history for the Application Detail dialog (PRD §6.5). */
function getReleaseHistory(app) {
  return [
    { version: `${app.code}-R3`, date: app.updated, status: app.score >= 85 ? 'Passed' : app.score >= 70 ? 'Passed with Risk' : 'Failed' },
    { version: `${app.code}-R2`, date: 'Apr 12, 2026', status: 'Passed' },
    { version: `${app.code}-R1`, date: 'Feb 3, 2026', status: 'Passed' },
  ];
}

const RELEASE_STATUS_VARIANT = { Passed: 'success', 'Passed with Risk': 'warning', Failed: 'error' };

/** Deterministic mock AI recommendation for the Application Detail dialog (PRD §6.5 "AI Recommendations"). */
function getAiRecommendation(app) {
  if (app.score >= 90) return `${app.name} is performing well against its quality gates. No immediate action needed.`;
  if (app.score >= 70) return `Consider increasing automation coverage for ${app.name} to reduce regression risk ahead of the next release.`;
  return `${app.name} is below the quality threshold — recommend a focused remediation sprint before the next release.`;
}

/**
 * Application Detail dialog — the PRD §6.5 "Application Detail Screen" fields
 * (summary, ownership, segment alignment, quality score, release history, and
 * an AI recommendation) rendered over the selected application's mock data.
 *
 * @param {object} props
 * @param {object|null} props.app - The selected application, or null when closed
 * @param {function(boolean): void} props.onOpenChange - Dialog open-state change handler
 * @returns {React.ReactElement}
 */
function ApplicationDetailDialog({ app, onOpenChange }) {
  return (
    <Dialog open={Boolean(app)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        {app ? (
          <>
            <DialogHeader>
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-humana-green-50 text-sm font-semibold text-humana-green-700">{app.code}</span>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="pr-8">{app.name}</DialogTitle>
                  <DialogDescription className="mt-1">{app.id} · {app.capability}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant={STAGE_VARIANT[app.stage]} size="md">{app.stage}</Badge>
              <Badge variant="outline" size="md">
                <span className={cn('mr-1.5 h-2 w-2 rounded-full', CRIT_DOT[app.criticality])} aria-hidden="true" />
                {app.criticality} Criticality
              </Badge>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center rounded-lg border border-slate-200 p-3">
                <ScoreRing score={app.score} />
                <span className="mt-1.5 text-2xs font-medium text-slate-500">Quality Score</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 p-3">
                <span className="text-lg font-semibold text-slate-900">{app.envs}</span>
                <span className="text-2xs font-medium text-slate-500">Environments</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 p-3">
                <Avatar name={app.owner} size="sm" />
                <span className="mt-1 max-w-full truncate text-2xs font-medium text-slate-500">{app.owner}</span>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">Technologies</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {app.tech.map((t) => <Badge key={t} variant="outline" size="sm">{t}</Badge>)}
              </div>
            </div>

            <div className="mt-4">
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">Release History</span>
              <div className="mt-1.5 flex flex-col divide-y divide-slate-100 rounded-lg border border-slate-200">
                {getReleaseHistory(app).map((r) => (
                  <div key={r.version} className="flex items-center justify-between px-3 py-2 text-sm">
                    <span className="font-medium text-slate-800">{r.version}</span>
                    <span className="text-slate-500">{r.date}</span>
                    <Badge variant={RELEASE_STATUS_VARIANT[r.status]} size="sm">{r.status}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-humana-green-200 bg-humana-green-50 p-3">
              <span className="text-2xs font-semibold uppercase tracking-wider text-humana-green-700">AI Recommendation</span>
              <p className="mt-1 text-sm text-humana-green-900">{getAiRecommendation(app)}</p>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

ApplicationDetailDialog.propTypes = {
  app: PropTypes.object,
  onOpenChange: PropTypes.func.isRequired,
};

/**
 * Application Master — single source of truth for applications. Interactive
 * grid (search, filter, sort, paginate, export, add) over mock data. Matches
 * Docs/mocks/03-application-master.png.
 *
 * @returns {React.ReactElement}
 */
function ApplicationMasterPage() {
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();
  const location = useLocation();

  const [apps, setApps] = useState(buildApplications);
  const [activeTab, setActiveTab] = useState(() => HASH_TAB_MAP[location.hash] || 'Applications');

  useEffect(() => {
    setActiveTab(HASH_TAB_MAP[location.hash] || 'Applications');
  }, [location.hash]);
  const [search, setSearch] = useState('');
  const [fCapability, setFCapability] = useState('');
  const [fStage, setFStage] = useState('');
  const [fCrit, setFCrit] = useState('');
  const [fScore, setFScore] = useState('');
  const [fOwner, setFOwner] = useState('');
  const [fTech, setFTech] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' });
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [detailApp, setDetailApp] = useState(null);
  const [form, setForm] = useState({ name: '', capability: CAPABILITIES[0], owner: OWNERS[0], stage: 'Production', criticality: 'Medium' });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Application Master' },
    ]);
  }, [setBreadcrumbs]);

  const scoreMatch = useCallback((score) => {
    if (fScore === '90+') return score >= 90;
    if (fScore === '70-89') return score >= 70 && score < 90;
    if (fScore === 'Below 70') return score < 70;
    return true;
  }, [fScore]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = apps.filter((a) => {
      if (q && !`${a.name} ${a.id} ${a.owner} ${a.capability}`.toLowerCase().includes(q)) return false;
      if (fCapability && a.capability !== fCapability) return false;
      if (fStage && a.stage !== fStage) return false;
      if (fCrit && a.criticality !== fCrit) return false;
      if (fOwner && a.owner !== fOwner) return false;
      if (fTech && !a.tech.includes(fTech)) return false;
      if (!scoreMatch(a.score)) return false;
      return true;
    });
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (typeof av === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [apps, search, fCapability, fStage, fCrit, fOwner, fTech, scoreMatch, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, fCapability, fStage, fCrit, fScore, fOwner, fTech]);

  const handleSort = useCallback((key) => {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  }, []);

  const handleExport = useCallback(() => {
    const rows = filtered.map((a) => ({
      Application: a.name, ID: a.id, Capability: a.capability, Owner: a.owner,
      Lifecycle: a.stage, Criticality: a.criticality, QualityScore: a.score,
      Technologies: a.tech.join('|'), Environments: a.envs, LastUpdated: a.updated,
    }));
    downloadCSV(rows, 'applications.csv');
    toast({ variant: 'success', title: 'Export complete', description: `${rows.length} applications exported to CSV.` });
  }, [filtered, toast]);

  const handleAdd = useCallback(() => {
    if (!form.name.trim()) return;
    const words = form.name.trim().split(' ');
    const code = (words[0][0] + (words[1] ? words[1][0] : (words[0][1] || 'X'))).toUpperCase();
    const next = {
      code, name: form.name.trim(), id: `APP-0${2000 + apps.length}`,
      capability: form.capability, owner: form.owner, stage: form.stage, criticality: form.criticality,
      score: 80, tech: ['Java', 'AWS'], extra: 0, envs: 1, updated: 'Jul 14, 2026', ago: 'just now',
    };
    setApps((prev) => [next, ...prev]);
    setAddOpen(false);
    setForm({ name: '', capability: CAPABILITIES[0], owner: OWNERS[0], stage: 'Production', criticality: 'Medium' });
    toast({ variant: 'success', title: 'Application added', description: `"${next.name}" was added to the inventory.` });
  }, [form, apps.length, toast]);

  const total = apps.length;
  const insights = useMemo(() => {
    const high = apps.filter((a) => a.criticality === 'High').length;
    const prod = apps.filter((a) => a.stage === 'Production').length;
    const below = apps.filter((a) => a.score < 70).length;
    const pct = (n) => `${Math.round((n / total) * 100)}%`;
    return [
      { label: 'High Criticality', value: high, pct: pct(high) },
      { label: 'In Production', value: prod, pct: pct(prod) },
      { label: 'Below Quality Score 70', value: below, pct: pct(below) },
      { label: 'Orphaned Applications', value: 7, pct: pct(7) },
    ];
  }, [apps, total]);

  const capabilityOptions = useMemo(() => [{ value: '', label: 'All' }, ...CAPABILITIES.map((c) => ({ value: c, label: c }))], []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Application Master</h1>
        <p className="text-sm text-slate-500">Single source of truth for all applications and related quality information.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {KPIS.map((k) => (
          <KpiCard key={k.id} label={k.label} value={k.value} unit="count" trend={k.trend} changeText={k.changeText} icon={k.icon} tone={k.tone} />
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex gap-6 overflow-x-auto" aria-label="Application views">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors',
                activeTab === tab ? 'border-humana-green-500 text-navy-900' : 'border-transparent text-slate-500 hover:text-slate-800'
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'Applications' ? (
        <>
          {/* Filter row */}
          <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <label className="flex flex-1 flex-col gap-1 min-w-[180px]">
              <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">Search</span>
              <span className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search applications..."
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-sm text-slate-700 focus:border-humana-green-500 focus:outline-none focus:ring-2 focus:ring-humana-green-500/40"
                />
              </span>
            </label>
            <FilterField label="Business Capability" value={fCapability} onChange={setFCapability} options={capabilityOptions} />
            <FilterField label="Lifecycle Stage" value={fStage} onChange={setFStage} options={[{ value: '', label: 'All' }, ...STAGES.map((s) => ({ value: s, label: s }))]} />
            <FilterField label="Criticality" value={fCrit} onChange={setFCrit} options={[{ value: '', label: 'All' }, ...CRITS.map((s) => ({ value: s, label: s }))]} />
            <FilterField label="Quality Score" value={fScore} onChange={setFScore} options={[{ value: '', label: 'All' }, { value: '90+', label: '90+' }, { value: '70-89', label: '70-89' }, { value: 'Below 70', label: 'Below 70' }]} />
            <Button variant="outline" size="sm" iconLeft={<SlidersHorizontal className="h-3.5 w-3.5" />} onClick={() => setShowMoreFilters((s) => !s)}>More Filters</Button>
            <Button variant="outline" size="sm" iconLeft={<Download className="h-3.5 w-3.5" />} onClick={handleExport}>Export</Button>
            <Button variant="primary" size="sm" iconLeft={<Plus className="h-3.5 w-3.5" />} onClick={() => setAddOpen(true)}>Add Application</Button>
            {showMoreFilters ? (
              <div className="flex w-full flex-wrap items-end gap-3 border-t border-slate-100 pt-3">
                <FilterField label="Owner" value={fOwner} onChange={setFOwner} options={[{ value: '', label: 'All' }, ...OWNERS.map((o) => ({ value: o, label: o }))]} />
                <FilterField label="Technology" value={fTech} onChange={setFTech} options={[{ value: '', label: 'All' }, ...TECHS.map((t) => ({ value: t, label: t }))]} />
                {(fOwner || fTech) ? (
                  <button type="button" onClick={() => { setFOwner(''); setFTech(''); }} className="mb-0.5 text-xs font-medium text-slate-500 hover:text-slate-700">
                    Clear
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Applications grid */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
            <div className="flex items-center justify-between gap-2 px-4 py-2.5 text-xs text-slate-500">
              <span>{filtered.length} application{filtered.length === 1 ? '' : 's'}</span>
              <div className="flex items-center gap-2">
                <span>
                  {filtered.length === 0 ? '0' : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="rounded-md p-1 hover:bg-slate-100 disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
                <span className="rounded-md bg-humana-green-50 px-2 py-0.5 font-medium text-humana-green-700">{safePage}</span>
                <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="rounded-md p-1 hover:bg-slate-100 disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-y border-slate-200 bg-slate-50 text-2xs text-slate-500">
                    <SortHeader label="Application" field="name" sort={sort} onSort={handleSort} />
                    <SortHeader label="Business Capability" field="capability" sort={sort} onSort={handleSort} />
                    <SortHeader label="Owner" field="owner" sort={sort} onSort={handleSort} />
                    <SortHeader label="Lifecycle" field="stage" sort={sort} onSort={handleSort} />
                    <SortHeader label="Criticality" field="criticality" sort={sort} onSort={handleSort} />
                    <SortHeader label="Quality" field="score" sort={sort} onSort={handleSort} align="center" />
                    <th className="px-4 py-2.5 font-medium uppercase tracking-wider">Technologies</th>
                    <SortHeader label="Envs" field="envs" sort={sort} onSort={handleSort} align="center" />
                    <th className="px-4 py-2.5 font-medium uppercase tracking-wider">Last Updated</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((app) => (
                    <tr
                      key={app.id}
                      className="cursor-pointer border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
                      onClick={() => setDetailApp(app)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-humana-green-50 text-xs font-semibold text-humana-green-700">{app.code}</span>
                          <div>
                            <p className="font-medium text-slate-800">{app.name}</p>
                            <p className="text-2xs text-slate-400">{app.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{app.capability}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={app.owner} size="sm" />
                          <span className="text-slate-700">{app.owner}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge variant={STAGE_VARIANT[app.stage]} size="sm">{app.stage}</Badge></td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-slate-700">
                          <span className={cn('h-2 w-2 rounded-full', CRIT_DOT[app.criticality])} aria-hidden="true" />
                          {app.criticality}
                        </span>
                      </td>
                      <td className="px-4 py-3"><div className="flex justify-center"><ScoreRing score={app.score} /></div></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {app.tech.map((t) => (
                            <span key={t} title={t} className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-slate-100 bg-slate-50">
                              <IntegrationLogo name={t} size="xs" />
                            </span>
                          ))}
                          {app.extra ? <span className="text-2xs text-slate-400">+{app.extra}</span> : null}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-700">{app.envs}</td>
                      <td className="px-4 py-3">
                        <p className="text-slate-700">{app.updated}</p>
                        <p className="text-2xs text-slate-400">{app.ago}</p>
                      </td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={(e) => { e.stopPropagation(); setDetailApp(app); }} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label={`View details for ${app.name}`}>
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pageRows.length === 0 ? (
                    <tr><td colSpan={10} className="px-4 py-10 text-center text-sm text-slate-400">No applications match your filters.</td></tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <TabSummary tab={activeTab} apps={apps} />
      )}

      {/* Inventory insights strip */}
      <div className="flex flex-wrap items-center gap-x-10 gap-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="mr-auto">
          <h3 className="text-base font-semibold text-slate-900">Application Inventory Insights</h3>
          <p className="text-sm text-slate-500">Your application portfolio health at a glance.</p>
        </div>
        {insights.map((it) => (
          <div key={it.label} className="flex flex-col">
            <span className="text-2xs uppercase tracking-wider text-slate-400">{it.label}</span>
            <span className="mt-1 text-lg font-semibold text-slate-900">
              {it.value} <span className="text-xs font-normal text-slate-400">({it.pct})</span>
            </span>
          </div>
        ))}
        <button type="button" onClick={() => setActiveTab('Inventory Insights')} className="inline-flex items-center gap-1.5 text-sm font-medium text-humana-green-600 hover:text-humana-green-700">
          View Inventory Insights <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Add Application dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Application</DialogTitle>
            <DialogDescription>Register a new application in the inventory.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4">
            <Input label="Application Name" placeholder="e.g. Member Rewards" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            <Select label="Business Capability" options={CAPABILITIES.map((c) => ({ value: c, label: c }))} value={form.capability} onValueChange={(v) => setForm((f) => ({ ...f, capability: v }))} />
            <Select label="Owner" options={OWNERS.map((o) => ({ value: o, label: o }))} value={form.owner} onValueChange={(v) => setForm((f) => ({ ...f, owner: v }))} />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Lifecycle Stage" options={STAGES.map((s) => ({ value: s, label: s }))} value={form.stage} onValueChange={(v) => setForm((f) => ({ ...f, stage: v }))} />
              <Select label="Criticality" options={CRITS.map((s) => ({ value: s, label: s }))} value={form.criticality} onValueChange={(v) => setForm((f) => ({ ...f, criticality: v }))} />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" size="md" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button variant="primary" size="md" onClick={handleAdd} disabled={!form.name.trim()}>Add Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Application Detail dialog */}
      <ApplicationDetailDialog app={detailApp} onOpenChange={(open) => { if (!open) setDetailApp(null); }} />
    </div>
  );
}

/**
 * Styled filter select for the applications toolbar.
 *
 * @param {object} props
 * @param {string} props.label - Field label
 * @param {string} props.value - Selected value
 * @param {function(string):void} props.onChange - Change handler
 * @param {{value:string,label:string}[]} props.options - Options
 * @returns {React.ReactElement}
 */
function FilterField({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700 focus:border-humana-green-500 focus:outline-none focus:ring-2 focus:ring-humana-green-500/40"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

/**
 * Real content for the non-Applications tabs — derived breakdowns over the
 * same mock data, so every tab shows something meaningful.
 *
 * @param {object} props
 * @param {string} props.tab - Active tab label
 * @param {object[]} props.apps - Application list
 * @returns {React.ReactElement}
 */
function TabSummary({ tab, apps }) {
  const groupBy = (key) => {
    const m = {};
    for (const a of apps) m[a[key]] = (m[a[key]] || 0) + 1;
    return Object.entries(m).sort((x, y) => y[1] - x[1]);
  };

  if (tab === 'Lifecycle') {
    return <BreakdownGrid title="Applications by Lifecycle Stage" rows={groupBy('stage')} total={apps.length} />;
  }
  if (tab === 'Quality Attributes') {
    const bands = [
      ['Excellent (90+)', apps.filter((a) => a.score >= 90).length],
      ['Good (70–89)', apps.filter((a) => a.score >= 70 && a.score < 90).length],
      ['Needs Attention (<70)', apps.filter((a) => a.score < 70).length],
    ];
    return <BreakdownGrid title="Applications by Quality Score" rows={bands} total={apps.length} />;
  }
  if (tab === 'Inventory Insights') {
    return <BreakdownGrid title="Applications by Business Capability" rows={groupBy('capability')} total={apps.length} />;
  }
  if (tab === 'Technologies & Frameworks') {
    const counts = {};
    for (const a of apps) {
      for (const t of a.tech) counts[t] = (counts[t] || 0) + 1;
    }
    const rows = Object.entries(counts).sort((x, y) => y[1] - x[1]);
    return <BreakdownGrid title="Applications by Technology" rows={rows} total={apps.length} />;
  }
  if (tab === 'Ownership & Contacts') {
    const byOwner = {};
    for (const a of apps) {
      if (!byOwner[a.owner]) byOwner[a.owner] = [];
      byOwner[a.owner].push(a.name);
    }
    const rows = Object.entries(byOwner).sort((x, y) => y[1].length - x[1].length);
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">Ownership &amp; Contacts</h3>
          <p className="text-sm text-slate-500">Application owners and the applications assigned to each.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-2xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-2.5 font-medium">Owner</th>
                <th className="px-5 py-2.5 font-medium">Email</th>
                <th className="px-5 py-2.5 font-medium">Applications Owned</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([owner, appNames]) => (
                <tr key={owner} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={owner} size="sm" />
                      <span className="font-medium text-slate-800">{owner}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{owner.toLowerCase().replace(/[^a-z]+/g, '.')}@humana.com</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {appNames.map((n) => <Badge key={n} variant="outline" size="sm">{n}</Badge>)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  if (tab === 'APIs & Services') {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">APIs &amp; Services</h3>
          <p className="text-sm text-slate-500">Registered API endpoints across the application portfolio.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-2xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-2.5 font-medium">Endpoint</th>
                <th className="px-5 py-2.5 font-medium">Method</th>
                <th className="px-5 py-2.5 font-medium">Owning Application</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {API_CATALOG.map((api) => (
                <tr key={api.name} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-5 py-3 font-mono text-xs text-slate-700">{api.name}</td>
                  <td className="px-5 py-3"><Badge variant="neutral" size="sm">{api.method}</Badge></td>
                  <td className="px-5 py-3 text-slate-600">{api.app}</td>
                  <td className="px-5 py-3"><Badge variant={API_STATUS_VARIANT[api.status]} size="sm">{api.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  if (tab === 'Dependencies') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
        <h3 className="text-base font-semibold text-slate-900">Application Dependencies</h3>
        <p className="text-sm text-slate-500">Upstream services each application relies on.</p>
        <div className="mt-4 flex flex-col divide-y divide-slate-100">
          {Object.entries(DEPENDENCY_MAP).map(([app, deps]) => (
            <div key={app} className="flex flex-wrap items-center gap-3 py-3 first:pt-0">
              <span className="w-44 shrink-0 font-medium text-slate-800">{app}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden="true" />
              <div className="flex flex-wrap gap-1.5">
                {deps.map((d) => <Badge key={d} variant="info" size="sm">{d}</Badge>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  // Application Map
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-card">
      <Workflow className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
      <h3 className="mt-3 text-base font-semibold text-slate-900">Application Map</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        Interactive dependency map across {apps.length} applications and their integrations. Select the Applications tab to browse the inventory.
      </p>
    </div>
  );
}

/**
 * A simple horizontal-bar breakdown card used by the tab summaries.
 *
 * @param {object} props
 * @param {string} props.title - Card title
 * @param {[string,number][]} props.rows - [label, count] pairs
 * @param {number} props.total - Total for percentage
 * @returns {React.ReactElement}
 */
function BreakdownGrid({ title, rows, total }) {
  const max = Math.max(...rows.map(([, n]) => n), 1);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 flex flex-col gap-3">
        {rows.map(([label, n]) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-56 shrink-0 truncate text-sm text-slate-600">{label}</span>
            <div className="h-2.5 flex-1 rounded-full bg-slate-100">
              <div className="h-2.5 rounded-full bg-humana-green-500" style={{ width: `${(n / max) * 100}%` }} />
            </div>
            <span className="w-24 shrink-0 text-right text-sm text-slate-500">
              <span className="font-semibold text-slate-900">{n}</span> ({Math.round((n / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

ApplicationMasterPage.displayName = 'ApplicationMasterPage';

export { ApplicationMasterPage };
export default ApplicationMasterPage;
