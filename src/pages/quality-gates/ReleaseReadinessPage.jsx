import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Plus,
  ArrowRight,
  ShieldAlert,
  Clock,
  ThumbsUp,
  FileCheck,
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

const MOCK_RELEASES = [
  {
    id: 'rel-980',
    name: 'Medicare Enrollment Portal R4',
    application: 'Medicare Portal',
    segment: 'Medicare',
    releaseDate: '2026-07-28',
    owner: 'Sarah Chen',
    qeOwner: 'Angela Martinez',
    overallScore: 89,
    businessScore: 95,
    technicalScore: 85,
    qualityScore: 92,
    operationalScore: 84,
    confidence: 90,
    risk: 'medium',
    gateStatus: 'passed',
    criticalDefects: 0,
    openDefects: 3,
    testCompletion: 98,
    automationExecution: 85,
    recommendation: 'Ready with Risk',
  },
  {
    id: 'rel-981',
    name: 'Claims Processor API v2.1',
    application: 'Claims Core',
    segment: 'Enterprise',
    releaseDate: '2026-08-05',
    owner: 'Robert Kim',
    qeOwner: 'Lisa Johnson',
    overallScore: 68,
    businessScore: 75,
    technicalScore: 60,
    qualityScore: 64,
    operationalScore: 73,
    confidence: 65,
    risk: 'high',
    gateStatus: 'failed',
    criticalDefects: 2,
    openDefects: 14,
    testCompletion: 82,
    automationExecution: 72,
    recommendation: 'Not Ready',
  },
  {
    id: 'rel-982',
    name: 'Provider Finder Mobile v1.8',
    application: 'Provider Directory',
    segment: 'Commercial',
    releaseDate: '2026-07-20',
    owner: 'Amanda Garcia',
    qeOwner: 'Priya Patel',
    overallScore: 96,
    businessScore: 98,
    technicalScore: 94,
    qualityScore: 96,
    operationalScore: 96,
    confidence: 98,
    risk: 'low',
    gateStatus: 'passed',
    criticalDefects: 0,
    openDefects: 1,
    testCompletion: 100,
    automationExecution: 95,
    recommendation: 'Ready',
  },
];

export function ReleaseReadinessPage() {
  const { currentPersona } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [releases, setReleases] = useState(MOCK_RELEASES);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Release Readiness' },
    ]);
  }, [setBreadcrumbs]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Release Data Refreshed',
        description: 'Readiness scores recalculated based on latest CI/CD pipelines.',
        variant: 'success',
      });
    }, 400);
  };

  const handleReleaseClick = (releaseId) => {
    navigate(`/releases/${releaseId}`);
  };

  const getRecommendationColor = (rec) => {
    switch (rec) {
      case 'Ready':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Ready with Risk':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Not Ready':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'Waiver Required':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">Release Readiness</h1>
          <p className="text-sm text-slate-500">
            Quality scores, gate compliance, and deployment confidence metrics for pending releases.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" iconLeft={<RefreshCw className="h-3.5 w-3.5" />} onClick={handleRefresh}>
            Recalculate Scores
          </Button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Active Releases" value="3" trend="stable" changePercent="0 vs last week" status="info" />
        <KpiCard label="Average Readiness Score" value="84%" trend="up" changePercent="+3.2%" status="success" />
        <KpiCard label="Passed Gates" value="2 / 3" trend="stable" changePercent="66.6% compliance" status="warning" />
        <KpiCard label="Deployment Risks" value="1 High" trend="down" changePercent="-1 high risk" status="danger" />
      </div>

      {/* Releases Cards */}
      <div className="flex flex-col gap-6">
        {releases.map((rel) => (
          <div key={rel.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Header info */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{rel.id}</span>
                  <h3 className="text-base font-semibold text-slate-900">{rel.name}</h3>
                  <Badge variant="primary" size="sm">{rel.segment}</Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Target Date: <span className="font-medium">{rel.releaseDate}</span> | Application: <span className="font-medium text-slate-700">{rel.application}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRecommendationColor(rel.recommendation)}`}>
                  {rel.recommendation}
                </div>
                <Button variant="outline" size="sm" iconRight={<ArrowRight className="h-3.5 w-3.5" />} onClick={() => handleReleaseClick(rel.id)}>
                  View Details
                </Button>
              </div>
            </div>

            {/* Scores panel */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {/* Overall readiness */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-center">
                <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Overall Readiness</span>
                <span className={`text-3xl font-extrabold mb-1 ${rel.overallScore >= 80 ? 'text-emerald-600' : rel.overallScore >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
                  {rel.overallScore}%
                </span>
                <Progress value={rel.overallScore} max={100} size="xs" variant={rel.overallScore >= 80 ? 'success' : rel.overallScore >= 70 ? 'warning' : 'danger'} />
              </div>

              {/* Business Readiness */}
              <div className="flex flex-col justify-between p-4 bg-white rounded-xl border border-slate-100">
                <span className="text-xs font-medium text-slate-500">Business Readiness</span>
                <div className="flex items-end justify-between mt-4">
                  <span className="text-xl font-bold text-slate-950">{rel.businessScore}%</span>
                  <span className="text-2xs text-emerald-600 font-semibold">On Track</span>
                </div>
              </div>

              {/* Technical Readiness */}
              <div className="flex flex-col justify-between p-4 bg-white rounded-xl border border-slate-100">
                <span className="text-xs font-medium text-slate-500">Technical Readiness</span>
                <div className="flex items-end justify-between mt-4">
                  <span className="text-xl font-bold text-slate-950">{rel.technicalScore}%</span>
                  <span className={`text-2xs font-semibold ${rel.technicalScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {rel.technicalScore >= 80 ? 'On Track' : 'Needs Review'}
                  </span>
                </div>
              </div>

              {/* Quality Readiness */}
              <div className="flex flex-col justify-between p-4 bg-white rounded-xl border border-slate-100">
                <span className="text-xs font-medium text-slate-500">Quality Readiness</span>
                <div className="flex items-end justify-between mt-4">
                  <span className="text-xl font-bold text-slate-950">{rel.qualityScore}%</span>
                  <span className="text-2xs text-emerald-600 font-semibold">Passed Gates</span>
                </div>
              </div>

              {/* Operational Readiness */}
              <div className="flex flex-col justify-between p-4 bg-white rounded-xl border border-slate-100">
                <span className="text-xs font-medium text-slate-500">Operational Readiness</span>
                <div className="flex items-end justify-between mt-4">
                  <span className="text-xl font-bold text-slate-950">{rel.operationalScore}%</span>
                  <span className="text-2xs text-emerald-600 font-semibold">Stable</span>
                </div>
              </div>
            </div>

            {/* Meta details footer */}
            <div className="bg-slate-50/30 border-t border-slate-100 px-6 py-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                <span>Confidence: <strong className="text-slate-800">{rel.confidence}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-slate-400" />
                <span>Risk: <strong className="text-slate-800 capitalize">{rel.risk}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>Test Cases: <strong className="text-slate-800">{rel.testCompletion}% Complete</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="h-4 w-4 text-slate-400" />
                <span>Critical Defects: <strong className="text-slate-800">{rel.criticalDefects}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReleaseReadinessPage;
