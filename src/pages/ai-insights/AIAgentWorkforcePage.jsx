import { useEffect, useState, useMemo } from 'react';
import {
  Bot,
  PlayCircle,
  CheckCircle2,
  Target,
  UserCog,
  Plus,
  Search,
  ArrowRight,
  ClipboardList,
  Code2,
  ScanSearch,
  ShieldCheck,
  Database,
  BarChart3,
  Gauge,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { PanelCard } from '@/components/shared/PanelCard';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/lib/constants';

/* Mock data mirrors Docs/mocks/08-ai-agent-workforce.png (frontend-only). */

const TONE = {
  blue: 'bg-info-50 text-info-600', green: 'bg-humana-green-50 text-humana-green-600',
  purple: 'bg-violet-50 text-violet-600', orange: 'bg-warning-50 text-warning-600',
  red: 'bg-danger-50 text-danger-600', cyan: 'bg-cyan-50 text-cyan-600',
};

const KPIS = [
  { id: 'active', label: 'Active Agents', value: '8', note: 'of 10 configured', link: 'View all agents', icon: <Bot />, tone: 'blue' },
  { id: 'exec', label: 'Agent Executions (Today)', value: '1,248', change: '↑ 18.6% vs yesterday', up: true, link: 'View activity', icon: <PlayCircle />, tone: 'green' },
  { id: 'tasks', label: 'Tasks Completed (Today)', value: '986', change: '↑ 21.4% vs yesterday', up: true, link: 'View analytics', icon: <CheckCircle2 />, tone: 'blue' },
  { id: 'acc', label: 'Agent Accuracy', value: '92.6%', change: '↑ 3.8% vs last 7 days', up: true, link: 'View quality', icon: <Target />, tone: 'purple' },
  { id: 'hitl', label: 'Human-in-the-Loop', value: '53', note: 'Requires attention', link: 'Review queue', icon: <UserCog />, tone: 'orange' },
];

const AGENTS = [
  { name: 'Planning & Design Agent', type: 'Planning', desc: 'Analyzes requirements and designs test strategy, scenarios and coverage.', exec: 186, acc: '93%', icon: <ClipboardList />, tone: 'green', status: 'Active' },
  { name: 'Test Case Generation Agent', type: 'Generation', desc: 'Generates comprehensive, risk-based test cases from user stories and requirements.', exec: 342, acc: '94%', icon: <Code2 />, tone: 'purple', status: 'Active' },
  { name: 'Execution Agent', type: 'Execution', desc: 'Executes tests, validates results and logs outcomes across platforms.', exec: 412, acc: '91%', icon: <Bot />, tone: 'blue', status: 'Active' },
  { name: 'Autonomous Exploration Test Agent', type: 'Exploration', desc: 'Explores applications like an end user to discover gaps and defects pre-merge.', exec: 128, acc: '90%', icon: <ScanSearch />, tone: 'orange', status: 'Active' },
  { name: 'Critic Agent', type: 'Critic', desc: 'Reviews tests, results and artifacts to identify issues and improve quality.', exec: 96, acc: '90%', icon: <ShieldCheck />, tone: 'red', status: 'Active' },
  { name: 'Test Data Agent', type: 'Data', desc: 'Creates, masks and provisions high-quality test data on demand.', exec: 64, acc: '93%', icon: <Database />, tone: 'cyan', status: 'Active' },
  { name: 'Quality Intelligence Agent', type: 'Intelligence', desc: 'Analyzes quality signals and predicts risks, defects and quality trends.', exec: 20, acc: '92%', icon: <BarChart3 />, tone: 'blue', status: 'Active' },
  { name: 'Release Readiness Agent', type: 'Release', desc: 'Evaluates release health and recommends go/no-go with confidence score.', exec: 0, acc: '—', icon: <Gauge />, tone: 'orange', status: 'Idle' },
];

const ACTIVITY = [
  { agent: 'Execution Agent', icon: <Bot />, tone: 'blue', activity: 'Completed test run for Humana Member Portal - Regression Suite', status: 'Success', related: 'Build #264', time: '2m ago' },
  { agent: 'Critic Agent', icon: <ShieldCheck />, tone: 'red', activity: 'Flagged 3 potential issues in test cases for Claims Platform', status: 'Review', related: 'Test Case Batch #9821', time: '7m ago' },
  { agent: 'Test Case Generation Agent', icon: <Code2 />, tone: 'purple', activity: 'Generated 45 new test cases for Provider Portal', status: 'Success', related: 'User Story US-14523', time: '12m ago' },
  { agent: 'Autonomous Exploration Test Agent', icon: <ScanSearch />, tone: 'orange', activity: 'Discovered 2 new defects in pre-merge testing', status: 'New Finding', related: 'Branch: feature/MP-2391', time: '18m ago' },
  { agent: 'Test Data Agent', icon: <Database />, tone: 'cyan', activity: 'Provisioned masked data set for Enrollment System', status: 'Success', related: 'Data Set: ENR_MASK_0426', time: '25m ago' },
];

const ACTIVITY_VARIANT = { Success: 'success', Review: 'warning', 'New Finding': 'info' };
const STATUS_DOT = { Active: 'bg-humana-green-500', Idle: 'bg-info-400', Learning: 'bg-warning-500', Disabled: 'bg-slate-400' };
const AGENT_TYPES = ['All Agent Types', ...AGENTS.map((a) => a.type)];

/**
 * KPI tile for the agent workforce header — value, delta/note, and a footer link.
 *
 * @param {object} props
 * @param {object} props.kpi - KPI descriptor
 * @param {function(string):void} props.onLink - Footer link handler
 * @returns {React.ReactElement}
 */
function AgentKpi({ kpi, onLink }) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-start gap-3">
        <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-full [&_svg]:h-5 [&_svg]:w-5', TONE[kpi.tone])} aria-hidden="true">{kpi.icon}</span>
        <span className="pt-0.5 text-sm font-medium text-slate-600">{kpi.label}</span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{kpi.value}</p>
      {kpi.change ? (
        <p className={cn('mt-1 text-2xs font-medium', kpi.up ? 'text-humana-green-600' : 'text-danger-600')}>{kpi.change}</p>
      ) : (
        <p className={cn('mt-1 text-2xs', kpi.id === 'hitl' ? 'text-warning-600' : 'text-slate-400')}>{kpi.note}</p>
      )}
      <button type="button" onClick={() => onLink(kpi.link)} className="mt-3 inline-flex items-center gap-1 text-2xs font-medium text-info-600 hover:text-info-700">
        {kpi.link} <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}

/**
 * AI Agent Workforce — discover, monitor and manage AI agents, rebuilt to match
 * Docs/mocks/08-ai-agent-workforce.png. Catalog filter/search and actions are
 * interactive.
 *
 * @returns {React.ReactElement}
 */
function AIAgentWorkforcePage() {
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();
  const [typeFilter, setTypeFilter] = useState('All Agent Types');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'AI Agent Workforce' },
    ]);
  }, [setBreadcrumbs]);

  const agents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return AGENTS.filter((a) => {
      if (typeFilter !== 'All Agent Types' && a.type !== typeFilter) return false;
      if (q && !`${a.name} ${a.desc}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [typeFilter, search]);

  const notify = (msg) => toast({ title: msg, description: 'Demo action in this frontend-only build.' });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">AI Agent Workforce</h1>
          <p className="text-sm text-slate-500">Discover, monitor and manage AI agents that accelerate quality engineering across the SDLC.</p>
        </div>
        <button type="button" onClick={() => notify('New Agent Initiative')} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-navy-900 px-4 text-sm font-medium text-white hover:bg-navy-800">
          <Plus className="h-4 w-4" /> New Agent Initiative
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {KPIS.map((k) => <AgentKpi key={k.id} kpi={k} onLink={notify} />)}
      </div>

      {/* Available Agents */}
      <PanelCard
        title="Available Agents"
        subtitle="AI agents purpose-built to drive speed, coverage and quality."
        actions={
          <div className="flex items-center gap-2">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 focus:border-humana-green-500 focus:outline-none focus:ring-2 focus:ring-humana-green-500/40">
              {AGENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <span className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search agents..." className="h-8 w-40 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-700 focus:border-humana-green-500 focus:outline-none focus:ring-2 focus:ring-humana-green-500/40" />
            </span>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {agents.map((a) => (
            <div key={a.name} className="flex flex-col rounded-xl border border-slate-200 p-4 transition-shadow hover:shadow-card-hover">
              <span className={cn('flex h-12 w-12 items-center justify-center rounded-full [&_svg]:h-5 [&_svg]:w-5', TONE[a.tone])} aria-hidden="true">{a.icon}</span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-2xs font-medium text-slate-500">
                <span className={cn('h-2 w-2 rounded-full', STATUS_DOT[a.status])} /> {a.status}
              </span>
              <h4 className="mt-1 text-sm font-semibold text-slate-900">{a.name}</h4>
              <p className="mt-1 flex-1 text-2xs leading-relaxed text-slate-500">{a.desc}</p>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-2xs">
                <div><p className="text-slate-400">Executions (Today)</p><p className="text-sm font-semibold text-slate-900">{a.exec}</p></div>
                <div className="text-right"><p className="text-slate-400">Accuracy</p><p className="text-sm font-semibold text-slate-900">{a.acc}</p></div>
              </div>
              <button type="button" onClick={() => notify(`${a.name} details`)} className="mt-3 w-full rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">View Details</button>
            </div>
          ))}
          {agents.length === 0 ? <p className="col-span-full py-8 text-center text-sm text-slate-400">No agents match your filters.</p> : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
          {[['Active', 'bg-humana-green-500'], ['Idle', 'bg-info-400'], ['Learning', 'bg-warning-500'], ['Disabled', 'bg-slate-400']].map(([label, dot]) => (
            <span key={label} className="inline-flex items-center gap-1.5 text-2xs text-slate-500"><span className={cn('h-2 w-2 rounded-full', dot)} /> {label}</span>
          ))}
          <button type="button" onClick={() => notify('Manage Agents')} className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-humana-green-600 hover:text-humana-green-700">Manage Agents <ArrowRight className="h-4 w-4" /></button>
        </div>
      </PanelCard>

      {/* Recent Agent Activity */}
      <PanelCard title="Recent Agent Activity">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-2xs uppercase tracking-wider text-slate-500">
                <th className="px-3 py-2 font-medium">Agent</th>
                <th className="px-3 py-2 font-medium">Activity</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Related To</th>
                <th className="px-3 py-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVITY.map((r) => (
                <tr key={r.activity} className="border-b border-slate-100 hover:bg-slate-50/60">
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span className={cn('flex h-7 w-7 items-center justify-center rounded-lg [&_svg]:h-3.5 [&_svg]:w-3.5', TONE[r.tone])}>{r.icon}</span>
                      <span className="font-medium text-slate-800">{r.agent}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{r.activity}</td>
                  <td className="px-3 py-3"><Badge variant={ACTIVITY_VARIANT[r.status]} size="sm">{r.status}</Badge></td>
                  <td className="px-3 py-3 text-slate-500">{r.related}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-400">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-center">
          <button type="button" onClick={() => notify('All agent activity')} className="inline-flex items-center gap-1 text-sm font-medium text-info-600 hover:text-info-700">View All Activity <ArrowRight className="h-4 w-4" /></button>
        </div>
      </PanelCard>
    </div>
  );
}

AIAgentWorkforcePage.displayName = 'AIAgentWorkforcePage';

export { AIAgentWorkforcePage };
export default AIAgentWorkforcePage;
