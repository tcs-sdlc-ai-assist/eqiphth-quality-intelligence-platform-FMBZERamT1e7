import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  FileCheck,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Layers,
  Database,
  Link,
  Brain,
} from 'lucide-react';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { StatusPill } from '@/components/shared/StatusPill';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/lib/constants';

const MOCK_RELEASE_DETAILS = {
  'rel-980': {
    id: 'rel-980',
    name: 'Medicare Enrollment Portal R4',
    application: 'Medicare Portal',
    segment: 'Medicare',
    releaseDate: '2026-07-28',
    owner: 'Sarah Chen',
    qeOwner: 'Angela Martinez',
    overallScore: 89,
    confidence: 90,
    risk: 'medium',
    gateStatus: 'passed',
    stories: [
      { id: 'US-201', summary: 'Apply dynamic age bounds verification', type: 'Feature', status: 'Completed', tests: 8 },
      { id: 'US-202', summary: 'Integrate Medicare Part D drug list service', type: 'Integration', status: 'Completed', tests: 15 },
      { id: 'US-203', summary: 'Implement accessible WCAG tab structures', type: 'Accessibility', status: 'Completed', tests: 12 },
    ],
    defects: [
      { id: 'BUG-109', summary: 'Mobile view overflows on login button', severity: 'medium', status: 'Open' },
      { id: 'BUG-112', summary: 'API latency spikes during token refreshing', severity: 'low', status: 'Closed' },
    ],
    codeQuality: {
      sonarCoverage: 88.5,
      sonarBugs: 0,
      sonarVulnerabilities: 0,
      codeSmells: 12,
      checkmarxStatus: 'Passed',
      castHealthScore: 8.4,
    },
    envReadiness: 'Ready',
    testDataReadiness: 'Ready',
    approvals: [
      { role: 'QE Lead', name: 'Angela Martinez', status: 'Approved', date: '2026-07-13' },
      { role: 'Product Owner', name: 'Emily Davis', status: 'Approved', date: '2026-07-14' },
      { role: 'Release Manager', name: 'Amanda Garcia', status: 'Pending', date: '' },
    ],
    aiRiskSummary: 'All critical regression suites have passed. The claims-portal integration shows low exception rates, but check API latency metrics post-release. One open UI bug remains, classified as non-blocking.',
  },
  'rel-981': {
    id: 'rel-981',
    name: 'Claims Processor API v2.1',
    application: 'Claims Core',
    segment: 'Enterprise',
    releaseDate: '2026-08-05',
    owner: 'Robert Kim',
    qeOwner: 'Lisa Johnson',
    overallScore: 68,
    confidence: 65,
    risk: 'high',
    gateStatus: 'failed',
    stories: [
      { id: 'US-301', summary: 'Support EDI 837 claim submission ingestion', type: 'Feature', status: 'Completed', tests: 24 },
      { id: 'US-302', summary: 'Implement automatic duplicate validation loop', type: 'Feature', status: 'In-Progress', tests: 4 },
    ],
    defects: [
      { id: 'BUG-144', summary: 'Duplicate EDI blocks cause core dump exception', severity: 'critical', status: 'Open' },
      { id: 'BUG-145', summary: 'Out of memory leak on concurrent claims ingestion', severity: 'high', status: 'Open' },
    ],
    codeQuality: {
      sonarCoverage: 71.2,
      sonarBugs: 4,
      sonarVulnerabilities: 2,
      codeSmells: 48,
      checkmarxStatus: 'Failed (2 High)',
      castHealthScore: 6.1,
    },
    envReadiness: 'Degraded',
    testDataReadiness: 'Ready',
    approvals: [
      { role: 'QE Lead', name: 'Lisa Johnson', status: 'Rejected', date: '2026-07-12' },
      { role: 'Product Owner', name: 'Emily Davis', status: 'Pending', date: '' },
      { role: 'Release Manager', name: 'Amanda Garcia', status: 'Pending', date: '' },
    ],
    aiRiskSummary: 'CRITICAL FAILURE: Memory leak detected during performance tests with 500 concurrent claim uploads. High risk of outage if deployed in current state. Check EDI parser classes and close buffer streams.',
  },
  'rel-982': {
    id: 'rel-982',
    name: 'Provider Finder Mobile v1.8',
    application: 'Provider Directory',
    segment: 'Commercial',
    releaseDate: '2026-07-20',
    owner: 'Amanda Garcia',
    qeOwner: 'Priya Patel',
    overallScore: 96,
    confidence: 98,
    risk: 'low',
    gateStatus: 'passed',
    stories: [
      { id: 'US-111', summary: 'Map provider locations using google maps', type: 'Feature', status: 'Completed', tests: 18 },
      { id: 'US-112', summary: 'Add filtering by specialty and language', type: 'Feature', status: 'Completed', tests: 22 },
    ],
    defects: [],
    codeQuality: {
      sonarCoverage: 94.1,
      sonarBugs: 0,
      sonarVulnerabilities: 0,
      codeSmells: 3,
      checkmarxStatus: 'Passed',
      castHealthScore: 9.2,
    },
    envReadiness: 'Ready',
    testDataReadiness: 'Ready',
    approvals: [
      { role: 'QE Lead', name: 'Priya Patel', status: 'Approved', date: '2026-07-10' },
      { role: 'Product Owner', name: 'Emily Davis', status: 'Approved', date: '2026-07-11' },
      { role: 'Release Manager', name: 'Amanda Garcia', status: 'Approved', date: '2026-07-12' },
    ],
    aiRiskSummary: 'Excellent quality metrics across all components. Security scans show clean reports. Ready for production deployment with zero known blocker dependencies.',
  },
};

export function ReleaseDetailPage() {
  const { releaseId } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();

  const [release, setRelease] = useState(null);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Release Readiness', path: ROUTES.RELEASE_READINESS },
      { label: 'Release Detail' },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    const data = MOCK_RELEASE_DETAILS[releaseId] || MOCK_RELEASE_DETAILS['rel-980'];
    setRelease(data);
  }, [releaseId]);

  if (!release) {
    return <div className="p-6">Loading release details...</div>;
  }

  const handleApprove = () => {
    toast({
      title: 'Release Approved',
      description: `You have successfully approved release ${release.name}.`,
      variant: 'success',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb back */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" iconLeft={<ArrowLeft className="h-3.5 w-3.5" />} onClick={() => navigate(ROUTES.RELEASE_READINESS)}>
          Back to Release Readiness
        </Button>
      </div>

      {/* Main Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">{release.id}</span>
            <h1 className="text-xl font-bold text-slate-900">{release.name}</h1>
            <Badge variant="primary" size="sm">{release.segment}</Badge>
          </div>
          <p className="text-xs text-slate-500">
            Application: <span className="font-medium text-slate-800">{release.application}</span> | Owner: <span className="font-medium text-slate-800">{release.owner}</span> | QE Owner: <span className="font-medium text-slate-800">{release.qeOwner}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button variant="primary" iconLeft={<FileCheck className="h-4 w-4" />} onClick={handleApprove}>
            Approve Release
          </Button>
        </div>
      </div>

      {/* AI Risk Narrative */}
      <PanelCard
        title="AI-Powered Risk Summary"
        subtitle="Generative intelligence analysis of release data"
        icon={<Brain className="h-5 w-5 text-emerald-600" />}
      >
        <div className="bg-emerald-50/50 border border-dashed border-emerald-200 rounded-xl p-4 flex gap-3">
          <Brain className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 text-xs">
            <span className="font-semibold text-emerald-800">Quality Agent Assessment</span>
            <p className="text-emerald-900 leading-relaxed">{release.aiRiskSummary}</p>
          </div>
        </div>
      </PanelCard>

      {/* KPI Scores Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Overall Quality Score" value={`${release.overallScore}%`} trend="up" changePercent="Gate compliance" status={release.overallScore >= 80 ? 'success' : 'danger'} />
        <KpiCard label="Linked Stories" value={release.stories.length.toString()} trend="stable" changePercent="Scope size" status="info" />
        <KpiCard label="Open Defects" value={release.defects.length.toString()} trend="down" changePercent="Active backlog" status={release.defects.length > 0 ? 'warning' : 'success'} />
        <KpiCard label="Environment Health" value={release.envReadiness} trend="stable" changePercent="Target: UAT/Staging" status={release.envReadiness === 'Ready' ? 'success' : 'danger'} />
      </div>

      {/* Stories and Code Quality */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Linked Stories */}
        <PanelCard
          title="Linked User Stories & Scope"
          subtitle="User stories mapped to this release branch"
          icon={<Layers className="h-5 w-5 text-emerald-600" />}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-2xs uppercase text-slate-500 font-semibold border-b">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Summary</th>
                  <th className="px-3 py-2 text-right">Tests</th>
                  <th className="px-3 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {release.stories.map((story) => (
                  <tr key={story.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2 font-medium text-slate-900">{story.id}</td>
                    <td className="px-3 py-2 truncate max-w-[200px]">{story.summary}</td>
                    <td className="px-3 py-2 text-right">{story.tests}</td>
                    <td className="px-3 py-2 text-center">
                      <StatusPill status={story.status === 'Completed' ? 'passed' : 'in-progress'} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelCard>

        {/* Code Quality & Security */}
        <PanelCard
          title="Static Analysis & Security Metrics"
          subtitle="Reports from SonarQube, Checkmarx, and CAST"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}
        >
          <div className="flex flex-col gap-4 text-xs py-2">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-500">SonarQube Code Coverage</span>
              <span className="font-semibold text-slate-900">{release.codeQuality.sonarCoverage}%</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-500">SonarQube Code Smells</span>
              <span className="font-semibold text-slate-900">{release.codeQuality.codeSmells} Smells</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-500">Checkmarx Security Scan</span>
              <span className={`font-semibold ${release.codeQuality.checkmarxStatus === 'Passed' ? 'text-emerald-600' : 'text-red-600'}`}>
                {release.codeQuality.checkmarxStatus}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">CAST Architectural Health Score</span>
              <span className="font-semibold text-slate-900">{release.codeQuality.castHealthScore} / 10</span>
            </div>
          </div>
        </PanelCard>
      </div>

      {/* Approvals Pipeline */}
      <PanelCard
        title="Approvals Workflow"
        subtitle="Verification check-offs required for go-live promotion"
        icon={<FileCheck className="h-5 w-5 text-emerald-600" />}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-2xs uppercase text-slate-500 font-semibold border-b">
              <tr>
                <th className="px-4 py-3">Approval Gate</th>
                <th className="px-4 py-3">Assigned Approver</th>
                <th className="px-4 py-3">Decision Date</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {release.approvals.map((app, index) => (
                <tr key={index} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{app.role}</td>
                  <td className="px-4 py-3">{app.name}</td>
                  <td className="px-4 py-3 text-slate-500">{app.date || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusPill status={app.status === 'Approved' ? 'passed' : app.status === 'Rejected' ? 'failed' : 'pending'} size="sm" dot />
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

export default ReleaseDetailPage;
