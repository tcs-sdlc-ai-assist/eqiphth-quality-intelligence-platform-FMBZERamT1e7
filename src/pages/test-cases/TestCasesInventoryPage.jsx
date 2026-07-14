import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BarChart,
  Bar,
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
  TestTube,
  Activity,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Plus,
  Eye,
  Edit,
  Copy,
  Archive,
  Upload,
  FileText,
  BarChart2,
  Tag,
  User,
  Calendar,
  ChevronRight,
  Layers,
  Zap,
  Shield,
  AlertTriangle,
  Clock,
  ThumbsUp,
  Search,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import {
  getTestCases,
  createTestCase,
  editTestCase,
  approveTestCase,
  cloneTestCase,
  retireTestCase,
  importTestCases,
} from '@/lib/mock-api/mockService';
import {
  getAllTestCaseTypes,
  getAllTestCaseStatuses,
  getAllTestCasePriorities,
  getAllAutomationStatuses,
} from '@/data/testCases';
import { getAllApplications } from '@/data/applications';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { ChartWrapper } from '@/components/shared/ChartWrapper';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusPill } from '@/components/shared/StatusPill';
import { EmptyState } from '@/components/shared/EmptyState';
import { DataTable } from '@/components/shared/DataTable';
import { PermissionGate } from '@/components/shared/PermissionGate';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
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
import { PERMISSIONS, ROUTES } from '@/lib/constants';

const TYPE_COLORS = {
  functional: '#16b364',
  regression: '#3b82f6',
  smoke: '#06b6d4',
  integration: '#8b5cf6',
  e2e: '#f59e0b',
  performance: '#ef4444',
  security: '#dc2626',
  accessibility: '#10b981',
};

const STATUS_COLORS = {
  passed: '#10b981',
  failed: '#ef4444',
  blocked: '#f59e0b',
  not_run: '#a3a3a3',
  'in_progress': '#3b82f6',
  skipped: '#94a3b8',
};

const PRIORITY_COLORS = {
  critical: '#dc2626',
  high: '#f59e0b',
  medium: '#3b82f6',
  low: '#a3a3a3',
};

const AUTOMATION_COLORS = {
  automated: '#10b981',
  manual: '#ef4444',
  hybrid: '#f59e0b',
  planned: '#3b82f6',
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

function CustomTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-dropdown">
      <p className="text-xs font-medium text-slate-900">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-xs text-slate-600" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value : entry.value}
          {unit}
        </p>
      ))}
    </div>
  );
}

function getPriorityBadgeVariant(priority) {
  switch (priority) {
    case 'critical':
      return 'error';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
    default:
      return 'neutral';
  }
}

function getTypeBadgeVariant(type) {
  switch (type) {
    case 'functional':
      return 'primary';
    case 'regression':
      return 'info';
    case 'smoke':
      return 'success';
    case 'integration':
      return 'warning';
    case 'e2e':
      return 'neutral';
    case 'performance':
      return 'error';
    case 'security':
      return 'error';
    case 'accessibility':
      return 'success';
    default:
      return 'neutral';
  }
}

function getAutomationBadgeVariant(automationStatus) {
  switch (automationStatus) {
    case 'automated':
      return 'success';
    case 'manual':
      return 'error';
    case 'hybrid':
      return 'warning';
    case 'planned':
      return 'info';
    default:
      return 'neutral';
  }
}

function getApprovalBadgeVariant(approvalStatus) {
  switch (approvalStatus) {
    case 'approved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'error';
    case 'draft':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function CreateEditDialog({ open, onOpenChange, onSubmit, loading, testCase }) {
  const isEdit = Boolean(testCase);
  const applications = useMemo(() => getAllApplications(), []);
  const applicationOptions = useMemo(() => {
    return applications.map((a) => ({ value: a.id, label: a.name }));
  }, [applications]);

  const typeOptions = useMemo(() => {
    return getAllTestCaseTypes().map((t) => ({
      value: t,
      label: t.charAt(0).toUpperCase() + t.slice(1),
    }));
  }, []);

  const priorityOptions = useMemo(() => {
    return getAllTestCasePriorities().map((p) => ({
      value: p,
      label: p.charAt(0).toUpperCase() + p.slice(1),
    }));
  }, []);

  const automationOptions = useMemo(() => {
    return getAllAutomationStatuses().map((a) => ({
      value: a,
      label: a.charAt(0).toUpperCase() + a.slice(1),
    }));
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    type: 'functional',
    priority: 'medium',
    application: '',
    segment: 'Enterprise',
    automationStatus: 'manual',
    expectedResult: '',
    tags: '',
    createdBy: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (testCase) {
      setFormData({
        title: testCase.title || '',
        type: testCase.type || 'functional',
        priority: testCase.priority || 'medium',
        application: testCase.application || '',
        segment: testCase.segment || 'Enterprise',
        automationStatus: testCase.automationStatus || 'manual',
        expectedResult: testCase.expectedResult || '',
        tags: Array.isArray(testCase.tags) ? testCase.tags.join(', ') : '',
        createdBy: testCase.createdBy || '',
      });
    } else {
      setFormData({
        title: '',
        type: 'functional',
        priority: 'medium',
        application: '',
        segment: 'Enterprise',
        automationStatus: 'manual',
        expectedResult: '',
        tags: '',
        createdBy: '',
      });
    }
    setErrors({});
  }, [testCase, open]);

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
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.createdBy.trim()) {
      newErrors.createdBy = 'Creator is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    const tagsArray = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];
    onSubmit({
      ...formData,
      tags: tagsArray,
      steps: testCase ? testCase.steps : [],
    });
  }, [formData, validate, onSubmit, testCase]);

  const handleOpenChange = useCallback(
    (nextOpen) => {
      if (!nextOpen) {
        setFormData({
          title: '',
          type: 'functional',
          priority: 'medium',
          application: '',
          segment: 'Enterprise',
          automationStatus: 'manual',
          expectedResult: '',
          tags: '',
          createdBy: '',
        });
        setErrors({});
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Test Case' : 'Create Test Case'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the test case details below.'
              : 'Enter the details for the new test case.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <Input
            label="Title"
            placeholder="Enter test case title"
            value={formData.title}
            onChange={handleInputChange('title')}
            error={errors.title}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Type"
              options={typeOptions}
              value={formData.type}
              onValueChange={(val) => handleChange('type', val)}
            />
            <Select
              label="Priority"
              options={priorityOptions}
              value={formData.priority}
              onValueChange={(val) => handleChange('priority', val)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Segment"
              options={SEGMENT_OPTIONS.filter((s) => s.value !== '')}
              value={formData.segment}
              onValueChange={(val) => handleChange('segment', val)}
            />
            <Select
              label="Automation Status"
              options={automationOptions}
              value={formData.automationStatus}
              onValueChange={(val) => handleChange('automationStatus', val)}
            />
          </div>

          <Select
            label="Application"
            placeholder="Select application"
            options={applicationOptions}
            value={formData.application}
            onValueChange={(val) => handleChange('application', val)}
          />

          <Input
            label="Created By"
            placeholder="Enter creator name"
            value={formData.createdBy}
            onChange={handleInputChange('createdBy')}
            error={errors.createdBy}
            required
          />

          <Input
            label="Tags (comma-separated)"
            placeholder="e.g. claims, regression, critical-path"
            value={formData.tags}
            onChange={handleInputChange('tags')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium leading-none text-slate-700">
              Expected Result
            </label>
            <textarea
              className={cn(
                'flex min-h-[80px] w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 transition-colors duration-200',
                'placeholder:text-slate-400',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                'hover:border-slate-400',
                'border-slate-300 focus-visible:border-humana-green-500'
              )}
              placeholder="Describe the expected result..."
              value={formData.expectedResult}
              onChange={handleInputChange('expectedResult')}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" size="md" onClick={() => handleOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Save Changes' : 'Create Test Case'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TestCaseDetailDialog({ testCase, open, onOpenChange, onApprove, onClone, onRetire }) {
  const { hasPermission } = usePersona();

  if (!testCase) return null;

  const steps = testCase.steps || [];
  const tags = testCase.tags || [];
  const canApprove = hasPermission(PERMISSIONS.EDIT_QUALITY_GATES) && testCase.approvalStatus !== 'approved';
  const canClone = hasPermission(PERMISSIONS.EDIT_MEASURES);
  const canRetire = hasPermission(PERMISSIONS.EDIT_MEASURES) && testCase.status !== 'skipped';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <TestTube className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{testCase.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {testCase.id} • {testCase.type} • {testCase.segment}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill status={testCase.status} size="md" dot />
          <Badge variant={getPriorityBadgeVariant(testCase.priority)} size="md">
            {testCase.priority}
          </Badge>
          <Badge variant={getTypeBadgeVariant(testCase.type)} size="md">
            {testCase.type}
          </Badge>
          <Badge variant={getAutomationBadgeVariant(testCase.automationStatus)} size="md">
            {testCase.automationStatus}
          </Badge>
          <Badge variant={getApprovalBadgeVariant(testCase.approvalStatus)} size="md">
            {testCase.approvalStatus}
          </Badge>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Created By:</span>
            <span className="font-medium text-slate-900">{testCase.createdBy}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Last Modified:</span>
            <span className="font-medium text-slate-900">{formatDate(testCase.lastModified)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Application:</span>
            <span className="font-medium text-slate-900">{testCase.application || '—'}</span>
          </div>
        </div>

        {tags.length > 0 ? (
          <div className="mt-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Tags</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
              ))}
            </div>
          </div>
        ) : null}

        {testCase.expectedResult ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Expected Result</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{testCase.expectedResult}</p>
          </div>
        ) : null}

        {steps.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Test Steps ({steps.length})</h4>
            <div className="flex flex-col gap-2">
              {steps.map((step) => (
                <div key={step.stepNumber} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-humana-green-50 text-xs font-semibold text-humana-green-700">
                      {step.stepNumber}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{step.action}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        <span className="font-medium text-slate-600">Expected:</span> {step.expectedResult}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <DialogFooter className="pt-4">
          {canApprove ? (
            <Button
              variant="primary"
              size="md"
              iconLeft={<ThumbsUp className="h-3.5 w-3.5" />}
              onClick={() => onApprove(testCase.id)}
            >
              Approve
            </Button>
          ) : null}
          {canClone ? (
            <Button
              variant="outline"
              size="md"
              iconLeft={<Copy className="h-3.5 w-3.5" />}
              onClick={() => onClone(testCase.id)}
            >
              Clone
            </Button>
          ) : null}
          {canRetire ? (
            <Button
              variant="outline"
              size="md"
              iconLeft={<Archive className="h-3.5 w-3.5" />}
              onClick={() => onRetire(testCase.id)}
            >
              Retire
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ImportDialog({ open, onOpenChange, onImport, loading }) {
  const [importText, setImportText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setImportText('');
      setError('');
    }
  }, [open]);

  const handleImport = useCallback(() => {
    if (!importText.trim()) {
      setError('Please paste JSON data to import.');
      return;
    }
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) {
        setError('Import data must be a JSON array of test case objects.');
        return;
      }
      if (parsed.length === 0) {
        setError('Import data array is empty.');
        return;
      }
      onImport(parsed);
    } catch {
      setError('Invalid JSON format. Please check the data and try again.');
    }
  }, [importText, onImport]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Test Cases</DialogTitle>
          <DialogDescription>
            Paste a JSON array of test case objects to import into the inventory.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-2">
          <textarea
            className={cn(
              'flex min-h-[160px] w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 font-mono transition-colors duration-200',
              'placeholder:text-slate-400',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
              'hover:border-slate-400',
              error
                ? 'border-danger-500 hover:border-danger-600 focus-visible:ring-danger-500'
                : 'border-slate-300 focus-visible:border-humana-green-500'
            )}
            placeholder='[{"title": "Test Case 1", "type": "functional", ...}]'
            value={importText}
            onChange={(e) => {
              setImportText(e.target.value);
              setError('');
            }}
            rows={8}
          />
          {error ? (
            <p className="text-xs text-danger-500" role="alert">{error}</p>
          ) : null}
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" size="md" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleImport} loading={loading}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AnalyticsPanel({ testCases }) {
  const typeData = useMemo(() => {
    const counts = {};
    for (const tc of testCases) {
      counts[tc.type] = (counts[tc.type] || 0) + 1;
    }
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    }));
  }, [testCases]);

  const statusData = useMemo(() => {
    const counts = {};
    for (const tc of testCases) {
      counts[tc.status] = (counts[tc.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
  }, [testCases]);

  const priorityData = useMemo(() => {
    const counts = {};
    for (const tc of testCases) {
      counts[tc.priority] = (counts[tc.priority] || 0) + 1;
    }
    return Object.entries(counts).map(([priority, count]) => ({
      priority,
      count,
      label: priority.charAt(0).toUpperCase() + priority.slice(1),
    }));
  }, [testCases]);

  const automationData = useMemo(() => {
    const counts = {};
    for (const tc of testCases) {
      counts[tc.automationStatus] = (counts[tc.automationStatus] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: status.charAt(0).toUpperCase() + status.slice(1),
    }));
  }, [testCases]);

  const approvalData = useMemo(() => {
    const counts = {};
    for (const tc of testCases) {
      counts[tc.approvalStatus] = (counts[tc.approvalStatus] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: status.charAt(0).toUpperCase() + status.slice(1),
    }));
  }, [testCases]);

  const segmentData = useMemo(() => {
    const counts = {};
    for (const tc of testCases) {
      counts[tc.segment] = (counts[tc.segment] || 0) + 1;
    }
    return Object.entries(counts).map(([segment, count]) => ({
      segment,
      count,
    }));
  }, [testCases]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PanelCard
        title="Test Cases by Type"
        subtitle="Distribution across test types"
        icon={<Tag className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
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
              <Bar dataKey="count" name="Test Cases" radius={[4, 4, 0, 0]} barSize={28}>
                {typeData.map((entry) => (
                  <Cell key={entry.type} fill={TYPE_COLORS[entry.type] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Execution Status"
        subtitle="Test case execution status distribution"
        icon={<Activity className="h-5 w-5" />}
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
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} tests`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {statusData.map((item) => (
              <div key={item.status} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[item.status] || '#a3a3a3' }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title="Priority Distribution"
        subtitle="Test cases by priority level"
        icon={<AlertTriangle className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {priorityData.map((entry) => (
                    <Cell key={entry.priority} fill={PRIORITY_COLORS[entry.priority] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} tests`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {priorityData.map((item) => (
              <div key={item.priority} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: PRIORITY_COLORS[item.priority] || '#a3a3a3' }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium capitalize text-slate-700">{item.priority}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title="Automation Coverage"
        subtitle="Test cases by automation status"
        icon={<Zap className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={automationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {automationData.map((entry) => (
                    <Cell key={entry.status} fill={AUTOMATION_COLORS[entry.status] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} tests`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {automationData.map((item) => (
              <div key={item.status} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: AUTOMATION_COLORS[item.status] || '#a3a3a3' }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium capitalize text-slate-700">{item.status}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title="Test Cases by Segment"
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
              <Bar dataKey="count" name="Test Cases" fill="#16b364" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Approval Status"
        subtitle="Test case approval workflow status"
        icon={<Shield className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {approvalData.map((item) => (
            <div key={item.status} className="flex items-center gap-3">
              <div className="w-24 shrink-0">
                <Badge variant={getApprovalBadgeVariant(item.status)} size="sm">
                  {item.label}
                </Badge>
              </div>
              <div className="flex-1">
                <Progress
                  value={item.count}
                  max={testCases.length || 1}
                  variant="primary"
                  size="sm"
                  animate
                />
              </div>
              <span className="text-sm font-semibold text-slate-900 w-8 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}

function TestCasesInventorySkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading test cases inventory" aria-busy="true">
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
 * Test Cases Inventory page component.
 * Displays test case list with metrics, filters, and CRUD actions.
 *
 * @returns {React.ReactElement}
 */
function TestCasesInventoryPage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [testCasesData, setTestCasesData] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [createEditOpen, setCreateEditOpen] = useState(false);
  const [createEditLoading, setCreateEditLoading] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [retireConfirmOpen, setRetireConfirmOpen] = useState(false);
  const [retireTarget, setRetireTarget] = useState(null);
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    priority: '',
    automationStatus: '',
    segment: '',
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Measures', path: ROUTES.MEASURES },
      { label: 'Test Cases Inventory' },
    ]);
  }, [setBreadcrumbs]);

  const loadTestCases = useCallback(async () => {
    setLoading(true);
    try {
      const filterParams = {};
      if (filters.type) filterParams.type = filters.type;
      if (filters.status) filterParams.status = filters.status;
      if (filters.priority) filterParams.priority = filters.priority;
      if (filters.automationStatus) filterParams.automationStatus = filters.automationStatus;
      if (filters.segment) filterParams.segment = filters.segment;
      const data = await getTestCases(filterParams);
      setTestCasesData(data);
    } catch {
      setTestCasesData([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTestCases();
  }, [loadTestCases]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    loadTestCases();
  }, [loadTestCases]);

  const handleCreateClick = useCallback(() => {
    setEditTarget(null);
    setCreateEditOpen(true);
  }, []);

  const handleEditClick = useCallback((tc) => {
    setEditTarget(tc);
    setCreateEditOpen(true);
  }, []);

  const handleCreateEditSubmit = useCallback(
    async (formData) => {
      setCreateEditLoading(true);
      try {
        if (editTarget) {
          const updated = await editTestCase(editTarget.id, formData);
          logEvent('config_change', {
            action: 'Test Case Updated',
            details: `Test case "${updated.title}" updated by ${currentPersona.name}.`,
            resource: updated.id,
            outcome: 'success',
            segment: updated.segment,
          });
          toast({
            variant: 'success',
            title: 'Test Case Updated',
            description: `"${updated.title}" has been updated successfully.`,
          });
        } else {
          const created = await createTestCase(formData);
          logEvent('config_change', {
            action: 'Test Case Created',
            details: `Test case "${created.title}" created by ${currentPersona.name}.`,
            resource: created.id,
            outcome: 'success',
            segment: created.segment,
          });
          toast({
            variant: 'success',
            title: 'Test Case Created',
            description: `"${created.title}" has been added to the inventory.`,
          });
        }
        setCreateEditOpen(false);
        setEditTarget(null);
        await loadTestCases();
      } catch (err) {
        toast({
          variant: 'error',
          title: editTarget ? 'Update Failed' : 'Creation Failed',
          description: err && err.error ? err.error : 'An error occurred.',
        });
      } finally {
        setCreateEditLoading(false);
      }
    },
    [editTarget, currentPersona, logEvent, toast, loadTestCases]
  );

  const handleTestCaseClick = useCallback((tc) => {
    setSelectedTestCase(tc);
    setDetailOpen(true);
  }, []);

  const handleDetailClose = useCallback((open) => {
    setDetailOpen(open);
    if (!open) {
      setSelectedTestCase(null);
    }
  }, []);

  const handleApproveClick = useCallback((testCaseId) => {
    setApproveTarget(testCaseId);
    setApproveConfirmOpen(true);
  }, []);

  const handleApproveConfirm = useCallback(async () => {
    if (!approveTarget) return;
    try {
      const updated = await approveTestCase(approveTarget);
      logEvent('governance_update', {
        action: 'Test Case Approved',
        details: `Test case "${updated.title}" approved by ${currentPersona.name}.`,
        resource: updated.id,
        outcome: 'success',
        segment: updated.segment,
      });
      toast({
        variant: 'success',
        title: 'Test Case Approved',
        description: `"${updated.title}" has been approved.`,
      });
      setDetailOpen(false);
      setSelectedTestCase(null);
      await loadTestCases();
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Approval Failed',
        description: err && err.error ? err.error : 'Failed to approve test case.',
      });
    }
  }, [approveTarget, currentPersona, logEvent, toast, loadTestCases]);

  const handleCloneClick = useCallback(
    async (testCaseId) => {
      try {
        const cloned = await cloneTestCase(testCaseId);
        logEvent('config_change', {
          action: 'Test Case Cloned',
          details: `Test case cloned to "${cloned.title}" by ${currentPersona.name}.`,
          resource: cloned.id,
          outcome: 'success',
          segment: cloned.segment,
        });
        toast({
          variant: 'success',
          title: 'Test Case Cloned',
          description: `"${cloned.title}" has been created as a copy.`,
        });
        setDetailOpen(false);
        setSelectedTestCase(null);
        await loadTestCases();
      } catch (err) {
        toast({
          variant: 'error',
          title: 'Clone Failed',
          description: err && err.error ? err.error : 'Failed to clone test case.',
        });
      }
    },
    [currentPersona, logEvent, toast, loadTestCases]
  );

  const handleRetireClick = useCallback((testCaseId) => {
    setRetireTarget(testCaseId);
    setRetireConfirmOpen(true);
  }, []);

  const handleRetireConfirm = useCallback(async () => {
    if (!retireTarget) return;
    try {
      const updated = await retireTestCase(retireTarget);
      logEvent('config_change', {
        action: 'Test Case Retired',
        details: `Test case "${updated.title}" retired by ${currentPersona.name}.`,
        resource: updated.id,
        outcome: 'success',
        segment: updated.segment,
      });
      toast({
        variant: 'success',
        title: 'Test Case Retired',
        description: `"${updated.title}" has been retired.`,
      });
      setDetailOpen(false);
      setSelectedTestCase(null);
      await loadTestCases();
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Retire Failed',
        description: err && err.error ? err.error : 'Failed to retire test case.',
      });
    }
  }, [retireTarget, currentPersona, logEvent, toast, loadTestCases]);

  const handleImportSubmit = useCallback(
    async (data) => {
      setImportLoading(true);
      try {
        const imported = await importTestCases(data);
        logEvent('config_change', {
          action: 'Test Cases Imported',
          details: `${imported.length} test cases imported by ${currentPersona.name}.`,
          resource: '/measures',
          outcome: 'success',
        });
        toast({
          variant: 'success',
          title: 'Import Complete',
          description: `${imported.length} test cases imported successfully.`,
        });
        setImportOpen(false);
        await loadTestCases();
      } catch (err) {
        toast({
          variant: 'error',
          title: 'Import Failed',
          description: err && err.error ? err.error : 'Failed to import test cases.',
        });
      } finally {
        setImportLoading(false);
      }
    },
    [currentPersona, logEvent, toast, loadTestCases]
  );

  const handleExportCSV = useCallback(() => {
    try {
      const data = testCasesData.map((tc) => ({
        id: tc.id,
        title: tc.title,
        type: tc.type,
        status: tc.status,
        priority: tc.priority,
        application: tc.application,
        segment: tc.segment,
        automationStatus: tc.automationStatus,
        approvalStatus: tc.approvalStatus,
        createdBy: tc.createdBy,
        lastModified: tc.lastModified,
        tags: Array.isArray(tc.tags) ? tc.tags.join('; ') : '',
      }));
      downloadCSV(data, 'test-cases.csv');
      logEvent('data_export', {
        action: 'Exported Test Cases',
        details: `Test cases exported as CSV by ${currentPersona.name}. ${data.length} records.`,
        resource: '/measures',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} test cases exported as CSV.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export test cases.',
      });
    }
  }, [testCasesData, currentPersona, logEvent, toast]);

  const handleExportJSON = useCallback(() => {
    try {
      const data = testCasesData.map((tc) => ({
        id: tc.id,
        title: tc.title,
        type: tc.type,
        status: tc.status,
        priority: tc.priority,
        application: tc.application,
        segment: tc.segment,
        automationStatus: tc.automationStatus,
        approvalStatus: tc.approvalStatus,
        createdBy: tc.createdBy,
        lastModified: tc.lastModified,
        tags: tc.tags,
      }));
      downloadJSON(data, 'test-cases.json');
      logEvent('data_export', {
        action: 'Exported Test Cases',
        details: `Test cases exported as JSON by ${currentPersona.name}. ${data.length} records.`,
        resource: '/measures',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} test cases exported as JSON.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export test cases.',
      });
    }
  }, [testCasesData, currentPersona, logEvent, toast]);

  const kpiData = useMemo(() => {
    const total = testCasesData.length;
    const executed = testCasesData.filter((tc) => tc.status === 'passed' || tc.status === 'failed').length;
    const passed = testCasesData.filter((tc) => tc.status === 'passed').length;
    const failed = testCasesData.filter((tc) => tc.status === 'failed').length;
    const passRate = executed > 0 ? Math.round((passed / executed) * 1000) / 10 : 0;
    const automated = testCasesData.filter((tc) => tc.automationStatus === 'automated').length;
    const automationRate = total > 0 ? Math.round((automated / total) * 1000) / 10 : 0;
    const approved = testCasesData.filter((tc) => tc.approvalStatus === 'approved').length;

    return [
      {
        id: 'kpi_total',
        label: 'Total Test Cases',
        value: total,
        unit: 'count',
        trend: 'improving',
        status: 'on_track',
        description: 'Total test cases in the inventory.',
      },
      {
        id: 'kpi_pass_rate',
        label: 'Pass Rate',
        value: passRate,
        unit: 'percent',
        trend: passRate >= 80 ? 'improving' : passRate >= 60 ? 'stable' : 'declining',
        status: passRate >= 80 ? 'on_track' : passRate >= 60 ? 'at_risk' : 'critical',
        description: 'Percentage of executed tests that passed.',
      },
      {
        id: 'kpi_automation',
        label: 'Automation Rate',
        value: automationRate,
        unit: 'percent',
        trend: automationRate >= 70 ? 'improving' : 'stable',
        status: automationRate >= 70 ? 'on_track' : 'at_risk',
        description: 'Percentage of test cases that are automated.',
      },
      {
        id: 'kpi_approved',
        label: 'Approved',
        value: approved,
        unit: 'count',
        trend: 'stable',
        status: 'on_track',
        description: 'Test cases with approved status.',
      },
    ];
  }, [testCasesData]);

  const filterFields = useMemo(() => {
    const typeOptions = getAllTestCaseTypes().map((t) => ({
      value: t,
      label: t.charAt(0).toUpperCase() + t.slice(1),
    }));
    const statusOptions = getAllTestCaseStatuses().map((s) => ({
      value: s,
      label: s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
    const priorityOptions = getAllTestCasePriorities().map((p) => ({
      value: p,
      label: p.charAt(0).toUpperCase() + p.slice(1),
    }));
    const automationOptions = getAllAutomationStatuses().map((a) => ({
      value: a,
      label: a.charAt(0).toUpperCase() + a.slice(1),
    }));

    return [
      {
        id: 'type',
        label: 'Type',
        type: 'select',
        options: [{ value: '', label: 'All Types' }, ...typeOptions],
        defaultValue: '',
      },
      {
        id: 'status',
        label: 'Status',
        type: 'select',
        options: [{ value: '', label: 'All Statuses' }, ...statusOptions],
        defaultValue: '',
      },
      {
        id: 'priority',
        label: 'Priority',
        type: 'select',
        options: [{ value: '', label: 'All Priorities' }, ...priorityOptions],
        defaultValue: '',
      },
      {
        id: 'automationStatus',
        label: 'Automation',
        type: 'select',
        options: [{ value: '', label: 'All Automation' }, ...automationOptions],
        defaultValue: '',
      },
      {
        id: 'segment',
        label: 'Segment',
        type: 'select',
        options: SEGMENT_OPTIONS,
        defaultValue: '',
      },
    ];
  }, []);

  const tableColumns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 90,
        cell: ({ row }) => (
          <span className="text-xs font-mono text-slate-500">{row.original.id}</span>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleTestCaseClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors line-clamp-2"
          >
            {row.original.title}
          </button>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 110,
        cell: ({ row }) => (
          <Badge variant={getTypeBadgeVariant(row.original.type)} size="sm">
            {row.original.type}
          </Badge>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        size: 90,
        cell: ({ row }) => (
          <Badge variant={getPriorityBadgeVariant(row.original.priority)} size="sm">
            {row.original.priority}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 110,
        cell: ({ row }) => (
          <StatusPill status={row.original.status} size="sm" dot />
        ),
      },
      {
        accessorKey: 'automationStatus',
        header: 'Automation',
        size: 110,
        cell: ({ row }) => (
          <Badge variant={getAutomationBadgeVariant(row.original.automationStatus)} size="sm">
            {row.original.automationStatus}
          </Badge>
        ),
      },
      {
        accessorKey: 'segment',
        header: 'Segment',
        size: 100,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.segment}</span>
        ),
      },
      {
        accessorKey: 'approvalStatus',
        header: 'Approval',
        size: 100,
        cell: ({ row }) => (
          <Badge variant={getApprovalBadgeVariant(row.original.approvalStatus)} size="sm">
            {row.original.approvalStatus}
          </Badge>
        ),
      },
      {
        accessorKey: 'createdBy',
        header: 'Creator',
        size: 120,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.createdBy}</span>
        ),
      },
      {
        accessorKey: 'lastModified',
        header: 'Modified',
        size: 110,
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">{formatDate(row.original.lastModified)}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 100,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5">
            <UITooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleTestCaseClick(row.original)}
                  className={cn(
                    'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                    'hover:bg-slate-100 hover:text-slate-600',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                  )}
                  aria-label={`View ${row.original.title}`}
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
                    aria-label={`Edit ${row.original.title}`}
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
    [handleTestCaseClick, handleEditClick]
  );

  if (loading) {
    return <TestCasesInventorySkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">Test Cases Inventory</h1>
          <p className="text-sm text-slate-500">
            Test case repository with metrics, filters, and lifecycle management for {currentPersona.name}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
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
              variant="outline"
              size="sm"
              iconLeft={<Upload className="h-3.5 w-3.5" />}
              onClick={() => setImportOpen(true)}
            >
              Import
            </Button>
          </PermissionGate>

          <PermissionGate requiredAction={PERMISSIONS.EDIT_MEASURES} behavior="hidden">
            <Button
              variant="primary"
              size="sm"
              iconLeft={<Plus className="h-3.5 w-3.5" />}
              onClick={handleCreateClick}
            >
              Create Test Case
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

      {/* Tabs: List / Cards / Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {testCasesData.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No test cases found"
              message="No test cases match the current filter criteria. Try adjusting your filters or create a new test case."
              size="lg"
              bordered
              actionLabel={hasPermission(PERMISSIONS.EDIT_MEASURES) ? 'Create Test Case' : undefined}
              onAction={hasPermission(PERMISSIONS.EDIT_MEASURES) ? handleCreateClick : undefined}
              actionIcon={<Plus className="h-3.5 w-3.5" />}
            />
          ) : (
            <DataTable
              columns={tableColumns}
              data={testCasesData}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search test cases..."
              emptyMessage="No test cases match the search criteria."
              onRowClick={handleTestCaseClick}
            />
          )}
        </TabsContent>

        <TabsContent value="cards">
          {testCasesData.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No test cases found"
              message="No test cases match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {testCasesData.map((tc) => (
                <Card
                  key={tc.id}
                  className={cn(
                    'p-5 cursor-pointer transition-all duration-200',
                    'hover:shadow-card-hover hover:border-humana-green-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                    'active:scale-[0.99]'
                  )}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleTestCaseClick(tc)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleTestCaseClick(tc);
                    }
                  }}
                  aria-label={`${tc.title}. Status: ${tc.status}. Priority: ${tc.priority}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
                        <TestTube className="h-4 w-4 text-humana-green-600" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-mono text-slate-400">{tc.id}</span>
                    </div>
                    <StatusPill status={tc.status} size="sm" dot />
                  </div>

                  <p className="mt-2 text-sm font-medium text-slate-900 line-clamp-2">{tc.title}</p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <Badge variant={getTypeBadgeVariant(tc.type)} size="sm">{tc.type}</Badge>
                    <Badge variant={getPriorityBadgeVariant(tc.priority)} size="sm">{tc.priority}</Badge>
                    <Badge variant={getAutomationBadgeVariant(tc.automationStatus)} size="sm">{tc.automationStatus}</Badge>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xs text-slate-400">{tc.segment}</span>
                      <span className="text-2xs text-slate-300">•</span>
                      <span className="text-2xs text-slate-400">{tc.createdBy}</span>
                    </div>
                    <Badge variant={getApprovalBadgeVariant(tc.approvalStatus)} size="sm">
                      {tc.approvalStatus}
                    </Badge>
                  </div>

                  {tc.tags && tc.tags.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tc.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
                      ))}
                      {tc.tags.length > 3 ? (
                        <Badge variant="outline" size="sm">+{tc.tags.length - 3}</Badge>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-2xs text-slate-400">{formatDate(tc.lastModified)}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {testCasesData.length === 0 ? (
            <EmptyState
              type="no_chart"
              title="No data for analytics"
              message="No test cases available to generate analytics. Try adjusting your filters."
              size="lg"
              bordered
            />
          ) : (
            <AnalyticsPanel testCases={testCasesData} />
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Panel */}
      {testCasesData.length > 0 && activeTab !== 'analytics' ? (
        <PanelCard
          title="Inventory Summary"
          subtitle={`${testCasesData.length} test cases across ${new Set(testCasesData.map((tc) => tc.segment)).size} segments`}
          icon={<Activity className="h-5 w-5" />}
          collapsible
          defaultCollapsed
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Passed</span>
              <span className="text-2xl font-semibold text-success-600">
                {testCasesData.filter((tc) => tc.status === 'passed').length}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Failed</span>
              <span className="text-2xl font-semibold text-danger-600">
                {testCasesData.filter((tc) => tc.status === 'failed').length}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Automated</span>
              <span className="text-2xl font-semibold text-slate-900">
                {testCasesData.filter((tc) => tc.automationStatus === 'automated').length}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Manual</span>
              <span className="text-2xl font-semibold text-slate-900">
                {testCasesData.filter((tc) => tc.automationStatus === 'manual').length}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {getAllTestCaseTypes().map((type) => {
              const count = testCasesData.filter((tc) => tc.type === type).length;
              if (count === 0) return null;
              return (
                <div key={type} className="flex items-center gap-3">
                  <div className="w-24 shrink-0">
                    <Badge variant={getTypeBadgeVariant(type)} size="sm">{type}</Badge>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={count}
                      max={testCasesData.length || 1}
                      variant="primary"
                      size="xs"
                      animate
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </PanelCard>
      ) : null}

      {/* Create/Edit Dialog */}
      <CreateEditDialog
        open={createEditOpen}
        onOpenChange={(open) => {
          setCreateEditOpen(open);
          if (!open) setEditTarget(null);
        }}
        onSubmit={handleCreateEditSubmit}
        loading={createEditLoading}
        testCase={editTarget}
      />

      {/* Detail Dialog */}
      <TestCaseDetailDialog
        testCase={selectedTestCase}
        open={detailOpen}
        onOpenChange={handleDetailClose}
        onApprove={handleApproveClick}
        onClone={handleCloneClick}
        onRetire={handleRetireClick}
      />

      {/* Import Dialog */}
      <ImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={handleImportSubmit}
        loading={importLoading}
      />

      {/* Approve Confirmation */}
      <ConfirmDialog
        open={approveConfirmOpen}
        onOpenChange={setApproveConfirmOpen}
        title="Approve Test Case"
        message="Are you sure you want to approve this test case? It will be marked as approved and available for execution scheduling."
        variant="info"
        confirmLabel="Approve"
        cancelLabel="Cancel"
        onConfirm={handleApproveConfirm}
      />

      {/* Retire Confirmation */}
      <ConfirmDialog
        open={retireConfirmOpen}
        onOpenChange={setRetireConfirmOpen}
        title="Retire Test Case"
        message="Are you sure you want to retire this test case? It will be marked as skipped and rejected. This action can be reversed by editing the test case."
        variant="warning"
        confirmLabel="Retire"
        cancelLabel="Cancel"
        onConfirm={handleRetireConfirm}
      />
    </div>
  );
}

TestCasesInventoryPage.displayName = 'TestCasesInventoryPage';

export { TestCasesInventoryPage };
export default TestCasesInventoryPage;