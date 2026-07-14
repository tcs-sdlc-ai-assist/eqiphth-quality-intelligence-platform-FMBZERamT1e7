import { useState, useEffect, useCallback, useMemo } from 'react';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Activity,
  Monitor,
  Shield,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Plus,
  Eye,
  Edit,
  FileText,
  Database,
  Layers,
  BarChart2,
  Tag,
  User,
  Calendar,
  ChevronRight,
  X,
  Search,
  Settings,
  Zap,
  GitBranch,
  Server,
  Code,
  TestTube,
  ClipboardCheck,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import {
  getApplications,
  addApplication,
  editApplication,
  exportApplications,
} from '@/lib/mock-api/mockService';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { ChartWrapper } from '@/components/shared/ChartWrapper';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusPill } from '@/components/shared/StatusPill';
import { EmptyState } from '@/components/shared/EmptyState';
import { DataTable } from '@/components/shared/DataTable';
import { PermissionGate } from '@/components/shared/PermissionGate';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Progress } from '@/components/ui/Progress';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu';
import {
  Tooltip as UITooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/Tooltip';
import { PERMISSIONS, ROUTES, MEASURE_STATUS } from '@/lib/constants';

const SEGMENT_COLORS = {
  Enterprise: '#16b364',
  Medicare: '#3b82f6',
  Medicaid: '#f59e0b',
  Commercial: '#8b5cf6',
  External: '#ef4444',
  Compliance: '#06b6d4',
};

const RISK_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#dc2626',
};

const STATUS_CHART_COLORS = {
  [MEASURE_STATUS.ON_TRACK]: '#10b981',
  [MEASURE_STATUS.AT_RISK]: '#f59e0b',
  [MEASURE_STATUS.CRITICAL]: '#ef4444',
  [MEASURE_STATUS.COMPLETED]: '#3b82f6',
  [MEASURE_STATUS.NOT_STARTED]: '#a3a3a3',
};

const SEGMENT_OPTIONS = [
  { value: '', label: 'All Segments' },
  { value: 'Enterprise', label: 'Enterprise' },
  { value: 'Medicare', label: 'Medicare' },
  { value: 'Medicaid', label: 'Medicaid' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'External', label: 'External' },
  { value: 'Compliance', label: 'Compliance' },
];

const RISK_OPTIONS = [
  { value: '', label: 'All Risk Levels' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: MEASURE_STATUS.ON_TRACK, label: 'On Track' },
  { value: MEASURE_STATUS.AT_RISK, label: 'At Risk' },
  { value: MEASURE_STATUS.CRITICAL, label: 'Critical' },
];

function CustomTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-dropdown">
      <p className="text-xs font-medium text-slate-900">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-xs text-slate-600" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
          {unit}
        </p>
      ))}
    </div>
  );
}

function getRiskBadgeVariant(riskLevel) {
  switch (riskLevel) {
    case 'critical':
      return 'error';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
    default:
      return 'success';
  }
}

function AddEditDialog({ open, onOpenChange, onSubmit, loading, application }) {
  const isEdit = Boolean(application);
  const [formData, setFormData] = useState({
    name: '',
    segment: 'Enterprise',
    owner: '',
    riskLevel: 'medium',
    environment: 'Production',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (application) {
      setFormData({
        name: application.name || '',
        segment: application.segment || 'Enterprise',
        owner: application.owner || '',
        riskLevel: application.riskLevel || 'medium',
        environment: application.environment || 'Production',
      });
    } else {
      setFormData({
        name: '',
        segment: 'Enterprise',
        owner: '',
        riskLevel: 'medium',
        environment: 'Production',
      });
    }
    setErrors({});
  }, [application, open]);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleInputChange = useCallback(
    (field) => (e) => {
      handleChange(field, e.target.value);
    },
    [handleChange]
  );

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Application name is required';
    }
    if (!formData.owner.trim()) {
      newErrors.owner = 'Owner is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    onSubmit(formData);
  }, [formData, validate, onSubmit]);

  const handleOpenChange = useCallback(
    (nextOpen) => {
      if (!nextOpen) {
        setFormData({
          name: '',
          segment: 'Enterprise',
          owner: '',
          riskLevel: 'medium',
          environment: 'Production',
        });
        setErrors({});
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Application' : 'Add Application'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the application details below.'
              : 'Enter the details for the new application.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <Input
            label="Application Name"
            placeholder="Enter application name"
            value={formData.name}
            onChange={handleInputChange('name')}
            error={errors.name}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Segment"
              options={SEGMENT_OPTIONS.filter((s) => s.value !== '')}
              value={formData.segment}
              onValueChange={(val) => handleChange('segment', val)}
            />
            <Select
              label="Risk Level"
              options={RISK_OPTIONS.filter((r) => r.value !== '')}
              value={formData.riskLevel}
              onValueChange={(val) => handleChange('riskLevel', val)}
            />
          </div>

          <Input
            label="Owner"
            placeholder="Enter owner name"
            value={formData.owner}
            onChange={handleInputChange('owner')}
            error={errors.owner}
            required
          />

          <Input
            label="Environment"
            placeholder="e.g. Production"
            value={formData.environment}
            onChange={handleInputChange('environment')}
          />
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" size="md" onClick={() => handleOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Save Changes' : 'Add Application'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ApplicationDetailDialog({ application, open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (open) {
      setActiveTab('overview');
    }
  }, [open]);

  if (!application) return null;

  const overview = application.overview || {};
  const releases = application.releases || [];
  const tests = application.tests || [];
  const governance = application.governance || [];
  const trendData = overview.trendData || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Monitor className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{application.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {application.id} • {application.segment} • {application.environment}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill status={application.qualityStatus} size="md" dot />
          <Badge variant={getRiskBadgeVariant(application.riskLevel)} size="md">
            {application.riskLevel} risk
          </Badge>
          <Badge variant="outline" size="md">
            {application.automationCoverage.toFixed(1)}% automated
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Test Cases</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{formatNumber(application.testCaseCount)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Releases</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{application.releaseCount}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Uptime</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{overview.uptime ? `${overview.uptime}%` : '—'}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">MTTR</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{overview.mttr ? `${overview.mttr}h` : '—'}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Owner:</span>
            <span className="font-medium text-slate-900">{application.owner}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Layers className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Segment:</span>
            <span className="font-medium text-slate-900">{application.segment}</span>
          </div>
          {overview.lastDeployDate ? (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Last Deploy:</span>
              <span className="font-medium text-slate-900">{formatDate(overview.lastDeployDate)}</span>
            </div>
          ) : null}
          {overview.activeUsers ? (
            <div className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Active Users:</span>
              <span className="font-medium text-slate-900">{formatNumber(overview.activeUsers)}</span>
            </div>
          ) : null}
        </div>

        {application.techStack && application.techStack.length > 0 ? (
          <div className="mt-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Tech Stack</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {application.techStack.map((tech) => (
                <Badge key={tech} variant="outline" size="sm">{tech}</Badge>
              ))}
            </div>
          </div>
        ) : null}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="releases">Releases ({releases.length})</TabsTrigger>
            <TabsTrigger value="tests">Tests ({tests.length})</TabsTrigger>
            <TabsTrigger value="governance">Governance ({governance.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="flex flex-col gap-4 pt-2">
              {overview.description ? (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Description</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{overview.description}</p>
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-slate-200 p-3">
                  <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Change Failure Rate</span>
                  <p className="mt-1 text-base font-semibold text-slate-900">{overview.changeFailureRate != null ? `${overview.changeFailureRate}%` : '—'}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Deploy Frequency</span>
                  <p className="mt-1 text-base font-semibold text-slate-900">{overview.deploymentFrequency != null ? `${overview.deploymentFrequency}/mo` : '—'}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Automation</span>
                  <p className="mt-1 text-base font-semibold text-slate-900">{application.automationCoverage.toFixed(1)}%</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Created</span>
                  <p className="mt-1 text-base font-semibold text-slate-900">{overview.createdDate ? formatDate(overview.createdDate) : '—'}</p>
                </div>
              </div>

              {trendData.length > 0 ? (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Incident & Deployment Trend</h4>
                  <ChartWrapper height={220} noCard noPadding>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11, fill: '#64748b' }}
                          axisLine={{ stroke: '#e2e8f0' }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: '#64748b' }}
                          axisLine={{ stroke: '#e2e8f0' }}
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" iconSize={8} />
                        <Bar dataKey="deployments" name="Deployments" fill="#16b364" radius={[3, 3, 0, 0]} barSize={14} />
                        <Bar dataKey="incidents" name="Incidents" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={14} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartWrapper>
                </div>
              ) : null}

              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Automation Coverage</h4>
                <Progress
                  value={application.automationCoverage}
                  max={100}
                  variant="auto"
                  size="md"
                  showValue
                  label="Automation Coverage"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="releases">
            <div className="flex flex-col gap-2 pt-2">
              {releases.length === 0 ? (
                <EmptyState
                  type="no_data"
                  title="No releases"
                  message="No release history available for this application."
                  size="sm"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Version</th>
                        <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Date</th>
                        <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Quality</th>
                        <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Passed</th>
                        <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Failed</th>
                        <th className="pb-2 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {releases.map((rel) => (
                        <tr key={rel.id} className="border-b border-slate-100 last:border-b-0">
                          <td className="py-2.5 font-medium text-slate-900">{rel.version}</td>
                          <td className="py-2.5 text-slate-700">{formatDate(rel.date)}</td>
                          <td className="py-2.5 text-right text-slate-700">{rel.qualityScore.toFixed(1)}</td>
                          <td className="py-2.5 text-right text-success-600">{formatNumber(rel.testsPassed)}</td>
                          <td className="py-2.5 text-right text-danger-600">{rel.testsFailed}</td>
                          <td className="py-2.5 text-center">
                            <StatusPill status={rel.status} size="sm" dot />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tests">
            <div className="flex flex-col gap-2 pt-2">
              {tests.length === 0 ? (
                <EmptyState
                  type="no_data"
                  title="No test suites"
                  message="No test suite data available for this application."
                  size="sm"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Suite</th>
                        <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Type</th>
                        <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Total</th>
                        <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Passed</th>
                        <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Failed</th>
                        <th className="pb-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Coverage</th>
                        <th className="pb-2 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tests.map((suite) => (
                        <tr key={suite.id} className="border-b border-slate-100 last:border-b-0">
                          <td className="py-2.5 font-medium text-slate-900 text-xs">{suite.name}</td>
                          <td className="py-2.5">
                            <Badge variant="outline" size="sm">{suite.type}</Badge>
                          </td>
                          <td className="py-2.5 text-right text-slate-700">{suite.totalTests}</td>
                          <td className="py-2.5 text-right text-success-600">{suite.passed}</td>
                          <td className="py-2.5 text-right text-danger-600">{suite.failed}</td>
                          <td className="py-2.5 text-right text-slate-700">{suite.coveragePercent > 0 ? `${suite.coveragePercent.toFixed(1)}%` : '—'}</td>
                          <td className="py-2.5 text-center">
                            <StatusPill status={suite.status} size="sm" dot />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="governance">
            <div className="flex flex-col gap-2 pt-2">
              {governance.length === 0 ? (
                <EmptyState
                  type="no_data"
                  title="No governance rules"
                  message="No governance rules configured for this application."
                  size="sm"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Rule</th>
                        <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Category</th>
                        <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Owner</th>
                        <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Last Audit</th>
                        <th className="pb-2 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {governance.map((rule) => (
                        <tr key={rule.id} className="border-b border-slate-100 last:border-b-0">
                          <td className="py-2.5">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900 text-xs">{rule.name}</span>
                              <span className="text-2xs text-slate-500 line-clamp-1">{rule.description}</span>
                            </div>
                          </td>
                          <td className="py-2.5">
                            <Badge variant="outline" size="sm">{rule.category}</Badge>
                          </td>
                          <td className="py-2.5 text-slate-700 text-xs">{rule.owner}</td>
                          <td className="py-2.5 text-slate-700 text-xs">{formatDate(rule.lastAuditDate)}</td>
                          <td className="py-2.5 text-center">
                            <StatusPill status={rule.status} size="sm" dot />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function AnalyticsPanel({ applications }) {
  const segmentData = useMemo(() => {
    const counts = {};
    for (const app of applications) {
      counts[app.segment] = (counts[app.segment] || 0) + 1;
    }
    return Object.entries(counts).map(([segment, count]) => ({
      segment,
      count,
    }));
  }, [applications]);

  const riskData = useMemo(() => {
    const counts = {};
    for (const app of applications) {
      counts[app.riskLevel] = (counts[app.riskLevel] || 0) + 1;
    }
    return Object.entries(counts).map(([level, count]) => ({
      level,
      count,
      label: level.charAt(0).toUpperCase() + level.slice(1),
    }));
  }, [applications]);

  const statusData = useMemo(() => {
    const counts = {};
    for (const app of applications) {
      counts[app.qualityStatus] = (counts[app.qualityStatus] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
  }, [applications]);

  const automationData = useMemo(() => {
    return applications
      .map((app) => ({
        name: app.name.length > 18 ? app.name.substring(0, 18) + '…' : app.name,
        coverage: app.automationCoverage,
      }))
      .sort((a, b) => b.coverage - a.coverage)
      .slice(0, 12);
  }, [applications]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PanelCard
        title="Applications by Segment"
        subtitle="Distribution across organizational segments"
        icon={<Layers className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={segmentData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="segment"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Applications" radius={[4, 4, 0, 0]} barSize={32}>
                {segmentData.map((entry) => (
                  <Cell key={entry.segment} fill={SEGMENT_COLORS[entry.segment] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Risk Level Distribution"
        subtitle="Applications by risk classification"
        icon={<AlertTriangle className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {riskData.map((entry) => (
                    <Cell key={entry.level} fill={RISK_COLORS[entry.level] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} apps`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {riskData.map((item) => (
              <div key={item.level} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: RISK_COLORS[item.level] || '#a3a3a3' }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium capitalize text-slate-700">{item.level}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title="Quality Status Overview"
        subtitle="Applications by quality status"
        icon={<Shield className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_CHART_COLORS[entry.status] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} apps`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {statusData.map((item) => (
              <div key={item.status} className="flex items-center justify-between gap-3">
                <StatusPill status={item.status} size="sm" dot />
                <span className="text-sm font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title="Automation Coverage"
        subtitle="Top applications by test automation coverage"
        icon={<Zap className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={automationData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                domain={[0, 100]}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Bar dataKey="coverage" name="Coverage %" fill="#16b364" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>
    </div>
  );
}

function ApplicationMasterSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading applications" aria-busy="true">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-96 rounded-xl" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Application Master Repository page component.
 * Displays application list with detailed fields, filters, tabs, and actions.
 *
 * @returns {React.ReactElement}
 */
function ApplicationMasterPage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [addEditLoading, setAddEditLoading] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filters, setFilters] = useState({
    segment: '',
    riskLevel: '',
    qualityStatus: '',
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Measures', path: ROUTES.MEASURES },
      { label: 'Applications' },
    ]);
  }, [setBreadcrumbs]);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      const filterParams = {};
      if (filters.segment) filterParams.segment = filters.segment;
      if (filters.riskLevel) filterParams.riskLevel = filters.riskLevel;
      if (filters.qualityStatus) filterParams.qualityStatus = filters.qualityStatus;
      const data = await getApplications(filterParams);
      setApplications(data);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    loadApplications();
  }, [loadApplications]);

  const handleAddClick = useCallback(() => {
    setEditTarget(null);
    setAddEditOpen(true);
  }, []);

  const handleEditClick = useCallback((app) => {
    setEditTarget(app);
    setAddEditOpen(true);
  }, []);

  const handleAddEditSubmit = useCallback(
    async (formData) => {
      setAddEditLoading(true);
      try {
        if (editTarget) {
          const updated = await editApplication(editTarget.id, formData);
          logEvent('config_change', {
            action: 'Application Updated',
            details: `Application "${updated.name}" updated by ${currentPersona.name}.`,
            resource: updated.id,
            outcome: 'success',
            segment: updated.segment,
          });
          toast({
            variant: 'success',
            title: 'Application Updated',
            description: `"${updated.name}" has been updated successfully.`,
          });
        } else {
          const created = await addApplication({
            ...formData,
            qualityStatus: MEASURE_STATUS.NOT_STARTED,
            automationCoverage: 0,
            testCaseCount: 0,
            releaseCount: 0,
            techStack: [],
            integrations: [],
            overview: {
              description: '',
              createdDate: new Date().toISOString().split('T')[0],
              lastDeployDate: '',
              activeUsers: 0,
              uptime: 0,
              mttr: 0,
              changeFailureRate: 0,
              deploymentFrequency: 0,
              trendData: [],
            },
            releases: [],
            tests: [],
            governance: [],
          });
          logEvent('config_change', {
            action: 'Application Added',
            details: `Application "${created.name}" added by ${currentPersona.name}.`,
            resource: created.id,
            outcome: 'success',
            segment: created.segment,
          });
          toast({
            variant: 'success',
            title: 'Application Added',
            description: `"${created.name}" has been added to the repository.`,
          });
        }
        setAddEditOpen(false);
        setEditTarget(null);
        await loadApplications();
      } catch (err) {
        toast({
          variant: 'error',
          title: editTarget ? 'Update Failed' : 'Add Failed',
          description: err && err.error ? err.error : 'An error occurred.',
        });
      } finally {
        setAddEditLoading(false);
      }
    },
    [editTarget, currentPersona, logEvent, toast, loadApplications]
  );

  const handleAppClick = useCallback((app) => {
    setSelectedApp(app);
    setDetailOpen(true);
  }, []);

  const handleDetailClose = useCallback((open) => {
    setDetailOpen(open);
    if (!open) {
      setSelectedApp(null);
    }
  }, []);

  const handleExportCSV = useCallback(async () => {
    try {
      const data = await exportApplications(filters);
      downloadCSV(data, 'applications.csv');
      logEvent('data_export', {
        action: 'Exported Applications',
        details: `Applications exported as CSV by ${currentPersona.name}. ${data.length} records.`,
        resource: '/measures',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} applications exported as CSV.`,
      });
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: err && err.error ? err.error : 'Failed to export applications.',
      });
    }
  }, [filters, currentPersona, logEvent, toast]);

  const handleExportJSON = useCallback(async () => {
    try {
      const data = await exportApplications(filters);
      downloadJSON(data, 'applications.json');
      logEvent('data_export', {
        action: 'Exported Applications',
        details: `Applications exported as JSON by ${currentPersona.name}. ${data.length} records.`,
        resource: '/measures',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} applications exported as JSON.`,
      });
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: err && err.error ? err.error : 'Failed to export applications.',
      });
    }
  }, [filters, currentPersona, logEvent, toast]);

  const kpiData = useMemo(() => {
    const total = applications.length;
    const onTrack = applications.filter((a) => a.qualityStatus === MEASURE_STATUS.ON_TRACK).length;
    const atRisk = applications.filter((a) => a.qualityStatus === MEASURE_STATUS.AT_RISK).length;
    const critical = applications.filter((a) => a.qualityStatus === MEASURE_STATUS.CRITICAL).length;
    const avgAutomation = total > 0
      ? Math.round((applications.reduce((sum, a) => sum + a.automationCoverage, 0) / total) * 10) / 10
      : 0;
    const totalTests = applications.reduce((sum, a) => sum + a.testCaseCount, 0);

    return [
      {
        id: 'kpi_total',
        label: 'Total Applications',
        value: total,
        unit: 'count',
        trend: 'stable',
        status: 'on_track',
        description: 'Total applications in the repository.',
      },
      {
        id: 'kpi_on_track',
        label: 'On Track',
        value: onTrack,
        unit: 'count',
        trend: 'improving',
        status: 'on_track',
        description: 'Applications meeting quality targets.',
      },
      {
        id: 'kpi_at_risk',
        label: 'At Risk / Critical',
        value: atRisk + critical,
        unit: 'count',
        trend: atRisk + critical > 5 ? 'declining' : 'stable',
        status: atRisk + critical > 5 ? 'at_risk' : 'on_track',
        description: 'Applications requiring attention.',
      },
      {
        id: 'kpi_automation',
        label: 'Avg Automation',
        value: avgAutomation,
        unit: 'percent',
        trend: avgAutomation >= 80 ? 'improving' : 'declining',
        status: avgAutomation >= 85 ? 'on_track' : 'at_risk',
        description: 'Average test automation coverage.',
      },
    ];
  }, [applications]);

  const filterFields = useMemo(() => {
    return [
      {
        id: 'segment',
        label: 'Segment',
        type: 'select',
        options: SEGMENT_OPTIONS,
        defaultValue: '',
      },
      {
        id: 'riskLevel',
        label: 'Risk Level',
        type: 'select',
        options: RISK_OPTIONS,
        defaultValue: '',
      },
      {
        id: 'qualityStatus',
        label: 'Quality Status',
        type: 'select',
        options: STATUS_OPTIONS,
        defaultValue: '',
      },
    ];
  }, []);

  const tableColumns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Application',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleAppClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors"
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: 'segment',
        header: 'Segment',
        size: 110,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: SEGMENT_COLORS[row.original.segment] || '#64748b' }}
              aria-hidden="true"
            />
            <span className="text-sm text-slate-700">{row.original.segment}</span>
          </div>
        ),
      },
      {
        accessorKey: 'owner',
        header: 'Owner',
        size: 140,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.owner}</span>
        ),
      },
      {
        accessorKey: 'riskLevel',
        header: 'Risk',
        size: 100,
        cell: ({ row }) => (
          <Badge variant={getRiskBadgeVariant(row.original.riskLevel)} size="sm">
            {row.original.riskLevel}
          </Badge>
        ),
      },
      {
        accessorKey: 'qualityStatus',
        header: 'Status',
        size: 120,
        cell: ({ row }) => (
          <StatusPill status={row.original.qualityStatus} size="sm" dot />
        ),
      },
      {
        accessorKey: 'automationCoverage',
        header: 'Automation',
        size: 120,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Progress
              value={row.original.automationCoverage}
              max={100}
              variant="auto"
              size="xs"
              className="flex-1"
            />
            <span className="text-xs font-medium text-slate-700 w-10 text-right">
              {row.original.automationCoverage.toFixed(1)}%
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'testCaseCount',
        header: 'Tests',
        size: 80,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{formatNumber(row.original.testCaseCount)}</span>
        ),
      },
      {
        accessorKey: 'releaseCount',
        header: 'Releases',
        size: 80,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.releaseCount}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 80,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5">
            <UITooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleAppClick(row.original)}
                  className={cn(
                    'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                    'hover:bg-slate-100 hover:text-slate-600',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                  )}
                  aria-label={`View ${row.original.name}`}
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">View Details</TooltipContent>
            </UITooltip>
            <PermissionGate requiredAction={PERMISSIONS.EDIT_MEASURES} behavior="hidden">
              <UITooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(row.original);
                    }}
                    className={cn(
                      'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                      'hover:bg-slate-100 hover:text-slate-600',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                    )}
                    aria-label={`Edit ${row.original.name}`}
                  >
                    <Edit className="h-4 w-4" aria-hidden="true" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Edit</TooltipContent>
              </UITooltip>
            </PermissionGate>
          </div>
        ),
      },
    ],
    [handleAppClick, handleEditClick]
  );

  if (loading) {
    return <ApplicationMasterSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">Application Repository</h1>
          <p className="text-sm text-slate-500">
            Master repository of all applications with quality metrics, releases, and governance for {currentPersona.name}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            iconLeft={<RefreshCw className="h-3.5 w-3.5" />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>

          <PermissionGate requiredAction={PERMISSIONS.EXPORT_REPORTS} behavior="hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  iconLeft={<Download className="h-3.5 w-3.5" />}
                >
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Export as</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportCSV}>
                  <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                  CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON}>
                  <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                  JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </PermissionGate>

          <PermissionGate requiredAction={PERMISSIONS.EDIT_MEASURES} behavior="hidden">
            <Button
              variant="primary"
              size="sm"
              iconLeft={<Plus className="h-3.5 w-3.5" />}
              onClick={handleAddClick}
            >
              Add Application
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            trend={kpi.trend}
            status={kpi.status}
            description={kpi.description}
          />
        ))}
      </div>

      {/* Filters */}
      <FilterBar
        fields={filterFields}
        values={filters}
        onChange={handleFilterChange}
        liveMode
        showApplyButton={false}
        showResetButton
        showActiveFilters
      />

      {/* Tabs: List / Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {applications.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No applications found"
              message="No applications match the current filter criteria. Try adjusting your filters or add a new application."
              size="lg"
              bordered
              actionLabel={hasPermission(PERMISSIONS.EDIT_MEASURES) ? 'Add Application' : undefined}
              onAction={hasPermission(PERMISSIONS.EDIT_MEASURES) ? handleAddClick : undefined}
              actionIcon={<Plus className="h-3.5 w-3.5" />}
            />
          ) : (
            <DataTable
              columns={tableColumns}
              data={applications}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search applications..."
              emptyMessage="No applications match the search criteria."
              onRowClick={handleAppClick}
            />
          )}
        </TabsContent>

        <TabsContent value="cards">
          {applications.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No applications found"
              message="No applications match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((app) => (
                <Card
                  key={app.id}
                  className={cn(
                    'p-5 cursor-pointer transition-all duration-200',
                    'hover:shadow-card-hover hover:border-humana-green-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                    'active:scale-[0.99]'
                  )}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleAppClick(app)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleAppClick(app);
                    }
                  }}
                  aria-label={`${app.name}. Status: ${app.qualityStatus}. Risk: ${app.riskLevel}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${SEGMENT_COLORS[app.segment] || '#64748b'}15` }}
                      >
                        <Monitor
                          className="h-4.5 w-4.5"
                          style={{ color: SEGMENT_COLORS[app.segment] || '#64748b' }}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex flex-col gap-0 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">{app.name}</h3>
                        <span className="text-2xs text-slate-500">{app.segment} • {app.owner}</span>
                      </div>
                    </div>
                    <StatusPill status={app.qualityStatus} size="sm" dot />
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-2xs text-slate-400 uppercase tracking-wider">Risk</span>
                      <Badge variant={getRiskBadgeVariant(app.riskLevel)} size="sm">
                        {app.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-2xs text-slate-400 uppercase tracking-wider">Tests</span>
                      <span className="text-sm font-semibold text-slate-900">{formatNumber(app.testCaseCount)}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-2xs text-slate-400 uppercase tracking-wider">Releases</span>
                      <span className="text-sm font-semibold text-slate-900">{app.releaseCount}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xs text-slate-400">Automation</span>
                      <span className="text-2xs font-medium text-slate-700">{app.automationCoverage.toFixed(1)}%</span>
                    </div>
                    <Progress
                      value={app.automationCoverage}
                      max={100}
                      variant="auto"
                      size="xs"
                      animate
                    />
                  </div>

                  {app.techStack && app.techStack.length > 0 ? (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {app.techStack.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" size="sm">{tech}</Badge>
                      ))}
                      {app.techStack.length > 3 ? (
                        <Badge variant="outline" size="sm">+{app.techStack.length - 3}</Badge>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="mt-2.5 flex items-center justify-end">
                    <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {applications.length === 0 ? (
            <EmptyState
              type="no_chart"
              title="No data for analytics"
              message="No applications available to generate analytics. Try adjusting your filters."
              size="lg"
              bordered
            />
          ) : (
            <AnalyticsPanel applications={applications} />
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Table */}
      {applications.length > 0 && activeTab !== 'analytics' ? (
        <PanelCard
          title="Application Summary"
          subtitle={`${applications.length} applications across ${new Set(applications.map((a) => a.segment)).size} segments`}
          icon={<Activity className="h-5 w-5" />}
          collapsible
          defaultCollapsed
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Total Test Cases</span>
              <span className="text-2xl font-semibold text-slate-900">
                {formatNumber(applications.reduce((sum, a) => sum + a.testCaseCount, 0))}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Total Releases</span>
              <span className="text-2xl font-semibold text-slate-900">
                {formatNumber(applications.reduce((sum, a) => sum + a.releaseCount, 0))}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg Automation</span>
              <span className="text-2xl font-semibold text-slate-900">
                {applications.length > 0
                  ? (applications.reduce((sum, a) => sum + a.automationCoverage, 0) / applications.length).toFixed(1)
                  : 0}%
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">High/Critical Risk</span>
              <span className="text-2xl font-semibold text-slate-900">
                {applications.filter((a) => a.riskLevel === 'high' || a.riskLevel === 'critical').length}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {Array.from(new Set(applications.map((a) => a.segment))).sort().map((segment) => {
              const segApps = applications.filter((a) => a.segment === segment);
              return (
                <div key={segment} className="flex items-center gap-3">
                  <div className="w-24 shrink-0 flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: SEGMENT_COLORS[segment] || '#64748b' }}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-slate-700">{segment}</span>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={segApps.length}
                      max={applications.length || 1}
                      variant="primary"
                      size="sm"
                      animate
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 w-8 text-right">{segApps.length}</span>
                </div>
              );
            })}
          </div>
        </PanelCard>
      ) : null}

      {/* Add/Edit Dialog */}
      <AddEditDialog
        open={addEditOpen}
        onOpenChange={(open) => {
          setAddEditOpen(open);
          if (!open) setEditTarget(null);
        }}
        onSubmit={handleAddEditSubmit}
        loading={addEditLoading}
        application={editTarget}
      />

      {/* Detail Dialog */}
      <ApplicationDetailDialog
        application={selectedApp}
        open={detailOpen}
        onOpenChange={handleDetailClose}
      />
    </div>
  );
}

ApplicationMasterPage.displayName = 'ApplicationMasterPage';

export { ApplicationMasterPage };
export default ApplicationMasterPage;