import { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  RefreshCw,
  ChevronDown,
  Star,
  Mail,
  History as HistoryIcon,
  ExternalLink,
  XCircle,
  X,
  ChevronsUpDown,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigation, usePageHeader } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { DataTable } from '@/components/shared/DataTable';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';

/* Mock data mirrors Docs/mocks — Test Execution build history + results (frontend-only). */

const ROW1_FILTERS = [
  { label: 'Segment', options: ['Insurance', 'CenterWell', 'Corporate'] },
  { label: 'Business Unit', options: ['Member Solutions', 'Provider Solutions', 'Pharmacy'] },
  { label: 'VP', options: ['John Smith', 'Jane Doe', 'Alex Ray'] },
  { label: 'Squad', options: ['Member Portal Team', 'Claims Team', 'Provider Team'] },
];

const BUILD_HISTORY = [
  { build: '231', passed: 360, failed: 40, other: 18 },
  { build: '233', passed: 350, failed: 55, other: 16 },
  { build: '238', passed: 345, failed: 45, other: 20 },
  { build: '239', passed: 300, failed: 190, other: 22 },
  { build: '240', passed: 330, failed: 150, other: 18 },
  { build: '241', passed: 360, failed: 70, other: 16 },
  { build: '242', passed: 370, failed: 60, other: 14 },
  { build: '245', passed: 355, failed: 75, other: 18 },
  { build: '246', passed: 300, failed: 210, other: 20 },
  { build: '247', passed: 330, failed: 120, other: 16 },
  { build: '249', passed: 360, failed: 80, other: 18 },
  { build: '250', passed: 300, failed: 220, other: 22 },
  { build: '251', passed: 340, failed: 110, other: 18 },
  { build: '252', passed: 355, failed: 70, other: 16 },
  { build: '253', passed: 360, failed: 60, other: 18 },
  { build: '261', passed: 350, failed: 90, other: 16 },
  { build: '262', passed: 365, failed: 55, other: 14 },
  { build: '262R', passed: 40, failed: 10, other: 6 },
  { build: '263', passed: 360, failed: 70, other: 16 },
  { build: '264', passed: 375, failed: 55, other: 14 },
];

const SUMMARIES = [
  'Agenda Page: Validate session inactivity on all browsers after 4 mins…',
  'Agenda Page: Validate session expired on all browsers after 10 mins…',
  'Delivery Settings Page: Validate Delivery Settings enrollment and Un-e…',
  "Delivery Settings Page: PV Web - Don't Remove Delivery Settings Icon …",
  'Profile Page: Validate contact preferences persistence across sessions…',
  'Claims Page: Validate claim status filter returns correct result set…',
  'Enrollment Page: Validate plan comparison table renders all tiers…',
  'Documents Page: Validate secure download of Explanation of Benefits…',
];

const ERRORS = [
  'Assertion error: Session timeout',
  'No such element exception: java.',
  'Client exception: Error executing',
  'No such element exception: Timeout',
  'Timeout waiting for element to be clickable',
  'Stale element reference exception',
];

/** Deterministic results — 137 rows so pagination mirrors the mock. */
const RESULTS = Array.from({ length: 137 }, (_, i) => ({
  id: `row-${i}`,
  testKeys:
    i === 0
      ? ['MPR-RGR-80566', 'MPR-RGR-80567', 'MPR-RGR-80554', 'MPR-RGR-80555', 'MPR-RGR-80559', 'MPR-RGR-80568']
      : [`MPR-RGR-${80600 - i * 137}`],
  status: 'ERROR',
  analysis: 'Not Started',
  summary: SUMMARIES[i % SUMMARIES.length],
  error: ERRORS[i % ERRORS.length],
}));

/**
 * Compact build-history tooltip.
 *
 * @param {object} props - Recharts tooltip props
 * @returns {React.ReactElement|null}
 */
function BuildTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-dropdown">
      <p className="text-xs font-medium text-slate-900">Build #{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

/**
 * Bordered select filter box matching the mock's filter rows.
 *
 * @param {object} props
 * @param {string} props.label - Field label
 * @param {string[]} props.options - Option labels
 * @param {string} [props.className] - Extra classes
 * @returns {React.ReactElement}
 */
function SelectBox({ label, options, className }) {
  const [value, setValue] = useState(options[0]);
  return (
    <label className={cn('flex min-w-[150px] flex-1 flex-col gap-0.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-card transition-colors focus-within:border-humana-green-500 focus-within:ring-2 focus-within:ring-humana-green-500/30', className)}>
      <span className="text-2xs font-medium text-slate-400">{label}</span>
      <div className="relative">
        <select value={value} onChange={(e) => setValue(e.target.value)} className="w-full appearance-none bg-transparent pr-6 text-sm font-semibold text-slate-800 focus:outline-none">
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      </div>
    </label>
  );
}

/**
 * Test Execution page — build history and results for a selected test suite.
 * Rebuilt to match the provided design reference. Mock data only.
 *
 * @returns {React.ReactElement}
 */
function TestExecutionDashboardPage() {
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();

  usePageHeader({ title: 'Test Execution', subtitle: `View execution details, logs and results for your test suites.` });

  const [favorite, setFavorite] = useState(false);
  const [suiteName, setSuiteName] = useState('Member Portal - Regression Suite');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Humana Test Harness', path: ROUTES.HTH },
      { label: 'Test Execution' },
    ]);
  }, [setBreadcrumbs]);

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: '',
        meta: { width: '4%' },
        enableSorting: false,
        enableHiding: false,
        cell: () => <Circle className="h-4 w-4 text-slate-300" aria-hidden="true" />,
      },
      {
        id: 'history',
        header: 'History',
        meta: { width: '6%' },
        enableSorting: false,
        cell: () => (
          <button type="button" className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700" aria-label="View history">
            <HistoryIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        ),
      },
      {
        id: 'report',
        header: 'Report',
        meta: { width: '6%' },
        enableSorting: false,
        cell: () => (
          <button type="button" className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700" aria-label="Open report">
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </button>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Test Status',
        meta: { width: '10%' },
        cell: () => (
          <Badge variant="error" size="sm" className="gap-1 uppercase tracking-wide" iconLeft={<XCircle className="h-3 w-3" />}>Error</Badge>
        ),
      },
      {
        accessorKey: 'analysis',
        header: 'Analysis',
        meta: { width: '9%' },
        cell: ({ row }) => <span className="text-xs text-slate-500">{row.original.analysis}</span>,
      },
      {
        accessorKey: 'testKeys',
        header: 'Test Key',
        meta: { width: '15%' },
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            {row.original.testKeys.map((k) => (
              <button key={k} type="button" className="text-left text-xs font-medium text-info-600 hover:text-info-700 hover:underline">{k}</button>
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'summary',
        header: 'Test Summary',
        meta: { width: '30%' },
        cell: ({ row }) => (
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm text-slate-700">{row.original.summary}</span>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden="true" />
          </div>
        ),
      },
      {
        accessorKey: 'error',
        header: 'Error Description',
        meta: { width: '20%' },
        enableSorting: false,
        cell: ({ row }) => <span className="text-xs text-slate-600">{row.original.error}</span>,
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Refresh — portalled area is the navbar; keep an inline refresh on the far right of row 1 */}
      {/* Filter row 1 */}
      <div className="flex flex-wrap items-stretch gap-3">
        {ROW1_FILTERS.map((f) => <SelectBox key={f.label} label={f.label} options={f.options} />)}
        <SelectBox label="Date Range" options={['May 27 – Jun 2, 2026', 'May 20 – May 26, 2026', 'Jun 3 – Jun 9, 2026']} />
        <button type="button" title="Refresh" aria-label="Refresh" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-slate-700 shadow-card hover:bg-slate-50">
          <RefreshCw className="h-4 w-4 text-slate-500" aria-hidden="true" />
        </button>
      </div>

      {/* Filter row 2 */}
      <div className="flex flex-wrap items-stretch gap-3">
        <SelectBox label="Application" options={['Humana Member Portal', 'Claims Platform', 'Provider Portal']} className="min-w-[200px]" />
        {/* Test Suite Name with clear */}
        <label className="flex min-w-[260px] flex-1 flex-col gap-0.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-card focus-within:border-humana-green-500 focus-within:ring-2 focus-within:ring-humana-green-500/30">
          <span className="text-2xs font-medium text-slate-400">Test Suite Name</span>
          <div className="flex items-center gap-2">
            <span className="flex-1 truncate text-sm font-semibold text-slate-800">{suiteName}</span>
            {suiteName ? (
              <button type="button" onClick={() => setSuiteName('')} className="text-slate-400 hover:text-slate-600" aria-label="Clear test suite">
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ) : null}
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          </div>
        </label>
        <SelectBox label="Execution #" options={['264', '263', '262']} className="min-w-[120px] flex-none" />
        <Button variant="primary" size="md" className="self-stretch bg-navy-900 hover:bg-navy-800" iconLeft={<Mail className="h-4 w-4" />}>Email</Button>
        <button type="button" onClick={() => setFavorite((v) => !v)} className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-slate-500 shadow-card hover:bg-slate-50" aria-label={favorite ? 'Unfavorite' : 'Favorite'} aria-pressed={favorite}>
          <Star className={cn('h-4 w-4', favorite ? 'fill-warning-400 text-warning-500' : 'text-slate-400')} aria-hidden="true" />
        </button>
      </div>

      {/* Build History */}
      <Card className="overflow-hidden">
        <div className="bg-navy-900 px-4 py-2.5 text-center text-sm font-semibold text-white">
          Build History - {suiteName || 'Regression Suite'} - Build # 264
        </div>
        <div className="p-4">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BUILD_HISTORY} margin={{ top: 8, right: 12, left: -12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="build" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} interval={0} angle={0} />
                <YAxis domain={[0, 800]} ticks={[0, 400, 800]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<BuildTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="passed" name="Passed" stackId="a" fill="#16b364" barSize={22} isAnimationActive={false} />
                <Bar dataKey="failed" name="Failed" stackId="a" fill="#ef4444" barSize={22} isAnimationActive={false} />
                <Bar dataKey="other" name="Other" stackId="a" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={22} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-1 text-2xs text-slate-400">** We do not have run information for the hidden build numbers</p>
        </div>
      </Card>

      {/* Description / Browser / Testing Type */}
      <div className="flex flex-wrap items-stretch gap-3">
        <div className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-card">
          <span className="text-sm text-slate-600"><span className="font-semibold text-slate-800">Description:</span> Please find the backed up result at path for Jenkins Build# 264 \\EDIDVUCHCMW01\Jenkins.Reports\CSDQ</span>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 shadow-card"><span className="font-semibold text-slate-800">Browser:</span> CHROME</div>
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 shadow-card"><span className="font-semibold text-slate-800">Testing Type:</span> Regression</div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 shadow-card"><span className="font-semibold text-slate-800">Execution Date:</span> 2026-04-10T12:53:00.223</div>
        <button type="button" onClick={() => toast({ variant: 'info', title: 'Build Summary Report', description: 'Opening the build summary report (simulated).' })} className="text-sm font-medium text-info-600 hover:text-info-700 hover:underline">Build Summary Report</button>
      </div>

      {/* Results table */}
      <DataTable
        columns={columns}
        data={RESULTS}
        enableExport
        enableDensityToggle
        searchAlign="right"
        tableClassName="table-fixed"
        headClassName="whitespace-normal align-bottom"
        maxHeight="30rem"
        pageSize={100}
        pageSizeOptions={[50, 100, 200]}
        searchPlaceholder="Search..."
        exportFilename="test-executions"
        emptyMessage="No test results found."
      />
    </div>
  );
}

TestExecutionDashboardPage.displayName = 'TestExecutionDashboardPage';

export { TestExecutionDashboardPage };
export default TestExecutionDashboardPage;
