import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Settings,
  Clock,
  Play,
  Layers,
  Activity,
  FileCheck,
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

const MOCK_SUITE_DETAILS = {
  'suite-101': {
    id: 'suite-101',
    name: 'Core Enrollment Regression Suite',
    application: 'Medicare Portal',
    segment: 'Medicare',
    owner: 'Robert Kim',
    testCount: 148,
    coverage: 88,
    frequency: 'daily',
    lastResult: 'passed',
    passRate: 94.6,
    avgDuration: '4m 32s',
    envReqs: 'SIT Environment',
    dataReqs: 'Medicare Test Patient Bundle',
    linkedReleases: ['rel-980', 'rel-983'],
    testCases: [
      { id: 'TC-101', title: 'Verify new member enrollment with valid details', type: 'Functional', status: 'passed' },
      { id: 'TC-102', title: 'Validate invalid date of birth error prompt', type: 'Negative', status: 'passed' },
      { id: 'TC-103', title: 'Check plan selection page load times', type: 'Performance', status: 'passed' },
      { id: 'TC-104', title: 'Verify signature block submission check', type: 'Functional', status: 'passed' },
    ],
  },
  'suite-102': {
    id: 'suite-102',
    name: 'Claims API Smoke Suite',
    application: 'Claims Core',
    segment: 'Enterprise',
    owner: 'Lisa Johnson',
    testCount: 42,
    coverage: 100,
    frequency: 'on_commit',
    lastResult: 'failed',
    passRate: 78.2,
    avgDuration: '1m 15s',
    envReqs: 'Dev Environment',
    dataReqs: 'Claims EDI 837 mock structures',
    linkedReleases: ['rel-981'],
    testCases: [
      { id: 'TC-201', title: 'EDI 837 Claim File Ingestion', type: 'Functional', status: 'passed' },
      { id: 'TC-202', title: 'Verify Claims Duplication Logic checks', type: 'Functional', status: 'failed' },
      { id: 'TC-203', title: 'Claims processing authentication token verification', type: 'Security', status: 'passed' },
    ],
  },
};

export function TestSuiteDetailPage() {
  const { suiteId } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();

  const [suite, setSuite] = useState(null);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'HTH Home', path: ROUTES.HTH },
      { label: 'Test Cases', path: ROUTES.TEST_CASES },
      { label: 'Test Suite Detail' },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    const data = MOCK_SUITE_DETAILS[suiteId] || MOCK_SUITE_DETAILS['suite-101'];
    setSuite(data);
  }, [suiteId]);

  if (!suite) {
    return <div className="p-6">Loading test suite details...</div>;
  }

  const handleRunSuite = () => {
    toast({
      title: 'Execution Triggered',
      description: `Test Suite ${suite.name} is now executing in ${suite.envReqs}.`,
      variant: 'success',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" iconLeft={<ArrowLeft className="h-3.5 w-3.5" />} onClick={() => navigate(-1)}>
          Back to Test Repository
        </Button>
      </div>

      {/* Main Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">{suite.id}</span>
            <h1 className="text-xl font-bold text-slate-900">{suite.name}</h1>
            <Badge variant="primary" size="sm">{suite.segment}</Badge>
          </div>
          <p className="text-xs text-slate-500">
            Application: <span className="font-medium text-slate-800">{suite.application}</span> | Owner: <span className="font-medium text-slate-800">{suite.owner}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" iconLeft={<Settings className="h-4 w-4" />}>Configure</Button>
          <Button variant="primary" iconLeft={<Play className="h-4 w-4" />} onClick={handleRunSuite}>
            Run Test Suite
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Included Test Cases" value={suite.testCount.toString()} trend="stable" changePercent="Active registry" status="info" />
        <KpiCard label="Automation Coverage" value={`${suite.coverage}%`} trend="stable" changePercent="Execution split" status="success" />
        <KpiCard label="Average Pass Rate" value={`${suite.passRate}%`} trend="up" changePercent="Last 20 builds" status={suite.passRate >= 90 ? 'success' : 'warning'} />
        <KpiCard label="Average Duration" value={suite.avgDuration} trend="down" changePercent="Optimization check" status="info" />
      </div>

      {/* Reqs and Cases */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Requirements */}
        <PanelCard
          title="Execution Configuration"
          subtitle="System and data prerequisites"
          icon={<Layers className="h-5 w-5 text-emerald-600" />}
          className="lg:col-span-1"
        >
          <div className="flex flex-col gap-4 text-xs py-2">
            <div className="flex flex-col gap-1 border-b pb-2">
              <span className="text-slate-400 font-semibold uppercase text-2xs">Target Environment</span>
              <span className="font-semibold text-slate-800 text-sm">{suite.envReqs}</span>
            </div>
            <div className="flex flex-col gap-1 border-b pb-2">
              <span className="text-slate-400 font-semibold uppercase text-2xs">Test Data Requirements</span>
              <span className="font-semibold text-slate-800 text-sm">{suite.dataReqs}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 font-semibold uppercase text-2xs">Linked Releases</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {suite.linkedReleases.map((rel) => (
                  <Badge key={rel} variant="neutral" size="sm">{rel}</Badge>
                ))}
              </div>
            </div>
          </div>
        </PanelCard>

        {/* Test Case List */}
        <PanelCard
          title="Included Test Cases"
          subtitle="List of active test cases in this suite"
          icon={<FileCheck className="h-5 w-5 text-emerald-600" />}
          className="lg:col-span-2"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-2xs uppercase text-slate-500 font-semibold border-b">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Test Case Title</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2 text-center">Last Result</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {suite.testCases.map((tc) => (
                  <tr key={tc.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2 font-medium text-slate-900">{tc.id}</td>
                    <td className="px-3 py-2 truncate max-w-[250px]">{tc.title}</td>
                    <td className="px-3 py-2">{tc.type}</td>
                    <td className="px-3 py-2 text-center">
                      <StatusPill status={tc.status} size="sm" dot />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelCard>
      </div>
    </div>
  );
}

export default TestSuiteDetailPage;
