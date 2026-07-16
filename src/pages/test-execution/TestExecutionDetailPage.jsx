import { useEffect, useState, useMemo } from 'react';
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
  Mail,
  Star,
  RefreshCw,
  Columns3,
  Rows3,
  Download,
  Search,
  XCircle,
  History,
  FileText,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn, downloadCSV } from '@/lib/utils';
import { useNavigation, usePageHeader } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/lib/constants';

/* Mock data mirrors Docs/mocks/07-test-execution-detail.png (frontend-only). */

const RESULT_COLS = [
  { key: 'history', label: 'History' },
  { key: 'report', label: 'Report' },
  { key: 'status', label: 'Test Status' },
  { key: 'analysis', label: 'Analysis' },
  { key: 'key', label: 'Test Key' },
  { key: 'summary', label: 'Test Summary' },
  { key: 'error', label: 'Error Description' },
];

const BUILDS = [
  { build: '231', passed: 420, failed: 60, other: 20 }, { build: '233', passed: 410, failed: 70, other: 18 },
  { build: '238', passed: 415, failed: 55, other: 22 }, { build: '239', passed: 380, failed: 150, other: 25 },
  { build: '240', passed: 400, failed: 120, other: 24 }, { build: '241', passed: 430, failed: 60, other: 20 },
  { build: '242', passed: 440, failed: 55, other: 18 }, { build: '245', passed: 435, failed: 58, other: 21 },
  { build: '246', passed: 360, failed: 180, other: 26 }, { build: '247', passed: 445, failed: 50, other: 19 },
  { build: '249', passed: 450, failed: 48, other: 17 }, { build: '250', passed: 470, failed: 90, other: 22 },
  { build: '251', passed: 460, failed: 70, other: 20 }, { build: '252', passed: 380, failed: 190, other: 28 },
  { build: '253', passed: 470, failed: 60, other: 18 }, { build: '261', passed: 480, failed: 55, other: 17 },
  { build: '262', passed: 465, failed: 62, other: 19 }, { build: '262R', passed: 40, failed: 10, other: 60 },
  { build: '263', passed: 470, failed: 58, other: 18 }, { build: '264', passed: 485, failed: 52, other: 16 },
];

const RESULTS = [
  { keys: ['MPR-RGR-80566', 'MPR-RGR-80567', 'MPR-RGR-80554'], summary: 'Agenda Page: Validate session inactivity on all browsers after 4 mins...', error: 'Assertion error: Session timeout' },
  { keys: ['MPR-RGR-70510'], summary: 'Agenda Page: Validate session expired on all browsers after 10 mins...', error: 'No such element exception: java...' },
  { keys: ['MPR-RGR-4425'], summary: 'Delivery Settings Page: Validate Delivery Settings enrollment and Un-e...', error: 'Client exception: Error executing...' },
  { keys: ['MPR-RGR-38793'], summary: "Delivery Settings Page: PV Web - Don't Remove Delivery Settings Icon...", error: 'No such element exception: Timeout' },
  { keys: ['MPR-RGR-38801'], summary: 'Profile Page: Validate contact preference update persists across sessions', error: 'Assertion error: Value mismatch' },
  { keys: ['MPR-RGR-39002'], summary: 'Claims Page: Validate claim history pagination beyond 50 records', error: 'Timeout waiting for element' },
  { keys: ['MPR-RGR-39110'], summary: 'Benefits Page: Validate plan comparison renders for all tiers', error: 'No such element exception' },
  { keys: ['MPR-RGR-39221'], summary: 'Auth: Validate MFA challenge on new device sign-in', error: 'Assertion error: OTP field not found' },
  { keys: ['MPR-RGR-39344'], summary: 'ID Card: Validate digital ID card download as PDF', error: 'Client exception: download failed' },
  { keys: ['MPR-RGR-39455'], summary: 'Messages: Validate secure message thread ordering', error: 'Assertion error: order mismatch' },
  { keys: ['MPR-RGR-39566'], summary: 'Pharmacy: Validate refill reminder banner visibility', error: 'No such element exception: Timeout' },
  { keys: ['MPR-RGR-39677'], summary: 'Provider Search: Validate distance filter within 25 miles', error: 'Assertion error: results empty' },
];
const PAGE_SIZE = 8;

/** Deterministic mock prior-run history for a result row's History dialog. */
function getRunHistory() {
  const statuses = ['ERROR', 'ERROR', 'PASSED', 'ERROR', 'PASSED'];
  return BUILDS.slice(-5).map((b, i) => ({
    build: b.build,
    status: statuses[i],
    duration: `${18 + ((i * 7) % 20)}m`,
  }));
}

const FILTERS_1 = [
  { label: 'Segment', options: ['Insurance', 'CenterWell'] },
  { label: 'Business Unit', options: ['Member Solutions', 'Provider Solutions'] },
  { label: 'VP', options: ['John Smith', 'Jane Doe'] },
  { label: 'Squad', options: ['Member Portal Team', 'Claims Team'] },
];
const FILTERS_2 = [
  { label: 'Application', options: ['Humana Member Portal', 'Claims Platform'] },
  { label: 'Test Suite Name', options: ['Member Portal - Regression Suite', 'Smoke Suite'] },
  { label: 'Execution #', options: ['264', '263', '262'] },
];

/**
 * Stateful labelled select used in the execution filter rows.
 *
 * @param {object} props
 * @param {string} props.label - Field label
 * @param {string[]} props.options - Options
 * @returns {React.ReactElement}
 */
function FilterSelect({ label, options }) {
  const [value, setValue] = useState(options[0]);
  return (
    <label className="flex flex-1 flex-col gap-1 min-w-[150px]">
      <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
      <select value={value} onChange={(e) => setValue(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700 focus:border-humana-green-500 focus:outline-none focus:ring-2 focus:ring-humana-green-500/40">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

/**
 * Test Execution — build history and test results for a suite run, rebuilt to
 * match Docs/mocks/07-test-execution-detail.png. Search, pagination, export,
 * favourite, and email are interactive.
 *
 * @returns {React.ReactElement}
 */
function TestExecutionDetailPage() {
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();

  usePageHeader({ title: 'Test Execution', subtitle: `View execution details, logs and results for your test suites.` });

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [starred, setStarred] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hiddenCols, setHiddenCols] = useState(() => new Set());
  const [density, setDensity] = useState('comfortable');
  const [historyRow, setHistoryRow] = useState(null);
  const [reportRow, setReportRow] = useState(null);
  const [buildSummaryOpen, setBuildSummaryOpen] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Test Execution' },
    ]);
  }, [setBreadcrumbs]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? RESULTS.filter((r) => `${r.keys.join(' ')} ${r.summary} ${r.error}`.toLowerCase().includes(q)) : RESULTS;
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  useEffect(() => { setPage(1); }, [search]);

  const handleExport = () => {
    downloadCSV(rows.map((r) => ({ TestKeys: r.keys.join('|'), Summary: r.summary, Error: r.error })), 'execution-results.csv');
    toast({ variant: 'success', title: 'Export complete', description: `${rows.length} results exported to CSV.` });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast({ variant: 'success', title: 'Data refreshed', description: 'Execution results reloaded from the latest mock run.' });
    }, 400);
  };

  const toggleCol = (key) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const isColVisible = (key) => !hiddenCols.has(key);
  const cellPad = density === 'compact' ? 'py-1' : 'py-3';

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="flex flex-wrap items-end gap-3">
          {FILTERS_1.map((f) => <FilterSelect key={f.label} label={f.label} options={f.options} />)}
          <button type="button" onClick={handleRefresh} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"><RefreshCw className={cn('h-4 w-4 text-slate-400', refreshing && 'animate-spin')} /> Refresh</button>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          {FILTERS_2.map((f) => <FilterSelect key={f.label} label={f.label} options={f.options} />)}
          <button type="button" onClick={() => toast({ variant: 'success', title: 'Report emailed', description: 'Execution report has been emailed to your inbox.' })} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-navy-900 px-4 text-sm font-medium text-white hover:bg-navy-800"><Mail className="h-4 w-4" /> Email</button>
          <button type="button" onClick={() => setStarred((s) => !s)} className={cn('inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50', starred ? 'text-warning-500' : 'text-slate-400')} aria-label="Favourite this execution">
            <Star className={cn('h-4 w-4', starred && 'fill-current')} />
          </button>
        </div>
      </div>

      {/* Build history */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="bg-navy-900 px-4 py-2.5 text-center text-sm font-semibold text-white">
          Build History - Member Portal - Regression Suite - Build # 264
        </div>
        <div className="p-5">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BUILDS} margin={{ top: 8, right: 12, left: -12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="build" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} interval={0} angle={-30} textAnchor="end" height={44} />
                <YAxis domain={[0, 800]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="passed" name="Passed" stackId="a" fill="#16b364" isAnimationActive={false} />
                <Bar dataKey="failed" name="Failed" stackId="a" fill="#ef4444" isAnimationActive={false} />
                <Bar dataKey="other" name="Other" stackId="a" fill="#3b82f6" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-2xs text-slate-400">** We do not have run information for the hidden build numbers</p>
        </div>
      </div>

      {/* Metadata strip */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-card">
        <div className="flex-1 min-w-[280px]">
          <span className="font-semibold text-slate-700">Description:</span>{' '}
          <span className="text-slate-500">Please find the backed up result at path for Jenkins Build# 264 \\EDIDVUCHCMW01\Jenkins.Reports\CSDQ</span>
        </div>
        <div className="rounded-lg border border-slate-200 px-3 py-1.5"><span className="text-slate-500">Browser:</span> <span className="font-medium text-slate-800">CHROME</span></div>
        <div className="rounded-lg border border-slate-200 px-3 py-1.5"><span className="text-slate-500">Testing Type:</span> <span className="font-medium text-slate-800">Regression</span></div>
        <div className="w-full flex items-center gap-3 border-t border-slate-100 pt-3">
          <span><span className="text-slate-500">Execution Date:</span> <span className="font-medium text-slate-800">2026-04-10T12:53:00.223</span></span>
          <button type="button" onClick={() => setBuildSummaryOpen(true)} className="inline-flex items-center gap-1 text-sm font-medium text-info-600 hover:text-info-700"><FileText className="h-4 w-4" /> Build Summary Report</button>
        </div>
      </div>

      {/* Result grid */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="inline-flex items-center gap-1 text-xs font-medium text-info-600 hover:text-info-700"><Columns3 className="h-3.5 w-3.5" /> Columns</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {RESULT_COLS.map((c) => (
                <DropdownMenuCheckboxItem key={c.key} checked={!hiddenCols.has(c.key)} onCheckedChange={() => toggleCol(c.key)}>
                  {c.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="inline-flex items-center gap-1 text-xs font-medium text-info-600 hover:text-info-700"><Rows3 className="h-3.5 w-3.5" /> Density</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuLabel>Row density</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={density === 'comfortable'} onCheckedChange={() => setDensity('comfortable')}>Comfortable</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={density === 'compact'} onCheckedChange={() => setDensity('compact')}>Compact</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button type="button" onClick={handleExport} className="inline-flex items-center gap-1 text-xs font-medium text-info-600"><Download className="h-3.5 w-3.5" /> Export</button>
          <span className="relative ml-auto">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search results..." className="h-8 w-56 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-700 focus:border-humana-green-500 focus:outline-none focus:ring-2 focus:ring-humana-green-500/40" />
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-2xs uppercase tracking-wider text-slate-500">
                {isColVisible('history') ? <th className="px-3 py-2 font-medium">History</th> : null}
                {isColVisible('report') ? <th className="px-3 py-2 font-medium">Report</th> : null}
                {isColVisible('status') ? <th className="px-3 py-2 font-medium">Test Status</th> : null}
                {isColVisible('analysis') ? <th className="px-3 py-2 font-medium">Analysis</th> : null}
                {isColVisible('key') ? <th className="px-3 py-2 font-medium">Test Key</th> : null}
                {isColVisible('summary') ? <th className="px-3 py-2 font-medium">Test Summary</th> : null}
                {isColVisible('error') ? <th className="px-3 py-2 font-medium">Error Description</th> : null}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r) => (
                <tr key={r.keys[0]} className="border-b border-slate-100 align-top hover:bg-slate-50/60">
                  {isColVisible('history') ? <td className={cn('px-3 text-slate-400', cellPad)}><button type="button" onClick={() => setHistoryRow(r)} className="hover:text-info-600" aria-label={`View run history for ${r.keys[0]}`}><History className="h-4 w-4" /></button></td> : null}
                  {isColVisible('report') ? <td className={cn('px-3 text-slate-400', cellPad)}><button type="button" onClick={() => setReportRow(r)} className="hover:text-info-600" aria-label={`View report for ${r.keys[0]}`}><ExternalLink className="h-4 w-4" /></button></td> : null}
                  {isColVisible('status') ? <td className={cn('px-3', cellPad)}><span className="inline-flex items-center gap-1 font-medium text-danger-600"><XCircle className="h-4 w-4" /> ERROR</span></td> : null}
                  {isColVisible('analysis') ? <td className={cn('px-3 text-slate-500', cellPad)}>Not Started</td> : null}
                  {isColVisible('key') ? (
                    <td className={cn('px-3', cellPad)}>
                      <div className="flex flex-col gap-0.5">
                        {r.keys.map((k) => <button key={k} type="button" onClick={() => setReportRow(r)} className="text-left font-medium text-info-600 hover:underline">{k}</button>)}
                      </div>
                    </td>
                  ) : null}
                  {isColVisible('summary') ? <td className={cn('px-3 text-slate-600', cellPad)}>{r.summary}</td> : null}
                  {isColVisible('error') ? <td className={cn('px-3 text-slate-500', cellPad)}>{r.error}</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 text-xs text-slate-500">
          <span>Rows per page: {PAGE_SIZE}</span>
          <span>{rows.length === 0 ? '0' : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, rows.length)} of {rows.length}</span>
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="rounded-md p-1 hover:bg-slate-100 disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
          <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="rounded-md p-1 hover:bg-slate-100 disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Build Summary Report dialog */}
      <Dialog open={buildSummaryOpen} onOpenChange={setBuildSummaryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Build Summary Report — Build #264</DialogTitle>
            <DialogDescription>Member Portal Regression Suite</DialogDescription>
          </DialogHeader>
          <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-slate-200 p-3"><p className="text-2xs text-slate-400">Pipeline</p><p className="font-medium text-slate-800">Member Portal Release</p></div>
            <div className="rounded-lg border border-slate-200 p-3"><p className="text-2xs text-slate-400">Environment</p><p className="font-medium text-slate-800">QA</p></div>
            <div className="rounded-lg border border-slate-200 p-3"><p className="text-2xs text-slate-400">Passed</p><p className="font-medium text-success-600">485</p></div>
            <div className="rounded-lg border border-slate-200 p-3"><p className="text-2xs text-slate-400">Failed</p><p className="font-medium text-danger-600">52</p></div>
            <div className="rounded-lg border border-slate-200 p-3"><p className="text-2xs text-slate-400">Duration</p><p className="font-medium text-slate-800">1h 18m</p></div>
            <div className="rounded-lg border border-slate-200 p-3"><p className="text-2xs text-slate-400">Triggered By</p><p className="font-medium text-slate-800">Scheduled Run</p></div>
          </div>
          <p className="mt-3 text-2xs text-slate-400">Report path: \\EDIDVUCHCMW01\Jenkins.Reports\CSDQ</p>
        </DialogContent>
      </Dialog>

      {/* Run history dialog */}
      <Dialog open={Boolean(historyRow)} onOpenChange={(o) => !o && setHistoryRow(null)}>
        <DialogContent className="max-w-md">
          {historyRow ? (
            <>
              <DialogHeader>
                <DialogTitle>Run History</DialogTitle>
                <DialogDescription>{historyRow.keys[0]} — last 5 executions</DialogDescription>
              </DialogHeader>
              <div className="mt-2 flex flex-col divide-y divide-slate-100">
                {getRunHistory().map((h) => (
                  <div key={h.build} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 text-sm">
                    <span className="font-medium text-slate-800">Build #{h.build}</span>
                    <span className="text-slate-500">{h.duration}</span>
                    <Badge variant={h.status === 'PASSED' ? 'success' : 'error'} size="sm">{h.status}</Badge>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Test report dialog */}
      <Dialog open={Boolean(reportRow)} onOpenChange={(o) => !o && setReportRow(null)}>
        <DialogContent className="max-w-lg">
          {reportRow ? (
            <>
              <DialogHeader>
                <DialogTitle>Test Report</DialogTitle>
                <DialogDescription>{reportRow.keys.join(', ')}</DialogDescription>
              </DialogHeader>
              <div className="mt-2 flex flex-col gap-3 text-sm">
                <div>
                  <p className="text-2xs font-semibold uppercase tracking-wider text-slate-400">Summary</p>
                  <p className="mt-1 text-slate-700">{reportRow.summary}</p>
                </div>
                <div>
                  <p className="text-2xs font-semibold uppercase tracking-wider text-slate-400">Error</p>
                  <p className="mt-1 rounded-lg bg-danger-50 px-3 py-2 font-mono text-xs text-danger-700">{reportRow.error}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-200 p-3"><p className="text-2xs text-slate-400">Browser</p><p className="font-medium text-slate-800">Chrome</p></div>
                  <div className="rounded-lg border border-slate-200 p-3"><p className="text-2xs text-slate-400">Build</p><p className="font-medium text-slate-800">#264</p></div>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

TestExecutionDetailPage.displayName = 'TestExecutionDetailPage';

export { TestExecutionDetailPage };
export default TestExecutionDetailPage;
