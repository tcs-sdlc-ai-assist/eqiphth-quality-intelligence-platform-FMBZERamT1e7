import { useState, useEffect } from 'react';
import {
  Brain,
  Cpu,
  Clock,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { StatusPill } from '@/components/shared/StatusPill';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/lib/constants';

const MOCK_AGENTS = [
  { id: 'agent-1', name: 'Planning & Design Agent', purpose: 'Analyzes requirements and designs test strategy, scenarios, coverage.', status: 'active', executions: 14, accuracy: 98.4 },
  { id: 'agent-2', name: 'Test Case Generation Agent', purpose: 'Generates comprehensive, risk-based test cases from user stories.', status: 'active', executions: 42, accuracy: 96.8 },
  { id: 'agent-3', name: 'Execution Agent', purpose: 'Executes tests, validates results, logs outcomes across platforms.', status: 'active', executions: 156, accuracy: 99.1 },
  { id: 'agent-4', name: 'Autonomous Exploration Test Agent', purpose: 'Explores applications like an end user to discover gaps and defects.', status: 'learning', executions: 8, accuracy: 92.5 },
  { id: 'agent-5', name: 'Critic Agent', purpose: 'Reviews tests, results and artifacts to identify issues and improve quality.', status: 'active', executions: 24, accuracy: 97.6 },
  { id: 'agent-6', name: 'Test Data Agent', purpose: 'Creates, masks and provisions high-quality test data on demand.', status: 'idle', executions: 0, accuracy: 98.0 },
  { id: 'agent-7', name: 'Quality Intelligence Agent', purpose: 'Analyzes quality signals and predicts risks, defects and quality trends.', status: 'active', executions: 11, accuracy: 95.4 },
  { id: 'agent-8', name: 'Release Readiness Agent', purpose: 'Evaluates release health and recommends go/no-go with confidence score.', status: 'active', executions: 3, accuracy: 99.5 },
];

const MOCK_ACTIVITY = [
  { id: 'act-1', agent: 'Execution Agent', activity: 'Completed regression run suite-101', status: 'SUCCESS', related: 'Medicare Portal', time: '10m ago' },
  { id: 'act-2', agent: 'Critic Agent', activity: 'Identified 2 duplicate test cases in claims suite', status: 'NEW FINDING', related: 'Claims Core', time: '42m ago' },
  { id: 'act-3', agent: 'Test Case Generation Agent', activity: 'Generated 15 test cases for US-202', status: 'REVIEW', related: 'Medicare Portal', time: '1h ago' },
];

export function AIAgentWorkforcePage() {
  const { currentPersona } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState(MOCK_AGENTS);
  const [activity, setActivity] = useState(MOCK_ACTIVITY);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'AI Agent Workforce' },
    ]);
  }, [setBreadcrumbs]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Agent Status Synced',
        description: 'Successfully pulled latest accuracy metrics and activity logs.',
        variant: 'success',
      });
    }, 400);
  };

  const handleExecuteAgent = (agentName) => {
    toast({
      title: 'Agent Triggered',
      description: `${agentName} execution started in background.`,
      variant: 'success',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">AI Agent Workforce</h1>
          <p className="text-sm text-slate-500">
            Discover, monitor, and manage AI agents that accelerate quality engineering across the SDLC.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" iconLeft={<RefreshCw className="h-3.5 w-3.5" />} onClick={handleRefresh}>
            Sync Agents
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Active Agents" value="7 / 8" trend="stable" changePercent="Configured instances" status="success" />
        <KpiCard label="Agent Executions Today" value="231" trend="up" changePercent="+14% vs yesterday" status="info" />
        <KpiCard label="Tasks Completed" value="184" trend="up" changePercent="+8% vs yesterday" status="success" />
        <KpiCard label="Average Accuracy" value="97.2%" trend="up" changePercent="+0.4% this week" status="success" />
        <KpiCard label="Human-in-the-Loop" value="3 Reviews" trend="down" changePercent="-1 review queue" status="warning" />
      </div>

      {/* Agents Catalog */}
      <PanelCard
        title="Agent Workspace & Catalog"
        subtitle="Operational AI agents in the Humana quality harness"
        icon={<Brain className="h-5 w-5 text-emerald-600" />}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 py-2">
          {agents.map((agent) => (
            <div key={agent.id} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-4 hover:border-emerald-200 transition-colors bg-white">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">{agent.id}</span>
                  <StatusPill status={agent.status} size="sm" dot />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm leading-snug">{agent.name}</h4>
                <p className="text-2xs text-slate-500 line-clamp-3">{agent.purpose}</p>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-2xs">
                  <span className="text-slate-400">Executions Today</span>
                  <span className="font-semibold text-slate-700">{agent.executions}</span>
                </div>
                <div className="flex justify-between text-2xs">
                  <span className="text-slate-400">Accuracy (7-day)</span>
                  <span className="font-semibold text-emerald-600">{agent.accuracy}%</span>
                </div>
                <Button variant="ghost" size="sm" className="w-full text-2xs py-1 mt-1" iconLeft={<Play className="h-3 w-3" />} onClick={() => handleExecuteAgent(agent.name)}>
                  Execute Agent
                </Button>
              </div>
            </div>
          ))}
        </div>
      </PanelCard>

      {/* Recent Agent Activity */}
      <PanelCard
        title="Recent Agent Activity"
        subtitle="Recent task executions and findings across the platform"
        icon={<Cpu className="h-5 w-5 text-emerald-600" />}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-2xs uppercase text-slate-500 font-semibold border-b">
              <tr>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Activity description</th>
                <th className="px-4 py-3">Related System</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3 text-center">Status Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {activity.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{act.agent}</td>
                  <td className="px-4 py-3">{act.activity}</td>
                  <td className="px-4 py-3">{act.related}</td>
                  <td className="px-4 py-3 text-slate-400">{act.time}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusPill status={act.status === 'SUCCESS' ? 'passed' : act.status === 'REVIEW' ? 'waived' : 'failed'} label={act.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </div>
  );
}

export default AIAgentWorkforcePage;
