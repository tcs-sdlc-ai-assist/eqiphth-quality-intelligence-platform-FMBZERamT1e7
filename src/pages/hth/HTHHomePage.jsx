import { useEffect, useState, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import {
  PlayCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Bug,
  Gauge,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/lib/constants';

/* Mock data mirrors Docs/mocks/04-hth-home.png (frontend-only). */

const spark = (vals) => vals.map((value, i) => ({ month: `w${i}`, value }));

const KPIS = [
  { id: 'exec', label: 'Total Executions', value: 42318, unit: 'count', changePercent: 18, changeLabel: 'vs prev 7 days', trend: 'improving', tone: 'green', icon: <PlayCircle />, spark: spark([30, 33, 31, 36, 34, 39, 42]) },
  { id: 'pass', label: 'Pass Rate', value: '87.6%', changePercent: 5.4, changeLabel: 'vs prev 7 days', trend: 'improving', tone: 'purple', icon: <CheckCircle2 />, spark: spark([80, 82, 81, 84, 85, 86, 88]) },
  { id: 'fail', label: 'Failure Rate', value: '12.4%', changePercent: -5.4, changeLabel: 'vs prev 7 days', trend: 'declining', tone: 'red', icon: <XCircle />, spark: spark([18, 17, 16, 15, 14, 13, 12]) },
  { id: 'time', label: 'Avg Exec Time', value: '1h 24m', changePercent: -12, changeLabel: 'vs prev 7 days', trend: 'declining', tone: 'blue', icon: <Clock />, spark: spark([100, 96, 98, 92, 90, 88, 84]) },
  { id: 'defects', label: 'Defects Found', value: 1248, unit: 'count', changePercent: -8, changeLabel: 'vs prev 7 days', trend: 'declining', tone: 'cyan', icon: <Bug />, spark: spark([1400, 1360, 1330, 1300, 1290, 1270, 1248]) },
  { id: 'cov', label: 'Test Coverage', value: '78.3%', changePercent: 6.7, changeLabel: 'vs prev 7 days', trend: 'improving', tone: 'orange', icon: <Gauge />, spark: spark([72, 73, 74, 75, 76, 77, 78]) },
];

const EXEC_OVERVIEW = [
  { name: 'Passed', value: 27845, pct: '65.8%', color: '#16b364' },
  { name: 'Failed', value: 5258, pct: '12.4%', color: '#ef4444' },
  { name: 'Blocked', value: 3102, pct: '7.3%', color: '#f59e0b' },
  { name: 'Not Executed', value: 6113, pct: '14.5%', color: '#cbd5e1' },
];

const TESTING_TYPES = [
  { name: 'Functional', pct: 36.2, count: '21,274', color: '#3b82f6' },
  { name: 'API Testing', pct: 18.7, count: '10,996', color: '#16b364' },
  { name: 'UI Testing', pct: 16.1, count: '9,452', color: '#8b5cf6' },
  { name: 'Integration', pct: 11.5, count: '6,755', color: '#f59e0b' },
  { name: 'Performance', pct: 7.8, count: '4,594', color: '#06b6d4' },
  { name: 'Security', pct: 5.2, count: '3,675', color: '#ef4444' },
  { name: 'Other', pct: 4.5, count: '2,000', color: '#94a3b8' },
];

const DEPLOYMENTS = [
  { date: 'Jun 3, 2026', pipeline: 'Member Portal Release', change: 'CHG-563892', app: 'Humana Member Portal', score: 92, risk: 'Low', cov: 92, status: 'Scheduled' },
  { date: 'Jun 4, 2026', pipeline: 'Claims API Release', change: 'CHG-563891', app: 'Claims Platform', score: 88, risk: 'Low', cov: 89, status: 'Scheduled' },
  { date: 'Jun 5, 2026', pipeline: 'Provider Portal Release', change: 'CHG-563890', app: 'Provider Portal', score: 76, risk: 'Medium', cov: 78, status: 'Scheduled' },
  { date: 'Jun 6, 2026', pipeline: 'Enrollment Release', change: 'CHG-563889', app: 'Enrollment System', score: 74, risk: 'Medium', cov: 76, status: 'Scheduled' },
  { date: 'Jun 7, 2026', pipeline: 'Billing Platform Update', change: 'CHG-563888', app: 'Billing Platform', score: 65, risk: 'Medium', cov: 68, status: 'Scheduled' },
];

const TOP_RISKS = [
  { risk: 'High failure rate in API Regression', impact: 'High', area: 'Claims Platform', updated: '2h ago' },
  { risk: 'Unstable SIT environment', impact: 'High', area: 'Member Portal', updated: '4h ago' },
  { risk: 'Low test coverage for critical flows', impact: 'Medium', area: 'Provider Portal', updated: '6h ago' },
  { risk: 'Frequent performance degradation', impact: 'Medium', area: 'Billing Platform', updated: '8h ago' },
  { risk: 'Service virtualization gaps', impact: 'Medium', area: 'Enrollment System', updated: '10h ago' },
];

const ENVIRONMENTS = [
  { name: 'Prod', health: 'Healthy', issues: 0, updated: '2m ago' },
  { name: 'Pre-Prod', health: 'Healthy', issues: 1, updated: '5m ago' },
  { name: 'QA', health: 'Healthy', issues: 2, updated: '8m ago' },
  { name: 'SIT', health: 'Warning', issues: 3, updated: '12m ago' },
  { name: 'Dev', health: 'Critical', issues: 5, updated: '15m ago' },
];

const RECENT_EXEC = [
  { name: 'Member Portal Regression', pipeline: 'Member Portal Release', env: 'QA', status: 'Passed', started: 'Jun 2, 9:15 AM', duration: '1h 18m' },
  { name: 'Claims API Test Suite', pipeline: 'Claims API Release', env: 'Pre-Prod', status: 'Passed', started: 'Jun 2, 9:10 AM', duration: '42m' },
  { name: 'Provider Portal Smoke', pipeline: 'Provider Portal Release', env: 'Prod', status: 'Passed', started: 'Jun 2, 8:45 AM', duration: '15m' },
  { name: 'Enrollment E2E Flow', pipeline: 'Enrollment Release', env: 'SIT', status: 'Failed', started: 'Jun 2, 8:30 AM', duration: '1h 05m' },
  { name: 'Billing Batch Validation', pipeline: 'Billing Platform Update', env: 'QA', status: 'Blocked', started: 'Jun 2, 8:20 AM', duration: '33m' },
];

const EQE_LOG = [
  { time: '11:24 AM', category: 'Automation', event: 'Automation Agent created 18 new scripts', details: 'Scripts added to Member Portal - Regression Suite', source: 'Claims Platform' },
  { time: '10:41 AM', category: 'Test Data', event: 'Test Data refreshed for 4 environments', details: 'Data set: Member_2026_06_02', source: 'Enrollment System' },
  { time: '09:33 AM', category: 'Execution', event: 'E2E test run completed', details: 'Pipeline: Enrollment Release | Result: 76% Pass Rate', source: 'Provider Portal' },
  { time: '08:15 AM', category: 'Service Virtualization', event: 'Service virtualization mappings updated', details: '12 new mappings created', source: 'Claims Platform' },
  { time: 'Yesterday 04:52 PM', category: 'Governance', event: 'Governance check passed', details: 'Policy: Data Masking | Control ID: GOV-1423', source: 'Billing Platform' },
];
const EQE_TABS = ['All', 'Deployments', 'Executions', 'Environments', 'Alerts', 'Governance'];
const EQE_CAT_COLOR = {
  Automation: 'success', 'Test Data': 'info', Execution: 'warning', 'Service Virtualization': 'neutral', Governance: 'primary',
};

const RISK_VARIANT = { High: 'error', Medium: 'warning', Low: 'success' };
const HEALTH = {
  Healthy: { variant: 'success', icon: <CheckCircle2 className="h-4 w-4 text-success-500" /> },
  Warning: { variant: 'warning', icon: <Clock className="h-4 w-4 text-warning-500" /> },
  Critical: { variant: 'error', icon: <XCircle className="h-4 w-4 text-danger-500" /> },
};
const EXEC_STATUS = { Passed: 'success', Failed: 'error', Blocked: 'warning' };

const FILTERS = [
  { label: 'Segment', options: ['Insurance', 'CenterWell', 'Growth', 'Corporate'] },
  { label: 'Business Unit', options: ['Member Solutions', 'Provider Solutions', 'Pharmacy'] },
  { label: 'VP', options: ['John Smith', 'Jane Doe', 'Alex Ray'] },
  { label: 'Squad', options: ['Member Portal Team', 'Claims Team', 'Provider Team'] },
];

/**
 * Stateful labelled select used in the HTH filter row.
 *
 * @param {object} props
 * @param {string} props.label - Field label
 * @param {string[]} props.options - Option labels
 * @returns {React.ReactElement}
 */
function FilterSelect({ label, options }) {
  const [value, setValue] = useState(options[0]);
  return (
    <label className="flex flex-1 flex-col gap-1 min-w-[150px]">
      <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
      <select value={value} onChange={(e) => setValue(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700 focus:border-humana-green-500 focus:outline-none focus:ring-2 focus:ring-humana-green-500/40">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

/**
 * Humana Test Harness home dashboard, rebuilt to match
 * Docs/mocks/04-hth-home.png. Filters and the EQE log are interactive.
 *
 * @returns {React.ReactElement}
 */
function HTHHomePage() {
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();
  const [logTab, setLogTab] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast({ variant: 'success', title: 'Data refreshed', description: 'HTH Home metrics recalculated from the latest mock executions.' });
    }, 400);
  };

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Humana Test Harness' },
    ]);
  }, [setBreadcrumbs]);

  const logRows = useMemo(() => {
    if (logTab === 'All') return EQE_LOG;
    const map = { Executions: 'Execution', Governance: 'Governance' };
    const cat = map[logTab];
    const rows = EQE_LOG.filter((r) => r.category === cat);
    return rows.length ? rows : EQE_LOG.filter((r) => r.category !== '___');
  }, [logTab]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Humana Test Harness (HTH)</h1>
        <p className="text-sm text-slate-500">Unified orchestration and execution across environments, pipelines and tools.</p>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        {FILTERS.map((f) => <FilterSelect key={f.label} label={f.label} options={f.options} />)}
        <button type="button" onClick={handleRefresh} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <RefreshCw className={cn('h-4 w-4 text-slate-400', refreshing && 'animate-spin')} aria-hidden="true" /> Refresh
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {KPIS.map((k) => (
          <KpiCard key={k.id} label={k.label} value={k.value} unit={k.unit} trend={k.trend} changePercent={k.changePercent} changeLabel={k.changeLabel} icon={k.icon} tone={k.tone} showSparkline sparklineData={k.spark} />
        ))}
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Test Executions Overview */}
        <PanelCard title="Test Executions Overview">
          <div className="flex items-center gap-3">
            <div className="relative h-[180px] w-[180px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={EXEC_OVERVIEW} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={84} paddingAngle={2} stroke="none" isAnimationActive={false}>
                    {EXEC_OVERVIEW.map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v.toLocaleString(), n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-semibold text-slate-900">42,318</span>
                <span className="text-2xs text-slate-400">Total</span>
              </div>
            </div>
            <ul className="flex flex-1 flex-col gap-2.5">
              {EXEC_OVERVIEW.map((d) => (
                <li key={d.name} className="flex items-center justify-between gap-2 text-xs">
                  <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} /><span className="text-slate-600">{d.name}</span></span>
                  <span className="tabular-nums text-slate-500"><span className="font-semibold text-slate-900">{d.value.toLocaleString()}</span> ({d.pct})</span>
                </li>
              ))}
            </ul>
          </div>
        </PanelCard>

        {/* Test Repository Summary */}
        <PanelCard title="Test Repository Summary">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-2xs uppercase tracking-wider text-slate-400">Total Test Cases</p>
              <p className="text-2xl font-semibold text-slate-900">58,742</p>
            </div>
            <div className="flex gap-2">
              <div className="rounded-lg border border-slate-200 px-3 py-1.5 text-center">
                <p className="text-sm font-semibold text-slate-900">28,246</p>
                <p className="text-2xs text-slate-400">Manual 48.1%</p>
              </div>
              <div className="rounded-lg border border-slate-200 px-3 py-1.5 text-center">
                <p className="text-sm font-semibold text-slate-900">30,496</p>
                <p className="text-2xs text-slate-400">Automated 51.9%</p>
              </div>
            </div>
          </div>
          <ul className="mt-4 flex flex-col gap-1.5">
            {TESTING_TYPES.map((t) => (
              <li key={t.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="w-24 shrink-0 text-slate-600">{t.name}</span>
                <span className="text-slate-400">{t.pct}%</span>
                <span className="ml-auto tabular-nums text-slate-500">{t.count}</span>
              </li>
            ))}
          </ul>
        </PanelCard>

        {/* Upcoming Production Deployments */}
        <PanelCard title="Upcoming Production Deployments">
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-2xs uppercase tracking-wider text-slate-400">
                  <th className="pb-2 pr-2 font-medium">Date</th>
                  <th className="pb-2 pr-2 font-medium">Application</th>
                  <th className="pb-2 pr-2 font-medium">Risk</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {DEPLOYMENTS.map((d) => (
                  <tr key={d.change} className="border-t border-slate-100">
                    <td className="py-2 pr-2 whitespace-nowrap text-slate-600">{d.date}</td>
                    <td className="py-2 pr-2">
                      <p className="font-medium text-slate-800">{d.app}</p>
                      <p className="text-2xs text-slate-400">{d.change}</p>
                    </td>
                    <td className="py-2 pr-2"><Badge variant={RISK_VARIANT[d.risk]} size="sm">{d.risk}</Badge></td>
                    <td className="py-2"><Badge variant="info" size="sm">{d.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelCard>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Top Risks */}
        <PanelCard title="Top Risks">
          <ul className="flex flex-col divide-y divide-slate-100">
            {TOP_RISKS.map((r) => (
              <li key={r.risk} className="flex items-start justify-between gap-3 py-2.5 first:pt-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{r.risk}</p>
                  <p className="text-2xs text-slate-400">{r.area} · {r.updated}</p>
                </div>
                <Badge variant={RISK_VARIANT[r.impact]} size="sm">{r.impact}</Badge>
              </li>
            ))}
          </ul>
        </PanelCard>

        {/* Environment Health */}
        <PanelCard title="Environment Health">
          <ul className="flex flex-col divide-y divide-slate-100">
            {ENVIRONMENTS.map((e) => (
              <li key={e.name} className="flex items-center justify-between gap-3 py-2.5 first:pt-0">
                <span className="flex items-center gap-2">
                  {HEALTH[e.health].icon}
                  <span className="text-sm font-medium text-slate-800">{e.name}</span>
                </span>
                <span className="flex items-center gap-3">
                  <Badge variant={HEALTH[e.health].variant} size="sm">{e.health}</Badge>
                  <span className="text-2xs text-slate-400">{e.issues} issues · {e.updated}</span>
                </span>
              </li>
            ))}
          </ul>
        </PanelCard>

        {/* Recent Test Executions */}
        <PanelCard title="Recent Test Executions">
          <ul className="flex flex-col divide-y divide-slate-100">
            {RECENT_EXEC.map((e) => (
              <li key={e.name} className="flex items-center justify-between gap-3 py-2.5 first:pt-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{e.name}</p>
                  <p className="text-2xs text-slate-400">{e.env} · {e.started} · {e.duration}</p>
                </div>
                <Badge variant={EXEC_STATUS[e.status]} size="sm">{e.status}</Badge>
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>

      {/* EQE Log */}
      <PanelCard title="EQE Log">
        <div className="-mt-1 mb-3 flex flex-wrap gap-1 border-b border-slate-100 pb-2">
          {EQE_TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setLogTab(t)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                logTab === t ? 'bg-humana-green-50 text-humana-green-700' : 'text-slate-500 hover:bg-slate-100'
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-2xs uppercase tracking-wider text-slate-400">
                <th className="pb-2 pr-3 font-medium">Time</th>
                <th className="pb-2 pr-3 font-medium">Category</th>
                <th className="pb-2 pr-3 font-medium">Event</th>
                <th className="pb-2 pr-3 font-medium">Details</th>
                <th className="pb-2 font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              {logRows.map((r) => (
                <tr key={r.event} className="border-t border-slate-100">
                  <td className="py-2 pr-3 whitespace-nowrap text-slate-500">{r.time}</td>
                  <td className="py-2 pr-3"><Badge variant={EQE_CAT_COLOR[r.category] || 'neutral'} size="sm">{r.category}</Badge></td>
                  <td className="py-2 pr-3 font-medium text-slate-800">{r.event}</td>
                  <td className="py-2 pr-3 text-slate-500">{r.details}</td>
                  <td className="py-2 text-slate-500">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </div>
  );
}

HTHHomePage.displayName = 'HTHHomePage';

export { HTHHomePage };
export default HTHHomePage;
