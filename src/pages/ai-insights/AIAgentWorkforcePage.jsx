import { useEffect, useState, useMemo, useRef } from 'react';
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
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigation, usePageHeader } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { PanelCard } from '@/components/shared/PanelCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageActions } from '@/components/layout/PageActions';
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

/* Mock data mirrors Docs/mocks/08-ai-agent-workforce.png (frontend-only). */

const TONE = {
  blue: 'bg-info-50 text-info-600', green: 'bg-humana-green-50 text-humana-green-600',
  purple: 'bg-violet-50 text-violet-600', orange: 'bg-warning-50 text-warning-600',
  red: 'bg-danger-50 text-danger-600', cyan: 'bg-cyan-50 text-cyan-600',
};

const KPIS = [
  { id: 'active', label: 'Active Agents', value: '8', note: 'of 10 configured', link: 'View all agents', target: 'agents', icon: <Bot />, tone: 'blue' },
  { id: 'exec', label: 'Agent Executions (Today)', value: '1,248', change: '↑ 18.6% vs yesterday', up: true, link: 'View activity', target: 'activity', icon: <PlayCircle />, tone: 'green' },
  { id: 'tasks', label: 'Tasks Completed (Today)', value: '986', change: '↑ 21.4% vs yesterday', up: true, link: 'View analytics', target: 'performance', icon: <CheckCircle2 />, tone: 'blue' },
  { id: 'acc', label: 'Agent Accuracy', value: '92.6%', change: '↑ 3.8% vs last 7 days', up: true, link: 'View quality', target: 'performance', icon: <Target />, tone: 'purple' },
  { id: 'hitl', label: 'Human-in-the-Loop', value: '53', note: 'Requires attention', link: 'Review queue', target: 'hitl', icon: <UserCog />, tone: 'orange' },
];

const INITIAL_AGENTS = [
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
  { agent: 'Planning & Design Agent', icon: <ClipboardList />, tone: 'green', activity: 'Drafted test strategy for Pharmacy Formulary API redesign', status: 'Success', related: 'Epic EPIC-2201', time: '41m ago' },
  { agent: 'Quality Intelligence Agent', icon: <BarChart3 />, tone: 'blue', activity: 'Flagged rising defect escape rate for Billing Platform', status: 'Review', related: 'Trend Alert QI-118', time: '52m ago' },
  { agent: 'Execution Agent', icon: <Bot />, tone: 'blue', activity: 'Completed smoke suite for Enrollment System', status: 'Success', related: 'Build #189', time: '1h ago' },
  { agent: 'Critic Agent', icon: <ShieldCheck />, tone: 'red', activity: 'Approved 12 generated test cases for Care Management', status: 'Success', related: 'Test Case Batch #9808', time: '1h ago' },
  { agent: 'Release Readiness Agent', icon: <Gauge />, tone: 'orange', activity: 'Recommended "Ready with Risk" for Claims Processor API v2.1', status: 'Review', related: 'Release rel-981', time: '2h ago' },
];

const HITL_QUEUE = [
  { id: 'HITL-501', agent: 'Critic Agent', item: '3 flagged test cases for Claims Platform batch #9821', reason: 'Possible duplicate assertions', status: 'Pending' },
  { id: 'HITL-502', agent: 'Autonomous Exploration Test Agent', item: 'New defect candidate in Member Portal checkout flow', reason: 'Confidence below auto-file threshold (72%)', status: 'Pending' },
  { id: 'HITL-503', agent: 'Test Case Generation Agent', item: '8 generated test cases for Provider Search API', reason: 'Requires SME sign-off before promotion', status: 'Pending' },
  { id: 'HITL-504', agent: 'Release Readiness Agent', item: '"Ready with Risk" recommendation for Claims Processor API v2.1', reason: 'Release manager confirmation required', status: 'Pending' },
  { id: 'HITL-505', agent: 'Quality Intelligence Agent', item: 'Rising defect escape rate alert for Billing Platform', reason: 'Trend confidence 81% — needs analyst review', status: 'Pending' },
];

const ACTIVITY_VARIANT = { Success: 'success', Review: 'warning', 'New Finding': 'info' };
const HITL_VARIANT = { Pending: 'warning', Approved: 'success', Rejected: 'error' };
const STATUS_DOT = { Active: 'bg-humana-green-500', Idle: 'bg-info-400', Learning: 'bg-warning-500', Disabled: 'bg-slate-400' };
const AGENT_STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Idle', label: 'Idle' },
  { value: 'Learning', label: 'Learning' },
  { value: 'Disabled', label: 'Disabled' },
];
const INITIATIVE_TYPES = ['Planning', 'Generation', 'Execution', 'Exploration', 'Critic', 'Data', 'Intelligence', 'Release'];

/**
 * KPI tile for the agent workforce header — value, delta/note, and a footer link.
 *
 * @param {object} props
 * @param {object} props.kpi - KPI descriptor
 * @param {function(object):void} props.onLink - Footer link handler, called with the KPI descriptor
 * @returns {React.ReactElement}
 */
function AgentKpi({ kpi, onLink }) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
      <span className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-full [&_svg]:h-6 [&_svg]:w-6', TONE[kpi.tone])} aria-hidden="true">{kpi.icon}</span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-medium text-slate-600">{kpi.label}</span>
        <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">{kpi.value}</p>
        {kpi.change ? (
          <p className={cn('mt-0.5 text-2xs font-semibold', kpi.up ? 'text-humana-green-600' : 'text-danger-600')}>{kpi.change}</p>
        ) : (
          <p className={cn('mt-0.5 text-2xs', kpi.id === 'hitl' ? 'text-warning-600' : 'text-slate-400')}>{kpi.note}</p>
        )}
        <button type="button" onClick={() => onLink(kpi)} className="mt-1.5 inline-flex items-center gap-1 text-2xs font-medium text-info-600 hover:text-info-700">
          {kpi.link} <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

/**
 * AI Agent Workforce — discover, monitor and manage AI agents, rebuilt to match
 * Docs/mocks/08-ai-agent-workforce.png. Catalog filter/search, agent detail,
 * Human-in-the-Loop review, agent management, and new-initiative intake are
 * all interactive against local mock state.
 *
 * @returns {React.ReactElement}
 */
function AIAgentWorkforcePage() {
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();
  const [typeFilter, setTypeFilter] = useState('All Agent Types');
  const [search, setSearch] = useState('');
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [hitlQueue, setHitlQueue] = useState(HITL_QUEUE);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [detailAgent, setDetailAgent] = useState(null);
  const [performanceOpen, setPerformanceOpen] = useState(false);
  const [hitlOpen, setHitlOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [initiativeOpen, setInitiativeOpen] = useState(false);
  const [initiativeForm, setInitiativeForm] = useState({ name: '', type: INITIATIVE_TYPES[0], description: '' });

  const agentsRef = useRef(null);
  const activityRef = useRef(null);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'AI Agent Workforce' },
    ]);
  }, [setBreadcrumbs]);

  const agentTypes = useMemo(() => ['All Agent Types', ...agents.map((a) => a.type)], [agents]);

  const filteredAgents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return agents.filter((a) => {
      if (typeFilter !== 'All Agent Types' && a.type !== typeFilter) return false;
      if (q && !`${a.name} ${a.desc}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [agents, typeFilter, search]);

  const handleKpiLink = (kpi) => {
    if (kpi.target === 'agents') {
      agentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (kpi.target === 'activity') {
      activityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (kpi.target === 'performance') {
      setPerformanceOpen(true);
    } else if (kpi.target === 'hitl') {
      setHitlOpen(true);
    }
  };

  const handleHitlDecision = (id, status) => {
    setHitlQueue((prev) => prev.map((h) => (h.id === id ? { ...h, status } : h)));
    toast({ variant: status === 'Approved' ? 'success' : 'warning', title: `Item ${status.toLowerCase()}`, description: `${id} has been ${status.toLowerCase()}.` });
  };

  const handleAgentStatusChange = (name, status) => {
    setAgents((prev) => prev.map((a) => (a.name === name ? { ...a, status } : a)));
  };

  const handleInitiativeSubmit = () => {
    if (!initiativeForm.name.trim()) return;
    toast({
      variant: 'success',
      title: 'Agent initiative submitted',
      description: `"${initiativeForm.name}" (${initiativeForm.type}) has been queued for review by the AI Agent Governance team.`,
    });
    setInitiativeOpen(false);
    setInitiativeForm({ name: '', type: INITIATIVE_TYPES[0], description: '' });
  };

  const visibleActivity = showAllActivity ? ACTIVITY : ACTIVITY.slice(0, 5);
  const pendingHitl = hitlQueue.filter((h) => h.status === 'Pending').length;

  usePageHeader({ title: 'AI Agent Workforce', subtitle: `Discover, monitor and manage AI agents that accelerate quality engineering across the SDLC.` });

  return (
    <div className="flex flex-col gap-6">
      {/* New Agent Initiative — portalled into the navbar (left of the bell) */}
      <PageActions>
        <button type="button" onClick={() => setInitiativeOpen(true)} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-navy-900 px-4 text-sm font-medium text-white hover:bg-navy-800">
          <Plus className="h-4 w-4" /> New Agent Initiative
        </button>
      </PageActions>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {KPIS.map((k) => <AgentKpi key={k.id} kpi={k.id === 'hitl' ? { ...k, value: String(pendingHitl) } : k} onLink={handleKpiLink} />)}
      </div>

      {/* Available Agents */}
      <PanelCard
        ref={agentsRef}
        title="Available Agents"
        subtitle="AI agents purpose-built to drive speed, coverage and quality."
        actions={
          <div className="flex items-center gap-2">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 focus:border-humana-green-500 focus:outline-none focus:ring-2 focus:ring-humana-green-500/40">
              {agentTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
            <span className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search agents..." className="h-8 w-40 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-700 focus:border-humana-green-500 focus:outline-none focus:ring-2 focus:ring-humana-green-500/40" />
            </span>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8">
          {filteredAgents.map((a) => (
            <div key={a.name} className="flex flex-col rounded-xl border border-slate-200 p-3 transition-shadow hover:shadow-card-hover">
              <span className={cn('mx-auto flex h-12 w-12 items-center justify-center rounded-full [&_svg]:h-6 [&_svg]:w-6', TONE[a.tone])} aria-hidden="true">{a.icon}</span>
              <span className="mt-2 flex items-center justify-center gap-1.5 text-2xs font-medium text-slate-500">
                <span className={cn('h-2 w-2 rounded-full', STATUS_DOT[a.status])} /> {a.status}
              </span>
              <h4 className="mt-2 text-sm font-bold text-slate-900">{a.name}</h4>
              <p className="mt-1 flex-1 text-2xs leading-relaxed text-slate-500">{a.desc}</p>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-2xs">
                <div><p className="text-slate-400">Executions (Today)</p><p className="mt-1 text-sm font-bold text-slate-900">{a.exec}</p></div>
                <div className="text-right"><p className="text-slate-400">Accuracy</p><p className="mt-1 text-sm font-bold text-slate-900">{a.acc}</p></div>
              </div>
              <button type="button" onClick={() => setDetailAgent(a)} className="mt-3 w-full rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">View Details</button>
            </div>
          ))}
          {filteredAgents.length === 0 ? <p className="col-span-full py-8 text-center text-sm text-slate-400">No agents match your filters.</p> : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
          {[['Active', 'bg-humana-green-500'], ['Idle', 'bg-info-400'], ['Learning', 'bg-warning-500'], ['Disabled', 'bg-slate-400']].map(([label, dot]) => (
            <span key={label} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600"><span className={cn('h-2.5 w-2.5 rounded-full', dot)} /> {label}</span>
          ))}
          <button type="button" onClick={() => setManageOpen(true)} className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-humana-green-600 hover:text-humana-green-700">Manage Agents <ArrowRight className="h-4 w-4" /></button>
        </div>
      </PanelCard>

      {/* Recent Agent Activity */}
      <PanelCard ref={activityRef} title="Recent Agent Activity">
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
              {visibleActivity.map((r) => (
                <tr key={r.activity} className="border-b border-slate-100 hover:bg-slate-50/60">
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg [&_svg]:h-[18px] [&_svg]:w-[18px] [&_svg]:[stroke-width:2.25px]', TONE[r.tone])}>{r.icon}</span>
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
        {ACTIVITY.length > 5 ? (
          <div className="mt-3 text-center">
            <button type="button" onClick={() => setShowAllActivity((s) => !s)} className="inline-flex items-center gap-1 text-sm font-medium text-info-600 hover:text-info-700">
              {showAllActivity ? 'Show Less' : 'View All Activity'} <ArrowRight className={cn('h-4 w-4 transition-transform', showAllActivity && 'rotate-90')} />
            </button>
          </div>
        ) : null}
      </PanelCard>

      {/* Agent Detail dialog */}
      <Dialog open={Boolean(detailAgent)} onOpenChange={(o) => !o && setDetailAgent(null)}>
        <DialogContent className="max-w-md">
          {detailAgent ? (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-full [&_svg]:h-5 [&_svg]:w-5', TONE[detailAgent.tone])} aria-hidden="true">{detailAgent.icon}</span>
                  <div>
                    <DialogTitle className="pr-8">{detailAgent.name}</DialogTitle>
                    <DialogDescription className="mt-1">{detailAgent.type} Agent</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <p className="mt-3 text-sm text-slate-600">{detailAgent.desc}</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-lg font-semibold text-slate-900">{detailAgent.exec}</p>
                  <p className="text-2xs text-slate-400">Executions Today</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-lg font-semibold text-slate-900">{detailAgent.acc}</p>
                  <p className="text-2xs text-slate-400">Accuracy</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900"><span className={cn('h-2 w-2 rounded-full', STATUS_DOT[detailAgent.status])} />{detailAgent.status}</span>
                  <p className="mt-1 text-2xs text-slate-400">Status</p>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Agent Performance dialog (View analytics / View quality) */}
      <Dialog open={performanceOpen} onOpenChange={setPerformanceOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Agent Performance</DialogTitle>
            <DialogDescription>Executions and accuracy by agent, today.</DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex flex-col divide-y divide-slate-100">
            {[...agents].sort((a, b) => b.exec - a.exec).map((a) => (
              <div key={a.name} className="flex items-center justify-between gap-3 py-2.5 first:pt-0">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
                  <span className={cn('flex h-7 w-7 items-center justify-center rounded-lg [&_svg]:h-3.5 [&_svg]:w-3.5', TONE[a.tone])}>{a.icon}</span>
                  {a.name}
                </span>
                <span className="flex items-center gap-4 text-xs text-slate-500">
                  <span>{a.exec} executions</span>
                  <span className="font-semibold text-slate-900">{a.acc}</span>
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Human-in-the-Loop review queue dialog */}
      <Dialog open={hitlOpen} onOpenChange={setHitlOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Human-in-the-Loop Review Queue</DialogTitle>
            <DialogDescription>Agent outputs below the auto-approval confidence threshold, awaiting review.</DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex flex-col divide-y divide-slate-100">
            {hitlQueue.map((h) => (
              <div key={h.id} className="flex flex-col gap-2 py-3 first:pt-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{h.item}</p>
                    <p className="text-2xs text-slate-400">{h.agent} · {h.reason}</p>
                  </div>
                  <Badge variant={HITL_VARIANT[h.status]} size="sm" className="shrink-0">{h.status}</Badge>
                </div>
                {h.status === 'Pending' ? (
                  <div className="flex items-center gap-1.5">
                    <Button variant="outline" size="sm" iconLeft={<CheckCircle2 className="h-3.5 w-3.5" />} onClick={() => handleHitlDecision(h.id, 'Approved')}>Approve</Button>
                    <Button variant="ghost" size="sm" iconLeft={<XCircle className="h-3.5 w-3.5" />} onClick={() => handleHitlDecision(h.id, 'Rejected')}>Reject</Button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Agents dialog */}
      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Agents</DialogTitle>
            <DialogDescription>Update each agent's operating status.</DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex flex-col divide-y divide-slate-100">
            {agents.map((a) => (
              <div key={a.name} className="flex items-center justify-between gap-3 py-2.5 first:pt-0">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
                  <span className={cn('flex h-7 w-7 items-center justify-center rounded-lg [&_svg]:h-3.5 [&_svg]:w-3.5', TONE[a.tone])}>{a.icon}</span>
                  {a.name}
                </span>
                <Select value={a.status} onValueChange={(v) => handleAgentStatusChange(a.name, v)} options={AGENT_STATUS_OPTIONS} wrapperClassName="w-32" />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* New Agent Initiative dialog */}
      <Dialog open={initiativeOpen} onOpenChange={setInitiativeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Agent Initiative</DialogTitle>
            <DialogDescription>Propose a new AI agent capability for governance review.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4">
            <Input label="Initiative Name" placeholder="e.g. Contract Test Validation Agent" value={initiativeForm.name} onChange={(e) => setInitiativeForm((f) => ({ ...f, name: e.target.value }))} required />
            <Select label="Agent Type" options={INITIATIVE_TYPES.map((t) => ({ value: t, label: t }))} value={initiativeForm.type} onValueChange={(v) => setInitiativeForm((f) => ({ ...f, type: v }))} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium leading-none text-slate-700">Description</label>
              <textarea
                className="flex min-h-[90px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-humana-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 hover:border-slate-400"
                placeholder="What should this agent do?"
                value={initiativeForm.description}
                onChange={(e) => setInitiativeForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" size="md" onClick={() => setInitiativeOpen(false)}>Cancel</Button>
            <Button variant="primary" size="md" onClick={handleInitiativeSubmit} disabled={!initiativeForm.name.trim()}>Submit Initiative</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

AIAgentWorkforcePage.displayName = 'AIAgentWorkforcePage';

export { AIAgentWorkforcePage };
export default AIAgentWorkforcePage;
