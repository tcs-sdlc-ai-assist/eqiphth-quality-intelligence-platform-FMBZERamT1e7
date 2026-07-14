import { useState, useEffect } from 'react';
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
} from 'recharts';
import {
  TrendingUp,
  Activity,
  Layers,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Plus,
  Play,
  FileText,
  BadgeAlert,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { ChartWrapper } from '@/components/shared/ChartWrapper';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusPill } from '@/components/shared/StatusPill';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { ROUTES } from '@/lib/constants';

const FILTER_FIELDS = [
  {
    id: 'portfolio',
    label: 'Portfolio (CTO)',
    type: 'select',
    options: [
      { value: 'Insurance CTO', label: 'Insurance CTO' },
      { value: 'CenterWell CTO', label: 'CenterWell CTO' },
      { value: 'Growth CTO', label: 'Growth CTO' },
      { value: 'Corporate CTO', label: 'Corporate CTO' },
    ],
    defaultValue: 'Insurance CTO',
  },
  {
    id: 'project',
    label: 'Project',
    type: 'select',
    options: [
      { value: 'Claims Modernization', label: 'Claims Modernization' },
      { value: 'Provider Portal v2', label: 'Provider Portal v2' },
      { value: 'Member Enrollment', label: 'Member Enrollment' },
    ],
    defaultValue: 'Claims Modernization',
  },
  {
    id: 'squad',
    label: 'Squad',
    type: 'select',
    options: [
      { value: 'Squad Alpha', label: 'Squad Alpha' },
      { value: 'Squad Beta', label: 'Squad Beta' },
      { value: 'Squad Gamma', label: 'Squad Gamma' },
    ],
    defaultValue: 'Squad Alpha',
  },
  {
    id: 'sprint',
    label: 'Sprint',
    type: 'select',
    options: [
      { value: 'Sprint 26.3', label: 'Sprint 26.3 (Current)' },
      { value: 'Sprint 26.2', label: 'Sprint 26.2' },
      { value: 'Sprint 26.1', label: 'Sprint 26.1' },
    ],
    defaultValue: 'Sprint 26.3',
  },
];

const JIRA_TRENDS_DATA = [
  { pi: 'PI 25.1', automation: 45, tickets: 90, testCases: 110, stories: 30, completed: 28 },
  { pi: 'PI 25.2', automation: 52, tickets: 95, testCases: 120, stories: 32, completed: 30 },
  { pi: 'PI 25.3', automation: 60, tickets: 110, testCases: 140, stories: 35, completed: 32 },
  { pi: 'PI 25.4', automation: 68, tickets: 105, testCases: 135, stories: 38, completed: 37 },
  { pi: 'PI 26.1', automation: 75, tickets: 120, testCases: 160, stories: 40, completed: 39 },
  { pi: 'PI 26.2', automation: 83, tickets: 125, testCases: 175, stories: 42, completed: 41 },
];

export function InSprintViewPage() {
  const { currentPersona } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    portfolio: 'Insurance CTO',
    project: 'Claims Modernization',
    squad: 'Squad Alpha',
    sprint: 'Sprint 26.3',
  });

  const [storyToggle, setStoryToggle] = useState('stories');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'HTH', path: ROUTES.HTH },
      { label: 'In-Sprint View' },
    ]);
  }, [setBreadcrumbs]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    toast({
      title: 'Filters Applied',
      description: `Viewing in-sprint quality dashboard for ${newFilters.sprint}.`,
      variant: 'success',
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Data Refreshed',
        description: 'Latest in-sprint metrics pulled from Jira and qTest.',
        variant: 'success',
      });
    }, 500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">In-Sprint View</h1>
          <p className="text-sm text-slate-500">
            Real-time quality insights for the current active sprint in the CTO portfolio.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" iconLeft={<RefreshCw className="h-3.5 w-3.5" />} onClick={handleRefresh}>
            Sync Jira
          </Button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar fields={FILTER_FIELDS} values={filters} onChange={handleFilterChange} showResetButton />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Sprint Automation Rate" value="84%" trend="up" changePercent="6% vs last sprint" status="success" />
        <KpiCard label="Jira Tickets Linked" value="128" trend="up" changePercent="12% vs last sprint" status="info" />
        <KpiCard label="Test Cases Created" value="340" trend="up" changePercent="22%" status="success" />
        <KpiCard label="Stories Checked" value="42" trend="stable" changePercent="0%" status="neutral" />
      </div>

      {/* Story Metrics and Linked Test Cases */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PanelCard
          title="Story Quality Metrics"
          subtitle="Audit of user stories in current sprint scope"
          icon={<Layers className="h-5 w-5 text-emerald-600" />}
          actions={
            <Tabs value={storyToggle} onValueChange={setStoryToggle}>
              <TabsList className="h-8">
                <TabsTrigger value="stories" className="text-2xs px-2 py-1">Stories</TabsTrigger>
                <TabsTrigger value="tickets" className="text-2xs px-2 py-1">Jira Tickets</TabsTrigger>
              </TabsList>
            </Tabs>
          }
        >
          <div className="flex flex-col gap-4 py-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Stories / Tickets</span>
              <span className="text-lg font-bold text-slate-900">42</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Stories with Only Automated Tests</span>
                <span className="font-semibold text-emerald-600">28 (66.6%)</span>
              </div>
              <Progress value={66.6} max={100} variant="success" size="sm" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Stories with Manual Tests</span>
                <span className="font-semibold text-blue-600">10 (23.8%)</span>
              </div>
              <Progress value={23.8} max={100} variant="info" size="sm" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Stories without a Test (Gaps)</span>
                <span className="font-semibold text-red-600">4 (9.5%)</span>
              </div>
              <Progress value={9.5} max={100} variant="danger" size="sm" />
            </div>
          </div>
        </PanelCard>

        <PanelCard
          title="Test Case Breakdown"
          subtitle="Distribution of unique test cases linked in this sprint"
          icon={<Activity className="h-5 w-5 text-emerald-600" />}
        >
          <div className="flex flex-col gap-4 py-4">
            <div className="flex justify-between items-center text-sm border-b pb-2">
              <span className="font-medium text-slate-700">Test Category</span>
              <span className="font-medium text-slate-700">Count & Split</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm text-slate-600">Automated</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">224 (65.8%)</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-sm text-slate-600">Manual</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">86 (25.3%)</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="text-sm text-slate-600">Not Required</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">20 (5.9%)</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-sm text-slate-600">Not Feasible</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">10 (3.0%)</span>
            </div>
          </div>
        </PanelCard>
      </div>

      {/* Jira Trends */}
      <PanelCard
        title="Jira Trends Across PIs"
        subtitle="Automation rate, test cases, and completed stories across rolling 6 PIs"
        icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
      >
        <ChartWrapper height={300} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={JIRA_TRENDS_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="pi" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="automation" name="Automation %" stroke="#16b364" strokeWidth={2.5} />
              <Line type="monotone" dataKey="testCases" name="Test Cases" stroke="#3b82f6" strokeWidth={2.5} />
              <Line type="monotone" dataKey="stories" name="Stories Scope" stroke="#8b5cf6" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      {/* Defects Grid by Squad */}
      <PanelCard
        title="Defects Summary by Squad"
        subtitle="Current active defects and escape audits for CTO squads"
        icon={<BadgeAlert className="h-5 w-5 text-emerald-600" />}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-2xs uppercase text-slate-500 font-semibold tracking-wider border-b">
              <tr>
                <th className="px-4 py-3">Squad Name</th>
                <th className="px-4 py-3 text-right">Total Defects</th>
                <th className="px-4 py-3 text-right">Open</th>
                <th className="px-4 py-3 text-right">Closed</th>
                <th className="px-4 py-3 text-right">Without Acher ID</th>
                <th className="px-4 py-3 text-center">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-900">Squad Alpha</td>
                <td className="px-4 py-3 text-right">18</td>
                <td className="px-4 py-3 text-right text-red-600">6</td>
                <td className="px-4 py-3 text-right">12</td>
                <td className="px-4 py-3 text-right font-semibold text-yellow-600">2</td>
                <td className="px-4 py-3 text-center"><StatusPill status="at_risk" size="sm" dot /></td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-900">Squad Beta</td>
                <td className="px-4 py-3 text-right">12</td>
                <td className="px-4 py-3 text-right text-red-600">2</td>
                <td className="px-4 py-3 text-right">10</td>
                <td className="px-4 py-3 text-right">0</td>
                <td className="px-4 py-3 text-center"><StatusPill status="passed" size="sm" dot /></td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-900">Squad Gamma</td>
                <td className="px-4 py-3 text-right">24</td>
                <td className="px-4 py-3 text-right text-red-600">11</td>
                <td className="px-4 py-3 text-right">13</td>
                <td className="px-4 py-3 text-right font-semibold text-yellow-600">5</td>
                <td className="px-4 py-3 text-center"><StatusPill status="critical" size="sm" dot /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </PanelCard>
    </div>
  );
}

export default InSprintViewPage;
