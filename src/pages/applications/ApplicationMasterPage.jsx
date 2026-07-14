import { useEffect, useState, useMemo, useCallback } from 'react';
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

const TABS = ['Applications', 'Application Map', 'Inventory Insights', 'Lifecycle', 'Quality Attributes'];

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
const TECH_COLOR = {
  Java: 'bg-orange-100 text-orange-800', '.NET': 'bg-violet-100 text-violet-800', React: 'bg-cyan-100 text-cyan-800',
  Angular: 'bg-red-100 text-red-800', AWS: 'bg-amber-100 text-amber-800', Azure: 'bg-blue-100 text-blue-800',
  SQL: 'bg-slate-200 text-slate-800', Node: 'bg-green-100 text-green-800', Python: 'bg-blue-100 text-blue-800', BI: 'bg-emerald-100 text-emerald-800',
};
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

  const [apps, setApps] = useState(buildApplications);
  const [activeTab, setActiveTab] = useState('Applications');
  const [search, setSearch] = useState('');
  const [fCapability, setFCapability] = useState('');
  const [fStage, setFStage] = useState('');
  const [fCrit, setFCrit] = useState('');
  const [fScore, setFScore] = useState('');
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' });
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
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
  }, [apps, search, fCapability, fStage, fCrit, scoreMatch, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, fCapability, fStage, fCrit, fScore]);

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
            <Button variant="outline" size="sm" iconLeft={<SlidersHorizontal className="h-3.5 w-3.5" />} onClick={() => toast({ title: 'More Filters', description: 'Advanced filters are a demo in this frontend-only build.' })}>More Filters</Button>
            <Button variant="outline" size="sm" iconLeft={<Download className="h-3.5 w-3.5" />} onClick={handleExport}>Export</Button>
            <Button variant="primary" size="sm" iconLeft={<Plus className="h-3.5 w-3.5" />} onClick={() => setAddOpen(true)}>Add Application</Button>
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
                      onClick={() => toast({ title: app.name, description: `${app.id} · ${app.capability} · Owner ${app.owner}` })}
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
                            <span key={t} className={cn('rounded px-1.5 py-0.5 text-2xs font-medium', TECH_COLOR[t] || 'bg-slate-100 text-slate-700')}>{t}</span>
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
                        <button type="button" onClick={(e) => { e.stopPropagation(); toast({ title: app.name, description: 'Row actions are a demo in this frontend-only build.' }); }} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label={`Actions for ${app.name}`}>
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
