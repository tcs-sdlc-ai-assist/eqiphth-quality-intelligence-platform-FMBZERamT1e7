import { useState, useEffect } from 'react';
import {
  Network,
  Search,
  Database,
  Brain,
  Layers,
  Cpu,
  GitBranch,
  Users,
  Settings,
  HelpCircle,
  Play,
} from 'lucide-react';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation, usePageHeader } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { PanelCard } from '@/components/shared/PanelCard';
import { KpiCard } from '@/components/shared/KpiCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/lib/constants';

const SUGGESTED_QUESTIONS = [
  'Show all test suites covering Medicare Enrollment Portal.',
  'What are the upstream dependencies of Claims Core API?',
  'Find all failed test cases for the current Medicare release.',
  'Which squads own the provider finder search APIs?',
];

const MOCK_NODES = [
  { id: 'node-1', label: 'Medicare Enrollment Portal', type: 'Application', status: 'Passed' },
  { id: 'node-2', label: 'Enrollment API Gateway', type: 'API', status: 'Passed' },
  { id: 'node-3', label: 'Claims Processor Service', type: 'Service', status: 'Failed' },
  { id: 'node-4', label: 'Core Enrollment Regression Suite', type: 'TestSuite', status: 'Passed' },
  { id: 'node-5', label: 'Squad Alpha', type: 'Team', status: 'Active' },
];

export function EnterpriseKnowledgeGraphPage() {
  const { currentPersona } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Enterprise Graph' },
    ]);
  }, [setBreadcrumbs]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setChatResponse('');
    setTimeout(() => {
      setLoading(false);
      setChatResponse(
        `Grounded search in Enterprise Knowledge Graph resolved: Found 3 related applications (Medicare Enrollment Portal, Claims Core, Member Registration), 1 Test Suite, and 2 linked DevOps Pipelines. No blocking dependencies discovered.`
      );
      toast({
        title: 'Search Completed',
        description: 'Successfully queried Enterprise Graph databases.',
        variant: 'success',
      });
    }, 600);
  };

  const handleSuggestedClick = (question) => {
    setSearchQuery(question);
    toast({
      title: 'Query Selected',
      description: 'Click Ask EQIP to submit the question.',
      variant: 'info',
    });
  };

  usePageHeader({ title: 'Enterprise Knowledge Graph', subtitle: `The connective tissue linking applications, requirements, test suites, and defects.` });

  return (
    <div className="flex flex-col gap-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Graph Nodes" value="1,482 Nodes" trend="stable" description="Applications, APIs, Test Cases" status="completed" />
        <KpiCard label="Graph Edges" value="4,832 Edges" trend="improving" description="Coverage & Dependencies" status="on_track" />
        <KpiCard label="Knowledge Depth" value="94.8%" trend="improving" description="Traceability coverage" status="on_track" />
        <KpiCard label="AI Grounding Rate" value="99.2%" trend="stable" description="Context accuracy" status="completed" />
      </div>

      {/* Ask EQIP Search Box */}
      <PanelCard
        title="Ask EQIP - Semantic Graph Search"
        subtitle="Search across requirements, code, test suites, and pipelines using natural language"
        icon={<Brain className="h-5 w-5 text-emerald-600" />}
      >
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask a question about dependencies, test cases, or squads..."
                className="pl-10 h-10 text-xs"
              />
            </div>
            <Button type="submit" variant="primary" className="h-10 text-xs font-semibold px-5" disabled={loading}>
              {loading ? 'Querying...' : 'Ask EQIP'}
            </Button>
          </div>

          {/* Suggested Questions */}
          <div className="flex flex-col gap-2">
            <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <HelpCircle className="h-3 w-3" /> Suggested queries
            </span>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSuggestedClick(q)}
                  className="bg-slate-50 border border-slate-200 hover:border-emerald-300 rounded-lg px-3 py-1.5 text-2xs text-slate-600 hover:text-slate-800 text-left transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Search Result */}
          {chatResponse && (
            <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3 animate-fade-in">
              <Brain className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 text-xs">
                <span className="font-semibold text-emerald-800">EQIP Graph Agent Response</span>
                <p className="text-emerald-900 leading-relaxed">{chatResponse}</p>
              </div>
            </div>
          )}
        </form>
      </PanelCard>

      {/* Network Nodes Grid representation */}
      <PanelCard
        title="Knowledge Network Visualization"
        subtitle="Current semantic nodes resolved in the active segment"
        icon={<Network className="h-5 w-5 text-emerald-600" />}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 py-4">
          {MOCK_NODES.map((node) => (
            <div key={node.id} className="border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center gap-2.5 bg-slate-50/50 hover:border-emerald-300 transition-colors">
              <div className="w-12 h-12 bg-white border rounded-full flex items-center justify-center text-slate-500 shadow-sm">
                {node.type === 'Application' && <Layers className="h-5 w-5 text-blue-500" />}
                {node.type === 'API' && <GitBranch className="h-5 w-5 text-emerald-500" />}
                {node.type === 'Service' && <Cpu className="h-5 w-5 text-red-500" />}
                {node.type === 'TestSuite' && <Database className="h-5 w-5 text-purple-500" />}
                {node.type === 'Team' && <Users className="h-5 w-5 text-indigo-500" />}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900 line-clamp-1">{node.label}</span>
                <span className="text-2xs text-slate-400 mt-0.5">{node.type}</span>
              </div>
              <Badge variant={node.status === 'Passed' || node.status === 'Active' ? 'success' : 'error'} size="sm">
                {node.status}
              </Badge>
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}

export default EnterpriseKnowledgeGraphPage;
