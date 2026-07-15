import { useEffect } from 'react';
import { Bot, Code2, ScanSearch, ShieldCheck, Sparkles, Activity } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/lib/constants';

/* Mock data — testing-focused AI agents (PRD §5 "Analytics › AI In Testing", §6.27). */

const TESTING_AGENTS = [
  { name: 'Test Case Generation Agent', desc: 'Generates comprehensive, risk-based test cases from user stories and requirements.', executions: 342, accuracy: '94%', icon: <Code2 />, tone: 'purple' },
  { name: 'Execution Agent', desc: 'Executes tests, validates results, and logs outcomes across platforms.', executions: 412, accuracy: '91%', icon: <Bot />, tone: 'blue' },
  { name: 'Autonomous Exploration Test Agent', desc: 'Explores applications like an end user to discover gaps and defects pre-merge.', executions: 128, accuracy: '90%', icon: <ScanSearch />, tone: 'orange' },
  { name: 'Critic Agent', desc: 'Reviews tests, results, and artifacts to identify issues and improve quality.', executions: 96, accuracy: '90%', icon: <ShieldCheck />, tone: 'red' },
];

const AGENT_ACTIVITY = [
  { agent: 'Execution Agent', activity: 'Completed test run for Member Portal - Regression Suite', status: 'Success', time: '2m ago' },
  { agent: 'Critic Agent', activity: 'Flagged 3 potential issues in test cases for Claims Platform', status: 'Review', time: '7m ago' },
  { agent: 'Test Case Generation Agent', activity: 'Generated 45 new test cases for Provider Portal', status: 'Success', time: '12m ago' },
  { agent: 'Autonomous Exploration Test Agent', activity: 'Discovered 2 new defects in pre-merge testing for Pharmacy Portal', status: 'New Finding', time: '18m ago' },
  { agent: 'Execution Agent', activity: 'Completed smoke suite for Enrollment System', status: 'Success', time: '34m ago' },
];

const STATUS_VARIANT = { Success: 'success', Review: 'warning', 'New Finding': 'info' };

/**
 * AI In Testing — the subset of the AI Agent Workforce focused specifically
 * on test generation, execution, exploration, and critique, per PRD §5
 * "Analytics › AI In Testing".
 *
 * @returns {React.ReactElement}
 */
function AIInTestingPage() {
  const { setBreadcrumbs } = useNavigation();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Humana Test Harness', path: ROUTES.HTH },
      { label: 'AI In Testing' },
    ]);
  }, [setBreadcrumbs]);

  const totalExecutions = TESTING_AGENTS.reduce((s, a) => s + a.executions, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">AI In Testing</h1>
        <p className="text-sm text-slate-500">AI agents accelerating test generation, execution, exploration, and critique across the portfolio.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Active Testing Agents" value={TESTING_AGENTS.length} unit="count" icon={<Bot />} tone="blue" />
        <KpiCard label="Agent Executions (Today)" value={totalExecutions} unit="count" icon={<Activity />} tone="green" />
        <KpiCard label="Avg. Agent Accuracy" value="91.3%" icon={<Sparkles />} tone="purple" />
        <KpiCard label="New Findings (Today)" value={12} unit="count" icon={<ScanSearch />} tone="orange" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {TESTING_AGENTS.map((a) => (
          <PanelCard key={a.name} title={a.name}>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-humana-green-50 text-humana-green-600 [&_svg]:h-5 [&_svg]:w-5">{a.icon}</span>
              <p className="flex-1 text-sm text-slate-600">{a.desc}</p>
            </div>
            <div className="mt-4 flex items-center gap-6 text-sm">
              <span><span className="font-semibold text-slate-900">{a.executions}</span> <span className="text-slate-400">executions today</span></span>
              <span><span className="font-semibold text-slate-900">{a.accuracy}</span> <span className="text-slate-400">accuracy</span></span>
            </div>
          </PanelCard>
        ))}
      </div>

      <PanelCard title="Recent Agent Activity">
        <ul className="flex flex-col divide-y divide-slate-100">
          {AGENT_ACTIVITY.map((a, i) => (
            <li key={i} className="flex items-center justify-between gap-3 py-2.5 first:pt-0">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">{a.activity}</p>
                <p className="text-2xs text-slate-400">{a.agent} · {a.time}</p>
              </div>
              <Badge variant={STATUS_VARIANT[a.status]} size="sm">{a.status}</Badge>
            </li>
          ))}
        </ul>
      </PanelCard>
    </div>
  );
}

AIInTestingPage.displayName = 'AIInTestingPage';

export { AIInTestingPage };
export default AIInTestingPage;
