import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  Bug,
  OctagonAlert,
  Hourglass,
  CheckCircle2,
  FileText,
  RefreshCw,
  ArrowRight,
  Download,
  Search,
} from 'lucide-react';
import { useNavigation, usePageHeader } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { FilterBar } from '@/components/shared/FilterBar';
import { DataTable } from '@/components/shared/DataTable';
import { StatusPill } from '@/components/shared/StatusPill';
import { PageActions } from '@/components/layout/PageActions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Tooltip as UiTooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';
import { cn, downloadCSV } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import {
  DEFECT_KPIS,
  DEFECTS_BY_PRIORITY,
  DEFECTS_AGING,
  DEFECTS_BY_TYPE,
  TOP_APPS_HIGH_CRITICAL,
  DEFECTS_BY_SOURCE,
  APP_DEFECT_ROWS,
  withSeverityBreakdown,
  withEnvironmentBreakdown,
  withStatusBreakdown,
  withIssueTypeBreakdown,
  withAgingBreakdown,
  withDensityBreakdown,
} from '@/data/defects';

const KPI_ICONS = {
  total: { icon: <Bug />, tone: 'blue' },
  open: { icon: <OctagonAlert />, tone: 'red' },
  in_progress: { icon: <Hourglass />, tone: 'orange' },
  closed: { icon: <CheckCircle2 />, tone: 'green' },
  reopened: { icon: <FileText />, tone: 'purple' },
};

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

const PORTFOLIO_OPTIONS = [
  { value: '', label: 'All Portfolios' },
  { value: 'cto', label: 'CTO' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'centerwell', label: 'CenterWell' },
];

const ISSUE_TYPE_OPTIONS = [
  { value: '', label: 'All Issue Types' },
  { value: 'functional', label: 'Functional' },
  { value: 'data', label: 'Data' },
  { value: 'ui_ux', label: 'UI / UX' },
  { value: 'performance', label: 'Performance' },
  { value: 'integration', label: 'Integration' },
  { value: 'security', label: 'Security' },
];

const DISPOSITION_OPTIONS = [
  { value: '', label: 'All Dispositions' },
  { value: 'fix', label: 'Fix Required' },
  { value: 'wont_fix', label: "Won't Fix" },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'deferred', label: 'Deferred' },
];

/**
 * Renders a donut chart with a centered total label and a side legend list,
 * matching the pattern used on HTHHomePage's "Test Executions Overview".
 *
 * @param {object} props
 * @param {{ name: string, value?: number, pct: string|number, color: string }[]} props.data - Slice data
 * @param {string} [props.dataKey='value'] - Field to size slices by
 * @param {string|number} [props.centerLabel] - Text shown centered in the donut
 * @param {string} [props.centerSubLabel='Total'] - Small caption under the center label
 * @returns {React.ReactElement}
 */
function LegendDonut({
  data,
  dataKey = 'value',
  centerLabel,
  centerSubLabel = 'Total',
  orientation = 'horizontal',
  size = 160,
  innerRadius = 50,
  outerRadius = 74,
}) {
  const vertical = orientation === 'vertical';
  return (
    <div className={cn('flex gap-3', vertical ? 'flex-col items-center' : 'items-center')}>
      <div className="relative shrink-0" style={{ height: size, width: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v, n) => [typeof v === 'number' ? v.toLocaleString() : v, n]} />
          </PieChart>
        </ResponsiveContainer>
        {centerLabel ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-semibold text-slate-900">{centerLabel}</span>
            <span className="text-2xs text-slate-400">{centerSubLabel}</span>
          </div>
        ) : null}
      </div>
      <ul className={cn('flex flex-col gap-1.5 min-w-0', vertical ? 'w-full' : 'flex-1')}>
        {data.map((d) => (
          <li key={d.name} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} aria-hidden="true" />
              <span className="truncate text-slate-600">{d.name}</span>
            </span>
            <span className="shrink-0 tabular-nums text-slate-500">
              {typeof d.value === 'number' ? <span className="font-semibold text-slate-900">{d.value.toLocaleString()}</span> : null}{' '}
              ({typeof d.pct === 'number' ? `${d.pct}%` : d.pct})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Bugs / Defects Overview page — KPI strip, priority/aging/type/source
 * breakdowns, top-application risk list, and a tabbed per-application
 * defect table. Mock data only, mirrors the provided design reference.
 *
 * @returns {React.ReactElement}
 */
function BugsDefectsOverviewPage() {
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();
  const navigate = useNavigate();

  usePageHeader({ title: 'Bugs / Defects Overview', subtitle: `Track, analyze, and resolve defects across Humana applications and portfolios.` });

  const [activeTab, setActiveTab] = useState('priority');
  const [filters, setFilters] = useState({ portfolio: '', status: '', issueType: '', disposition: '' });
  const [pageSearch, setPageSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Humana Test Harness', path: ROUTES.HTH },
      { label: 'Bugs / Defects' },
    ]);
  }, [setBreadcrumbs]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast({ title: 'Defects Refreshed', description: 'Defect counts recalculated from the latest test runs.', variant: 'success' });
    }, 400);
  };

  const priorityRows = APP_DEFECT_ROWS;
  const severityRows = useMemo(() => withSeverityBreakdown(), []);
  const environmentRows = useMemo(() => withEnvironmentBreakdown(), []);
  const statusRows = useMemo(() => withStatusBreakdown(), []);
  const issueTypeRows = useMemo(() => withIssueTypeBreakdown(), []);
  const agingRows = useMemo(() => withAgingBreakdown(), []);
  const densityRows = useMemo(() => withDensityBreakdown(), []);

  const applyRowFilter = (rows) => {
    let result = filters.status ? rows.filter((r) => r.status === filters.status) : rows;
    const q = pageSearch.trim().toLowerCase();
    if (q) result = result.filter((r) => (r.application || '').toLowerCase().includes(q));
    return result;
  };

  const TAB_ROWS = {
    priority: priorityRows,
    severity: severityRows,
    environment: environmentRows,
    status: statusRows,
    issue_type: issueTypeRows,
    aging: agingRows,
    density: densityRows,
  };

  const handleDownload = () => {
    downloadCSV(applyRowFilter(TAB_ROWS[activeTab] || priorityRows), `defects-${activeTab}.csv`);
    toast({ variant: 'success', title: 'Export complete', description: 'Defect data exported to CSV.' });
  };

  const statusCell = ({ row }) => <StatusPill status={row.original.status} size="sm" dot />;
  const appCell = ({ row }) => <span className="text-sm font-medium text-slate-800">{row.original.application}</span>;

  const priorityColumns = useMemo(
    () => [
      { accessorKey: 'application', header: 'Application', cell: appCell, meta: { width: '22%' } },
      { accessorKey: 'totalDefects', header: 'Total Defects', meta: { width: '10%' } },
      { accessorKey: 'blocker', header: 'Blocker', meta: { width: '8%' } },
      { accessorKey: 'critical', header: 'Critical', meta: { width: '8%' } },
      { accessorKey: 'high', header: 'High', meta: { width: '8%' } },
      { accessorKey: 'medium', header: 'Medium', meta: { width: '8%' } },
      { accessorKey: 'low', header: 'Low', meta: { width: '7%' } },
      { accessorKey: 'none', header: 'None/Other', meta: { width: '10%' } },
      { accessorKey: 'openDefects', header: 'Open Defects', meta: { width: '10%' } },
      { id: 'status', header: 'Status', cell: statusCell, meta: { width: '9%' } },
    ],
    []
  );

  const severityColumns = useMemo(
    () => [
      { accessorKey: 'application', header: 'Application', cell: appCell, meta: { width: '26%' } },
      { accessorKey: 'totalDefects', header: 'Total Defects' },
      { accessorKey: 'sev1', header: 'Sev 1' },
      { accessorKey: 'sev2', header: 'Sev 2' },
      { accessorKey: 'sev3', header: 'Sev 3' },
      { accessorKey: 'sev4', header: 'Sev 4' },
      { accessorKey: 'openDefects', header: 'Open Defects' },
      { id: 'status', header: 'Status', cell: statusCell, meta: { width: '12%' } },
    ],
    []
  );

  const environmentColumns = useMemo(
    () => [
      { accessorKey: 'application', header: 'Application', cell: appCell, meta: { width: '26%' } },
      { accessorKey: 'totalDefects', header: 'Total Defects' },
      { accessorKey: 'prod', header: 'Prod' },
      { accessorKey: 'uat', header: 'UAT' },
      { accessorKey: 'qa', header: 'QA' },
      { accessorKey: 'dev', header: 'Dev' },
      { accessorKey: 'sit', header: 'SIT' },
      { id: 'status', header: 'Status', cell: statusCell, meta: { width: '12%' } },
    ],
    []
  );

  const statusColumns = useMemo(
    () => [
      { accessorKey: 'application', header: 'Application', cell: appCell, meta: { width: '26%' } },
      { accessorKey: 'totalDefects', header: 'Total Defects' },
      { accessorKey: 'openOnly', header: 'Open' },
      { accessorKey: 'inProgressCount', header: 'In Progress' },
      { accessorKey: 'reopenedCount', header: 'Reopened' },
      { accessorKey: 'closedCount', header: 'Closed' },
      { id: 'status', header: 'Status', cell: statusCell, meta: { width: '12%' } },
    ],
    []
  );

  const issueTypeColumns = useMemo(
    () => [
      { accessorKey: 'application', header: 'Application', cell: appCell, meta: { width: '26%' } },
      { accessorKey: 'totalDefects', header: 'Total Defects' },
      { accessorKey: 'functional', header: 'Functional' },
      { accessorKey: 'data', header: 'Data' },
      { accessorKey: 'uiUx', header: 'UI/UX' },
      { accessorKey: 'performance', header: 'Performance' },
      { accessorKey: 'integration', header: 'Integration' },
      { accessorKey: 'security', header: 'Security' },
      { id: 'status', header: 'Status', cell: statusCell, meta: { width: '12%' } },
    ],
    []
  );

  const agingColumns = useMemo(
    () => [
      { accessorKey: 'application', header: 'Application', cell: appCell, meta: { width: '26%' } },
      { accessorKey: 'openDefects', header: 'Open Defects' },
      { accessorKey: 'age1to5', header: '1-5 Days' },
      { accessorKey: 'age6to10', header: '6-10 Days' },
      { accessorKey: 'age11to30', header: '11-30 Days' },
      { accessorKey: 'age31plus', header: '31+ Days' },
      { accessorKey: 'leakedToProd', header: 'Leaked to Prod' },
      { id: 'status', header: 'Status', cell: statusCell, meta: { width: '12%' } },
    ],
    []
  );

  const densityColumns = useMemo(
    () => [
      { accessorKey: 'application', header: 'Application', cell: appCell, meta: { width: '26%' } },
      { accessorKey: 'totalDefects', header: 'Total Defects' },
      { accessorKey: 'testCaseCount', header: 'Test Cases' },
      { accessorKey: 'densityPer1k', header: 'Defects / 1K TC' },
      { accessorKey: 'densityPerKloc', header: 'Defects / KLOC' },
      { id: 'status', header: 'Status', cell: statusCell, meta: { width: '12%' } },
    ],
    []
  );

  const filterFields = useMemo(
    () => [
      { id: 'portfolio', label: 'Portfolio', type: 'select', options: PORTFOLIO_OPTIONS, defaultValue: '' },
      { id: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, defaultValue: '' },
      { id: 'issueType', label: 'Issue Type', type: 'select', options: ISSUE_TYPE_OPTIONS, defaultValue: '' },
      { id: 'disposition', label: 'Disposition', type: 'select', options: DISPOSITION_OPTIONS, defaultValue: '' },
    ],
    []
  );

  const maxTopApp = Math.max(...TOP_APPS_HIGH_CRITICAL.map((a) => a.count));

  // Shared config for every per-application defect table: fixed layout (no
  // horizontal scroll), capped height (vertical scroll matching the side card),
  // and search on the right with the column/density/export actions on the left.
  const tableProps = {
    enableExport: true,
    enableDensityToggle: true,
    searchAlign: 'right',
    pageSize: 10,
    maxHeight: '22rem',
    tableClassName: 'table-fixed [&_th]:px-1.5 [&_td]:px-1.5 [&_td]:text-xs',
    headClassName: 'whitespace-normal align-bottom',
    searchPlaceholder: 'Search defects, applications...',
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Refresh — portalled into the navbar (far right) */}
      <PageActions>
        <UiTooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              iconLeft={<RefreshCw className={refreshing ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />}
              onClick={handleRefresh}
              aria-label="Refresh defect data"
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">Refresh</TooltipContent>
        </UiTooltip>
      </PageActions>

      {/* Filters */}
      <FilterBar
        fields={filterFields}
        values={filters}
        onChange={setFilters}
        onReset={() => setPageSearch('')}
        liveMode
        showApplyButton={false}
        showResetButton
        showActiveFilters
        resetLabel="Clear All"
        actions={
          <>
            <Input
              value={pageSearch}
              onChange={(e) => setPageSearch(e.target.value)}
              placeholder="Search defects, applications..."
              size="md"
              iconLeft={<Search className="h-4 w-4" />}
              wrapperClassName="w-full sm:w-64"
              aria-label="Search defects and applications"
            />
            <UiTooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="md"
                  className="px-2.5"
                  iconLeft={<Download className="h-4 w-4" />}
                  onClick={handleDownload}
                  aria-label="Download defect data"
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">Download</TooltipContent>
            </UiTooltip>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {DEFECT_KPIS.map((k) => (
          <KpiCard
            key={k.id}
            label={k.label}
            value={k.value}
            unit="count"
            trend={k.trend === 'up' ? 'improving' : 'declining'}
            changePercent={k.changePercent}
            changeLabel={k.changeLabel}
            icon={KPI_ICONS[k.id]?.icon}
            tone={KPI_ICONS[k.id]?.tone}
            iconVariant="solid"
          />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <PanelCard title="Defects by Priority" noBorder info="Distribution of all defects across priority levels (Blocker through None/Other).">
          <LegendDonut data={DEFECTS_BY_PRIORITY} centerLabel="1,813" orientation="vertical" size={150} innerRadius={46} outerRadius={70} />
        </PanelCard>

        <PanelCard title="Defects Aging" noBorder info="Open defects grouped by how long they have been open.">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEFECTS_AGING} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="bucket" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} allowDecimals={false} />
                <Tooltip formatter={(v) => [v, 'Defects']} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PanelCard>

        <PanelCard title="Defects by Type" noBorder info="Breakdown of defects by issue type (Functional, Data, UI/UX, and more).">
          <LegendDonut data={DEFECTS_BY_TYPE} dataKey="pct" centerLabel="1,813" orientation="vertical" size={150} innerRadius={46} outerRadius={70} />
        </PanelCard>

        <PanelCard
          title="Top Applications"
          subtitle="By High / Critical / Blocker count"
          noBorder
          info="Applications ranked by their number of High, Critical, and Blocker defects."
          className="flex flex-col"
          bodyClassName="flex flex-1 flex-col"
        >
          <div className="flex flex-col gap-3">
            {TOP_APPS_HIGH_CRITICAL.map((a) => (
              <div key={a.name} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate text-xs font-medium text-slate-700">{a.name}</span>
                <Progress value={a.count} max={maxTopApp} variant="error" size="sm" className="flex-1" />
                <span className="w-8 shrink-0 text-right text-xs font-semibold text-slate-900">{a.count}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate(ROUTES.APPLICATIONS)}
            className="mt-auto inline-flex items-center gap-1 self-center pt-4 text-xs font-medium text-humana-green-600 transition-colors hover:text-humana-green-700"
          >
            View all applications <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </button>
        </PanelCard>
      </div>

      {/* Table + Defects by Source */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <div className="flex min-w-0 flex-col gap-4 xl:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="priority">Priority</TabsTrigger>
              <TabsTrigger value="severity">Severity</TabsTrigger>
              <TabsTrigger value="environment">Environment</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="issue_type">Issue Type</TabsTrigger>
              <TabsTrigger value="aging">Aging/Leakage</TabsTrigger>
              <TabsTrigger value="density">Defect Density</TabsTrigger>
            </TabsList>

            <TabsContent value="priority">
              <DataTable columns={priorityColumns} data={applyRowFilter(priorityRows)} {...tableProps} exportFilename="defects-by-priority" />
            </TabsContent>
            <TabsContent value="severity">
              <DataTable columns={severityColumns} data={applyRowFilter(severityRows)} {...tableProps} exportFilename="defects-by-severity" />
            </TabsContent>
            <TabsContent value="environment">
              <DataTable columns={environmentColumns} data={applyRowFilter(environmentRows)} {...tableProps} exportFilename="defects-by-environment" />
            </TabsContent>
            <TabsContent value="status">
              <DataTable columns={statusColumns} data={applyRowFilter(statusRows)} {...tableProps} exportFilename="defects-by-status" />
            </TabsContent>
            <TabsContent value="issue_type">
              <DataTable columns={issueTypeColumns} data={applyRowFilter(issueTypeRows)} {...tableProps} exportFilename="defects-by-issue-type" />
            </TabsContent>
            <TabsContent value="aging">
              <DataTable columns={agingColumns} data={applyRowFilter(agingRows)} {...tableProps} exportFilename="defects-aging-leakage" />
            </TabsContent>
            <TabsContent value="density">
              <DataTable columns={densityColumns} data={applyRowFilter(densityRows)} {...tableProps} exportFilename="defect-density" />
            </TabsContent>
          </Tabs>
        </div>

        <PanelCard
          title="Defects by Source"
          noBorder
          info="Origin of reported defects (Testing, Production Monitoring, User Reported, and more)."
          className="flex flex-col"
          bodyClassName="flex flex-1 flex-col"
        >
          <div className="mb-3 flex justify-end">
            <Select options={[{ value: 'all', label: 'All Sources' }]} defaultValue="all" wrapperClassName="w-32" />
          </div>
          <LegendDonut data={DEFECTS_BY_SOURCE} centerLabel="1,813" orientation="vertical" size={150} innerRadius={46} outerRadius={70} />
          <button
            type="button"
            onClick={() => setActiveTab('priority')}
            className="mt-auto inline-flex items-center justify-center gap-1 pt-4 text-xs font-medium text-humana-green-600 transition-colors hover:text-humana-green-700"
          >
            View full defect insights <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </button>
        </PanelCard>
      </div>
    </div>
  );
}

BugsDefectsOverviewPage.displayName = 'BugsDefectsOverviewPage';

export { BugsDefectsOverviewPage };
export default BugsDefectsOverviewPage;
